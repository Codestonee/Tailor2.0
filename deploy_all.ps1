# Inställningar
$PROJECT_ID = "tailor-478714"
$REGION = "europe-north1"

Write-Host "🚀 Startar total deployment för Tailor 2.0..." -ForegroundColor Green

# --- BACKEND ---
Write-Host "📦 Bygger och deployar Backend..." -ForegroundColor Yellow
cd backend
gcloud builds submit --tag gcr.io/$PROJECT_ID/tailor-backend
gcloud run deploy tailor-backend --image gcr.io/$PROJECT_ID/tailor-backend --platform managed --region $REGION --allow-unauthenticated
cd ..

# --- FRONTEND ---
Write-Host "🎨 Bygger och deployar Frontend..." -ForegroundColor Yellow
cd Frontend
gcloud builds submit --tag gcr.io/$PROJECT_ID/tailor-frontend
gcloud run deploy tailor-frontend --image gcr.io/$PROJECT_ID/tailor-frontend --platform managed --region $REGION --allow-unauthenticated
cd ..

Write-Host "✅ KLART! Hela systemet är uppdaterat." -ForegroundColor Green