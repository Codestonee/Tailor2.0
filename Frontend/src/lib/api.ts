import { AnalysisRequest, AnalysisResult, JobResult } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const analyzeApplication = async (request: AnalysisRequest): Promise<AnalysisResult> => {
  
  if (!request.cvFile) {
    throw new Error("Ingen fil vald.");
  }

  // Förbered data för analys
  const formData = new FormData();
  formData.append('file', request.cvFile);
  formData.append('job_description', request.jobDescription);
  formData.append('language', request.language);

  try {
    console.log("🤖 Skickar till AI för analys...");
    
    // STEG 1: Gör analys-anropet direkt (inget debug-steg)
    const analyzeResponse = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!analyzeResponse.ok) {
      const errorData = await analyzeResponse.json();
      console.error("❌ Backend error:", errorData);
      throw new Error(errorData.detail || 'Analysen misslyckades.');
    }

    const analysisData = await analyzeResponse.json();
    console.log("📊 Analys mottagen:", analysisData);

    // STEG 2: Generera personligt brev
    console.log("✍️ Genererar personligt brev...");
    const companyName = "Arbetsgivaren"; 
    
    const letterFormData = new FormData();
    letterFormData.append('file', request.cvFile);
    letterFormData.append('job_description', request.jobDescription);
    letterFormData.append('company', companyName);
    letterFormData.append('language', request.language);
    letterFormData.append('tone', request.tone);

    const letterResponse = await fetch(`${API_BASE_URL}/generate-letter`, {
      method: 'POST',
      body: letterFormData,
    });

    let letterData = { letter: "Kunde inte generera brev." };
    if (letterResponse.ok) {
      letterData = await letterResponse.json();
    } else {
      console.warn("⚠️ Brevgenerering misslyckades, men fortsätter ändå");
    }

    // STEG 3: Mappa till frontend-format
    let missingKeywords: string[] = [];
    const improvements = analysisData.improvement_plan || [];
    
    // Parsa ut saknade nyckelord om backend lagt in dem
    const firstImprovement = improvements[0] || "";
    if (firstImprovement.includes("Saknar nyckelord:") || firstImprovement.includes("Missing keywords:")) {
        const kwString = firstImprovement.split(":")[1] || "";
        missingKeywords = kwString.split(",").map((s: string) => s.trim()).filter((s: string) => s.length > 0);
        improvements.shift(); // Ta bort raden så den inte visas dubbelt
    }

    // Skapa resultatet
    const result: AnalysisResult = {
      matchScore: analysisData.score,
      scoreBreakdown: {
        technical: analysisData.score, // Använd totalscoren som bas
        softSkills: Math.min(100, analysisData.score + 5),
        experience: Math.max(0, analysisData.score - 5)
      },
      summary: analysisData.summary,
      keywordsFound: analysisData.skills?.hard_skills || [], 
      keywordsMissing: missingKeywords,
      improvements: improvements.map((item: string) => ({
        type: 'missing_skill',
        description: 'Förslag',
        suggestion: item
      })),
      coverLetter: letterData.letter
    };

    return result;

  } catch (error) {
    console.error("❌ API Error:", error);
    throw error;
  }
};

export const searchJobs = async (query: string, location: string = ""): Promise<JobResult[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/search-jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, location }),
    });

    if (!response.ok) {
      throw new Error('Kunde inte hämta jobb');
    }

    return await response.json();
  } catch (error) {
    console.error("Job Search Error:", error);
    return [];
  }
};