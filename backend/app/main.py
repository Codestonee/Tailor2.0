Inga emojis eller specialtecken som kraschar Windows-terminalen.
"""

import os
"""
app/main.py - WINDOWS SAFE VERSION
Inga emojis eller specialtecken som kraschar Windows-terminalen.
"""

import os
import logging
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.logging_config import logger
from app.core.security import setup_cors, setup_security_headers, setup_error_handlers
from app.api.routes import router, health_router, limiter as api_limiter

# ============================================================================
# LIFESPAN (STARTUP & SHUTDOWN)
# ============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize on startup and cleanup on shutdown"""
    # --- STARTUP ---
    logger.info("=" * 50)
    logger.info(f"[START] {settings.PROJECT_NAME} v2.0.0 Starting")
    logger.info("=" * 50)
    
    # Check API key
    try:
        _ = settings.CLEAN_API_KEY
        logger.info("[OK] Gemini API key configured")
    except ValueError:
        logger.error("[ERR] GEMINI_API_KEY not configured")
        logger.error("Please set GEMINI_API_KEY in .env file")
    
    # Log configuration
    logger.info(f"Debug mode: {settings.DEBUG}")
    logger.info(f"CORS origins: {settings.CORS_ORIGINS}")
    logger.info(f"Rate limit: {settings.RATE_LIMIT} requests/minute")
    logger.info(f"Max file size: {settings.MAX_FILE_SIZE / 1024 / 1024:.1f} MB")
    
    logger.info("[OK] Tailor 2.0 ready to receive requests")
    logger.info("API docs available at /api/docs")
    logger.info("=" * 50)
    
    yield  # Här körs applikationen
    
    # --- SHUTDOWN ---
    logger.info("[STOP] Tailor 2.0 shutting down")

# Initialize FastAPI
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Advanced CV Analysis and Job Matching Platform",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan
)

# ============================================================================
# MIDDLEWARE SETUP
# ============================================================================

# 1. CORS Configuration
setup_cors(app, settings.CORS_ORIGINS)

# 2. Security Headers
setup_security_headers(app)

# 3. Rate Limiting
app.state.limiter = api_limiter
app.add_middleware(SlowAPIMiddleware)

@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={
            "error": "Too many requests",
            "error_type": "rate_limit_error",
            "detail": "Please wait before making another request"
        }
    )

# 4. Error Handlers
setup_error_handlers(app)

# ============================================================================
# CUSTOM MIDDLEWARE
# ============================================================================

@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all requests with timing"""
    import time
    
    start_time = time.time()
    
    # Log request (Using ASCII arrows)
    logger.debug(f">> {request.method} {request.url.path} from {request.client}")
    
    try:
        response = await call_next(request)
        
        # Calculate duration
        duration = time.time() - start_time
        
        # Log response
        logger.debug(
            f"<< {request.method} {request.url.path} "
            f"{response.status_code} ({duration:.3f}s)"
        )
        
        # Add timing header
        response.headers["X-Process-Time"] = str(duration)
        
        return response
    
    except Exception as e:
        logger.error(
            f"Request failed: {request.method} {request.url.path}",
            exc_info=True
        )
        raise

# ============================================================================
# INCLUDE ROUTERS
# ============================================================================

# Health check routes (no prefix)
app.include_router(health_router)

# API routes (with /api/v1 prefix)
app.include_router(router)

# ============================================================================
# ROOT ENDPOINTS
# ============================================================================

@app.get("/status")
async def get_status():
    """Detailed status endpoint"""
    return {
        "status": "operational",
        "service": settings.PROJECT_NAME,
        "version": "2.0.0",
        "api": "/api/v1",
        "docs": "/api/docs",
        "debug": settings.DEBUG
    }

# ============================================================================
# 404 HANDLER
# ============================================================================

@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    return JSONResponse(
        status_code=404,
        content={
            "error": "Endpoint not found",
            "error_type": "not_found",
            "path": str(request.url.path),
            "method": request.method,
            "hint": "Check /api/docs for available endpoints"
        }
    )

# ============================================================================
# MAIN ENTRY POINT
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        # reload=settings.DEBUG, # Reload kan ibland strula med 'app' objektet direkt i Windows
        log_level="info",
        access_log=True
    )
