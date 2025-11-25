import os
from dotenv import load_dotenv
from functools import lru_cache

load_dotenv()

class Settings:
    # Project
    PROJECT_NAME: str = "Tailor CV Matching Platform"
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    
    # API
    API_V1_STR: str = "/api/v1"
    
    # AI/LLM
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    MODEL_NAME: str = "gemini-2.5-flash"
    
    # Database (Optional - för future use)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///tailor.db")
    
    # Security
    CORS_ORIGINS: list = ["*"]  # Ändra i prod
    RATE_LIMIT: int = int(os.getenv("RATE_LIMIT", "100"))
    
    # File upload
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: set = {".pdf"}
    
    # Embeddings
    USE_EMBEDDINGS: bool = True
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"  # Lightweight, fast
    
    @property
    def CLEAN_API_KEY(self) -> str:
        """Clean API key from whitespace"""
        if not self.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY not configured")
        return self.GEMINI_API_KEY.strip().replace('\n', '').replace('\r', '')

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()