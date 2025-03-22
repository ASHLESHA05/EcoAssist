from flask import Blueprint, request, jsonify
from .models.chatbot import CarbonFootprintChatbot
from .utils.user_data import fetch_user_data
from .config import Config



# Create a chatbot instance
chatbot_instance = CarbonFootprintChatbot(Config.GEMINI_API_KEY, Config.DB_PATH)



#Yet to be added in Ui
@routes_bp.route('/chatPremium', methods=['POST'])
def handle_chat():
    """
    Handles POST requests for chat interactions.
    Expects JSON payload with 'message' field.
    """
    try:
        email = request.args.get("email")
        # Extract message from POST request
        data = request.get_json()
        message = data.get('message', '')

        if not message:
            return jsonify({'error': 'No message provided'}), 400

        # Fetch user data
        user_data = fetch_user_data(email)

        # Get chatbot response
        response = chatbot_instance.chatbot(user_data, message)

        # Return response as JSON
        return jsonify({'response': response})

    except Exception as e:
        print(f"Error in /chatPremium endpoint: {e}")
        return jsonify({'error': 'Internal server error'}), 500

# Additional routes can be added here
@chat_bp.route('/clear-history', methods=['POST'])
def clear_history():
    """Clears the chat history."""
    try:
        chatbot_instance.clear_chat_history()
        return jsonify({'status': 'success', 'message': 'Chat history cleared'})
    except Exception as e:
        print(f"Error clearing chat history: {e}")
        return jsonify({'error': 'Failed to clear chat history'}), 500