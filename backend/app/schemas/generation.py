from pydantic import BaseModel
from typing import List, Dict

class OptimizeCVRequest(BaseModel):
    cv_text: str
    job_description: str

class OptimizeCVResponse(BaseModel):
    optimized_cv: str
    summary_of_changes: List[str]

class CoverLetterRequest(BaseModel):
    cv_text: str
    job_description: str

class CoverLetterResponse(BaseModel):
    cover_letter_text: str

class EmailTemplateRequest(BaseModel):
    context: str # e.g., "application_follow_up", "networking_outreach"

class EmailTemplate(BaseModel):
    title: str
    body: str

class EmailTemplateResponse(BaseModel):
    templates: List[EmailTemplate]
