import fitz  # PyMuPDF
import logging

# Konfigurera logging så vi ser vad som händer
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PDFEngine:
    @staticmethod
    def extract_text(file_path: str) -> str:
        """
        Läser en PDF från disk och returnerar all text som en sträng.
        """
        try:
            doc = fitz.open(file_path)
            text_content = []
            
            for page_num, page in enumerate(doc):
                text = page.get_text()
                text_content.append(f"--- Sida {page_num + 1} ---\n{text}")
                
            full_text = "\n".join(text_content)
            logger.info(f"Lyckades extrahera {len(full_text)} tecken från {file_path}")
            return full_text
            
        except Exception as e:
            logger.error(f"Fel vid läsning av PDF: {e}")
            raise e

    @staticmethod
    def count_tokens(text: str) -> int:
        """Enkel uppskattning av tokens (bra för att inte spränga budgeten)"""
        return len(text.split()) * 1.3  # Grov uppskattning