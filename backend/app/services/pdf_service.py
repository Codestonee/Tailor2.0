import fitz  # PyMuPDF
import pytesseract
import logging
from PIL import Image
import io
import re

logger = logging.getLogger(__name__)

class PDFService:
    """Enhanced PDF extraction with multiple fallbacks"""
    
    @staticmethod
    def extract_text(file_path: str) -> str:
        """Extract text with fallback strategy"""
        # 1. Try PyMuPDF (Fastest)
        text = PDFService._try_pymupdf(file_path)
        if PDFService._is_good(text):
            return PDFService._clean(text)
        
        logger.warning("PyMuPDF insufficient, trying pdfplumber...")
        try:
            import pdfplumber
            with pdfplumber.open(file_path) as pdf:
                text = '\n\n'.join(page.extract_text() or '' for page in pdf.pages)
            if PDFService._is_good(text):
                return PDFService._clean(text)
        except:
            pass
        
        logger.warning("Using OCR fallback...")
        return PDFService._try_ocr(file_path)
    
    @staticmethod
    def _try_pymupdf(path: str) -> str:
        try:
            doc = fitz.open(path)
            text = '\n\n'.join(page.get_text('text') for page in doc)
            doc.close()
            return text
        except:
            return ""
    
    @staticmethod
    def _try_ocr(path: str) -> str:
        try:
            doc = fitz.open(path)
            text = []
            for i, page in enumerate(doc):
                if i >= 3:  # Limit to first 3 pages
                    break
                pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
                img = Image.open(io.BytesIO(pix.tobytes("png")))
                # Requires tesseract installed on system
                try:
                     ocr_text = pytesseract.image_to_string(img, lang='swe+eng')
                     text.append(ocr_text)
                except:
                     pass
            return '\n'.join(text)
        except:
            return ""
    
    @staticmethod
    def _is_good(text: str) -> bool:
        return bool(text and len(text.strip()) > 150)
    
    @staticmethod
    def _clean(text: str) -> str:
        # Fix hyphenation
        text = re.sub(r'-\s*\n\s*', '', text)
        # Remove page numbers
        text = re.sub(r'Sida \d+ av \d+', '', text, flags=re.I)
        # Normalize whitespace
        text = re.sub(r'\n{3,}', '\n\n', text)
        return text.strip()