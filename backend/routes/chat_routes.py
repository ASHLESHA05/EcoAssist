# from flask import Blueprint, request, jsonify
# from .models.chatbot import CarbonFootprintChatbot
# from .utils.user_data import fetch_user_data
# from .config import Config
# from . import routes_bp  # Import the blueprint from __init__.py



# import os
# import sqlite3
# from google.generativeai import configure, GenerativeModel
# from flask import Flask, request, jsonify


# class CarbonFootprintChatbot:
#     def __init__(self, api_key, db_path='chat_history.db'):
#         """
#         Initializes the chatbot with API configuration and database setup.

#         Args:
#             api_key (str): The Gemini API key.
#             db_path (str, optional): Path to the SQLite database file. Defaults to 'chat_history.db'.
#         """
#         # Configure Gemini API
#         configure(api_key=api_key)

#         # Define system instruction for the AI model
#         self.system_instruction = """
#         You are an AI assistant specialized in carbon footprint reduction. 
#         The user provides their data and a message with each query. Use the user_data to tailor your response 
#         and assume it contains relevant information about their carbon footprint or plans. 
#         Respond ONLY to questions about:
#         - Explaining how carbon footprints are calculated (without performing specific calculations)
#         - Suggesting eco-friendly alternatives
#         - Explaining sustainability practices
#         - Renewable energy solutions
#         - Waste reduction strategies
#         If the message is unrelated, interpret it in the context of carbon footprint reduction.
#         """

#         # Initialize the generative model once for efficiency
#         self.model = GenerativeModel('gemini-1.5-pro', system_instruction=self.system_instruction)

#         # Set database path and initialize it
#         self.db_path = db_path
#         self.init_db()

#     ### Database Methods ###

#     def init_db(self):
#         """Creates the chat history table if it doesn't exist."""
#         conn = sqlite3.connect(self.db_path)
#         c = conn.cursor()
#         c.execute('''CREATE TABLE IF NOT EXISTS chat_history
#                      (id INTEGER PRIMARY KEY AUTOINCREMENT, role TEXT, user_data TEXT, message TEXT)''')
#         conn.commit()
#         conn.close()

#     def add_message(self, role, user_data, message):
#         """Adds a message with user data to the chat history."""
#         conn = sqlite3.connect(self.db_path)
#         c = conn.cursor()
#         c.execute("INSERT INTO chat_history (role, user_data, message) VALUES (?, ?, ?)", 
#                   (role, user_data, message))
#         conn.commit()
#         conn.close()

#     def get_chat_history(self):
#         """Retrieves the entire chat history."""
#         conn = sqlite3.connect(self.db_path)
#         c = conn.cursor()
#         c.execute("SELECT role, user_data, message FROM chat_history")
#         history = c.fetchall()
#         conn.close()
#         return history

#     def clear_chat_history(self):
#         """Clears the chat history."""
#         conn = sqlite3.connect(self.db_path)
#         c = conn.cursor()
#         c.execute("DELETE FROM chat_history")
#         conn.commit()
#         conn.close()

#     ### Validation Methods ###

#     def is_on_topic(self, message):
#         """
#         Checks if the message is related to carbon footprint reduction.

#         Args:
#             message (str): The user's input message.

#         Returns:
#             bool: True if on-topic, False otherwise.
#         """
#         keywords = [
#             "carbon", "footprint", "emissions", "sustainable", "eco-friendly",
#             "energy efficiency", "renewable", "waste reduction", "recycle", "greenhouse gas",
#             "climate change", "energy saving", "carbon offset", "sustainability",
#             "kg of carbon", "carbon measurement", "carbon calculation", "carbon amount",
#             "reduce carbon", "carbon impact", "carbon level"
#         ]
#         return any(keyword in message.lower() for keyword in keywords)

#     def validate_response(self, response):
#         """
#         Ensures the response stays on-topic.

#         Args:
#             response (str): The AI-generated response.

#         Returns:
#             str: The validated response or a redirection message.
#         """
#         blocked_phrases = [
#             "sorry, i can't help with that", "i am an ai", "unrelated", "off-topic",
#             "i don't know", "not sure", "can't assist"
#         ]
#         if any(phrase in response.lower() for phrase in blocked_phrases):
#             return "Let's focus on carbon reduction. What's your question?"
#         return response

#     ### Chatbot Logic ###

#     def chatbot(self, user_data, message):
#         """
#         Processes the user's input (user_data and message) and generates a response.

#         Args:
#             user_data (str): The user's data (e.g., carbon footprint details or plans).
#             message (str): The user's query or message.

#         Returns:
#             str: The chatbot's response.
#         """
#         try:
#             # Retrieve chat history
#             chat_history = self.get_chat_history()

#             # Prepare context with chat history, including user_data
#             context = "\n".join([f"{role}: [User Data: {user_data}] {msg}" 
#                                  for role, user_data, msg in chat_history])
#             full_query = f"{context}\nUser: [User Data: {user_data}] {message}"

#             # Generate response using the pre-initialized model
#             response = self.model.generate_content(full_query)

#             # Validate the response
#             validated_response = self.validate_response(response.text)

#             # Store interaction in the database if the message is on-topic

#             return validated_response

#         except Exception as e:
#             print(f"An error occurred: {e}")
#             return "I'm sorry, something went wrong. Please try again later."



# # Initialize chatbot instance
# api_key = os.getenv("GEMINI_API_KEY", "AIzaSyC5NO9hKx8qVlwhZeU9qVYo-kRUKvj9TGE")  # Use env var or default
# chatbot_instance = CarbonFootprintChatbot(api_key)

# @routes_bp.route('/chatPremium', methods=['GET'])
# def handle_chat():
#     """
#     Handles POST requests from the web interface.
#     Expects JSON payload with 'message' field.
#     """
#     try:
#         email = request.args.get('email')
#         message = request.args.get('messages')
#         user_data = fetch_user_data(email)

#         # Get chatbot response
#         response = chatbot_instance.chatbot(user_data, message)

#         # Return response as JSON
#         return jsonify({'response': response})

#     except Exception as e:
#         print(f"Error in /chat endpoint: {e}")
#         return jsonify({'error': 'Internal server error'}), 500


