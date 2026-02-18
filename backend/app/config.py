from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Ollama Configuration
    ollama_base_url: str = "http://127.0.0.1:11434"
    ollama_model: str = "llama3"
    
    # Vector Database
    vector_db_type: str = "chroma"
    chroma_persist_dir: str = "./data/chroma_db"
    
    # Embedding Model
    embedding_model: str = "BAAI/bge-small-en-v1.5"
    
    # Translation Model (NLLB)
    nllb_model: str = "facebook/nllb-200-distilled-600M"
    
    # Supported Languages (ISO 639-1 codes)
    supported_languages: str = "en,ta,te,hi,ml,bn,mr,gu,kn,pa"
    
    # API Configuration
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    cors_origins: str = "http://localhost:5173,http://localhost:3000"
    
    # Logging
    log_level: str = "INFO"
    
    @property
    def supported_languages_list(self) -> List[str]:
        return [lang.strip() for lang in self.supported_languages.split(",")]
    
    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.cors_origins.split(",")]
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
