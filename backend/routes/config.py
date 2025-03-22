import os
# Do not change it at all
class Config:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyC5NO9hKx8qVlwhZeU9qVYo-kRUKvj9TGE")
    DB_PATH = os.getenv("DB_PATH", "chat_history.db")
    

class LlamaConfig:
    MODEL_PATH = os.getenv("LLAMA_MODEL_PATH",  r"D:\Projects\Carbon_tracker\Lama\merged\merged")
    MEMORY_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "llama_chat_memory")
    os.makedirs(MEMORY_DIR, exist_ok=True)