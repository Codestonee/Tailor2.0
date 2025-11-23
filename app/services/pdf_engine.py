import fitz  # PyMuPDF
import pdfplumber
import pytesseract
from PIL import Image
import io
import re
import logging
import shutil

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PDFEngine:

    @staticmethod
    def extract_text(path: str) -> str:
        """
        Extraherar text med fallback-strategi: PyMuPDF -> pdfplumber -> OCR.
        """
        # 1) PyMuPDF (Snabbast)
        text = PDFEngine._extract_pymupdf(path)
        if PDFEngine._is_good(text):
            return PDFEngine._clean_text(text)

        logger.warning(f"⚠️ PyMuPDF gav dåligt resultat ({len(text)} tecken). Testar pdfplumber...")

        # 2) pdfplumber (Bättre på layout, långsammare)
        text = PDFEngine._extract_pdfplumber(path)
        if PDFEngine._is_good(text):
            return PDFEngine._clean_text(text)

        logger.warning("⚠️ pdfplumber gav också dåligt resultat. Kör OCR (Tungt)...")

        # 3) OCR (Sista utvägen för inskannade bilder)
        text = PDFEngine._extract_ocr(path)
        return PDFEngine._clean_text(text)

    @staticmethod
    def _extract_pymupdf(path: str) -> str:
        try:
            doc = fitz.open(path)
            # Använd "blocks" för att behålla stycke-struktur bättre
            text = ""
            for page in doc:
                text += page.get_text("text") + "\n"
            return text
        except Exception as e:
            logger.error(f"PyMuPDF error: {e}")
            return ""

    @staticmethod
    def _extract_pdfplumber(path: str) -> str:
        try:
            text = []
            with pdfplumber.open(path) as pdf:
                for page in pdf.pages:
                    # extract_text behåller layout bättre än fitz ibland
                    page_text = page.extract_text()
                    if page_text:
                        text.append(page_text)
            return "\n\n".join(text)
        except Exception as e:
            logger.error(f"pdfplumber error: {e}")
            return ""

    @staticmethod
    def _extract_ocr(path: str) -> str:
        # Kolla först om tesseract finns installerat
        if not shutil.which("tesseract"):
            logger.error("❌ Tesseract är inte installerat på servern/datorn. Kan inte köra OCR.")
            return ""

        try:
            doc = fitz.open(path)
            output = []
            
            # Begränsa OCR till första 3 sidorna för att spara tid/minne
            for i, page in enumerate(doc):
                if i >= 3: break 
                
                # Öka DPI för bättre läsbarhet (zoom=2 ger ca 144 DPI, zoom=3 ca 216 DPI)
                pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
                img = Image.open(io.BytesIO(pix.tobytes("png")))
                
                # Försök läsa svenska och engelska
                ocr_text = pytesseract.image_to_string(img, lang="swe+eng")
                output.append(ocr_text)

            text = "\n".join(output)
            logger.info(f"📄 OCR extraherade {len(text)} tecken.")
            return text
        except Exception as e:
            logger.error(f"OCR error: {e}")
            return ""

    @staticmethod
    def _is_good(text: str) -> bool:
        if not text: return False
        # Enkel heuristik: Har vi mer än 100 tecken är det antagligen inte en tom sida/bild
        return len(text.strip()) > 100

    @staticmethod
    def _clean_text(text: str) -> str:
        if not text: return ""

        # 1. Fixa avstavningar (viktigt för svenska!)
        # "utveckl-\ning" -> "utveckling"
        text = re.sub(r"-\s*\n\s*", "", text)

        # 2. Ta bort sidnummer och konstiga sidhuvuden (förenklad)
        text = re.sub(r"Sida \d+ av \d+", "", text, flags=re.I)

        # 3. VIKTIGT: Bevara stycken men ta bort onödig luft
        # Ersätt 3+ nya rader med 2 (styckebrytning)
        text = re.sub(r"\n{3,}", "\n\n", text)
        
        # 4. Ta bort udda tecken som kan förvirra AI (null bytes etc)
        text = text.replace('\x00', '')

        return text.strip()