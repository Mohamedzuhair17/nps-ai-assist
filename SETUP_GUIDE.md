# 🚀 NPS - AI Assistant - Complete Setup Guide

This guide will help you set up the complete multilingual RAG (Retrieval-Augmented Generation) assistant system for the National Pension System (NPS).

## 📋 System Overview

The assistant uses a sophisticated pipeline to ensure accurate, multilingual responses:

```
User Input (Any Language) 
    ↓
Language Detection
    ↓
Contextual Translation to English
    ↓
Vector Knowledge Retrieval (ChromaDB)
    ↓
AI Response Generation (Llama 3)
    ↓
Translation back to User Language
    ↓
Natural Language Response
```

## 🎯 Prerequisites

Before starting, ensure you have:

1. **Python 3.10+** - [Download](https://www.python.org/downloads/)
2. **Node.js 18+** - [Download](https://nodejs.org/)
3. **Ollama** - [Download](https://ollama.ai/)
4. **8GB+ RAM** (Recommended)
5. **10GB+ disk space** (For AI models)

## 🏗️ Setup Instructions

### Step 1: Install Ollama and Llama 3

1. **Download and Install Ollama**
   - Visit https://ollama.ai/
   - Install and run the application.

2. **Pull Llama 3 Model**
   ```bash
   ollama pull llama3
   ```

3. **Verify**
   ```bash
   ollama list
   ```

### Step 2: Set Up Backend (Python FastAPI)

1. **Navigate to Backend Directory**
   ```bash
   cd backend
   ```

2. **Run Automated Setup (Recommended)**
   ```powershell
   .\start.ps1
   ```
   *This script handles virtual environment creation, dependency installation, and database initialization.*

3. **Verification**
   - API Docs: http://localhost:8000/docs
   - Health Check: http://localhost:8000/health

### Step 3: Set Up Frontend (React + Vite)

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Dev Server**
   ```bash
   npm run dev
   ```

3. **Open the App**
   - Navigate to http://localhost:5173

## 🌍 Supported Languages

The system supports 10+ languages including:
- English, Tamil, Hindi, Telugu, Malayalam, Bengali, Marathi, Gujarati, Kannada, Punjabi.

## 🔧 Configuration

### Backend (.env)
Edit `backend/.env` for custom settings:
- `OLLAMA_MODEL`: Change LLM model (default: llama3)
- `EMBEDDING_MODEL`: Change vector embedding model
- `CORS_ORIGINS`: Update allowed origins for frontend

## 🐛 Troubleshooting

**Problem**: "Failed to connect to Ollama"
- Ensure Ollama is running in your taskbar/system tray.
- Run `ollama list` to verify model availability.

**Problem**: "Module not found"
- Ensure you've run the `start.ps1` script or manually installed requirements.

**Problem**: Slow Responses
- First request is always slower (model cold start).
- Subsequent requests should take 3-6 seconds.

## 🔐 Production Notes

- **Build**: Use `npm run build` for frontend deployment.
- **Security**: Implement API keys for production RAG access.
- **Hardware**: For high-traffic use, consider GPU-accelerated hosting for the backend.

---

**You are now ready to provide expert NPS assistance in any language! 🚀**
