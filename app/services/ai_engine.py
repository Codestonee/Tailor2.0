import logging
import re
import time
import google.generativeai as genai
from google.api_core.exceptions import ResourceExhausted, ServiceUnavailable, InternalServerError
from app.core.config import settings
from app.models.schemas import CVAnalysisResponse

logger = logging.getLogger(__name__)
genai.configure(api_key=settings.CLEAN_API_KEY)

class AIEngine:
    def __init__(self):
        self.model = genai.GenerativeModel(
            model_name=settings.MODEL_NAME,
            # Låg temperatur för att den ska följa reglerna strikt
            generation_config={"response_mime_type": "application/json", "temperature": 0.1}
        )

    def _clean_json_response(self, text: str) -> str:
        text = text.strip()
        if text.startswith("```"):
            text = re.sub(r"^```json\s*|\s*```$", "", text, flags=re.MULTILINE)
        return text

    def analyze_cv(self, full_text: str, language: str = "sv") -> CVAnalysisResponse | dict:
        
        lang_cmd = "SWEDISH" if language == "sv" else "ENGLISH"
        
        # EN BETYDLIGT SMARTARE OCH STRIKTARE PROMPT
        prompt = f"""
        ROLE:
        You are a Senior Tech Recruiter. You evaluate candidates based on COMPENTENCE, not just keywords.

        TASK:
        Analyze the CV against the Job Description provided below.

        SCORING RULES (FOLLOW STRICTLY):
        1. **ROLE MATCH:** If the candidate HAS the job title requested (e.g. Nurse/Sjuksköterska), the score MUST start at 70.
        2. **EXPERIENCE:** If they have relevant years of experience, add points.
        3. **SEMANTIC MATCH:** Understand that "Omvårdnad" = "Vård". Do NOT penalize for synonyms.
        4. **BUZZWORDS:** Do NOT lower the score just because generic buzzwords (like "chatt", "detaljer") are missing.

        TONE RULES:
        - Address the user as "Du" (You).
        - NEVER use the candidate's name (e.g. "Maria"). Use "Du" instead.
        - Be professional but encouraging.

        INPUT DATA:
        {full_text[:50000]} 
        
        OUTPUT FORMAT (JSON):
        {{
            "candidate_info": {{ "name": "Extract Name", "email": "Extract Email", "current_role": "Extract Role" }},
            "summary": "Start with 'Du är en...'. Summarize their fit for this specific role.",
            "skills": {{
                "hard_skills": ["Relevant Hard Skill 1", "Hard Skill 2"],
                "soft_skills": ["Soft Skill 1", "Soft Skill 2"]
            }},
            "score": Integer 0-100 (Follow SCORING RULES above!),
            "strengths": ["Du har...", "Din erfarenhet av..."],
            "weaknesses": ["Du saknar erfarenhet av...", "Det framgår inte om du..."],
            "improvement_plan": ["Lägg till...", "Förtydliga..."]
        }}
        
        Respond in {lang_cmd}.
        """

        max_retries = 3
        base_delay = 2

        for attempt in range(max_retries):
            try:
                logger.info(f"🧠 AI Thinking... Attempt {attempt+1}")
                response = self.model.generate_content(prompt)
                
                if not response.text: raise ValueError("Empty response")
                
                clean_json = self._clean_json_response(response.text)
                return CVAnalysisResponse.model_validate_json(clean_json)

            except Exception as e:
                logger.warning(f"AI Error (Attempt {attempt+1}): {e}")
                if attempt < max_retries - 1:
                    time.sleep(2)
                else:
                    return {"error": "Service unavailable."}