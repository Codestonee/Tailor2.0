import google.generativeai as genai
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

class WriterEngine:
    def __init__(self):
        # Vi återanvänder samma nyckel och modellkonfiguration från settings
        genai.configure(api_key=settings.CLEAN_API_KEY)
        self.model = genai.GenerativeModel(settings.MODEL_NAME)

    def generate_cover_letter(
        self, 
        cv_text: str, 
        job_description: str, 
        company_name: str,
        language: str = "sv",
        tone: str = "professional"
    ) -> str:
        """
        Genererar ett personligt brev baserat på CV och jobbannons.
        Anpassar språk och ton baserat på input.
        """
        
        # Mappa tonval till instruktioner (Svenska / Engelska)
        is_swedish = language == "sv"
        
        tone_map_sv = {
            "professional": "professionell, saklig och förtroendeingivande",
            "enthusiastic": "entusiastisk, energisk och framåt",
            "creative": "kreativ, personlig och berättande (storytelling)"
        }
        
        tone_map_en = {
            "professional": "professional, formal and trustworthy",
            "enthusiastic": "enthusiastic, energetic and forward-looking",
            "creative": "creative, personal and storytelling-focused"
        }

        # Välj rätt tonbeskrivning
        selected_tone_desc = tone_map_sv.get(tone) if is_swedish else tone_map_en.get(tone)
        # Fallback om tonen är okänd
        if not selected_tone_desc:
            selected_tone_desc = tone_map_sv["professional"] if is_swedish else tone_map_en["professional"]

        # Språkspecifika instruktioner
        lang_instruction = "på SVENSKA" if is_swedish else "in ENGLISH"
        role_instruction = "professionell karriärcoach" if is_swedish else "professional career coach"
        
        prompt = f"""
        ROLE:
        Du är en {role_instruction}. Din uppgift är att skriva ett övertygande personligt brev (Cover Letter) {lang_instruction}.
        
        TONE:
        Tonen i brevet ska vara: {selected_tone_desc}.
        
        INPUT DATA:
        ----------------
        KANDIDATENS CV:
        {cv_text[:20000]}
        
        FÖRETAG: {company_name}
        JOBBANNONS:
        {job_description[:20000]}
        ----------------
        
        INSTRUKTIONER:
        1. Skriv brevet riktat direkt till {company_name}.
        2. Matcha kandidatens styrkor från CV:t med kraven i jobbannonsen.
        3. Var specifik och undvik klyschor.
        4. Använd INTE platshållare som [Ditt Namn]. Försök hitta namnet i CV:t. Om inget namn finns, skriv under med "Vänliga hälsningar" (eller "Sincerely").
        5. Brevet ska vara max 300 ord.
        6. Formatera med tydliga stycken för läsbarhet.
        
        BREV:
        """
        
        try:
            logger.info(f"✍️ Genererar brev på {language} med ton: {tone}")
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            logger.error(f"❌ Fel vid generering av brev: {e}")
            return "Kunde inte generera brevet just nu. Försök igen senare."