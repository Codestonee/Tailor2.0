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
            generation_config={"response_mime_type": "application/json"}
        )

    def _clean_json_response(self, text: str) -> str:
        text = text.strip()
        if text.startswith("```"):
            text = re.sub(r"^```json\s*|\s*```$", "", text, flags=re.MULTILINE)
        return text

    def analyze_cv(self, full_text: str, language: str = "sv") -> CVAnalysisResponse | dict:
        
        lang_cmd = "SWEDISH" if language == "sv" else "ENGLISH"
        
        # Prompt som tvingar AI att agera som en människa, inte en ordräknare
        prompt = f"""
        ROLE:
        You are a Senior Talent Acquisition Specialist. Your goal is to find the BEST candidate, not to reject people based on missing buzzwords.

        TASK:
        Evaluate the candidate's CV against the Job Description provided below.

        SCORING LOGIC (FOLLOW STRICTLY):
        1. **Core Role Match:** Does the candidate have the right job title (e.g., Nurse/Sjuksköterska)? If YES -> Score MUST start at 70%.
        2. **Experience:** Do they have relevant years of experience? If YES -> Add 10-20%.
        3. **Skills:** Do they have the *capability* to do the job, even if exact keywords differ? (e.g., "Patient care" vs "Omvårdnad"). If YES -> Treat as match.
        4. **Penalty:** Only lower the score if CRITICAL mandatory requirements (like a license or specific language) are explicitly missing.

        TONE RULES:
        - Address the candidate as "Du" (You).
        - NEVER use their name (e.g., "Maria").
        - Be encouraging. Instead of "You lack...", say "You could highlight...".

        INPUT DATA:
        {full_text[:40000]} 
        
        OUTPUT FORMAT (JSON):
        {{
            "candidate_info": {{ "name": "Extract", "email": "Extract", "current_role": "Extract" }},
            "summary": "Start with 'Du är en...'. Summarize why they are a good fit.",
            "skills": {{ "hard_skills": ["Skill 1", "Skill 2"], "soft_skills": ["Skill 1", "Skill 2"] }},
            "score": Integer 0-100 (Follow Scoring Logic above!),
            "strengths": ["Strong point 1", "Strong point 2"],
            "weaknesses": ["Missing requirement 1", "Area for improvement"],
            "improvement_plan": ["Actionable tip 1", "Actionable tip 2"]
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
                    time.sleep((base_delay * (2 ** attempt)) + random.uniform(0, 1))
                else:
                    return {"error": "Service unavailable."}