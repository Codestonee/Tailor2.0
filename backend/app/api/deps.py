from fastapi import Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.models.database import get_db
import logging

logger = logging.getLogger(__name__)

def get_database_session(db: Session = Depends(get_db)) -> Session:
    """
    Dependency to get database session.
    Vi låter eventuella fel bubbla upp så att rätt felmeddelande (t.ex. Validering) visas.
    """
    yield db

async def validate_api_key(x_api_key: str = Header(None)) -> str:
    """Dependency to validate API key (optional, for future use)"""
    if x_api_key is None:
        return None
    
    if not x_api_key or len(x_api_key) < 10:
        raise HTTPException(status_code=401, detail="Invalid API key")
    
    return x_api_key

async def get_client_ip(x_forwarded_for: str = Header(None)) -> str:
    """Get client IP for logging/rate limiting"""
    if x_forwarded_for:
        return x_forwarded_for.split(",")[0].strip()
    return "unknown"