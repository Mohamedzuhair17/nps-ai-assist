# NPS - AI Assistant (Backend)

The robust FastAPI backend for the NPS - AI Assistant. This service orchestrates the RAG (Retrieval-Augmented Generation) pipeline, combining language detection, machine translation, vector search, and LLM inference.

## 🌟 Core Features

- **Advanced RAG Pipeline**: Combines context-aware document retrieval with conversational AI.
- **Multilingual Support**: Powered by Facebook's NLLB-200, supporting 10+ major Indian languages.
- **Local LLM Execution**: Scalable integration with Llama 3 running via Ollama.
- **High Performance**: Semantic search implementation using ChromaDB and BGE embeddings.
- **Developer Friendly**: Structured API documentation and built-in health monitoring.

## 🏗️ Architecture Flow

1. **Input**: User query (any language)
2. **Detection**: Identify source language
3. **Translation**: Convert query to English for optimal retrieval
4. **Retrieval**: Semantic search in the NPS Knowledge Base
5. **Generation**: AI synthesizes answer using retrieved context
6. **Translation**: Convert answer back to user's native tongue
7. **Output**: Accurate, natural response

## 🚀 Installation & Setup

### Prerequisites
- Python 3.10+
- Ollama with Llama 3 model (`ollama pull llama3`)

### Steps
1. **Initialize Virtual Environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # venv\Scripts\activate on Windows
   ```
2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
3. **Seed Vector Knowledge**:
   ```bash
   python scripts/init_vector_db.py
   ```
4. **Start Service**:
   ```bash
   python -m uvicorn main:app --reload --port 8000
   ```

## 📡 API Endpoints

- `POST /chat`: Primary endpoint for user queries.
- `GET /health`: Monitor system connectivity and model status.
- `POST /documents`: Add new information to the knowledge base.
- `GET /docs`: Interactive Swagger documentation.

## 📁 Structure

```
backend/
├── app/
│   ├── services/    # Logic for Translation, RAG, and AI
│   ├── config.py    # Environment & System settings
│   └── models.py    # Payload definitions
├── scripts/         # DB bootstrapping scripts
└── main.py          # Application entry point
```

---

**Empowering financial planning through localized artificial intelligence.**
