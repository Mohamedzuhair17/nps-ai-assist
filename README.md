# NPS-Wise - Multilingual AI Chatbot 🚀

A comprehensive National Pension System (NPS) platform with an intelligent multilingual chatbot powered by RAG (Retrieval-Augmented Generation) and Llama 3.

## ✨ Features

### 🤖 Multilingual AI Chat Assistant
- **10+ Language Support**: English, Tamil, Hindi, Telugu, Malayalam, Bengali, Marathi, Gujarati, Kannada, Punjabi
- **Automatic Language Detection**: Detects user's language and responds in the same language
- **RAG-Powered Responses**: Retrieves relevant information from a comprehensive NPS knowledge base
- **Llama 3 Integration**: Powered by Llama 3 running locally via Ollama
- **Real-time Translation**: Uses Facebook's NLLB-200 model for high-quality translation

### 📊 Additional Features
- NPS Information Portal
- Pension Calculator
- Tax Benefits Guide
- Account Management
- Modern, Responsive UI

## 🏗️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **shadcn-ui** components
- **Framer Motion** for animations

### Backend (NEW!)
- **Python 3.10+** with FastAPI
- **Ollama** for local LLM inference (Llama 3)
- **NLLB-200** for translation
- **ChromaDB** for vector storage
- **Sentence Transformers** (BGE) for embeddings
- **langdetect** for language detection

## 🚀 Quick Start

### Prerequisites
1. Install [Ollama](https://ollama.ai/) and pull Llama 3:
   ```bash
   ollama pull llama3
   ```

2. Ensure you have:
   - Python 3.10+
   - Node.js 18+
   - 8GB+ RAM

### Installation

#### 1. Backend Setup
```bash
cd backend
.\start.ps1  # Windows PowerShell (automated setup)

# OR manually:
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
python scripts\init_vector_db.py
python -m uvicorn main:app --reload
```

#### 2. Frontend Setup
```bash
# In project root
npm install
npm run dev
```

#### 3. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Get started in 5 minutes
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed setup instructions
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Complete technical overview
- **[backend/README.md](backend/README.md)** - Backend documentation

## 🧪 Testing

### Test Backend
```bash
cd backend
python test_backend.py
```

### Test Chat in Different Languages
- English: "What is NPS?"
- Tamil: "என்பிஎஸ் என்றால் என்ன?"
- Hindi: "NPS क्या है?"
- Telugu: "NPS అంటే ఏమిటి?"

## 🌍 Supported Languages

| Language | Code | Native Name |
|----------|------|-------------|
| English | en | English |
| Tamil | ta | தமிழ் |
| Hindi | hi | हिन्दी |
| Telugu | te | తెలుగు |
| Malayalam | ml | മലയാളം |
| Bengali | bn | বাংলা |
| Marathi | mr | मराठी |
| Gujarati | gu | ગુજરાતી |
| Kannada | kn | ಕನ್ನಡ |
| Punjabi | pa | ਪੰਜਾਬੀ |

## 📊 System Architecture

```
User (Any Language)
    ↓
React Frontend
    ↓
FastAPI Backend
    ├── Language Detection
    ├── Translation (NLLB)
    ├── Vector Search (ChromaDB)
    ├── LLM Generation (Llama 3)
    └── Response Translation
    ↓
Ollama Server (Llama 3)
```

## 🔧 Configuration

### Backend (.env)
```env
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3
EMBEDDING_MODEL=BAAI/bge-small-en-v1.5
NLLB_MODEL=facebook/nllb-200-distilled-600M
API_PORT=8000
```

## 📁 Project Structure

```
nps-wise/
├── backend/              # Python FastAPI backend
│   ├── app/
│   │   ├── services/    # RAG pipeline components
│   │   ├── config.py
│   │   └── models.py
│   ├── scripts/
│   ├── main.py
│   └── requirements.txt
├── src/                 # React frontend
│   ├── components/
│   ├── pages/
│   └── ...
├── public/
├── SETUP_GUIDE.md
├── QUICK_START.md
└── package.json
```

## 🐛 Troubleshooting

### "Cannot connect to Ollama"
```bash
ollama list  # Check if Ollama is running
ollama pull llama3  # Pull the model if missing
```

### "Failed to connect to AI service"
- Ensure backend is running: http://localhost:8000/health
- Check CORS settings in backend/.env

### Memory Issues
- Close other applications
- Ensure 8GB+ RAM available
- Restart your computer

## 🚀 Deployment

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for production deployment instructions.

## 📝 License

This project is part of the NPS-Wise application.

## 🤝 Contributing

Contributions are welcome! Please read the setup guide before contributing.

## 📧 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the documentation
3. Check backend logs and browser console

---

**Built with ❤️ for making NPS information accessible in every language**
