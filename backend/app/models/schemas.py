from pydantic import BaseModel, Field, validator
from typing import List, Optional

class CandidateInfo(BaseModel):
    name: str = Field(..., description="Candidate full name")
    email: str = Field(..., description="Contact email")
    current_role: Optional[str] = Field(None, description="Current or latest job title")
    years_experience: Optional[int] = Field(None, ge=0, le=70)

class SkillSet(BaseModel):
    hard_skills: List[str] = Field(default_factory=list)
    soft_skills: List[str] = Field(default_factory=list)
    languages: List[str] = Field(default_factory=list)

class CVAnalysisResponse(BaseModel):
    candidate_info: CandidateInfo
    summary: str
    skills: SkillSet
    score: int = Field(..., ge=0, le=100)
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    improvement_plan: List[str] = Field(default_factory=list)

class JobDescription(BaseModel):
    title: str
    company: str
    description: str
    required_skills: List[str] = Field(default_factory=list)
    nice_to_have_skills: List[str] = Field(default_factory=list)

class MatchingResult(BaseModel):
    overall_score: int = Field(..., ge=0, le=100)
    skill_match: int
    experience_match: int
    matched_skills: List[str]
    missing_skills: List[str]
    recommendations: List[str]

class AnalysisRequest(BaseModel):
    cv_content: str = Field(..., min_length=100)
    job_description: str = Field(..., min_length=50)
    # ÄNDRING HÄR: regex -> pattern
    language: str = Field(default="sv", pattern="^(sv|en)$")
    
    @validator('cv_content', 'job_description')
    def check_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Content cannot be empty')
        return v.strip()