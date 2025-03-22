import os
import json
from datetime import datetime

class LlamaChatMemoryManager:
    def __init__(self, memory_dir):
        """
        Initialize the LLaMa Chat Memory Manager.
        
        Args:
            memory_dir (str): Directory path to store memory files
        """
        self.memory_dir = memory_dir
        os.makedirs(memory_dir, exist_ok=True)
    
    def get_memory_file_path(self, user_id):
        """Get the path to a user's memory file"""
        return os.path.join(self.memory_dir, f"{user_id}_llama_memory.json")
    
    def load_chat_memory(self, user_id):
        """
        Load a user's chat memory.
        
        Args:
            user_id (str): User identifier
            
        Returns:
            list: List of chat messages or empty list if no memory exists
        """
        memory_file = self.get_memory_file_path(user_id)
        
        if os.path.exists(memory_file):
            try:
                with open(memory_file, 'r') as f:
                    return json.load(f)
            except json.JSONDecodeError:
                return []
        return []
    
    def save_chat_memory(self, user_id, user_message, bot_response):
        """
        Save messages to a user's chat memory.
        
        Args:
            user_id (str): User identifier
            user_message (str): User's message
            bot_response (str): Bot's response
        """
        memory_file = self.get_memory_file_path(user_id)
        
        # Load existing memory or create new
        memory = self.load_chat_memory(user_id)
        
        # Add new messages with timestamps
        timestamp = datetime.now().isoformat()
        memory.append({
            "role": "user",
            "content": user_message,
            "timestamp": timestamp
        })
        memory.append({
            "role": "assistant",
            "content": bot_response,
            "timestamp": timestamp
        })
        
        # Limit memory size (keep last 10 conversation turns = 20 messages)
        if len(memory) > 20:
            memory = memory[-20:]
        
        # Save updated memory
        with open(memory_file, 'w') as f:
            json.dump(memory, f, indent=2)
    
    def clear_chat_memory(self, user_id):
        """
        Clear a user's chat memory.
        
        Args:
            user_id (str): User identifier
            
        Returns:
            bool: True if successful, False otherwise
        """
        memory_file = self.get_memory_file_path(user_id)
        
        if os.path.exists(memory_file):
            try:
                os.remove(memory_file)
                return True
            except Exception:
                return False
        return True  # No file to delete
    
    def format_context_from_memory(self, memory):
        """
        Format memory messages into a context string for the model.
        
        Args:
            memory (list): List of message objects
            
        Returns:
            str: Formatted context string
        """
        context_lines = []
        for msg in memory:
            role = "User" if msg["role"] == "user" else "Assistant"
            context_lines.append(f"{role}: {msg['content']}")
        
        return "\n".join(context_lines)