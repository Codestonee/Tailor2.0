import google.generativeai as genai
import json
import re
import logging
from typing import Dict
from app.core.config import settings

logger = logging.getLogger(__name__)

class AIService:
    """Gemini API integration with robust error handling"""
    
    def __init__(self):
        genai.configure(api_key=settings.CLEAN_API_KEY)
        self.model = genai.GenerativeModel(
            model_name=settings.MODEL_NAME,
            generation_config={
                "response_mime_type": "application/json",
                "temperature": 0.1
            }
        )
    
    def analyze_cv(self, cv_text: str, language: str = "sv") -> Dict:
        """Analyze CV and return structured output"""
        
        lang = "SWEDISH" if language == "sv" else "ENGLISH"
        
        prompt = f"""
        You are an expert recruiter analyzing a CV.
        Analyze the following CV and extract:
        1. Candidate info (name, email, role)
        2. Skills (hard & soft)
        3. Summary (2-3 sentences)
        4. Strengths (list)
        5. Weaknesses (list)
        
        Return ONLY valid JSON, no markdown or preamble.
        CV:
        {cv_text[:8000]}
        
        Language: {lang}
        """
        
        try:
            response = self.model.generate_content(prompt)
            return self._parse_json(response.text)
        except Exception as e:
            logger.error(f"AI analysis failed: {e}")
            # Fallback empty structure to prevent crash
            return {
                "candidate_info": {"name": "Unknown", "email": ""},
                "summary": "Analysis failed due to AI error.",
                "skills": {"hard_skills": [], "soft_skills": []},
                "score": 0
            }
    
    def _parse_json(self, text: str) -> Dict:
        """Parse JSON from response"""
        text = text.strip()
        if text.startswith('```'):
            text = re.sub(r'^```json\s*|\s*```$', '', text, flags=re.MULTILINE)
        return json.loads(text)