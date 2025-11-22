from typing import List, Optional
from pydantic import BaseModel, Field

class CandidateInfo(BaseModel):
    # Namn och email vill vi helst ha, men current_role kan saknas
    name: str = Field(..., description="Kandidatens fullständiga namn")
    email: str = Field(..., description="Kontakt-email")
    # Ändring: Tillåter nu None (null) om kandidaten är arbetslös eller info saknas
    current_role: Optional[str] = Field(None, description="Nuvarande eller senaste jobbtitel")

class Skills(BaseModel):
    hard_skills: List[str] = Field(default_factory=list, description="Tekniska färdigheter")
    soft_skills: List[str] = Field(default_factory=list, description="Personliga egenskaper")

class CVAnalysisResponse(BaseModel):
    candidate_info: CandidateInfo
    summary: str = Field(..., description="Kort sammanfattning av profilen")
    skills: Skills
    # Vi behåller score strikt, AI:n måste ge en poäng
    score: int = Field(..., ge=0, le=100, description="Matchningspoäng mellan 0 och 100")
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    improvement_plan: List[str] = Field(default_factory=list)