from pydantic import BaseModel, Field
from typing import Optional, List, Dict


class ChatRequest(BaseModel):
    """Request model for chat endpoint"""
    query: str = Field(..., min_length=1, max_length=2000, description="User query")
    language: Optional[str] = Field(None, description="Force specific language (ISO code)")
    top_k: int = Field(5, ge=1, le=10, description="Number of documents to retrieve")
    temperature: float = Field(0.7, ge=0.0, le=1.0, description="LLM temperature")


class SourceDocument(BaseModel):
    """Source document information"""
    id: str
    text: str
    distance: float


class ChatResponse(BaseModel):
    """Response model for chat endpoint"""
    response: str
    detected_language: str
    english_query: Optional[str] = None
    english_response: Optional[str] = None
    retrieved_documents: int
    sources: List[SourceDocument]
    error: Optional[str] = None


class DocumentUpload(BaseModel):
    """Request model for uploading documents"""
    documents: List[str] = Field(..., min_items=1, description="List of document texts")
    metadatas: Optional[List[Dict]] = Field(None, description="Optional metadata for each document")
    ids: Optional[List[str]] = Field(None, description="Optional IDs for each document")


class DocumentUploadResponse(BaseModel):
    """Response model for document upload"""
    success: bool
    documents_added: int
    total_documents: int
    message: str


class HealthResponse(BaseModel):
    """Response model for health check"""
    status: str
    ollama_connected: bool
    vector_db_documents: int
    supported_languages: List[str]
