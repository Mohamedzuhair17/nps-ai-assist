# NPS Multilingual RAG Backend

A production-ready FastAPI backend for the NPS (National Pension System) chatbot with multilingual support using RAG (Retrieval-Augmented Generation).

## 🌟 Features

- **Multilingual Support**: Automatically detects and responds in 10+ Indian languages (Tamil, Hindi, Telugu, Malayalam, Bengali, Marathi, Gujarati, Kannada, Punjabi, English)
- **RAG Pipeline**: Retrieves relevant documents from vector database for accurate responses
- **NLLB Translation**: Uses Facebook's NLLB-200 model for high-quality translation
- **Llama 3 Integration**: Powered by Llama 3 via Ollama for intelligent responses
- **Vector Database**: ChromaDB for efficient semantic search
- **Production Ready**: Comprehensive error handling, logging, and health checks

## 🏗️ Architecture

```
User Query (Tamil) ↓
Language Detection ↓
Translate to English (NLLB) ↓
Generate Embeddings (BGE) ↓
Retrieve Documents (ChromaDB) ↓
Generate Response (Llama 3) ↓
Translate to Tamil (NLLB) ↓
Response (Tamil)
```

## 📋 Prerequisites

1. **Python 3.10+**
2. **Ollama** with Llama 3 model installed and running
3. **Git** (for cloning)
4. **8GB+ RAM** (recommended for running models)

## 🚀 Quick Start

### 1. Install Ollama and Llama 3

```bash
# Download and install Ollama from https://ollama.ai
# Then pull Llama 3 model
ollama pull llama3

# Verify it's running
ollama list
```

### 2. Set Up Python Environment

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Note**: First installation will download several large models (~2-3GB):
- NLLB translation model (~600MB)
- BGE embedding model (~100MB)
- This is a one-time download

### 3. Initialize Vector Database

```bash
# Run the initialization script to populate the knowledge base
python scripts/init_vector_db.py
```

This will create a ChromaDB database with comprehensive NPS information.

### 4. Start the Server

```bash
# Start the FastAPI server
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc

## 📡 API Endpoints

### Health Check
```bash
GET /health
```

Response:
```json
{
  "status": "healthy",
  "ollama_connected": true,
  "vector_db_documents": 22,
  "supported_languages": ["en", "ta", "te", "hi", "ml", "bn", "mr", "gu", "kn", "pa"]
}
```

### Chat (Main Endpoint)
```bash
POST /chat
Content-Type: application/json

{
  "query": "என்பிஎஸ் என்றால் என்ன?",  // What is NPS? in Tamil
  "language": null,  // Auto-detect, or force with "ta", "hi", etc.
  "top_k": 5,
  "temperature": 0.7
}
```

Response:
```json
{
  "response": "தேசிய ஓய்வூதிய திட்டம் (NPS) என்பது...",
  "detected_language": "ta",
  "english_query": "What is NPS?",
  "english_response": "National Pension System (NPS) is...",
  "retrieved_documents": 5,
  "sources": [...]
}
```

### Upload Documents
```bash
POST /documents
Content-Type: application/json

{
  "documents": ["Document text 1", "Document text 2"],
  "metadatas": [{"source": "manual"}, {"source": "manual"}],
  "ids": ["custom_id_1", "custom_id_2"]
}
```

### Get Document Count
```bash
GET /documents/count
```

## 🔧 Configuration

Edit `.env` file to customize:

```env
# Ollama Configuration
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3

# Vector Database
CHROMA_PERSIST_DIR=./data/chroma_db

# Embedding Model
EMBEDDING_MODEL=BAAI/bge-small-en-v1.5

# Translation Model
NLLB_MODEL=facebook/nllb-200-distilled-600M

# Supported Languages (ISO 639-1 codes)
SUPPORTED_LANGUAGES=en,ta,te,hi,ml,bn,mr,gu,kn,pa

# API Configuration
API_PORT=8000
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

## 🧪 Testing

### Test with cURL

```bash
# Health check
curl http://localhost:8000/health

# Chat in English
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"query": "What is NPS?", "top_k": 5, "temperature": 0.7}'

# Chat in Tamil (auto-detected)
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"query": "என்பிஎஸ் என்றால் என்ன?", "top_k": 5, "temperature": 0.7}'
```

### Test with Python

```python
import requests

response = requests.post(
    "http://localhost:8000/chat",
    json={
        "query": "NPS में टैक्स बेनिफिट क्या है?",  # Hindi
        "top_k": 5,
        "temperature": 0.7
    }
)

print(response.json()["response"])
```

## 📁 Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── config.py              # Configuration management
│   ├── models.py              # Pydantic models
│   └── services/
│       ├── __init__.py
│       ├── language_detector.py   # Language detection
│       ├── translator.py          # NLLB translation
│       ├── vector_store.py        # ChromaDB integration
│       ├── llama_client.py        # Ollama/Llama 3 client
│       └── rag_pipeline.py        # Complete RAG orchestration
├── scripts/
│   └── init_vector_db.py      # Database initialization
├── data/
│   └── chroma_db/             # Vector database (auto-created)
├── main.py                    # FastAPI application
├── requirements.txt           # Python dependencies
├── .env                       # Environment variables
└── README.md                  # This file
```

## 🌍 Supported Languages

| Language | ISO Code | NLLB Code | Script |
|----------|----------|-----------|--------|
| English | en | eng_Latn | Latin |
| Tamil | ta | tam_Taml | Tamil |
| Telugu | te | tel_Telu | Telugu |
| Hindi | hi | hin_Deva | Devanagari |
| Malayalam | ml | mal_Mlym | Malayalam |
| Bengali | bn | ben_Beng | Bengali |
| Marathi | mr | mar_Deva | Devanagari |
| Gujarati | gu | guj_Gujr | Gujarati |
| Kannada | kn | kan_Knda | Kannada |
| Punjabi | pa | pan_Guru | Gurmukhi |

## 🐛 Troubleshooting

### Ollama Connection Error
```
Error: Failed to connect to Ollama
```
**Solution**: Ensure Ollama is running:
```bash
ollama serve
# In another terminal:
ollama list  # Should show llama3
```

### Model Download Issues
```
Error: Model not found
```
**Solution**: Pull the Llama 3 model:
```bash
ollama pull llama3
```

### Memory Issues
```
Error: Out of memory
```
**Solution**: 
- Close other applications
- Use a smaller NLLB model: `facebook/nllb-200-distilled-600M` (default)
- Reduce `top_k` parameter in requests

### CORS Errors
```
Error: CORS policy blocked
```
**Solution**: Add your frontend URL to `CORS_ORIGINS` in `.env`:
```env
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://your-frontend-url
```

## 📊 Performance

- **Average Response Time**: 3-8 seconds (including translation)
  - Language Detection: ~50ms
  - Translation: ~1-2s per direction
  - Vector Search: ~100ms
  - LLM Generation: ~2-5s
  
- **Throughput**: ~10-15 requests/minute (single instance)

- **Model Sizes**:
  - NLLB-200-distilled-600M: ~600MB
  - BGE-small-en-v1.5: ~100MB
  - Llama 3: ~4.7GB (managed by Ollama)

## 🔐 Security Notes

For production deployment:
1. Add API key authentication
2. Implement rate limiting
3. Use HTTPS
4. Sanitize user inputs
5. Set up proper CORS policies
6. Use environment-specific configurations

## 📝 License

This project is part of the NPS-Wise application.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📧 Support

For issues or questions:
- Check the troubleshooting section
- Review API documentation at `/docs`
- Check Ollama status and logs
