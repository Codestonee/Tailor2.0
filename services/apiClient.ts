import { AnalysisResult, Job, ChatMessage, InterviewResponse, SalaryEstimation } from "../types";

export interface PitchFeedback {
  score: number;
  feedback: string;
  improved_version: string;
}

export interface APIError {
  error: string;
  message: string;
  timestamp?: string;
}

class APIClient {
  private baseURL: string;
  private timeout: number = 30000; // 30s
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTTL: number = 5 * 60 * 1000; // 5 minuter

  constructor() {
    // Din backend URL
    this.baseURL = "https://tailor-backend-154020994638.europe-north1.run.app/api/v1";
  }

  private getCacheKey(endpoint: string, data: any): string {
    return `${endpoint}:${JSON.stringify(data)}`;
  }

  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    const isExpired = Date.now() - cached.timestamp > this.cacheTTL;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }
    return cached.data;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private async post<T>(endpoint: string, data: any, options: { cache?: boolean } = {}): Promise<T> {
    const { cache = false } = options;

    if (cache) {
      const cacheKey = this.getCacheKey(endpoint, data);
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached as T;
    }

    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: controller.signal,
      });
      
      clearTimeout(id);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(errorData.detail || `API Error: ${response.status}`);
      }

      const result = await response.json();

      if (cache) {
        const cacheKey = this.getCacheKey(endpoint, data);
        this.setCache(cacheKey, result);
      }

      return result as T;
    } catch (error: any) {
      console.error(`API Call failed to ${endpoint}:`, error);
      if (error.name === 'AbortError') throw new Error("Servern svarar inte (Timeout). Försök igen.");
      throw error;
    }
  }

  // --- Public Methods ---

  async analyzeCV(cvText: string, jobDescription: string): Promise<AnalysisResult> {
    return this.post<AnalysisResult>("/cv/analyze_text", { cv_text: cvText, job_description: jobDescription, language: "sv" }, { cache: true });
  }

  async generateCoverLetter(cvText: string, jobDescription: string): Promise<string> {
    const res = await this.post<{ content: string }>("/generate/create", { cv_text: cvText, job_description: jobDescription, generation_type: "cover_letter" });
    return res.content;
  }

  // HÄR ÄR FIXEN: Vi skickar med cv_text om mode är 'match'
  async searchJobs(cvText: string, mode: 'match' | 'search', params: { city: string; radius: number; role?: string }): Promise<Job[]> {
    try {
      const res = await this.post<{ jobs: Job[] }>("/jobs/search", {
        query: mode === 'search' ? (params.role || "") : "",
        location: params.city,
        limit: 10,
        cv_text: mode === 'match' ? cvText : "" 
      }, { cache: true });
      
      return res.jobs || [];
    } catch (e) {
      console.warn("Job search failed", e);
      return [];
    }
  }

  async getInterviewResponse(history: ChatMessage[], jobDescription?: string, cvText?: string, role?: string): Promise<InterviewResponse> {
    try {
      return await this.post<InterviewResponse>("/interview/chat", {
        history,
        cv_text: cvText || "",
        job_description: jobDescription || "",
        custom_role: role || ""
      });
    } catch (e) {
      return { text: "Just nu har jag lite svårt att ansluta. Försök igen.", scoreImpact: 0 };
    }
  }

  async roastCV(cvText: string): Promise<string> {
    const res = await this.post<{ content: string }>("/roast/create", { cv_text: cvText });
    return res.content;
  }

  async evaluatePitch(pitchText: string): Promise<PitchFeedback> {
    return this.post<PitchFeedback>("/pitch/evaluate", { pitch_text: pitchText });
  }

  async estimateSalary(role: string, location: string, experience: string): Promise<SalaryEstimation> {
    return {
      role, location,
      range: { low: 32000, median: 44500, high: 58000 },
      tips: ["Hänvisa till liknande projekt", "Betona bredd", "Kolla fackets statistik"],
      factors: ["Erfarenhet", "Geografiskt läge", "Bransch"]
    };
  }
}

export const apiClient = new APIClient();