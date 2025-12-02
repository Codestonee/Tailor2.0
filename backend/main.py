import os
import requests
import json
import re
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GENAI_API_KEY = os.getenv("GEMINI_API_KEY")
if GENAI_API_KEY:
    genai.configure(api_key=GENAI_API_KEY)
    model = genai.GenerativeModel('gemini-2.0-flash')

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Datamodeller ---
class AnalysisRequest(BaseModel):
    cv_text: str
    job_description: str
    language: str = "sv"

class CoverLetterRequest(BaseModel):
    cv_text: str
    job_description: str
    generation_type: str

class JobSearchRequest(BaseModel):
    query: Optional[str] = ""
    location: str
    limit: int = 10
    cv_text: Optional[str] = "" 

class ChatMessage(BaseModel):
    role: str
    text: str

class InterviewRequest(BaseModel):
    history: List[ChatMessage]
    cv_text: Optional[str] = ""
    job_description: Optional[str] = ""
    custom_role: Optional[str] = ""

class RoastRequest(BaseModel):
    cv_text: str

class PitchRequest(BaseModel):
    pitch_text: str

def clean_json_response(text):
    # Tar bort markdown-block (```json ... ```)
    cleaned = re.sub(r"```json\s*", "", text)
    cleaned = re.sub(r"```\s*$", "", cleaned)
    # Tar bort eventuell text före/efter JSON-klamrar
    start = cleaned.find('{')
    end = cleaned.rfind('}') + 1
    if start != -1 and end != 0:
        cleaned = cleaned[start:end]
    return cleaned.strip()

# --- Endpoints ---

@app.get("/")
def read_root():
    return {"status": "Tailor Backend is running"}

@app.post("/api/v1/cv/analyze_text")
async def analyze_text(request: AnalysisRequest):
    if not GENAI_API_KEY:
        raise HTTPException(status_code=500, detail="API-nyckel saknas.")

    prompt = f"""
    Agera som en expert rekryterare. Analysera följande CV mot jobbannonsen.
    
    JOBBANNONS: {request.job_description[:2000]}...
    CV: {request.cv_text[:4000]}...
    
    Svara ENDAST med giltig JSON enligt denna struktur (inga extra ord):
    {{
        "matchScore": 50,
        "atsScore": 50,
        "matchedSkills": ["skill1", "skill2"],
        "missingSkills": ["skill3"],
        "summary": "Kort sammanfattning...",
        "improvements": [
            {{
                "id": "1",
                "title": "Titel",
                "explanation": "Text...",
                "example": "Exempel...",
                "impactScore": 5
            }}
        ]
    }}
    """
    try:
        response = model.generate_content(prompt)
        cleaned_text = clean_json_response(response.text)
        # Testa att parsa för att se om det är giltigt
        json_data = json.loads(cleaned_text)
        
        # SÄKERHETSKOLL: Se till att alla fält finns
        if "matchScore" not in json_data: json_data["matchScore"] = 50
        if "atsScore" not in json_data: json_data["atsScore"] = 50
        if "matchedSkills" not in json_data: json_data["matchedSkills"] = []
        if "missingSkills" not in json_data: json_data["missingSkills"] = []
        if "improvements" not in json_data: json_data["improvements"] = []
        if "summary" not in json_data: json_data["summary"] = "Analysen kunde inte sammanfattas."
        
        return json_data 
    except Exception as e:
        print(f"Analysfel: {e}")
        # Fallback-data om AI:n misslyckas, så appen inte kraschar
        return {
            "matchScore": 0,
            "atsScore": 0,
            "matchedSkills": [],
            "missingSkills": [],
            "summary": "Kunde inte analysera just nu. Försök igen.",
            "improvements": []
        }

@app.post("/api/v1/generate/create")
async def generate_cover_letter(request: CoverLetterRequest):
    prompt = f"Skriv personligt brev. CV: {request.cv_text[:2000]}. Jobb: {request.job_description[:2000]}"
    try:
        response = model.generate_content(prompt)
        return {"content": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/jobs/search")
async def search_jobs(request: JobSearchRequest):
    url = "https://jobsearch.api.jobtechdev.se/search"
    search_query = request.query

    if request.cv_text and (not search_query or search_query.lower() == "jobb" or search_query == ""):
        try:
            extraction_prompt = f"Läs CV och ge EN yrkestitel på svenska att söka på. CV: {request.cv_text[:2000]}"
            ai_resp = model.generate_content(extraction_prompt)
            search_query = clean_json_response(ai_resp.text)
        except Exception:
            search_query = "jobb"

    if not search_query:
        search_query = "jobb"

    params = {"q": f"{search_query} {request.location}", "limit": request.limit, "sort": "relevance"}
    headers = {"accept": "application/json"}

    try:
        response = requests.get(url, params=params, headers=headers)
        data = response.json()
        mapped_jobs = []
        for hit in data.get("hits", []):
            mapped_jobs.append({
                "id": str(hit.get("id")),
                "title": hit.get("headline"),
                "employer": hit.get("employer", {}).get("name", "Okänd"),
                "description": hit.get("description", {}).get("text", ""),
                "location": hit.get("workplace_address", {}).get("municipality", request.location),
                "url": hit.get("webpage_url", "#")
            })
        return {"jobs": mapped_jobs}
    except Exception:
        return {"jobs": []}

@app.post("/api/v1/interview/chat")
async def interview_chat(request: InterviewRequest):
    system_prompt = f"Du är rekryterare. Roll: {request.job_description}. CV: {request.cv_text}. Svara JSON: {{'text': '...', 'scoreImpact': 0}}"
    full_prompt = system_prompt + "\nHISTORIK: " + str(request.history)
    try:
        response = model.generate_content(full_prompt)
        return json.loads(clean_json_response(response.text))
    except:
        return {"text": "Berätta mer?", "scoreImpact": 0}

@app.post("/api/v1/roast/create")
async def roast_cv(request: RoastRequest):
    try:
        response = model.generate_content(f"Roasta CV hårt: {request.cv_text[:4000]}")
        return {"content": response.text}
    except Exception as e:
        return {"content": "Kunde inte roasta just nu."}

@app.post("/api/v1/pitch/evaluate")
async def evaluate_pitch(request: PitchRequest):
    try:
        response = model.generate_content(f"Utvärdera pitch, ge JSON (score, feedback, improved_version): {request.pitch_text}")
        return json.loads(clean_json_response(response.text))
    except:
        return {"score": 0, "feedback": "Fel vid analys.", "improved_version": ""}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)