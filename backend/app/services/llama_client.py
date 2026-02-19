import ollama
import logging
from typing import List, Dict, Optional

logger = logging.getLogger(__name__)


class LlamaClient:
    """Client for interacting with Llama 3 via Ollama"""
    
    def __init__(
        self,
        base_url: str = "http://127.0.0.1:11434",
        model: str = "llama3"
    ):
        """
        Initialize Llama client
        
        Args:
            base_url: Ollama server base URL
            model: Model name (e.g., 'llama3')
        """
        self.base_url = base_url
        self.model = model
        
        # Configure ollama client
        ollama.Client(host=base_url)
        
        logger.info(f"LlamaClient initialized with model: {model} at {base_url}")
    
    def generate_response(
        self,
        query: str,
        context_documents: List[str],
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1024,
        target_language: str = "English"
    ) -> str:
        """
        Generate a response using Llama 3 with RAG context
        
        Args:
            query: User query
            context_documents: Retrieved documents for context
            system_prompt: Optional system prompt
            temperature: Sampling temperature (0.0 to 1.0)
            max_tokens: Maximum tokens to generate
            target_language: Language to respond in
        """
        if not query or not query.strip():
            logger.warning("Empty query provided for generation")
            return "I didn't receive a valid question. Please try again."
        
        # Build context from documents
        context = self._build_context(context_documents)
        
        # Build the prompt
        if system_prompt is None:
            system_prompt = f"""You are an expert assistant for the National Pension System (NPS) in India. 
Your role is to provide accurate, helpful, and detailed information about NPS.
You MUST provide your entire response in {target_language}.
Even if the context is in English, you must translate the relevant information and respond ONLY in {target_language}.

Use the provided context to answer questions accurately. If you're not sure about something, say so.
Be concise but comprehensive. Use bullet points and formatting when helpful."""
        
        # Construct the full prompt
        full_prompt = f"""{system_prompt}

Context from NPS knowledge base (in English):
{context}

User Question: {query}

Please provide a detailed and accurate answer in {target_language} based on the context above:"""
        
        try:
            logger.info(f"Generating response for query: {query[:100]}...")
            
            # Call Ollama API
            response = ollama.generate(
                model=self.model,
                prompt=full_prompt,
                options={
                    'temperature': temperature,
                    'num_predict': max_tokens,
                }
            )
            
            generated_text = response['response'].strip()
            
            logger.info(f"Generated response: {generated_text[:100]}...")
            return generated_text
            
        except Exception as e:
            logger.error(f"Failed to generate response: {e}")
            return f"I apologize, but I encountered an error while processing your question. Please try again or rephrase your question."
    
    def _build_context(self, documents: List[str], max_length: int = 2000) -> str:
        """
        Build context string from retrieved documents
        
        Args:
            documents: List of document texts
            max_length: Maximum character length for context
            
        Returns:
            Formatted context string
        """
        if not documents:
            return "No specific context available."
        
        context_parts = []
        current_length = 0
        
        for i, doc in enumerate(documents, 1):
            doc_text = f"\n[Document {i}]\n{doc}\n"
            
            if current_length + len(doc_text) > max_length:
                break
            
            context_parts.append(doc_text)
            current_length += len(doc_text)
        
        return "\n".join(context_parts)
    
    def check_health(self) -> bool:
        """
        Check if Ollama server is running and model is available
        
        Returns:
            True if healthy, False otherwise
        """
        try:
            # Try to list models
            models = ollama.list()
            
            # Check if our model is available
            model_names = [m['name'] for m in models.get('models', [])]
            
            if self.model in model_names or any(self.model in name for name in model_names):
                logger.info(f"Health check passed. Model {self.model} is available.")
                return True
            else:
                logger.warning(f"Model {self.model} not found in available models: {model_names}")
                return False
                
        except Exception as e:
            logger.error(f"Health check failed: {e}")
            return False
