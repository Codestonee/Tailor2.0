import os
import shutil
import logging
import tempfile
import magic  # Kräver: pip install python-magic (Mac/Linux) eller python-magic-bin (Windows)
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
from app.services.scoring_engine import ScoringEngine
from app.services.writer_engine import WriterEngine
from app.core.config import settings

# Konfigurera logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initiera Rate Limiter
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title=settings.PROJECT_NAME)

# Koppla Rate Limiter till appen
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# SÄKERHET: CORS Konfiguration
# Hämtar tillåtna ursprung från miljövariabel eller använder säkra defaults för utveckling
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

ai_engine = AIEngine()
writer_engine = WriterEngine()

# SÄKERHET: Max filstorlek (10 MB)
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
    """
    Validerar filstorlek och MIME-typ för att förhindra skadliga uppladdningar.
    """
    # 1. Kontrollera filstorlek
    file.file.seek(0, 2)  # Gå till slutet
    size = file.file.tell()
    file.file.seek(0)  # Återställ cursor
    
    if size > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="Filen är för stor (Max 10MB).")

    # 2. Kontrollera faktisk MIME-typ (Magic Bytes)
    header = file.file.read(2048)
    file.file.seek(0)  # Återställ cursor
    
    try:
        mime_type = magic.from_buffer(header, mime=True)
        if mime_type != "application/pdf":
            raise HTTPException(
                status_code=400, 
                detail=f"Ogiltig filtyp: {mime_type}. Endast PDF tillåts."
            )
    except Exception as e:
        logger.error(f"Kunde inte validera filtyp: {e}")
        raise HTTPException(status_code=400, detail="Kunde inte verifiera filtypen.")

@app.get("/")
def read_root():
    return {"status": "Tailor AI is ready", "model": settings.MODEL_NAME}

@app.post("/search-jobs", response_model=List[JobResult])
@limiter.limit("20/minute") # Rate limit för sökningar
def search_jobs(request: Request, payload: JobSearchRequest):
    # request-objektet krävs av slowapi
    jobs = JobEngine.search_jobs(payload.query, location=payload.location)
    return jobs

@app.post("/analyze")
@limiter.limit("5/minute") # Striktare rate limit för tung AI-analys
async def analyze_cv(
    request: Request,
    file: UploadFile = File(...), 
    job_description: Optional[str] = Form(None),
    language: str = Form("sv")
):
    # 1. Validera filen
    await validate_file(file)

    # 2. Spara säkert temporärt (Fixar Race Condition)
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    temp_filename = temp_file.name
    
    try:
        # Kopiera innehåll till tempfil
        shutil.copyfileobj(file.file, temp_file)
        temp_file.close() # Stäng så att andra processer kan läsa den
        
        # 3. Extrahera text
        cv_text = PDFEngine.extract_text(temp_filename)
        
        math_score = 0
        missing_keywords = []
        
        if job_description:
            # Scoring engine med språkstöd
            score_result = ScoringEngine.calculate_match(cv_text, job_description, language=language)
            math_score = score_result["score"]
            missing_keywords = score_result["missing_keywords"]
            
            intro = "JOB DESCRIPTION:" if language == "en" else "JOBBANNONS:"
            cv_text += f"\n\n--- {intro} ---\n{job_description}"

        # 4. AI-analys
        analysis = ai_engine.analyze_cv(cv_text, language=language)
        
        # --- FIX: KONTROLLERA OM AI MISSLYCKADES ---
        # Detta block förhindrar kraschen du precis fick
        if isinstance(analysis, dict):
            error_msg = analysis.get("error", "Okänt fel vid AI-analys")
            logger.error(f"AI-analys misslyckades: {error_msg}")
            # Detta ger frontend ett snyggt fel istället för en krasch
            raise HTTPException(status_code=503, detail=error_msg)
        # -------------------------------------------

        if job_description:
            # Nu är det säkert att sätta score, för vi vet att analysis inte är en dict
            analysis.score = math_score
            if missing_keywords:
                prefix = "Missing keywords:" if language == "en" else "Saknar nyckelord:"
                keywords_str = ", ".join(missing_keywords[:5])
                analysis.improvement_plan.insert(0, f"{prefix} {keywords_str}")

        return analysis

    except HTTPException as he:
        raise he # Skicka vidare HTTP-fel
    except Exception as e:
        logger.error(f"Fel vid analys: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # 5. Städa upp
        if os.path.exists(temp_filename):
            os.unlink(temp_filename)

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
    
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    temp_filename = temp_file.name
    
    try:
        shutil.copyfileobj(file.file, temp_file)
        temp_file.close()
            
        cv_text = PDFEngine.extract_text(temp_filename)
        
        letter = writer_engine.generate_cover_letter(
            cv_text=cv_text,
            job_description=job_description,
            company_name=company,
            language=language,
            tone=tone
        )
        return {"letter": letter}
        
    except Exception as e:
        logger.error(f"Fel vid brevgenerering: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_filename):
            os.unlink(temp_filename)