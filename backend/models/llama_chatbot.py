import torch
from transformers import LlamaForCausalLM, LlamaTokenizer

class LlamaCarbonFootprintChatBot:
    def __init__(self, model_path, device=None):
        """
        Initialize the LLaMa Carbon Footprint Chat Bot with the specified model path.
        
        Args:
            model_path (str): Path to the pre-trained model directory
            device (str, optional): Force specific device ('cuda' or 'cpu'). Auto-detects if None.
        """
        self.model_path = model_path
        self.tokenizer = LlamaTokenizer.from_pretrained(model_path)
        self.model = LlamaForCausalLM.from_pretrained(model_path)
        
        # Set up device
        if device is None:
            self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        else:
            self.device = torch.device(device)
            
        self.model = self.model.to(self.device)
        self.model.eval()  # Set to evaluation mode
        
        print(f"LLaMa model loaded on {self.device}")
    
    def format_prompt(self, user_query, context=None):
        """
        Format the user's query with the required instruction tags
        
        Args:
            user_query (str): User's question
            context (str, optional): Previous conversation history
            
        Returns:
            str: Formatted prompt
        """
        if context:
            # Include context for premium users with memory
            return f"<s>[INST] Previous conversation:\n{context}\n\nNew question: {user_query} [/INST]"
        else:
            # Simple prompt for regular users
            return f"<s>[INST] {user_query} [/INST]"
    
    def generate_response(self, prompt, max_length=200, temperature=0.8, top_p=0.95, **kwargs):
        """
        Generate a response to the given prompt.
        
        Args:
            prompt (str): User's input/question
            max_length (int): Maximum length of generated response
            temperature (float): Controls randomness (lower = more deterministic)
            top_p (float): Nucleus sampling probability threshold
            **kwargs: Additional generation parameters
            
        Returns:
            str: Generated response
        """
        # Format the prompt with instruction tags
        formatted_prompt = self.format_prompt(prompt)
        
        # Tokenize input with attention mask
        inputs = self.tokenizer(
            formatted_prompt, 
            return_tensors="pt"
        )
        input_ids = inputs.input_ids.to(self.device)
        attention_mask = inputs.attention_mask.to(self.device)
        
        # Automatically determine do_sample based on generation parameters
        do_sample = kwargs.pop('do_sample', None)
        if do_sample is None:
            do_sample = (temperature != 1.0) or (top_p != 1.0)
        
        # Generate response
        with torch.no_grad():
            output = self.model.generate(
                input_ids,
                attention_mask=attention_mask,
                max_length=len(input_ids[0]) + max_length,  # Ensure we generate beyond input
                temperature=temperature,
                top_p=top_p,
                do_sample=do_sample,
                pad_token_id=self.tokenizer.eos_token_id,
                **kwargs
            )
        
        # Decode and clean up response
        response = self.tokenizer.decode(
            output[0], 
            skip_special_tokens=True
        )
        
        # Remove the input prompt from the response
        return response.replace(formatted_prompt, "").strip()
    
    def generate_response_with_context(self, user_query, context=None, **kwargs):
        """
        Generate a response that takes into account previous conversation history
        
        Args:
            user_query (str): User's current question
            context (str, optional): Previous conversation history
            **kwargs: Additional generation parameters
            
        Returns:
            str: Generated response considering context
        """
        # Format prompt with context
        formatted_prompt = self.format_prompt(user_query, context)
        
        # Use the same generation logic but with the context-aware prompt
        inputs = self.tokenizer(
            formatted_prompt, 
            return_tensors="pt"
        )
        input_ids = inputs.input_ids.to(self.device)
        attention_mask = inputs.attention_mask.to(self.device)
        
        # Use longer max_length for context-aware responses
        max_length = kwargs.pop('max_length', 300)
        
        with torch.no_grad():
            output = self.model.generate(
                input_ids,
                attention_mask=attention_mask,
                max_length=len(input_ids[0]) + max_length,
                temperature=kwargs.pop('temperature', 0.8),
                top_p=kwargs.pop('top_p', 0.95),
                do_sample=kwargs.pop('do_sample', True),
                pad_token_id=self.tokenizer.eos_token_id,
                **kwargs
            )
        
        response = self.tokenizer.decode(
            output[0], 
            skip_special_tokens=True
        )
        
        # Remove the input prompt from the response
        return response.replace(formatted_prompt, "").strip()