import requests
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
import json
import os
from dotenv import load_dotenv
import time
import asyncio

load_dotenv()

# API Keys (replace with yours)
CLIMATIQ_API_KEY = os.getenv('CLIMATIQ_API_KEY')
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

# Hugging Face Model (assumes access; replace with actual model ID if different)
MODEL_ID = "meta-llama/Llama-3.2-3B-Instruct"  # Check availability

# Load Model and Tokenizer from Hugging Face
device = "cuda" if torch.cuda.is_available() else "cpu"
HF_TOKEN = os.getenv("HF_TOKEN")  # Replace with your actual token

# Load tokenizer with authentication
tokenizer = AutoTokenizer.from_pretrained(MODEL_ID, token=HF_TOKEN)

# Load model with authentication (if needed later in your script)
model = AutoModelForCausalLM.from_pretrained(MODEL_ID, token=HF_TOKEN).to(device)  # Move model to the correct device

# Pre-fetched Data (fallback)
PREFETCHED_DATA = {
    "clmatiq_car_10_miles": {"co2e": 4.0, "unit": "kg"},
    "openweather_default": {"weather": "clear", "temp": 20}
}

# Cache for API responses
API_CACHE = {}
CACHE_EXPIRY = 300  # Cache expiry time in seconds (5 minutes)

# Predefined responses for casual conversations
CASUAL_RESPONSES = {
    "hello": "Hi there! How can I assist you today?",
    "hi": "Hello! What can I do for you?",
    "how are you": "I'm just a bot, but I'm here to help you! How can I assist?",
    "what's up": "Not much, just here to help you reduce your carbon footprint!",
    "good morning": "Good morning! Ready to make today eco-friendly?",
    "good afternoon": "Good afternoon! How can I assist you?",
    "good evening": "Good evening! What can I do for you today?",
    "bye": "Goodbye! Have a great day!",
    "exit": "Goodbye! Have a great day!",
}

# Climatiq API Call
def get_emission(distance_km, transport_type="passenger_vehicle"):
    cache_key = f"climatiq_{distance_km}_{transport_type}"
    if cache_key in API_CACHE and (time.time() - API_CACHE[cache_key]["timestamp"]) < CACHE_EXPIRY:
        return API_CACHE[cache_key]["data"]

    url = "https://api.climatiq.io/v1/estimate"
    headers = {"Authorization": f"Bearer {CLIMATIQ_API_KEY}"}
    payload = {
        "emission_factor": {
            "activity_id": "passenger_vehicle_vehicle_type_car_fuel_source_na_engine_size_na_vehicle_age_na_vehicle_weight_na",
            "source": "EPA",
            "region": "US"
        },
        "parameters": {
            "distance": distance_km,
            "distance_unit": "km"
        }
    }
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        API_CACHE[cache_key] = {"data": (data["co2e"], data["co2e_unit"]), "timestamp": time.time()}
        return data["co2e"], data["co2e_unit"]
    except Exception as e:
        print(f"Climatiq API failed: {e}")
        return PREFETCHED_DATA["clmatiq_car_10_miles"]["co2e"], PREFETCHED_DATA["clmatiq_car_10_miles"]["unit"]

# OpenWeather API Call
def get_weather(city="London"):
    cache_key = f"openweather_{city}"
    if cache_key in API_CACHE and (time.time() - API_CACHE[cache_key]["timestamp"]) < CACHE_EXPIRY:
        return API_CACHE[cache_key]["data"]

    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={OPENWEATHER_API_KEY}&units=metric"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        API_CACHE[cache_key] = {"data": (data["weather"][0]["main"], data["main"]["temp"]), "timestamp": time.time()}
        return data["weather"][0]["main"], data["main"]["temp"]
    except Exception as e:
        print(f"OpenWeather API failed: {e}")
        return PREFETCHED_DATA["openweather_default"]["weather"], PREFETCHED_DATA["openweather_default"]["temp"]

# Generate Response with Llama
def generate_response(prompt, max_length=100):
    inputs = tokenizer(prompt, return_tensors="pt").to(device)  # Move input tensors to the correct device
    outputs = model.generate(**inputs, max_length=max_length, num_return_sequences=1, temperature=0.7)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

# Chatbot Logic
def chatbot(query):
    query = query.lower()
    
    # Handle casual conversations
    for key in CASUAL_RESPONSES:
        if key in query:
            return CASUAL_RESPONSES[key]
    
    if "driv" in query or "car" in query:
        distance_km = 16  # Default 10 miles
        for word in query.split():
            if word.isdigit():
                distance_km = float(word) * 1.60934  # Miles to km
                break
        co2e, unit = get_emission(distance_km)
        prompt = f"User asked: '{query}'. Climatiq says: {co2e} {unit} CO2e. Generate a response."
        return generate_response(prompt)
    elif "reduce" in query or "tip" in query:
        weather, temp = get_weather("London")
        weather_tip = "cycle instead of driving" if weather.lower() == "clear" else "use public transport"
        prompt = f"User asked: '{query}'. Weather is {weather}, {temp}°C. Suggest: {weather_tip}. Generate a response."
        return generate_response(prompt)
    else:
        prompt = f"User asked: '{query}'. I can help with driving emissions or tips to reduce your footprint. What do you want to know?"
        return generate_response(prompt)

# Main Loop
def main():
    print("Welcome to the Carbon Footprint Chatbot! (Type 'exit' to quit)")
    while True:
        query = input("You: ")
        if query.lower() == "exit":
            print("Goodbye!")
            break
        response = chatbot(query)
        print(f"Bot: {response}")

if __name__ == "__main__":
    main()