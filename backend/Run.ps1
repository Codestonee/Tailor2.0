# Stanna vid fel
$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting Tailor 2.0 Backend..."

# Skapa logs-mapp om den inte finns
if (-not (Test-Path "logs")) {
    New-Item -ItemType Directory -Force -Path "logs" | Out-Null
}

# Installera beroenden
Write-Host "📚 Installing dependencies..."
pip install -r requirements.txt

# Starta servern
Write-Host "🌐 Starting Uvicorn server..."
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000