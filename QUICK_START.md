# 🚀 Quick Start - NPS Multilingual RAG Chatbot

## ⚡ TL;DR - Get Started in 5 Minutes

### 1️⃣ Install Ollama & Llama 3
```bash
# Download Ollama from https://ollama.ai and install
ollama pull llama3
```

### 2️⃣ Start Backend (in one terminal)
```bash
cd backend
.\start.ps1  # Windows PowerShell
# OR manually:
# python -m venv venv
# venv\Scripts\activate
# pip install -r requirements.txt
# python scripts\init_vector_db.py
# python -m uvicorn main:app --reload
```

### 3️⃣ Start Frontend (in another terminal)
```bash
npm install
npm run dev
```

### 4️⃣ Test It!
- Open http://localhost:5173
- Go to Chat Assistant
- Try: "What is NPS?" or "என்பிஎஸ் என்றால் என்ன?"

---

## 📍 Important URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | React app |
| Backend API | http://localhost:8000 | FastAPI server |
| API Docs | http://localhost:8000/docs | Interactive API docs |
| Health Check | http://localhost:8000/health | Backend status |
| Ollama | http://127.0.0.1:11434 | Llama 3 server |

---

## 🧪 Test Commands

### Test Backend Health
```bash
curl http://localhost:8000/health
```

### Test Chat (English)
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"query": "What is NPS?", "top_k": 5}'
```

### Run Test Suite
```bash
cd backend
python test_backend.py
```

---

## 🌍 Supported Languages

| Language | Code | Example Query |
|----------|------|---------------|
| English | en | What is NPS? |
| Tamil | ta | என்பிஎஸ் என்றால் என்ன? |
| Hindi | hi | NPS क्या है? |
| Telugu | te | NPS అంటే ఏమిటి? |
| Malayalam | ml | NPS എന്താണ്? |
| Bengali | bn | NPS কি? |
| Marathi | mr | NPS म्हणजे काय? |
| Gujarati | gu | NPS શું છે? |
| Kannada | kn | NPS ಎಂದರೇನು? |
| Punjabi | pa | NPS ਕੀ ਹੈ? |

---

## 🐛 Quick Troubleshooting

### Backend won't start
```bash
# Check Python version (need 3.10+)
python --version

# Check if virtual environment is activated
# You should see (venv) in your prompt

# Reinstall dependencies
pip install -r requirements.txt
```

### "Cannot connect to Ollama"
```bash
# Check if Ollama is running
ollama list

# If not, start it and pull llama3
ollama pull llama3
```

### Frontend can't connect to backend
```bash
# Verify backend is running
curl http://localhost:8000/health

# Check CORS settings in backend/.env
# Should include: CORS_ORIGINS=http://localhost:5173
```

### "Out of memory" errors
- Close other applications
- Restart your computer
- Ensure you have at least 8GB RAM

---

## 📊 Expected Performance

| Operation | Time |
|-----------|------|
| First request | 5-10s (model loading) |
| English query | 2-5s |
| Multilingual query | 3-8s (includes translation) |
| Language detection | ~50ms |
| Vector search | ~100ms |

---

## 🔧 Common Commands

### Backend
```bash
# Start backend
cd backend
python -m uvicorn main:app --reload

# Initialize/reset database
python scripts\init_vector_db.py

# Test backend
python test_backend.py
```

### Frontend
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## 📁 Project Structure

```
nps-wise/
├── backend/              # Python FastAPI backend
│   ├── app/
│   │   ├── services/    # RAG pipeline components
│   │   ├── config.py    # Configuration
│   │   └── models.py    # API models
│   ├── scripts/         # Utility scripts
│   ├── main.py          # FastAPI app
│   └── requirements.txt # Python dependencies
├── src/                 # React frontend
│   └── pages/
│       └── ChatAssistant.tsx  # Chat interface
├── SETUP_GUIDE.md       # Detailed setup guide
└── QUICK_START.md       # This file
```

---

## 🎯 Next Steps

1. ✅ Get the basic system running
2. 📚 Read the full [SETUP_GUIDE.md](SETUP_GUIDE.md)
3. 🧪 Run the test suite
4. 🎨 Customize the UI
5. 📝 Add more documents to the knowledge base
6. 🚀 Deploy to production

---

## 💡 Tips

- **Keep Ollama running** in the background
- **First request is slow** - models need to load
- **Use the API docs** at http://localhost:8000/docs for testing
- **Check logs** in the terminal for debugging
- **Language auto-detection** works best with full sentences

---

## 📞 Need Help?

1. Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed instructions
2. Review backend logs in terminal
3. Check browser console for frontend errors
4. Verify all services are running (Ollama, Backend, Frontend)

---

**Happy Chatting! 🎉**
