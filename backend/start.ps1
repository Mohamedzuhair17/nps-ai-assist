# NPS RAG Backend - Quick Start Script for Windows
# This script sets up and starts the backend server

Write-Host "🚀 NPS Multilingual RAG Backend - Quick Start" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found. Please install Python 3.10 or higher." -ForegroundColor Red
    exit 1
}

# Check if Ollama is running
Write-Host "🔍 Checking Ollama status..." -ForegroundColor Yellow
try {
    $ollamaCheck = Invoke-WebRequest -Uri "http://127.0.0.1:11434" -Method GET -TimeoutSec 2 -ErrorAction SilentlyContinue
    Write-Host "✅ Ollama is running" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Ollama is not running or not accessible at http://127.0.0.1:11434" -ForegroundColor Yellow
    Write-Host "   Please start Ollama and ensure Llama 3 model is installed:" -ForegroundColor Yellow
    Write-Host "   1. Download Ollama from https://ollama.ai" -ForegroundColor Yellow
    Write-Host "   2. Run: ollama pull llama3" -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit 1
    }
}

# Create virtual environment if it doesn't exist
if (-not (Test-Path "venv")) {
    Write-Host "📦 Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    Write-Host "✅ Virtual environment created" -ForegroundColor Green
} else {
    Write-Host "✅ Virtual environment already exists" -ForegroundColor Green
}

# Activate virtual environment
Write-Host "🔧 Activating virtual environment..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"

# Install dependencies
Write-Host "📥 Installing dependencies..." -ForegroundColor Yellow
Write-Host "   (This may take a few minutes on first run - downloading ~2-3GB of models)" -ForegroundColor Yellow
pip install -r requirements.txt --quiet

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Check if vector database is initialized
Write-Host "🗄️  Checking vector database..." -ForegroundColor Yellow
if (-not (Test-Path "data\chroma_db")) {
    Write-Host "⚠️  Vector database not found. Initializing..." -ForegroundColor Yellow
    python scripts\init_vector_db.py
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Vector database initialized" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to initialize vector database" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Vector database already initialized" -ForegroundColor Green
}

# Start the server
Write-Host ""
Write-Host "🎉 Starting FastAPI server..." -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "API will be available at:" -ForegroundColor Cyan
Write-Host "  • Main API: http://localhost:8000" -ForegroundColor White
Write-Host "  • API Docs: http://localhost:8000/docs" -ForegroundColor White
Write-Host "  • Health Check: http://localhost:8000/health" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
