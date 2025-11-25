from fastapi import HTTPException
from app.models.enums import ErrorType

class TailorException(HTTPException):
    """Base exception for Tailor API"""
    
    def __init__(self, status_code: int, detail: str, error_type: ErrorType):
        super().__init__(status_code=status_code, detail=detail)
        self.error_type = error_type

class ValidationError(TailorException):
    def __init__(self, detail: str):
        super().__init__(400, detail, ErrorType.VALIDATION_ERROR)

class FileError(TailorException):
    def __init__(self, detail: str):
        super().__init__(400, detail, ErrorType.FILE_ERROR)

class ExtractionError(TailorException):
    def __init__(self, detail: str):
        super().__init__(500, detail, ErrorType.EXTRACTION_ERROR)

class AIError(TailorException):
    def __init__(self, detail: str):
        super().__init__(503, detail, ErrorType.AI_ERROR)

class DatabaseError(TailorException):
    def __init__(self, detail: str):
        super().__init__(500, detail, ErrorType.DATABASE_ERROR)

class RateLimitError(TailorException):
    def __init__(self, detail: str = "Too many requests"):
        super().__init__(429, detail, ErrorType.RATE_LIMIT_ERROR)