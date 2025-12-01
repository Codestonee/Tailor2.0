import { AnalysisResult, Job, ChatMessage, InterviewResponse, SalaryEstimation } from "../types";

// Använd miljövariabel om den finns (för prod), annars localhost
const API_URL = "https://tailor-backend-154020994638.europe-north1.run.app/api/v1";

export interface PitchFeedback {
  score: number;
  feedback: string;
  improved_version: string;
}

async function postData(endpoint: string, data: any) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(errorData.detail || `API Error: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("API Call failed:", error);
    throw error;
  }
}

export const parseCV = async (fileText: string): Promise<string> => {
  return fileText; 
};

export const findJobsForCV = async (
  cvText: string, 
  mode: 'match' | 'search', 
  params: { city: string; radius: number; role?: string }
): Promise<Job[]> => {
  try {
    const response = await postData("/jobs/search", {
      query: params.role || "jobb",
      location: params.city,
      limit: 5
    });
    return response.jobs || [];
  } catch (e) {
    console.warn("Kunde inte hämta jobb, returnerar tom lista.", e);
    return [];
  }
};

export const analyzeApplication = async (cvText: string, jobDescription: string): Promise<AnalysisResult> => {
  const data = await postData("/cv/analyze_text", {
    cv_text: cvText,
    job_description: jobDescription,
    language: "sv"
  });
  return data;
};

export const generateCoverLetter = async (cvText: string, jobDescription: string): Promise<string> => {
  const data = await postData("/generate/create", {
    cv_text: cvText,
    job_description: jobDescription,
    generation_type: "cover_letter"
  });
  return data.content;
};

export const getInterviewResponse = async (
  history: ChatMessage[],
  jobDescription?: string,
  cvText?: string,
  role?: string
): Promise<InterviewResponse> => {
  try {
    const data = await postData("/interview/chat", {
      history: history,
      cv_text: cvText || "",
      job_description: jobDescription || "",
      custom_role: role || ""
    });
    return data;
  } catch (error) {
    console.error("Interview Error", error);
    return {
      text: "Just nu har jag lite svårt att ansluta till intervju-servern. Försök igen om en liten stund.",
      scoreImpact: 0
    };
  }
};

export const estimateSalary = async (role: string, location: string, experience: string): Promise<SalaryEstimation> => {
  // Placeholder - Kan kopplas till SCB-API i framtiden
  return {
    role,
    location,
    range: { low: 32000, median: 44500, high: 58000 },
    tips: [
      "Hänvisa till din erfarenhet av liknande projekt", 
      "Betona din kompetensbredd",
      "Kolla lönestatistik hos facket"
    ],
    factors: ["Erfarenhet", "Geografiskt läge", "Bransch"]
  };
};

// --- NYA FUNKTIONER ---

export const roastCV = async (cvText: string): Promise<string> => {
  const data = await postData("/roast/create", { cv_text: cvText });
  return data.content;
};

export const evaluatePitch = async (pitchText: string): Promise<PitchFeedback> => {
  const data = await postData("/pitch/evaluate", { pitch_text: pitchText });
  return data;
};