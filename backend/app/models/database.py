from sqlalchemy import create_engine, Column, String, Integer, DateTime, Text, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./tailor.db")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
    echo=os.getenv("DEBUG", "false").lower() == "true"
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ============================================================================
# Database Models
# ============================================================================

class CVAnalysis(Base):
    """Store CV analysis results"""
    __tablename__ = "cv_analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    candidate_name = Column(String(255), index=True)
    candidate_email = Column(String(255), index=True)
    cv_content = Column(Text)
    extraction_score = Column(Float, default=0.0)
    skills_extracted = Column(Text)  # JSON string
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class JobMatch(Base):
    """Store CV-to-job matching results"""
    __tablename__ = "job_matches"
    
    id = Column(Integer, primary_key=True, index=True)
    cv_analysis_id = Column(Integer)
    job_description = Column(Text)
    match_score = Column(Float)
    skill_match_score = Column(Float)
    keyword_match_score = Column(Float)
    semantic_match_score = Column(Float)
    experience_match_score = Column(Float)
    matched_skills = Column(Text)  # JSON string
    missing_skills = Column(Text)   # JSON string
    recommendations = Column(Text)  # JSON string
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

class UserProfile(Base):
    """Store user profiles (future use)"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(255))
    is_active = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)

class AnalysisHistory(Base):
    """Track user analysis history"""
    __tablename__ = "analysis_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    cv_analysis_id = Column(Integer)
    job_match_id = Column(Integer)
    action = Column(String(50))  # "analyzed", "matched", "exported"
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

# Create tables
Base.metadata.create_all(bind=engine)

def get_db():
    """Dependency for database sessions"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()