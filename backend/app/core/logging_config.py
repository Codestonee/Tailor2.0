import logging
import sys
import os
from logging.handlers import RotatingFileHandler

def setup_logging():
    """Configure structured logging"""
    # Ensure logs directory exists
    os.makedirs('logs', exist_ok=True)

    logger = logging.getLogger("tailor")
    logger.setLevel(logging.DEBUG)
    
    # Format
    formatter = logging.Formatter(
        fmt='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    # Console Handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    
    # File Handler
    file_handler = RotatingFileHandler(
        'logs/tailor.log',
        maxBytes=10*1024*1024,
        backupCount=5
    )
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)
    
    return logger

logger = setup_logging()