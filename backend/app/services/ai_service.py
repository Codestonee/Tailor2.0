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

    def optimize_cv(self, cv_text: str, job_description: str) -> Dict:
        """Generate an optimized version of the CV for a specific job."""
        prompt = f"""
        You are a professional career coach. Your task is to revise and optimize the provided CV to perfectly match the given job description.
        Focus on:
        1.  Rephrasing sentences to highlight relevant experience.
        2.  Incorporating keywords from the job description naturally.
        3.  Suggesting a more impactful summary.

        Return a JSON object with two keys:
        - "optimized_cv": The full, revised CV text as a single string.
        - "summary_of_changes": A list of strings, where each string is a key change you made.

        CV_TEXT:
        {cv_text[:4000]}

        JOB_DESCRIPTION:
        {job_description[:4000]}
        """
        try:
            response = self.model.generate_content(prompt)
            return self._parse_json(response.text)
        except Exception as e:
            logger.error(f"CV optimization failed: {e}")
            raise

    def generate_cover_letter(self, cv_text: str, job_description: str) -> Dict:
        """Generate a cover letter based on a CV and job description."""
        prompt = f"""
        You are a professional writer specializing in job applications.
        Based on the provided CV and job description, write a compelling, professional, and concise cover letter.
        The tone should be confident but humble. The letter should highlight the candidate's key strengths and experiences that align with the job requirements.

        Return a JSON object with one key:
        - "cover_letter_text": The full cover letter text as a single string.

        CV_TEXT:
        {cv_text[:4000]}

        JOB_DESCRIPTION:
        {job_description[:4000]}
        """
        try:
            response = self.model.generate_content(prompt)
            return self._parse_json(response.text)
        except Exception as e:
            logger.error(f"Cover letter generation failed: {e}")
            raise

    def generate_email_templates(self, context: str) -> Dict:
        """Generate email templates for a specific context."""
        prompt = f"""
        You are a career advisor. Generate three professional email templates for the following context: '{context}'.
        Contexts can be 'application_follow_up', 'networking_outreach', 'thank_you_after_interview'.

        Return a JSON object with one key:
        - "templates": A list of objects, where each object has "title" and "body" keys.

        CONTEXT: {context}
        """
        try:
            response = self.model.generate_content(prompt)
            return self._parse_json(response.text)
        except Exception as e:
            logger.error(f"Email template generation failed: {e}")
            raise

    def _parse_json(self, text: str) -> Dict:
        """Parse JSON from response"""
        text = text.strip()
        if text.startswith('```'):
            text = re.sub(r'^```json\s*|\s*```$', '', text, flags=re.MULTILINE)
        return json.loads(text)
