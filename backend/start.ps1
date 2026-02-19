# NPS RAG Backend - Quick Start Script for Windows

Write-Host "NPS Multilingual RAG Backend - Quick Start" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "Python found: $pythonVersion" -ForegroundColor Green
}
catch {
    Write-Host "Python not found. Please install Python 3.10 or higher." -ForegroundColor Red
    exit 1
}

# Check if Ollama is running
Write-Host "Checking Ollama status..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri "http://127.0.0.1:11434" -Method GET -TimeoutSec 2 -ErrorAction Stop | Out-Null
    Write-Host "Ollama is running" -ForegroundColor Green
}
catch {
    Write-Host "Ollama is not running at http://127.0.0.1:11434" -ForegroundColor Yellow
    Write-Host "Run: ollama pull llama3"
}

# Create virtual environment if it doesn't exist
if (-not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    Write-Host "Virtual environment created" -ForegroundColor Green
}
else {
    Write-Host "Virtual environment already exists" -ForegroundColor Green
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Initialize vector database if missing
if (-not (Test-Path "data\chroma_db")) {
    Write-Host "Initializing vector database..." -ForegroundColor Yellow
    python scripts\init_vector_db.py
}

# Start server
Write-Host ""
Write-Host "Starting FastAPI server..." -ForegroundColor Green
Write-Host "API: http://localhost:8000"
Write-Host "Docs: http://localhost:8000/docs"
Write-Host ""

python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
