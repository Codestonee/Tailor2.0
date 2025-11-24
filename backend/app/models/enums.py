from enum import Enum

class Language(str, Enum):
    """Supported languages"""
    SWEDISH = "sv"
    ENGLISH = "en"

class AnalysisType(str, Enum):
    """Types of analysis"""
    CV = "cv"
    MATCHING = "matching"
    BATCH = "batch"
    SKILLS = "skills"

class SkillCategory(str, Enum):
    """Skill categories"""
    HARD_SKILL = "hard"
    SOFT_SKILL = "soft"
    LANGUAGE = "language"
    CERTIFICATION = "certification"

class MatchQuality(str, Enum):
    """Match quality levels"""
    EXCELLENT = "excellent"  # 80-100
    GOOD = "good"             # 60-79
    MODERATE = "moderate"     # 40-59
    POOR = "poor"             # 0-39

class ErrorType(str, Enum):
    """Error types for consistent error handling"""
    VALIDATION_ERROR = "validation_error"
    FILE_ERROR = "file_error"
    EXTRACTION_ERROR = "extraction_error"
    AI_ERROR = "ai_error"
    DATABASE_ERROR = "database_error"
    RATE_LIMIT_ERROR = "rate_limit_error"
    SERVER_ERROR = "server_error"