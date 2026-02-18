from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging
from contextlib import asynccontextmanager

from app.config import settings
from app.models import (
    ChatRequest, ChatResponse, DocumentUpload, 
    DocumentUploadResponse, HealthResponse
)
from app.services.language_detector import LanguageDetector
from app.services.translator import NLLBTranslator
from app.services.vector_store import VectorStore
from app.services.llama_client import LlamaClient
from app.services.rag_pipeline import RAGPipeline

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.log_level),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Global service instances
language_detector = None
translator = None
vector_store = None
llama_client = None
rag_pipeline = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize services on startup and cleanup on shutdown"""
    global language_detector, translator, vector_store, llama_client, rag_pipeline
    
    logger.info("Initializing services...")
    
    try:
        # Initialize services
        language_detector = LanguageDetector(settings.supported_languages_list)
        translator = NLLBTranslator(settings.nllb_model)
        vector_store = VectorStore(
            embedding_model=settings.embedding_model,
            persist_directory=settings.chroma_persist_dir
        )
        llama_client = LlamaClient(
            base_url=settings.ollama_base_url,
            model=settings.ollama_model
        )
        rag_pipeline = RAGPipeline(
            language_detector=language_detector,
            translator=translator,
            vector_store=vector_store,
            llama_client=llama_client
        )
        
        logger.info("All services initialized successfully")
        
    except Exception as e:
        logger.error(f"Failed to initialize services: {e}", exc_info=True)
        raise
    
    yield
    
    # Cleanup (if needed)
    logger.info("Shutting down services...")


# Create FastAPI app
app = FastAPI(
    title="NPS Multilingual RAG API",
    description="Multilingual chatbot API for National Pension System with RAG capabilities",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint"""
    return {
        "message": "NPS Multilingual RAG API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Health check endpoint"""
    try:
        ollama_healthy = llama_client.check_health()
        doc_count = vector_store.get_collection_count()
        
        return HealthResponse(
            status="healthy" if ollama_healthy else "degraded",
            ollama_connected=ollama_healthy,
            vector_db_documents=doc_count,
            supported_languages=settings.supported_languages_list
        )
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/chat", response_model=ChatResponse, tags=["Chat"])
async def chat(request: ChatRequest):
    """
    Process a chat query with multilingual RAG pipeline
    
    The pipeline:
    1. Detects user language (or uses forced language)
    2. Translates query to English
    3. Retrieves relevant documents from vector DB
    4. Generates response using Llama 3
    5. Translates response back to user's language
    """
    try:
        logger.info(f"Received chat request: {request.query[:100]}...")
        
        result = rag_pipeline.process_query(
            query=request.query,
            top_k=request.top_k,
            temperature=request.temperature,
            force_language=request.language
        )
        
        return ChatResponse(**result)
        
    except Exception as e:
        logger.error(f"Chat endpoint error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/documents", response_model=DocumentUploadResponse, tags=["Documents"])
async def upload_documents(request: DocumentUpload):
    """
    Upload documents to the vector database
    
    Documents should be in English for best results.
    """
    try:
        logger.info(f"Uploading {len(request.documents)} documents")
        
        vector_store.add_documents(
            documents=request.documents,
            metadatas=request.metadatas,
            ids=request.ids
        )
        
        total_docs = vector_store.get_collection_count()
        
        return DocumentUploadResponse(
            success=True,
            documents_added=len(request.documents),
            total_documents=total_docs,
            message=f"Successfully added {len(request.documents)} documents"
        )
        
    except Exception as e:
        logger.error(f"Document upload error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/documents/count", tags=["Documents"])
async def get_document_count():
    """Get the total number of documents in the vector database"""
    try:
        count = vector_store.get_collection_count()
        return {"total_documents": count}
    except Exception as e:
        logger.error(f"Error getting document count: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=True
    )
