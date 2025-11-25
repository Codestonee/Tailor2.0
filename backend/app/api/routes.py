import logging
import os
from typing import Optional, List

from fastapi import APIRouter, Depends, Request, File, UploadFile, Form, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.config import settings
from app.services.pdf_service import PDFService
from app.services.matching_service import MatchingService
from app.services.ai_service import AIService
from app.services.job_service import JobService
from app.utils.validators import InputValidator
from app.api.errors import ValidationError, FileError, ExtractionError
from app.api.deps import get_database_session
from slowapi import Limiter
from slowapi.util import get_remote_address

logger = logging.getLogger(__name__)

# Create routers
router = APIRouter(prefix="/api/v1", tags=["analysis"])
health_router = APIRouter(tags=["health"])

# Rate limiter
limiter = Limiter(key_func=get_remote_address)

# Initialize services
matching_service = MatchingService()
ai_service = AIService()
job_service = JobService()

# --- Pydantic Modeller för JSON Body (NYTT) ---
class JobSearchRequest(BaseModel):
    query: str
    location: Optional[str] = ""
    limit: int = 10

class BatchAnalysisRequest(BaseModel):
    cv_text: str
    job_descriptions: List[str]

class TextRequest(BaseModel):
    text: str

# ============================================================================
# HEALTH ENDPOINTS
# ============================================================================

@health_router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Tailor 2.0", "version": "2.0.0"}

@health_router.get("/")
async def root():
    return {"status": "Tailor 2.0 is operational", "api_docs": "/api/docs"}

# ============================================================================
# ANALYSIS ENDPOINTS
# ============================================================================

@router.post("/analyze/cv", response_model=dict)
@limiter.limit("10/minute")
async def analyze_cv(
    request: Request,
    file: UploadFile = File(...),
    language: str = Form("sv"),
    job_description: Optional[str] = Form(None),
    db: Session = Depends(get_database_session)
):
    try:
        # Validate inputs
        if not InputValidator.validate_file_type(file.filename):
            raise FileError("Endast PDF-filer är tillåtna")

        file.file.seek(0, os.SEEK_END)
        file_size = file.file.tell()
        file.file.seek(0)

        if not InputValidator.validate_file_size(file_size, settings.MAX_FILE_SIZE):
            raise FileError(f"Filen är för stor. Max {int(settings.MAX_FILE_SIZE / 1024 / 1024)} MB tillåten")
        
        # Extract and validate CV text
        import tempfile
        import os
        import shutil
        
        fd, temp_path = tempfile.mkstemp(suffix=".pdf")
        os.close(fd)
        
        try:
            with open(temp_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            cv_text = PDFService.extract_text(temp_path)
            cv_text = InputValidator.sanitize_text(cv_text)

            # Validate CV text (Svensk anpassning)
            if len(cv_text) < 50:
                 raise ValidationError("Kunde inte läsa text från filen. Är det en bild?")

            InputValidator.validate_cv_text(cv_text)
            
            logger.info(f"Extracted {len(cv_text)} characters from PDF")
            
            # Analyze with AI
            analysis = ai_service.analyze_cv(cv_text, language)
            
            # If job description provided, do matching too
            if job_description:
                job_description = InputValidator.sanitize_text(job_description)
                InputValidator.validate_job_description(job_description)

                match_result = matching_service.match_cv_to_job(cv_text, job_description)
                analysis['match_score'] = match_result['overall_score']
                analysis['matched_skills'] = match_result['matched_skills']
                analysis['missing_skills'] = match_result['missing_skills']
                analysis['score'] = match_result['overall_score'] # Override AI score
                analysis['improvement_plan'] = match_result['recommendations']
            
            return analysis
            
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)
    
    except ValidationError:
        raise
    except FileError:
        raise
    except Exception as e:
        logger.error(f"CV analysis failed: {e}", exc_info=True)
        raise ExtractionError(f"Analys misslyckades: {str(e)}")

# ============================================================================
# MATCHING ENDPOINTS
# ============================================================================

# Modell för request body
class MatchRequest(BaseModel):
    cv_content: str
    job_description: str

@router.post("/match/analyze", response_model=dict)
@limiter.limit("20/minute")
async def match_cv_to_job(
    request: Request,
    body: MatchRequest # Använder Pydantic model här
):
    try:
        cv_text = InputValidator.sanitize_text(body.cv_content)
        job_text = InputValidator.sanitize_text(body.job_description)
        
        result = matching_service.match_cv_to_job(cv_text, job_text)
        logger.info(f"Matching complete: {result['overall_score']}%")
        
        return {
            "overall_score": result['overall_score'],
            "skill_score": result['skill_score'],
            "keyword_score": result['keyword_score'],
            "semantic_score": result['semantic_score'],
            "experience_score": result['experience_score'],
            "matched_skills": result['matched_skills'],
            "missing_skills": result['missing_skills'],
            "recommendations": result['recommendations']
        }
    
    except Exception as e:
        logger.error(f"Matching failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# JOB SEARCH ENDPOINTS
# ============================================================================

@router.post("/jobs/search", response_model=dict)
@limiter.limit("20/minute")
async def search_jobs(
    request: Request,
    body: JobSearchRequest # HÄR VAR FELET! Nu använder vi Pydantic
):
    """Search for jobs using JobTech API via JSON Body"""
    try:
        if not body.query or len(body.query) < 2:
            raise ValidationError("Sökordet måste vara minst 2 tecken")
        
        # Anropa servicen
        jobs = job_service.search(body.query, body.location, body.limit)
        
        logger.info(f"Found {len(jobs)} jobs for query: {body.query}")
        
        return {"jobs": jobs, "count": len(jobs), "query": body.query}
    
    except ValidationError:
        raise
    except Exception as e:
        logger.error(f"Job search failed: {e}")
        raise HTTPException(status_code=503, detail="Jobbsökning ej tillgänglig")

# ============================================================================
# BATCH ENDPOINTS
# ============================================================================

@router.post("/analyze/batch", response_model=dict)
@limiter.limit("5/minute")
async def batch_analyze(
    request: Request,
    body: BatchAnalysisRequest # Fixat till Pydantic
):
    try:
        cv_text = InputValidator.sanitize_text(body.cv_text)
        
        results = []
        for i, job_desc in enumerate(body.job_descriptions):
            job_desc = InputValidator.sanitize_text(job_desc)
            match = matching_service.match_cv_to_job(cv_text, job_desc)
            results.append({
                "job_index": i,
                "score": match['overall_score'],
                "details": match
            })
        
        results.sort(key=lambda x: x['score'], reverse=True)
        
        return {
            "results": results,
            "best_match": results[0] if results else None,
            "total_analyzed": len(results)
        }
    except Exception as e:
        logger.error(f"Batch analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# UTILITY ENDPOINTS
# ============================================================================

@router.post("/extract/skills", response_model=dict)
async def extract_skills(request: Request, body: TextRequest):
    try:
        text = InputValidator.sanitize_text(body.text)
        from app.utils.skill_extractor import SkillExtractor
        skills = SkillExtractor.extract_from_text(text)
        return skills
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/normalize/text", response_model=dict)
async def normalize_text(request: Request, body: TextRequest):
    try:
        text = InputValidator.sanitize_text(body.text)
        from app.utils.text_normalizer import TextNormalizer
        normalized = TextNormalizer.normalize(text)
        return {"original": body.text, "normalized": normalized}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))