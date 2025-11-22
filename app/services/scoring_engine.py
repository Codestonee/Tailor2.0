from sklearn.feature_extraction.text import TfidfVectorizer, ENGLISH_STOP_WORDS
from sklearn.metrics.pairwise import cosine_similarity
import logging

logger = logging.getLogger(__name__)

# Lista på vanliga svenska stoppord som inte bär någon mening för matchning
SWEDISH_STOP_WORDS = [
    "och", "det", "att", "i", "en", "jag", "hon", "han", "den", "med", "var", "sig", "för",
    "så", "till", "är", "men", "ett", "om", "hade", "de", "av", "icke", "mig", "du", "henne",
    "då", "sin", "nu", "har", "inte", "hans", "honom", "skulle", "hennes", "där", "min",
    "man", "ej", "vid", "kunde", "något", "från", "ut", "när", "efter", "upp", "vi", "dem",
    "vara", "vad", "över", "än", "dig", "kan", "sina", "här", "ha", "mot", "alla", "under",
    "någon", "eller", "allt", "mycket", "sedan", "ju", "denna", "själv", "detta", "åt",
    "utan", "varit", "hur", "ingen", "mitt", "ni", "bli", "blev", "oss", "din", "dessa",
    "några", "deras", "bli", "mina", "samma", "vilken", "er", "sådan", "vår", "blivit",
    "dess", "inom", "mellan", "sådant", "varför", "varje", "vilka", "ditt", "vem", "vilket",
    "sitta", "sådana", "vart", "dina", "vars", "vårt", "våra", "ert", "era", "vilkas"
]

class ScoringEngine:
    @staticmethod
    def calculate_match(cv_text: str, job_description: str, language: str = "sv") -> dict:
        """
        Beräknar matchningspoäng mellan CV och jobbannons med TF-IDF.
        Stöder nu både svenska och engelska stoppord.
        """
        try:
            documents = [cv_text, job_description]
            
            # Välj rätt lista med stoppord beroende på språk
            if language == "en":
                # Konvertera till lista för att TfidfVectorizer ska bli nöjd
                stop_words_list = list(ENGLISH_STOP_WORDS)
            else:
                stop_words_list = SWEDISH_STOP_WORDS
            
            # Skapa TF-IDF-matris med rätt språkinställningar
            vectorizer = TfidfVectorizer(stop_words=stop_words_list)
            
            try:
                tfidf_matrix = vectorizer.fit_transform(documents)
                # Beräkna cosinus-likhet (0-1) och omvandla till procent (0-100)
                match_score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0] * 100
            except ValueError:
                # Kan hända om texterna är tomma eller bara innehåller stoppord
                logger.warning("Kunde inte beräkna TF-IDF (tom text eller bara stoppord). Sätter score till 0.")
                return {"score": 0, "missing_keywords": []}
            
            # Nyckelordsanalys (Enkel mängdlära)
            cv_tokens = set(cv_text.lower().split())
            job_tokens = set(job_description.lower().split())
            
            # Filtrera bort stoppord även från nyckelordslistan för att hitta relevanta saknade ord
            stop_words_set = set(stop_words_list)
            
            missing_keywords = [
                word for word in job_tokens 
                if word not in cv_tokens 
                and word not in stop_words_set 
                and len(word) > 3 # Ignorera korta skräp-ord
                and word.isalpha() # Se till att det faktiskt är ord, inte "---" eller "123"
            ]
            
            # Returnera de 10 mest relevanta saknade orden (enkel heuristik: de som är kvar)
            # En mer avancerad version skulle sortera på TF-IDF-vikt, men detta räcker långt.
            top_missing = list(missing_keywords)[:10]

            return {
                "score": round(match_score, 1),
                "missing_keywords": top_missing
            }
            
        except Exception as e:
            logger.error(f"❌ Fel vid scoring: {e}")
            return {"score": 0, "missing_keywords": []}