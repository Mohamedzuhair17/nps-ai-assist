from .language_detector import LanguageDetector
from .translator import NLLBTranslator
from .vector_store import VectorStore
from .llama_client import LlamaClient
import logging
from typing import Dict, Optional

logger = logging.getLogger(__name__)


class RAGPipeline:
    """
    Complete RAG pipeline with multilingual support:
    1. Detect user language
    2. Translate to English (if needed)
    3. Retrieve relevant documents from vector DB
    4. Generate response using Llama 3
    5. Translate response back to user's language
    """
    
    def __init__(
        self,
        language_detector: LanguageDetector,
        translator: NLLBTranslator,
        vector_store: VectorStore,
        llama_client: LlamaClient
    ):
        """
        Initialize RAG pipeline with all required services
        
        Args:
            language_detector: Language detection service
            translator: Translation service
            vector_store: Vector database service
            llama_client: Llama 3 client
        """
        self.language_detector = language_detector
        self.translator = translator
        self.vector_store = vector_store
        self.llama_client = llama_client
        
        logger.info("RAG Pipeline initialized successfully")
    
    def process_query(
        self,
        query: str,
        top_k: int = 5,
        temperature: float = 0.7,
        detect_language: bool = True,
        force_language: Optional[str] = None
    ) -> Dict:
        """
        Process a user query through the complete RAG pipeline
        
        Args:
            query: User query in any supported language
            top_k: Number of documents to retrieve
            temperature: LLM temperature for generation
            detect_language: Whether to auto-detect language
            force_language: Force a specific language (ISO code)
            
        Returns:
            Dictionary containing response and metadata
        """
        import time
        start_time = time.time()
        
        try:
            # Step 1: Detect language
            # Always check script language first for robustness against UI defaults
            t_detect_start = time.time()
            script_lang = self.language_detector.detect_script_language(query)
            
            if script_lang:
                user_language = script_lang
                logger.info(f"Detected script language {user_language} overrides force_language={force_language}")
            elif force_language:
                user_language = force_language
                logger.info(f"Using forced language: {user_language}")
            elif detect_language:
                user_language = self.language_detector.detect_language(query)
                logger.info(f"Detected language: {user_language}")
            else:
                user_language = "en"
            
            t_detect_end = time.time()
            logger.info(f"Time: Language Detection: {t_detect_end - t_detect_start:.4f}s")
            
            # Get NLLB language codes
            user_lang_nllb = self.language_detector.get_nllb_code(user_language)
            
            # Step 2: Translate query to English (if not already English)
            t_translate_q_start = time.time()
            if user_language != "en":
                logger.info(f"Translating query from {user_language} to English")
                english_query = self.translator.translate_to_english(query, user_lang_nllb)
            else:
                english_query = query
            t_translate_q_end = time.time()
            logger.info(f"Time: Query Translation: {t_translate_q_end - t_translate_q_start:.4f}s")
            
            logger.info(f"English query: {english_query}")
            
            # Step 3: Retrieve relevant documents
            t_retrieve_start = time.time()
            logger.info(f"Retrieving top {top_k} documents")
            retrieved_docs = self.vector_store.search(english_query, top_k=top_k)
            
            # Extract document texts
            context_documents = [doc['document'] for doc in retrieved_docs]
            t_retrieve_end = time.time()
            logger.info(f"Time: Retrieval: {t_retrieve_end - t_retrieve_start:.4f}s")
            
            logger.info(f"Retrieved {len(context_documents)} documents")
            
            # Get language name for LLM
            user_lang_name = self.language_detector.get_language_name(user_language)
            
            # Step 4: Generate response using Llama 3
            t_generate_start = time.time()
            logger.info(f"Generating response with Llama 3 in {user_lang_name}")
            generated_response = self.llama_client.generate_response(
                query=english_query,
                context_documents=context_documents,
                temperature=temperature,
                target_language=user_lang_name
            )
            t_generate_end = time.time()
            logger.info(f"Time: Generation: {t_generate_end - t_generate_start:.4f}s")
            
            # Step 5: (Optimized) Language is already handled by LLM directly
            final_response = generated_response
            t_translate_r_start = t_translate_r_end = time.time()
            logger.info("Skipping post-generation translation (handled by LLM)")
            
            total_time = time.time() - start_time
            logger.info(f"Pipeline Timing: Total={total_time:.2f}s, Detect={t_detect_end-t_detect_start:.2f}s, TransQ={t_translate_q_end-t_translate_q_start:.2f}s, Search={t_retrieve_end-t_retrieve_start:.2f}s, LLM={t_generate_end-t_generate_start:.2f}s")
            
            # Prepare result
            result = {
                "response": final_response,
                "detected_language": user_language,
                "english_query": english_query,
                "generated_response": generated_response,
                "retrieved_documents": len(context_documents),
                "timing": {
                    "total": round(total_time, 2),
                    "detection": round(t_detect_end - t_detect_start, 2),
                    "translation_q": round(t_translate_q_end - t_translate_q_start, 2),
                    "retrieval": round(t_retrieve_end - t_retrieve_start, 2),
                    "generation": round(t_generate_end - t_generate_start, 2),
                    "translation_r": round(t_translate_r_end - t_translate_r_start, 2)
                },
                "sources": [
                    {
                        "id": doc['id'],
                        "text": doc['document'][:200] + "..." if len(doc['document']) > 200 else doc['document'],
                        "distance": doc['distance']
                    }
                    for doc in retrieved_docs[:3]  # Return top 3 sources
                ]
            }
            
            logger.info("Query processed successfully")
            return result
            
        except Exception as e:
            logger.error(f"Error in RAG pipeline: {e}", exc_info=True)
            return {
                "response": "I apologize, but I encountered an error processing your question. Please try again.",
                "error": str(e),
                "detected_language": "en"
            }
