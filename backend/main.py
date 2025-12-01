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

# IMPORTERA DINA PROMPTS HÄR
from prompts import CareerPrompts

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

# --- Helper ---
def clean_json_response(text):
    cleaned = re.sub(r"```json\s*", "", text)
    cleaned = re.sub(r"```\s*$", "", cleaned)
    return cleaned.strip()

# --- Endpoints ---

@app.get("/")
def read_root():
    return {"status": "Tailor Backend is running"}

# 1. ANALYSERA CV
@app.post("/api/v1/cv/analyze_text")
async def analyze_text(request: AnalysisRequest):
    if not GENAI_API_KEY:
        raise HTTPException(status_code=500, detail="API-nyckel saknas.")

    # HÄMTA PROMPT FRÅN CENTRAL FIL
    prompt = CareerPrompts.cv_analysis(request.cv_text, request.job_description)

    try:
        response = model.generate_content(prompt)
        cleaned_text = clean_json_response(response.text)
        json_data = json.loads(cleaned_text)
        return json_data 
    except Exception as e:
        print(f"Fel vid analys: {e}")
        raise HTTPException(status_code=500, detail=f"Kunde inte analysera data: {str(e)}")

# 2. GENERERA PERSONLIGT BREV
@app.post("/api/v1/generate/create")
async def generate_cover_letter(request: CoverLetterRequest):
    # HÄMTA PROMPT FRÅN CENTRAL FIL
    prompt = CareerPrompts.cover_letter(request.cv_text, request.job_description)

    try:
        response = model.generate_content(prompt)
        return {"content": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 3. SÖK JOBB (SMART VERSION)
@app.post("/api/v1/jobs/search")
async def search_jobs(request: JobSearchRequest):
    url = "https://jobsearch.api.jobtechdev.se/search"
    search_query = request.query

    if request.cv_text and (not search_query or search_query.lower() == "jobb"):
        print("Använder AI för att hitta sökord från CV...")
        
        # HÄMTA PROMPT FRÅN CENTRAL FIL
        extraction_prompt = CareerPrompts.extract_search_terms(request.cv_text)
        
        try:
            ai_resp = model.generate_content(extraction_prompt)
            search_query = clean_json_response(ai_resp.text)
            print(f"AI hittade söktermen: {search_query}")
        except Exception as e:
            print(f"Kunde inte extrahera sökord: {e}")
            search_query = "jobb"

    if not search_query:
        search_query = "jobb"

    params = {"q": search_query, "limit": request.limit, "sort": "relevance"}
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

# 4. INTERVJU-SIMULATOR
@app.post("/api/v1/interview/chat")
async def interview_chat(request: InterviewRequest):
    if not GENAI_API_KEY:
        raise HTTPException(status_code=500, detail="API-nyckel saknas.")

    role_description = request.job_description if request.job_description else request.custom_role
    
    # HÄMTA PROMPT FRÅN CENTRAL FIL (I två steg)
    system_instr = CareerPrompts.interview_system_instruction(role_description, request.cv_text)
    full_prompt = CareerPrompts.construct_interview_prompt(system_instr, request.history)

    try:
        response = model.generate_content(full_prompt)
        cleaned_text = clean_json_response(response.text)
        return json.loads(cleaned_text)
    except Exception as e:
        print(f"Intervjufel: {e}")
        return {
            "text": "Ursäkta, kan du utveckla det där lite mer?",
            "scoreImpact": 0
        }

# 5. ROAST MY CV
@app.post("/api/v1/roast/create")
async def roast_cv(request: RoastRequest):
    if not GENAI_API_KEY:
        raise HTTPException(status_code=500, detail="API-nyckel saknas.")

    # HÄMTA PROMPT FRÅN CENTRAL FIL
    prompt = CareerPrompts.roast_cv(request.cv_text)

    try:
        response = model.generate_content(prompt)
        return {"content": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 6. ELEVATOR PITCH
@app.post("/api/v1/pitch/evaluate")
async def evaluate_pitch(request: PitchRequest):
    if not GENAI_API_KEY:
        raise HTTPException(status_code=500, detail="API-nyckel saknas.")

    # HÄMTA PROMPT FRÅN CENTRAL FIL
    prompt = CareerPrompts.evaluate_pitch(request.pitch_text)

    try:
        response = model.generate_content(prompt)
        cleaned = clean_json_response(response.text)
        return json.loads(cleaned)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)