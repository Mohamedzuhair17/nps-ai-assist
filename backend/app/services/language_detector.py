from langdetect import detect, LangDetectException
from typing import Optional
import logging

logger = logging.getLogger(__name__)


# Language code mapping (ISO 639-1 to NLLB codes)
LANG_CODE_MAP = {
    "en": "eng_Latn",  # English
    "ta": "tam_Taml",  # Tamil
    "te": "tel_Telu",  # Telugu
    "hi": "hin_Deva",  # Hindi
    "ml": "mal_Mlym",  # Malayalam
    "bn": "ben_Beng",  # Bengali
    "mr": "mar_Deva",  # Marathi
    "gu": "guj_Gujr",  # Gujarati
    "kn": "kan_Knda",  # Kannada
    "pa": "pan_Guru",  # Punjabi
}

# Reverse mapping for NLLB to ISO
NLLB_TO_ISO = {v: k for k, v in LANG_CODE_MAP.items()}


class LanguageDetector:
    """Detects the language of input text"""
    
    def __init__(self, supported_languages: list[str] = None):
        self.supported_languages = supported_languages or list(LANG_CODE_MAP.keys())
        logger.info(f"LanguageDetector initialized with languages: {self.supported_languages}")
    
    def detect_language(self, text: str) -> str:
        """
        Detect the language of the input text
        
        Args:
            text: Input text to detect language
            
        Returns:
            ISO 639-1 language code (e.g., 'en', 'ta', 'hi')
        """
        if not text or not text.strip():
            logger.warning("Empty text provided for language detection, defaulting to 'en'")
            return "en"
            
        # 1. Check for specific Indian language scripts explicitly
        # This overrides statistical detection which might be confused by English words like "NPS"
        script_lang = self.detect_script_language(text)
        if script_lang:
            logger.info(f"Detected language via script check: {script_lang}")
            return script_lang
        
        # 2. Fallback to statistical detection
        try:
            detected_lang = detect(text)
            
            # Validate if detected language is supported
            if detected_lang in self.supported_languages:
                logger.debug(f"Detected language via langdetect: {detected_lang}")
                return detected_lang
            else:
                logger.warning(
                    f"Detected language '{detected_lang}' not in supported languages. "
                    f"Defaulting to 'en'"
                )
                return "en"
                
        except LangDetectException as e:
            logger.error(f"Language detection failed: {e}. Defaulting to 'en'")
            return "en"

    def detect_script_language(self, text: str) -> Optional[str]:
        """Detect language based on Unicode character ranges"""
        
        # Count characters in each range
        counts = {
            "ta": 0, # Tamil
            "hi": 0, # Hindi (Devanagari)
            "te": 0, # Telugu
            "ml": 0, # Malayalam
            "bn": 0, # Bengali
            "gu": 0, # Gujarati
            "kn": 0, # Kannada
            "pa": 0, # Punjabi (Gurmukhi)
        }
        
        for char in text:
            cp = ord(char)
            
            if 0x0B80 <= cp <= 0x0BFF: counts["ta"] += 1
            elif 0x0900 <= cp <= 0x097F: counts["hi"] += 1 # Devanagari (Hindi, Marathi)
            elif 0x0C00 <= cp <= 0x0C7F: counts["te"] += 1
            elif 0x0D00 <= cp <= 0x0D7F: counts["ml"] += 1
            elif 0x0980 <= cp <= 0x09FF: counts["bn"] += 1
            elif 0x0A80 <= cp <= 0x0AFF: counts["gu"] += 1
            elif 0x0C80 <= cp <= 0x0CFF: counts["kn"] += 1
            elif 0x0A00 <= cp <= 0x0A7F: counts["pa"] += 1
            
        # Log counts for debugging
        logger.debug(f"Script counts for text '{text[:20]}...': {counts}")
        
        # Return the language with the most characters, if significant
        best_lang = max(counts, key=counts.get)
        if counts[best_lang] > 0:
            return best_lang
            
        return None
    
    def get_nllb_code(self, iso_code: str) -> str:
        """
        Convert ISO 639-1 code to NLLB language code
        
        Args:
            iso_code: ISO 639-1 language code (e.g., 'en', 'ta')
            
        Returns:
            NLLB language code (e.g., 'eng_Latn', 'tam_Taml')
        """
        return LANG_CODE_MAP.get(iso_code, "eng_Latn")
    
    def get_iso_code(self, nllb_code: str) -> str:
        """
        Convert NLLB language code to ISO 639-1 code
        
        Args:
            nllb_code: NLLB language code (e.g., 'eng_Latn', 'tam_Taml')
            
        Returns:
            ISO 639-1 language code (e.g., 'en', 'ta')
        """
        return NLLB_TO_ISO.get(nllb_code, "en")
