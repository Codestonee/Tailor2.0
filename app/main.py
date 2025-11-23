import os
import shutil
import logging
import tempfile
import magic
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.services.pdf_engine import PDFEngine
from app.services.ai_engine import AIEngine
from app.services.job_engine import JobEngine
from app.services.writer_engine import WriterEngine
from app.core.config import settings

# Konfigurera loggning
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("TailorAPI")

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title=settings.PROJECT_NAME)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS: Tillåt allt för utveckling
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ai_engine = AIEngine()
writer_engine = WriterEngine()
MAX_FILE_SIZE = 10 * 1024 * 1024

class JobSearchRequest(BaseModel):
    query: str
    location: Optional[str] = ""

class JobResult(BaseModel):
    id: str
    title: str
    company: str
    location: str
    description: str
    url: str

async def validate_file(file: UploadFile):
    file.file.seek(0, 2)
    if file.file.tell() > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="Filen är för stor (Max 10MB).")
    file.file.seek(0)
    # Enkel check för att undvika onödiga fel
    if file.content_type != "application/pdf":
         logger.warning(f"Varning: Filtyp är {file.content_type}")

@app.get("/")
def read_root():
    return {"status": "Tailor AI is ready", "model": settings.MODEL_NAME}

@app.post("/search-jobs", response_model=List[JobResult])
@limiter.limit("20/minute")
def search_jobs(request: Request, payload: JobSearchRequest):
    try:
        return JobEngine.search_jobs(payload.query, location=payload.location)
    except Exception:
        raise HTTPException(status_code=503, detail="Kunde inte hämta jobb.")

@app.post("/analyze")
@limiter.limit("10/minute")
async def analyze_cv(
    request: Request,
    file: UploadFile = File(...), 
    job_description: Optional[str] = Form(None),
    language: str = Form("sv")
):
    await validate_file(file)
    
    # Använd tempfile säkert
    fd, temp_path = tempfile.mkstemp(suffix=".pdf")
    os.close(fd)
    
    try:
        # Skriv data till disken
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Extrahera text
        cv_text = PDFEngine.extract_text(temp_path)
        
        # Lägg till jobbannonsen i prompten
        full_context = cv_text
        if job_description:
            intro = "JOB DESCRIPTION (TARGET):" if language == "en" else "JOBBANNONS (MÅLBILD):"
            full_context += f"\n\n{'='*20}\n{intro}\n{job_description}\n{'='*20}"

        # --- HÄR ÄR ÄNDRINGEN ---
        # Vi anropar BARA AI:n. Ingen ScoringEngine som förstör poängen.
        analysis = ai_engine.analyze_cv(full_context, language=language)
        
        if isinstance(analysis, dict) and "error" in analysis:
             raise HTTPException(status_code=503, detail=analysis["error"])

        return analysis

    except Exception as e:
        logger.error(f"Analysis failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.post("/generate-letter")
@limiter.limit("5/minute")
async def generate_letter(
    request: Request,
    file: UploadFile = File(...), 
    job_description: str = Form(...),
    company: str = Form(...),
    language: str = Form("sv"),
    tone: str = Form("professional")
):
    await validate_file(file)
    fd, temp_path = tempfile.mkstemp(suffix=".pdf")
    os.close(fd)

    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        cv_text = PDFEngine.extract_text(temp_path)
        letter = writer_engine.generate_cover_letter(cv_text, job_description, company, language, tone)
        return {"letter": letter}
    except Exception as e:
        logger.error(f"Letter generation failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Kunde inte skapa brev.")
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)