import os
from dotenv import load_dotenv

# Ladda .env filen om den finns
load_dotenv()

class Settings:
    PROJECT_NAME: str = "Tailor CV Analysis"
    MODEL_NAME: str = "gemini-2.5-flash"
    
    # HÄR VAR FELET: Vi ändrar så den letar efter GEMINI_API_KEY
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    @property
    def CLEAN_API_KEY(self):
        """Städar nyckeln från eventuella mellanslag."""
        if not self.GEMINI_API_KEY:
            # Logga en varning eller kasta ett fel om nyckeln saknas
            print("VARNING: GEMINI_API_KEY saknas i miljövariablerna.")
            return ""
        return self.GEMINI_API_KEY.strip().replace('\n', '').replace('\r', '')

settings = Settings()