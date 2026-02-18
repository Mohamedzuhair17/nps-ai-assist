from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch
import logging
from typing import Optional

logger = logging.getLogger(__name__)


class NLLBTranslator:
    """Translation service using NLLB (No Language Left Behind) model"""
    
    def __init__(self, model_name: str = "facebook/nllb-200-distilled-600M"):
        """
        Initialize NLLB translator
        
        Args:
            model_name: HuggingFace model name for NLLB
        """
        self.model_name = model_name
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        
        logger.info(f"Loading NLLB model: {model_name} on device: {self.device}")
        
        try:
            self.tokenizer = AutoTokenizer.from_pretrained(model_name)
            self.model = AutoModelForSeq2SeqLM.from_pretrained(model_name).to(self.device)
            logger.info("NLLB model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load NLLB model: {e}")
            raise
    
    def translate(
        self,
        text: str,
        source_lang: str,
        target_lang: str,
        max_length: int = 512
    ) -> str:
        """
        Translate text from source language to target language
        
        Args:
            text: Text to translate
            source_lang: Source language code (NLLB format, e.g., 'tam_Taml')
            target_lang: Target language code (NLLB format, e.g., 'eng_Latn')
            max_length: Maximum length of generated translation
            
        Returns:
            Translated text
        """
        if not text or not text.strip():
            logger.warning("Empty text provided for translation")
            return ""
        
        # If source and target are the same, return original text
        if source_lang == target_lang:
            logger.info(f"Source and target languages are the same ({source_lang}), skipping translation")
            return text
        
        try:
            logger.info(f"Translating from {source_lang} to {target_lang}")
            
            # Set source language for tokenizer
            self.tokenizer.src_lang = source_lang
            
            # Tokenize input
            inputs = self.tokenizer(
                text,
                return_tensors="pt",
                padding=True,
                truncation=True,
                max_length=max_length
            ).to(self.device)
            
            # Generate translation
            translated_tokens = self.model.generate(
                **inputs,
                forced_bos_token_id=self.tokenizer.convert_tokens_to_ids(target_lang),
                max_length=max_length,
                num_beams=5,
                early_stopping=True
            )
            
            # Decode translation
            translated_text = self.tokenizer.batch_decode(
                translated_tokens,
                skip_special_tokens=True
            )[0]
            
            logger.info(f"Translation successful: {text[:50]}... -> {translated_text[:50]}...")
            return translated_text
            
        except Exception as e:
            logger.error(f"Translation failed: {e}")
            # Return original text if translation fails
            return text
    
    def translate_to_english(self, text: str, source_lang: str) -> str:
        """
        Convenience method to translate any language to English
        
        Args:
            text: Text to translate
            source_lang: Source language code (NLLB format)
            
        Returns:
            Translated text in English
        """
        return self.translate(text, source_lang, "eng_Latn")
    
    def translate_from_english(self, text: str, target_lang: str) -> str:
        """
        Convenience method to translate English to any language
        
        Args:
            text: English text to translate
            target_lang: Target language code (NLLB format)
            
        Returns:
            Translated text in target language
        """
        return self.translate(text, "eng_Latn", target_lang)
