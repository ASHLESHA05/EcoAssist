from flask import request, jsonify
from . import routes_bp  # Import the blueprint from __init__.py
from database.connection import get_db_connection  # Import database connection
import json
from datetime import datetime
from .utils.user_data import fetch_user_data


import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
import re
import json
import requests

class CarbonFootprintAssistant:
    def __init__(self, model_path=r"D:\Projects\Carbon_tracker\Lama\Lama_model"):
        
        
        
        """Initialize the assistant with model and tokenizer."""
        self.tokenizer = AutoTokenizer.from_pretrained(model_path)
        self.tokenizer.pad_token = self.tokenizer.eos_token
        self.model = AutoModelForCausalLM.from_pretrained(
            model_path,
            torch_dtype=torch.float16,
            device_map="auto"
        )
        self.sensitive_keywords = ["menstrual", "personal hygiene", "sensitive topic"]
        self.max_attempts = 4
        self.default_tips = [
            {"title": "Use Public Transport", "description": "Switch to buses or trains for your daily commute."},
            {"title": "Upgrade Home Insulation", "description": "Reduce energy loss with better insulation."},
            {"title": "Reduce Meat Intake", "description": "Cut down on meat to lower food emissions."},
            {"title": "Shop Locally", "description": "Buy local products to reduce transport emissions."}
        ]
        self.default_plans = [
            {"title": "Plan 1", "description": "Install solar panels to reduce home energy costs."},
            {"title": "Plan 2", "description": "Carpool with neighbors to cut transport emissions."},
            {"title": "Plan 3", "description": "Start composting to manage food waste."},
            {"title": "Plan 4", "description": "Switch to energy-efficient appliances."}
        ]

    def fetch_user_data_(self, id='User123',):
        """
        Fetch user data from the API or database
        
        Args:
            user_id (str): The unique identifier for the user
            
        Returns:
            dict: User data containing carbon footprint information
        """
        try:
            # This is a placeholder - in a real implementation, this might be:
            # response = requests.get(f"https://api.example.com/users/{user_id}/carbon-data")
            # user_data = response.json()
            
            # For now, we'll just return mock data
            
            
            # PART OF BACKEND

            if user_data is None:
                user_data = {
                    "eco_score": 65.0,
                    "carbon_footprint_total": 15000.0,
                    "carbon_footprint_breakdown": {
                        "Transport": 300000.0, 
                        "Home": 5000.0, 
                        "Food": 4000.0, 
                        "Shopping": 3000.0
                    },
                    "water_saved": 50,
                    "energy_saved": 1000.0,
                    "waste_reduced": 2,
                    "user_plan": "Implement a Home Energy Audit - Schedule a professional energy audit to assess your home's energy inefficiencies.",
                    "current_activities": {
                        "Mode of transport": "car, distance: 20.0 km/day",
                        "Home Energy source": "grid electricity, Electricity Usage: 300.0 kWh/month, Heating Type: gas",
                        "Food diet type": "omnivore, Food Waste: medium, Organic food consumption: occasional"
                    }
                }
            
            return user_data
            
        except Exception as e:
            print(f"Error fetching user data: {e}")
            # Return a minimal default dataset if fetch fails
            return {
                "eco_score": 60.0,
                "carbon_footprint_total": 12000.0,
                "carbon_footprint_breakdown": {"Transport": 6000.0, "Home": 3000.0, "Food": 2000.0, "Shopping": 1000.0},
                "user_plan": "Reduce carbon footprint"
            }

    def _generate_response(self, instruction, input_text):
        """Generate raw text from the LLaMA model."""
        prompt = f"<s>[INST] {instruction}\n\nFormat your response as follows:\n- For tips, use numbered list with title and description: '1. **Title** - Description'\n- For plans, use bullet points: '- Description'\n\n{input_text} [/INST]"
        inputs = self.tokenizer(prompt, return_tensors="pt").to(next(self.model.parameters()).device)
        outputs = self.model.generate(
            **inputs,
            max_length=500,
            num_return_sequences=1,
            temperature=0.7,
            do_sample=True
        )
        response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        return response.split("[/INST]")[-1].strip()

    def _reduce_user_data(self, user_data, attempt):
        """Reduce user data progressively based on attempt number."""
        if attempt == 1:  # First retry: Remove detailed activities
            reduced_data = user_data.copy()
            reduced_data.pop("current_activities", None)
            return f"""
            USER BEHAVIOR DATA:
            - Eco-Score: {reduced_data.get('eco_score', 65.0)}
            - Carbon Footprint [kg] total: {reduced_data.get('carbon_footprint_total', 15000.0)}
            - Transport: {reduced_data.get('carbon_footprint_breakdown', {}).get('Transport', 300000.0)}
            - Home: {reduced_data.get('carbon_footprint_breakdown', {}).get('Home', 5000.0)}
            - Food: {reduced_data.get('carbon_footprint_breakdown', {}).get('Food', 4000.0)}
            - Shopping: {reduced_data.get('carbon_footprint_breakdown', {}).get('Shopping', 3000.0)}
            - User Plan: {reduced_data.get('user_plan', 'Implement a Home Energy Audit')}
            """
        elif attempt == 2:  # Second retry: Remove breakdown
            reduced_data = user_data.copy()
            return f"""
            USER BEHAVIOR DATA:
            - Eco-Score: {reduced_data.get('eco_score', 65.0)}
            - Carbon Footprint [kg] total: {reduced_data.get('carbon_footprint_total', 15000.0)}
            - User Plan: {reduced_data.get('user_plan', 'Implement a Home Energy Audit')}
            """
        elif attempt == 3:  # Third retry: Minimal data
            return "Reduce my carbon footprint."
        return "Reduce my carbon footprint."  # Fallback for any further attempts

    def _structure_output(self, generated_text, user_data):
        """Structure the generated text into tips and plans."""
        # Filter sensitive content
        lines = generated_text.split("\n")
        filtered_lines = [line for line in lines if not any(keyword in line.lower() for keyword in self.sensitive_keywords)]
        filtered_text = "\n".join(filtered_lines)
        
        # More flexible regex patterns
        numbered_pattern = r"(?:^|\n)(?:\s*)?(\d+)\.?\s*(?:\*\*)?([^-\n]*?)(?:\*\*)?(?:\s*)?-(?:\s*)?([^\n]*?)(?=\n\d+\.|\n-|\n\s*$|$)"
        bullet_pattern = r"(?:^|\n)(?:\s*)?-\s*([^\n]*?)(?=\n-|\n\d+\.|\n\s*$|$)"
        
        # Extract plan category
        plan_category = None
        if "user_plan" in user_data:
            plan_text = user_data["user_plan"].lower()
            if "home" in plan_text or "energy" in plan_text:
                plan_category = "home"
            elif "transport" in plan_text:
                plan_category = "transport"
            elif "food" in plan_text:
                plan_category = "food"
            elif "shopping" in plan_text:
                plan_category = "shopping"
        
        # Parse tips
        numbered_matches = re.findall(numbered_pattern, filtered_text, re.MULTILINE | re.DOTALL)
        tips = []
        if numbered_matches:
            for match in numbered_matches:
                if len(match) >= 3:  # Make sure we have index, title, description
                    title = match[1].strip()
                    description = match[2].strip()
                    if title and description:
                        tips.append({"title": title, "description": description})
                elif len(match) >= 2:  # Fallback if we have index and combined title/description
                    text = match[1].strip()
                    if ":" in text:
                        title, description = text.split(":", 1)
                        tips.append({"title": title.strip(), "description": description.strip()})
                    else:
                        tips.append({"title": f"Tip {match[0]}", "description": text})
        
        # Parse plans
        bullet_matches = re.findall(bullet_pattern, filtered_text, re.MULTILINE | re.DOTALL)
        plans = []
        if bullet_matches:
            for i, match in enumerate(bullet_matches, 1):
                text = match.strip()
                if ":" in text:
                    title, description = text.split(":", 1)
                    plans.append({"title": title.strip(), "description": description.strip()})
                else:
                    plans.append({"title": f"Plan {i}", "description": text})
        
        # If we didn't find enough, try alternative parsing
        if len(tips) < 4 or len(plans) < 4:
            # Try splitting by numbers for tips
            lines = [l for l in filtered_text.split('\n') if l.strip()]
            for i, line in enumerate(lines):
                if re.match(r'^\d+\.', line) and len(tips) < 4:
                    text = re.sub(r'^\d+\.\s*', '', line).strip()
                    if ":" in text:
                        title, description = text.split(":", 1)
                        tips.append({"title": title.strip(), "description": description.strip()})
                    else:
                        tips.append({"title": f"Tip {i+1}", "description": text})
                elif line.strip().startswith('-') and len(plans) < 4:
                    text = line.strip()[1:].strip()
                    if ":" in text:
                        title, description = text.split(":", 1)
                        plans.append({"title": title.strip(), "description": description.strip()})
                    else:
                        plans.append({"title": f"Plan {len(plans)+1}", "description": text})
        
        # Personalize
        for tip in tips:
            if "transport" in tip["title"].lower() and user_data.get("carbon_footprint_breakdown", {}).get("Transport", 0) > 10000:
                tip["description"] += " This is critical due to your high transport footprint."
            elif "home" in tip["title"].lower() and user_data.get("current_activities", {}).get("Home Energy source", "") == "grid electricity":
                tip["description"] += " Switching to renewables could enhance your plan."
        for plan in plans:
            if "home" in plan["description"].lower() and user_data.get("current_activities", {}).get("Home Energy source", "") == "grid electricity":
                plan["description"] += " Switching to solar or wind energy could enhance this."
            elif "food" in plan["description"].lower() and user_data.get("current_activities", {}).get("Food diet type", "").startswith("omnivore"):
                plan["description"] += " Reducing meat consumption could amplify your impact."
        
        return {"tips": tips[:4], "plans": plans[:4]}

    def get_recommendations(self, user_data=None, user_id=None):
        """
        Generate and structure recommendations with retry logic.
        
        Args:
            user_data (dict, optional): User data containing carbon footprint information.
                                       If not provided, will attempt to fetch using user_id
            user_id (str, optional): User ID to fetch data for if user_data is not provided
            
        Returns:
            dict: Recommendations containing tips and plans
        """
        # If user_data is not provided, fetch it using the user_id
        if user_data is None:
            if user_id is None:
                raise ValueError("Either user_data or user_id must be provided")
            user_data = self.fetch_user_data_(user_id)
        
        # Define instructions
        suggestion_instruction = "Provide 4 suggestion tips for reducing my carbon footprint"
        reduction_instruction = "Provide 4 carbon footprint reduction plans."
        
        full_input_text = f"""
        USER BEHAVIOR DATA:
        - Eco-Score: {user_data.get('eco_score', 65.0)}
        - Carbon Footprint [kg] total: {user_data.get('carbon_footprint_total', 15000.0)}
        - Transport: {user_data.get('carbon_footprint_breakdown', {}).get('Transport', 300000.0)}
        - Home: {user_data.get('carbon_footprint_breakdown', {}).get('Home', 5000.0)}
        - Food: {user_data.get('carbon_footprint_breakdown', {}).get('Food', 4000.0)}
        - Shopping: {user_data.get('carbon_footprint_breakdown', {}).get('Shopping', 3000.0)}
        - Water Saved: {user_data.get('water_saved', 50)}
        - Energy Saved: {user_data.get('energy_saved', 1000.0)}
        - Waste Reduced: {user_data.get('waste_reduced', 2)}
        - User Plan: {user_data.get('user_plan', 'Implement a Home Energy Audit')}
        - Current User Activity:
          - Mode of transport: {user_data.get('current_activities', {}).get('Mode of transport', 'car, distance: 20.0 km/day')}
          - Home Energy source: {user_data.get('current_activities', {}).get('Home Energy source', 'grid electricity')}
          - Food diet type: {user_data.get('current_activities', {}).get('Food diet type', 'omnivore')}
        """

        for attempt in range(self.max_attempts):
            input_text = full_input_text if attempt == 0 else self._reduce_user_data(user_data, attempt)
            
            # Generate outputs
            suggestion_output = self._generate_response(suggestion_instruction, input_text)
            suggestion_result = self._structure_output(suggestion_output, user_data)
            
            reduction_output = self._generate_response(reduction_instruction, input_text)
            reduction_result = self._structure_output(reduction_output, user_data)
            
            # Check if we have 4 tips and 4 plans
            if len(suggestion_result["tips"]) >= 4 and len(reduction_result["plans"]) >= 4:
                return {
                    "tips": suggestion_result["tips"][:4],
                    "plans": reduction_result["plans"][:4]
                }
            # If we have some tips and plans but not 4 of each, use what we have and supplement
            elif len(suggestion_result["tips"]) > 0 and len(reduction_result["plans"]) > 0:
                tips = suggestion_result["tips"]
                plans = reduction_result["plans"]
                
                # Add default tips if needed
                if len(tips) < 4:
                    tips.extend(self.default_tips[:4-len(tips)])
                
                # Add default plans if needed
                if len(plans) < 4:
                    plans.extend(self.default_plans[:4-len(plans)])
                
                return {
                    "tips": tips[:4],
                    "plans": plans[:4]
                }
        
        # Fallback to defaults after max attempts
        return {
            "tips": self.default_tips[:4],
            "plans": self.default_plans[:4]
        }

    def save_recommendations_to_file(self, recommendations, filename="recommendations.json"):
        """
        Save the recommendations to a JSON file
        
        Args:
            recommendations (dict): The recommendations to save
            filename (str): The filename to save to
        """
        try:
            with open(filename, 'w') as f:
                json.dump(recommendations, f, indent=4)
            print(f"Recommendations saved to {filename}")
        except Exception as e:
            print(f"Error saving recommendations: {e}")


def getSugessions(user_data):
    assistant = CarbonFootprintAssistant()
    user_id = "user123"
    recommendations = assistant.get_recommendations(user_data=user_data, user_id=user_id)
    assistant.save_recommendations_to_file(recommendations)
    print("\nCarbon Footprint Reduction Recommendations:")
    print("\nSuggestion Tips (4):")
    for tip in recommendations["tips"]:
        print(f"Title: {tip['title']}")
        print(f"Description: {tip['description']}\n")

    print("Reduction Plans (4):")
    for plan in recommendations["plans"]:
        print(f"Title: {plan['title']}")
        print(f"Description: {plan['description']}\n")
    recommendations['tips']






def getPlans(user_data):
    assistant = CarbonFootprintAssistant()
    user_id = "user123"
    recommendations = assistant.get_recommendations(user_data=user_data, user_id=user_id)
    assistant.save_recommendations_to_file(recommendations)
    print("\nCarbon Footprint Reduction Recommendations:")
    print("\nSuggestion Tips (4):")
    for tip in recommendations["tips"]:
        print(f"Title: {tip['title']}")
        print(f"Description: {tip['description']}\n")

    print("Reduction Plans (4):")
    for plan in recommendations["plans"]:
        print(f"Title: {plan['title']}")
        print(f"Description: {plan['description']}\n")
    recommendations['plans']
    
    
# Only for premium users
import google.generativeai as genai
import re

# Configure the Gemini API with your API key
API_KEY = "AIzaSyC5NO9hKx8qVlwhZeU9qVYo-kRUKvj9TGE"  # Replace with your actual Gemini API key
genai.configure(api_key=API_KEY)

class CarbonFootprintAssistant:
    def __init__(self):
        """Initialize the assistant with the Gemini model."""
        self.model = genai.GenerativeModel("gemini-1.5-flash")  # Using Gemini 1.5 Flash as an example
        self.sensitive_keywords = ["menstrual", "personal hygiene", "sensitive topic"]

    def _generate_response(self, instruction, input_text):
        """Generate raw text using the Gemini API."""
        prompt = f"{instruction}\n\n{input_text}"
        response = self.model.generate_content(prompt)
        return response.text.strip()

    def _structure_output(self, generated_text, user_data):
        """Structure the generated text into tips and plans flexibly."""
        # Filter sensitive content
        lines = generated_text.split("\n")
        filtered_lines = [line for line in lines if not any(keyword in line.lower() for keyword in self.sensitive_keywords)]
        filtered_text = "\n".join(filtered_lines).strip()

        # Extract plan category
        plan_category = None
        if "user_plan" in user_data:
            plan_text = user_data["user_plan"].lower()
            if "home" in plan_text or "energy" in plan_text:
                plan_category = "home"
            elif "transport" in plan_text:
                plan_category = "transport"
            elif "food" in plan_text:
                plan_category = "food"
            elif "shopping" in plan_text:
                plan_category = "shopping"

        tips = []
        plans = []

        # Flexible parsing for tips
        tip_pattern = r"(?:\d+\.\s*|\*\*.*?)\s*(.+?)(?=\n\d+\.|\n\*\*|\n-|\n\s*$)"
        tip_matches = re.findall(tip_pattern, filtered_text, re.MULTILINE | re.DOTALL)
        all_tips = [{"title": f"Tip {i+1}", "description": match.strip()} for i, match in enumerate(tip_matches) if match.strip() and not re.match(r"^\d+\.?\d*$|.*:.*\d+\.?\d*$", match.strip())]
        
        if all_tips:
            if plan_category:
                relevant_tips = [tip for tip in all_tips if plan_category in tip["description"].lower()]
                tips.extend(relevant_tips)
                if len(tips) < 4:
                    off_topic_tips = [tip for tip in all_tips if tip not in relevant_tips]
                    tips.extend(off_topic_tips[:4 - len(tips)])
            else:
                tips = all_tips[:4]

        # Flexible parsing for plans
        plan_pattern = r"(?:-\s*|\n\s*)(.+?)(?=\n-|\n\s*$|\n\d+\.|\n\*\*)"
        plan_matches = re.findall(plan_pattern, filtered_text, re.MULTILINE | re.DOTALL)
        all_plans = [{"title": f"Plan {i+1}", "description": match.strip()} for i, match in enumerate(plan_matches) if match.strip() and not re.match(r"^\d+\.?\d*$|.*:.*\d+\.?\d*$", match.strip())]
        
        if all_plans:
            if plan_category:
                relevant_plans = [plan for plan in all_plans if plan_category in plan["description"].lower()]
                plans.extend(relevant_plans)
                if len(plans) < 4:
                    off_topic_plans = [plan for plan in all_plans if plan not in relevant_plans]
                    plans.extend(off_topic_plans[:4 - len(plans)])
            else:
                plans = all_plans[:4]

        # Personalize
        for tip in tips:
            if "transport" in tip["description"].lower() and user_data.get("carbon_footprint_breakdown", {}).get("Transport", 0) > 10000:
                tip["description"] += " This is critical due to your high transport footprint."
            elif "home" in tip["description"].lower() and user_data.get("current_activities", {}).get("Home Energy source", "") == "grid electricity":
                tip["description"] += " Switching to renewables could enhance your plan."
        for plan in plans:
            if "home" in plan["description"].lower() and user_data.get("current_activities", {}).get("Home Energy source", "") == "grid electricity":
                plan["description"] += " Switching to solar or wind energy could enhance this."
            elif "food" in plan["description"].lower() and user_data.get("current_activities", {}).get("Food diet type", "").startswith("omnivore"):
                plan["description"] += " Reducing meat consumption could amplify your impact."

        return {"tips": tips[:4], "plans": plans[:4]}

    def get_recommendations(self, user_data, suggestion_instruction, reduction_instruction):
        """Generate and structure recommendations using Gemini API."""
        input_text = f"""
        USER BEHAVIOR DATA:
        - Eco-Score: {user_data.get('eco_score', 65.0)}
        - Carbon Footprint [kg] total: {user_data.get('carbon_footprint_total', 15000.0)}
        - Transport: {user_data.get('carbon_footprint_breakdown', {}).get('Transport', 300000.0)}
        - Home: {user_data.get('carbon_footprint_breakdown', {}).get('Home', 5000.0)}
        - Food: {user_data.get('carbon_footprint_breakdown', {}).get('Food', 4000.0)}
        - Shopping: {user_data.get('carbon_footprint_breakdown', {}).get('Shopping', 3000.0)}
        - Water Saved: {user_data.get('water_saved', 50)}
        - Energy Saved: {user_data.get('energy_saved', 1000.0)}
        - Waste Reduced: {user_data.get('waste_reduced', 2)}
        - User Plan: {user_data.get('user_plan', 'Implement a Home Energy Audit')}
        - Current User Activity:
          - Mode of transport: {user_data.get('current_activities', {}).get('Mode of transport', 'car, distance: 20.0 km/day')}
          - Home Energy source: {user_data.get('current_activities', {}).get('Home Energy source', 'grid electricity')}
          - Food diet type: {user_data.get('current_activities', {}).get('Food diet type', 'omnivore')}
        """

        # Generate outputs
        suggestion_output = self._generate_response(suggestion_instruction, input_text)
        suggestion_result = self._structure_output(suggestion_output, user_data)
        
        reduction_output = self._generate_response(reduction_instruction, input_text)
        reduction_result = self._structure_output(reduction_output, user_data)
        
        return {
            "tips": suggestion_result["tips"],
            "plans": reduction_result["plans"]
        }
 
def getGsugessions(usd,types=1,):
    suggestion_instruction = "Provide suggestion tips for reducing my carbon footprint based on my user data."
    reduction_instruction = "Provide carbon footprint reduction plans based on my user data."
    assistant = CarbonFootprintAssistant()
    result = assistant.get_recommendations(usd, suggestion_instruction, reduction_instruction)

    if type == 1:
        #tips
        return result['tips']
    else:
        return result['plans']
        #plans
    
    
    
    
@routes_bp.route("/get-Suggestions", methods=["GET"])
def get_sugessions():
    email = request.args.get("email")
    user_data = {
    "eco_score": 65.0,
    "carbon_footprint_total": 15000.0,
    "carbon_footprint_breakdown": {
        "Transport": 300000.0, 
        "Home": 5000.0, 
        "Food": 4000.0, 
        "Shopping": 3000.0
    },
    "water_saved": 50,
    "energy_saved": 1000.0,
    "waste_reduced": 2,
    "user_plan": "Implement a Home Energy Audit - Schedule a professional energy audit to assess your home's energy inefficiencies.",
    "current_activities": {
        "Mode of transport": "car, distance: 20.0 km/day",
        "Home Energy source": "grid electricity, Electricity Usage: 300.0 kWh/month, Heating Type: gas",
        "Food diet type": "omnivore, Food Waste: medium, Organic food consumption: occasional"
    }}
    

    user_data = fetch_user_data(email)
    sugessions = getSugessions(user_data)
    return jsonify(sugessions),200

   
   


# didnt write route in frontend   
@routes_bp.route("/get-Suggestions-premium", methods=["GET"])
def get_sugessions_premium():
    email = request.args.get("email")
    user_data = {
    "eco_score": 65.0,
    "carbon_footprint_total": 15000.0,
    "carbon_footprint_breakdown": {
        "Transport": 300000.0, 
        "Home": 5000.0, 
        "Food": 4000.0, 
        "Shopping": 3000.0
    },
    "water_saved": 50,
    "energy_saved": 1000.0,
    "waste_reduced": 2,
    "user_plan": "Implement a Home Energy Audit - Schedule a professional energy audit to assess your home's energy inefficiencies.",
    "current_activities": {
        "Mode of transport": "car, distance: 20.0 km/day",
        "Home Energy source": "grid electricity, Electricity Usage: 300.0 kWh/month, Heating Type: gas",
        "Food diet type": "omnivore, Food Waste: medium, Organic food consumption: occasional"
    }}
    

    user_data = fetch_user_data(email)


    sugessions = getGsugessions(user_data,types =1)
    
    return jsonify(sugessions),200
    
    
@routes_bp.route('/getReductionPlan', methods=['GET'])
def get_reduction_plan():
    email = request.args.get('email')
    if not email:
        return jsonify({"error": "Email parameter is missing"}), 400
    # email recieved fetch user
    user_data = {
        "eco_score": 65.0,
        "carbon_footprint_total": 15000.0,
        "carbon_footprint_breakdown": {
            "Transport": 300000.0, 
            "Home": 5000.0, 
            "Food": 4000.0, 
            "Shopping": 3000.0
        },
        "water_saved": 50,
        "energy_saved": 1000.0,
        "waste_reduced": 2,
        "user_plan": "Implement a Home Energy Audit - Schedule a professional energy audit to assess your home's energy inefficiencies.",
        "current_activities": {
            "Mode of transport": "car, distance: 20.0 km/day",
            "Home Energy source": "grid electricity, Electricity Usage: 300.0 kWh/month, Heating Type: gas",
            "Food diet type": "omnivore, Food Waste: medium, Organic food consumption: occasional"
        }}
    user_data = fetch_user_data(email)
    plans = getPlans(user_data)
    return jsonify(plans),200

@routes_bp.route('/getReductionPlan-premium', methods=['GET'])
def get_gemma_values():
    email = request.args.get('email')
    if not email:
        return jsonify({"error": "Email parameter is missing"}), 400
    # email recieved fetch user
    user_data = {
        "eco_score": 65.0,
        "carbon_footprint_total": 15000.0,
        "carbon_footprint_breakdown": {
            "Transport": 300000.0, 
            "Home": 5000.0, 
            "Food": 4000.0, 
            "Shopping": 3000.0
        },
        "water_saved": 50,
        "energy_saved": 1000.0,
        "waste_reduced": 2,
        "user_plan": "Implement a Home Energy Audit - Schedule a professional energy audit to assess your home's energy inefficiencies.",
        "current_activities": {
            "Mode of transport": "car, distance: 20.0 km/day",
            "Home Energy source": "grid electricity, Electricity Usage: 300.0 kWh/month, Heating Type: gas",
            "Food diet type": "omnivore, Food Waste: medium, Organic food consumption: occasional"
        }}
    user_data = fetch_user_data(email)
    data = getGsugessions(user_data,types=3)
    return jsonify(data),200