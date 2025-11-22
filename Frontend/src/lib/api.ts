import { AnalysisRequest, AnalysisResult } from '../types';

// Ändra denna URL om du kör backend någon annanstans än lokalt
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'; 

export const analyzeApplication = async (request: AnalysisRequest): Promise<AnalysisResult> => {
  
  // 1. Förbered data för uppladdning
  const formData = new FormData();
  
  if (!request.cvFile) {
    throw new Error("Ingen fil vald.");
  }

  formData.append('file', request.cvFile);
  formData.append('job_description', request.jobDescription);
  formData.append('language', request.language);

  try {
    // 2. Gör analys-anropet till backend
    // Notera: Detta kan ta 10-20 sekunder för AI:n att bearbeta
    const analyzeResponse = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!analyzeResponse.ok) {
      const errorData = await analyzeResponse.json();
      throw new Error(errorData.detail || 'Analysen misslyckades.');
    }

    const analysisData = await analyzeResponse.json();

    // 3. Generera personligt brev (görs separat för att kunna skicka med 'tone' och 'company')
    // Vi försöker gissa företagsnamn från jobbbeskrivningen eller sätter ett default
    const companyName = "Arbetsgivaren"; // I en framtida version kan vi be AI extrahera detta
    
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

    if (!letterResponse.ok) {
        console.warn("Kunde inte generera brev, men analysen lyckades.");
    }
    
    const letterData = await letterResponse.ok ? await letterResponse.json() : { letter: "Kunde inte generera brev." };

    // 4. Mappa om Python-backendens svar till Frontendens format
    
    // Hantera saknade nyckelord (som backend lägger in som text i improvement_plan)
    let missingKeywords: string[] = [];
    const improvements = analysisData.improvement_plan || [];
    
    // Backend lägger ibland in "Saknar nyckelord: ..." som första punkt. Vi försöker parsa ut det.
    const firstImprovement = improvements[0] || "";
    if (firstImprovement.includes("Saknar nyckelord:") || firstImprovement.includes("Missing keywords:")) {
        const kwString = firstImprovement.split(":")[1] || "";
        missingKeywords = kwString.split(",").map((s: string) => s.trim()).filter((s: string) => s.length > 0);
        // Ta bort denna rad från improvements så den inte dubbleras
        improvements.shift();
    }

    return {
      matchScore: analysisData.score,
      // Eftersom backend bara ger EN totalpoäng just nu, så simulerar vi delpoängen 
      // genom att sätta alla till samma (eller variera lite lätt för effekt)
      scoreBreakdown: {
        technical: analysisData.score,
        softSkills: Math.min(100, analysisData.score + 5), // Lite högre för att vara snäll
        experience: Math.max(0, analysisData.score - 5)   // Lite lägre för realism
      },
      summary: analysisData.summary,
      keywordsFound: analysisData.skills?.hard_skills || [], 
      keywordsMissing: missingKeywords,
      improvements: improvements.map((item: string) => ({
        type: 'missing_skill', // Vi sätter en generisk typ tills backend ger mer detaljer
        description: 'Förslag',
        suggestion: item
      })),
      coverLetter: letterData.letter
    };

  } catch (error) {
    console.error("API Error:", error);
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
    return []; // Returnera tom lista vid fel så appen inte kraschar
  }
};