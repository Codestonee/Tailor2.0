import requests
import logging

logger = logging.getLogger(__name__)

class JobEngine:
    BASE_URL = "https://jobsearch.api.jobtechdev.se/search"

    @staticmethod
    def search_jobs(query: str, limit: int = 10, location: str = None):
        """
        Söker efter jobb via Arbetsförmedlingens öppna API (JobTech).
        Ingen API-nyckel krävs för grundläggande sökningar i deras öppna data.
        """
        params = {
            "q": query,
            "limit": limit,
            "offset": 0
        }
        
        # Om plats anges, lägg till det i sökfrågan för enkelhetens skull
        # (API:et har specifika ID:n för orter, men fritextsökning fungerar ofta bra)
        if location:
            params["q"] += f" {location}"

        try:
            logger.info(f"🔍 Söker jobb med query: {params['q']}")
            response = requests.get(JobEngine.BASE_URL, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            hits = data.get("hits", [])
            
            # Vi normaliserar datan så den är lätt att använda i frontend
            normalized_jobs = []
            for hit in hits:
                job = {
                    "id": str(hit.get("id")),
                    "title": hit.get("headline"),
                    "company": hit.get("employer", {}).get("name", "Okänd arbetsgivare"),
                    "location": hit.get("workplace_address", {}).get("municipality", "Sverige"),
                    "description": hit.get("description", {}).get("text", ""),
                    "url": hit.get("webpage_url", "")
                }
                normalized_jobs.append(job)
                
            return normalized_jobs

        except requests.exceptions.RequestException as e:
            logger.error(f"❌ Fel vid jobbsökning: {e}")
            return []