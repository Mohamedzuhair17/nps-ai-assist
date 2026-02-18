# 🚀 NPS-Wise Multilingual RAG Chatbot - Complete Setup Guide

This guide will help you set up the complete multilingual RAG (Retrieval-Augmented Generation) chatbot system for NPS (National Pension System).

## 📋 System Overview

Your chatbot uses the following pipeline:

```
User Input (Tamil/Hindi/etc.) 
    ↓
Language Detection
    ↓
Translate to English (NLLB)
    ↓
Generate Embeddings (BGE)
    ↓
Retrieve Documents (ChromaDB)
    ↓
Generate Response (Llama 3 via Ollama)
    ↓
Translate to User's Language (NLLB)
    ↓
Response in Original Language
```

## 🎯 Prerequisites

Before starting, ensure you have:

1. **Python 3.10+** - [Download](https://www.python.org/downloads/)
2. **Node.js 18+** - [Download](https://nodejs.org/)
3. **Ollama** - [Download](https://ollama.ai/)
4. **8GB+ RAM** (recommended)
5. **10GB+ free disk space** (for models)

## 🏗️ Setup Instructions

### Step 1: Install Ollama and Llama 3

1. **Download and Install Ollama**
   - Visit https://ollama.ai/
   - Download for Windows
   - Install and run Ollama

2. **Pull Llama 3 Model**
   ```bash
   # Open a new terminal/PowerShell
   ollama pull llama3
   ```

3. **Verify Installation**
   ```bash
   ollama list
   # Should show llama3 in the list
   ```

4. **Keep Ollama Running**
   - Ollama should be running in the background
   - It will be accessible at http://127.0.0.1:11434

### Step 2: Set Up Backend (Python FastAPI)

1. **Navigate to Backend Directory**
   ```bash
   cd backend
   ```

2. **Option A: Use Quick Start Script (Recommended for Windows)**
   ```powershell
   # Run the automated setup script
   .\start.ps1
   ```
   
   This script will:
   - Check prerequisites
   - Create virtual environment
   - Install dependencies
   - Initialize vector database
   - Start the server

3. **Option B: Manual Setup**
   ```bash
   # Create virtual environment
   python -m venv venv
   
   # Activate virtual environment
   # On Windows:
   venv\Scripts\activate
   # On Linux/Mac:
   source venv/bin/activate
   
   # Install dependencies (this will download ~2-3GB of models)
   pip install -r requirements.txt
   
   # Initialize vector database with NPS knowledge
   python scripts\init_vector_db.py
   
   # Start the server
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

4. **Verify Backend is Running**
   - Open http://localhost:8000/docs in your browser
   - You should see the API documentation
   - Check health: http://localhost:8000/health

### Step 3: Set Up Frontend (React + Vite)

1. **Open a New Terminal** (keep backend running in the other terminal)

2. **Navigate to Project Root**
   ```bash
   cd ..  # Go back to project root if you're in backend/
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Open the Application**
   - The app will open at http://localhost:5173
   - Navigate to the "Chat Assistant" page

### Step 4: Test the System

1. **Test in English**
   - Type: "What is NPS?"
   - You should get a detailed response about the National Pension System

2. **Test in Tamil**
   - Type: "என்பிஎஸ் என்றால் என்ன?"
   - The system will detect Tamil, translate to English, get the answer, and translate back to Tamil

3. **Test in Hindi**
   - Type: "NPS क्या है?"
   - Should work similarly with automatic language detection

4. **Test Other Languages**
   - Telugu: "NPS అంటే ఏమిటి?"
   - Malayalam: "NPS എന്താണ്?"
   - Bengali: "NPS কি?"

## 🌍 Supported Languages

The system supports 10+ languages:
- English (en)
- Tamil (ta)
- Hindi (hi)
- Telugu (te)
- Malayalam (ml)
- Bengali (bn)
- Marathi (mr)
- Gujarati (gu)
- Kannada (kn)
- Punjabi (pa)

## 🔧 Configuration

### Backend Configuration

Edit `backend/.env` to customize:

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

# API Configuration
API_PORT=8000
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend Configuration

The frontend is already configured to connect to `http://localhost:8000`. If you change the backend port, update the API URL in:
- `src/pages/ChatAssistant.tsx` (line ~77)

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  - User Interface                                            │
│  - Language Selection                                        │
│  - Chat Interface                                            │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/JSON
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                    Backend (FastAPI)                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              RAG Pipeline                            │   │
│  │  1. Language Detector (langdetect)                  │   │
│  │  2. Translator (NLLB-200)                           │   │
│  │  3. Vector Store (ChromaDB + BGE embeddings)        │   │
│  │  4. LLM Client (Llama 3 via Ollama)                 │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                    Ollama (Local)                            │
│  - Llama 3 Model (4.7GB)                                     │
│  - Running at http://127.0.0.1:11434                         │
└─────────────────────────────────────────────────────────────┘
```

## 🐛 Troubleshooting

### Backend Issues

**Problem**: "Failed to connect to Ollama"
```
Solution:
1. Check if Ollama is running: ollama list
2. Restart Ollama service
3. Verify Llama 3 is installed: ollama pull llama3
```

**Problem**: "Module not found" errors
```
Solution:
1. Ensure virtual environment is activated
2. Reinstall dependencies: pip install -r requirements.txt
```

**Problem**: "Out of memory" errors
```
Solution:
1. Close other applications
2. Restart your computer
3. Consider using a smaller model
```

### Frontend Issues

**Problem**: "Failed to connect to AI service"
```
Solution:
1. Ensure backend is running at http://localhost:8000
2. Check backend health: http://localhost:8000/health
3. Check browser console for CORS errors
```

**Problem**: CORS errors in browser
```
Solution:
1. Verify CORS_ORIGINS in backend/.env includes http://localhost:5173
2. Restart backend server after changing .env
```

## 📈 Performance Expectations

- **First Request**: 5-10 seconds (models loading)
- **Subsequent Requests**: 3-8 seconds
  - Language Detection: ~50ms
  - Translation (2x): ~2-4s
  - Vector Search: ~100ms
  - LLM Generation: ~2-5s

## 🔐 Production Deployment

For production deployment, consider:

1. **Backend**:
   - Add API key authentication
   - Implement rate limiting
   - Use production WSGI server (Gunicorn)
   - Set up HTTPS
   - Use cloud-based vector DB (Pinecone, Weaviate)
   - Consider using API-based LLM (OpenAI, Anthropic)

2. **Frontend**:
   - Build for production: `npm run build`
   - Deploy to Vercel, Netlify, or similar
   - Update API URL to production backend

## 📚 Additional Resources

- **Backend API Docs**: http://localhost:8000/docs
- **Ollama Documentation**: https://ollama.ai/docs
- **NLLB Model**: https://huggingface.co/facebook/nllb-200-distilled-600M
- **ChromaDB**: https://docs.trychroma.com/

## 🆘 Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review backend logs in the terminal
3. Check browser console for frontend errors
4. Verify all services are running:
   - Ollama: http://127.0.0.1:11434
   - Backend: http://localhost:8000/health
   - Frontend: http://localhost:5173

## 📝 Next Steps

Once everything is working:

1. **Add More Documents**: Use the `/documents` API endpoint to add more NPS knowledge
2. **Customize Prompts**: Edit `backend/app/services/llama_client.py` to customize system prompts
3. **Add More Languages**: Update `SUPPORTED_LANGUAGES` in `.env`
4. **Improve UI**: Customize the chat interface in `src/pages/ChatAssistant.tsx`

## 🎉 Success!

If you've made it this far and everything is working, congratulations! You now have a fully functional multilingual RAG chatbot powered by Llama 3.

Try asking questions in different languages and watch the magic happen! 🚀
