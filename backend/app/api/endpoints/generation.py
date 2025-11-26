from fastapi import APIRouter, Depends, Request, HTTPException
from slowapi import Limiter
from slowapi.util import get_remote_address
import logging

from app.services.ai_service import AIService
from app.schemas.generation import (
    OptimizeCVRequest,
    OptimizeCVResponse,
    CoverLetterRequest,
    CoverLetterResponse,
    EmailTemplateRequest,
    EmailTemplateResponse
)
from app.utils.validators import InputValidator

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/generate", tags=["generation"])
limiter = Limiter(key_func=get_remote_address)
ai_service = AIService()

@router.post("/optimize-cv", response_model=OptimizeCVResponse)
@limiter.limit("5/minute")
async def optimize_cv_endpoint(request: Request, body: OptimizeCVRequest):
    """Optimizes a CV for a given job description."""
    try:
        cv_text = InputValidator.sanitize_text(body.cv_text)
        job_description = InputValidator.sanitize_text(body.job_description)

        if len(cv_text) < 50 or len(job_description) < 20:
            raise HTTPException(status_code=400, detail="CV or job description is too short.")

        result = ai_service.optimize_cv(cv_text, job_description)
        return result
    except Exception as e:
        logger.error(f"CV optimization endpoint failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to optimize CV.")

@router.post("/cover-letter", response_model=CoverLetterResponse)
@limiter.limit("5/minute")
async def generate_cover_letter_endpoint(request: Request, body: CoverLetterRequest):
    """Generates a cover letter based on a CV and job description."""
    try:
        cv_text = InputValidator.sanitize_text(body.cv_text)
        job_description = InputValidator.sanitize_text(body.job_description)

        if len(cv_text) < 50 or len(job_description) < 20:
            raise HTTPException(status_code=400, detail="CV or job description is too short.")

        result = ai_service.generate_cover_letter(cv_text, job_description)
        return result
    except Exception as e:
        logger.error(f"Cover letter generation endpoint failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to generate cover letter.")

@router.post("/email-templates", response_model=EmailTemplateResponse)
@limiter.limit("10/minute")
async def generate_email_templates_endpoint(request: Request, body: EmailTemplateRequest):
    """Generates email templates for a given context."""
    try:
        context = InputValidator.sanitize_text(body.context)
        if not context:
            raise HTTPException(status_code=400, detail="Context cannot be empty.")

        result = ai_service.generate_email_templates(context)
        return result
    except Exception as e:
        logger.error(f"Email template generation endpoint failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to generate email templates.")
