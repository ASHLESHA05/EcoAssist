from flask import Blueprint, request, jsonify
from .models.llama_chatbot import LlamaCarbonFootprintChatBot
from .utils.llama_memory_manager import LlamaChatMemoryManager
from .config import LlamaConfig

# Create a Blueprint for LLaMa chat routes with unique name
llama_chat_bp = Blueprint('llama_chat', __name__)

# Initialize chatbot and memory manager
llama_chatbot = LlamaCarbonFootprintChatBot(LlamaConfig.MODEL_PATH)
llama_memory_manager = LlamaChatMemoryManager(LlamaConfig.MEMORY_DIR)

@llama_chat_bp.route('/chat', methods=['POST'])
def handle_llama_chat():
    """
    Handle regular LLaMa chat requests (without memory).
    
    Expected JSON payload:
    {
        "message": "User's question about carbon footprint"
    }
    """
    try:
        # Get data from request
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({'error': 'No message provided'}), 400
        
        user_message = data['message']
        
        # Generate response without context
        response = llama_chatbot.generate_response(
            user_message,
            max_length=250,  # Shorter for regular chat
            temperature=0.7   # More deterministic for consistent responses
        )
        
        return jsonify({'response': response})
    
    except Exception as e:
        print(f"Error in /llama/chat endpoint: {str(e)}")
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@llama_chat_bp.route('/chatPremium', methods=['POST'])
def handle_llama_chat_premium():
    """
    Handle premium LLaMa chat requests with conversation memory.
    
    Expected JSON payload:
    {
        "message": "User's question about carbon footprint"
    }
    
    Header:
    User-ID: "user123" (or other user identifier)
    """
    try:
        # Get data from request
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({'error': 'No message provided'}), 400
        
        user_message = data['message']
        
        # Get user ID from header (you should implement proper authentication)
        user_id = request.headers.get('User-ID', 'default-user')
        
        # Load previous conversation memory
        memory = llama_memory_manager.load_chat_memory(user_id)
        
        # Generate a context-aware response if we have previous memory
        if memory:
            context = llama_memory_manager.format_context_from_memory(memory)
            response = llama_chatbot.generate_response_with_context(
                user_message,
                context=context,
                max_length=300,  # Longer for premium
                temperature=0.8,
                top_p=0.95
            )
        else:
            # First message, no context yet
            response = llama_chatbot.generate_response(
                user_message,
                max_length=300,
                temperature=0.8,
                top_p=0.95
            )
        
        # Save the interaction to memory
        llama_memory_manager.save_chat_memory(user_id, user_message, response)
        
        return jsonify({'response': response})
    
    except Exception as e:
        print(f"Error in /llama/chatPremium endpoint: {str(e)}")
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@llama_chat_bp.route('/clear-memory', methods=['POST'])
def clear_llama_memory():
    """Clear LLaMa chat memory for a user."""
    try:
        user_id = request.headers.get('User-ID', 'default-user')
        success = llama_memory_manager.clear_chat_memory(user_id)
        
        if success:
            return jsonify({'status': 'success', 'message': 'LLaMa chat memory cleared'})
        else:
            return jsonify({'status': 'error', 'message': 'Failed to clear LLaMa chat memory'}), 500
    
    except Exception as e:
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500
