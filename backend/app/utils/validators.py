import re
from typing import Tuple
from app.api.errors import ValidationError

class InputValidator:
    """Validate all user inputs"""
    
    @staticmethod
    def validate_email(email: str) -> bool:
        """Validate email format"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))
    
    @staticmethod
    def validate_file_size(file_size: int, max_size: int = 10 * 1024 * 1024) -> bool:
        """Validate file size"""
        return file_size <= max_size
    
    @staticmethod
    def validate_file_type(filename: str, allowed_types: set = {".pdf"}) -> bool:
        """Validate file type"""
        ext = "." + filename.split(".")[-1].lower()
        return ext in allowed_types
    
    @staticmethod
    def validate_text_length(text: str, min_length: int = 10, max_length: int = 100000) -> bool:
        """Validate text length"""
        return min_length <= len(text.strip()) <= max_length
    
    @staticmethod
    def validate_language(lang: str) -> bool:
        """Validate language code"""
        return lang in ["sv", "en"]
    
    @staticmethod
    def validate_cv_text(cv_text: str) -> Tuple[bool, str]:
        """Validate CV text comprehensively"""
        # Check length
        if not InputValidator.validate_text_length(cv_text, 100, 100000):
            raise ValidationError("CV text must be between 100 and 100000 characters")
        
        # Check for required sections (English AND Swedish)
        cv_lower = cv_text.lower()
        required_keywords = [
            # English
            "experience", "skill", "education", "work", "resume", "cv", "profile",
            # Swedish
            "erfarenhet", "utbildning", "kompetens", "arbete", "profil", "sammanfattning", "färdigheter"
        ]
        
        found_keywords = sum(1 for kw in required_keywords if kw in cv_lower)
        
        # Vi sänker kravet till att bara hitta MINST ETT av dessa ord
        if found_keywords < 1:
            # Om vi inte hittar några nyckelord, kolla om texten är rimligt lång ändå
            # Ibland kan layouten göra att ord "försvinner" eller delas upp
            if len(cv_text) > 500:
                return True, "CV text length is sufficient"
                
            raise ValidationError("CV must contain information about experience, skills, or education (på svenska eller engelska)")
        
        return True, "CV text is valid"
    
    @staticmethod
    def validate_job_description(job_text: str) -> Tuple[bool, str]:
        """Validate job description"""
        if not InputValidator.validate_text_length(job_text, 20, 50000):
            raise ValidationError("Job description must be between 20 and 50000 characters")
        
        return True, "Job description is valid"
    
    @staticmethod
    def sanitize_text(text: str) -> str:
        """Remove potentially harmful characters"""
        # Remove null bytes
        text = text.replace('\x00', '')
        
        # Remove control characters (except newlines and tabs)
        text = ''.join(ch for ch in text if ch.isprintable() or ch in '\n\t')
        
        return text