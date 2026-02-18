$ErrorActionPreference = "SilentlyContinue"

Write-Host "🚀 Starting NPS-Wise Multilingual Chatbot..." -ForegroundColor Cyan

# 1. Start Ollama (if not running)
if (!(Get-Process "ollama" -ErrorAction SilentlyContinue)) {
    Write-Host "🤖 Starting Ollama..." -ForegroundColor Yellow
    Start-Process "ollama" -ArgumentList "serve" -NoNewWindow
    Start-Sleep -Seconds 5
}
else {
    Write-Host "✅ Ollama is already running." -ForegroundColor Green
}

# 2. Start Backend
Write-Host "🐍 Starting Backend on http://localhost:8000..." -ForegroundColor Yellow
$backendProcess = Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd backend; .\venv\Scripts\activate; python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000" -PassThru
Start-Sleep -Seconds 5

# 3. Start Frontend
Write-Host "⚛️  Starting Frontend on http://localhost:8080..." -ForegroundColor Yellow
$frontendProcess = Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "npm run dev" -PassThru
Start-Sleep -Seconds 5

# 4. Open Browser
Write-Host "🌍 Opening Application..." -ForegroundColor Green
Start-Process "http://localhost:8080"

Write-Host "✅ System is live!" -ForegroundColor Green
Write-Host "Press any key to exit this launcher (Servers will keep running)..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
