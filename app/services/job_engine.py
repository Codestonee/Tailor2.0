import requests
import logging

logger = logging.getLogger(__name__)

class JobEngine:
    BASE_URL = "https://jobsearch.api.jobtechdev.se/search"

    @staticmethod
    def search_jobs(query: str, limit: int = 10, location: str = None):
        """
        Söker efter jobb via Arbetsförmedlingens öppna API (JobTech).
        """
        # Bygg söksträngen
        # Om användaren inte skrivit något sökord men har en plats, sök på platsen
        search_term = query if query else ""
        if location:
            search_term += f" {location}"
            
        # Om både query och location saknas, returnera tomt direkt
        if not search_term.strip():
            return []

        params = {
            "q": search_term.strip(),
            "limit": limit,
            "offset": 0
        }
        
        try:
            logger.info(f"🔍 Söker jobb med params: {params}")
            response = requests.get(JobEngine.BASE_URL, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            hits = data.get("hits", [])
            
            normalized_jobs = []
            for hit in hits:
                # SÄKERHET: Använd "or" för att garantera att vi aldrig skickar None (null)
                # Detta förhindrar att Pydantic kraschar om API:et saknar data.
                job = {
                    "id": str(hit.get("id") or ""),
                    "title": hit.get("headline") or "Utan rubrik",
                    "company": hit.get("employer", {}).get("name") or "Okänd arbetsgivare",
                    "location": hit.get("workplace_address", {}).get("municipality") or "Sverige",
                    "description": hit.get("description", {}).get("text") or "Ingen beskrivning",
                    "url": hit.get("webpage_url") or ""
                }
                normalized_jobs.append(job)
                
            return normalized_jobs

        except requests.exceptions.RequestException as e:
            logger.error(f"❌ Nätverksfel vid jobbsökning: {e}")
            return []
        except Exception as e:
            logger.error(f"❌ Oväntat fel vid parsning av jobb: {e}")
            return []