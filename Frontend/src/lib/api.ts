import { AnalysisResult, JobResult } from '../types';

// FIX: Vi bygger URL:en explicit så att /api/v1 alltid kommer med
const ENV_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
// Ta bort ev. avslutande slash från ENV_URL och lägg till /api/v1
const API_BASE = `${ENV_URL.replace(/\/$/, '')}/api/v1`;

export interface APIError {
  message: string;
  status: number;
}

class APIClient {
  private async handleError(response: Response): Promise<never> {
    let errorMessage = `API Error: ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || errorMessage;
    } catch {
      // Kunde inte parsa JSON, behåll standardmeddelandet
    }
    
    throw {
      message: errorMessage,
      status: response.status
    } as APIError;
  }

  async analyzeCV(
    file: File,
    jobDescription: string,
    language: string
  ): Promise<AnalysisResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('job_description', jobDescription);
    formData.append('language', language);

    console.log(`Sending request to: ${API_BASE}/analyze/cv`);

    try {
      const response = await fetch(`${API_BASE}/analyze/cv`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) await this.handleError(response);
      
      const data = await response.json();
      
      return {
        matchScore: data.match_score || data.score || 0,
        scoreBreakdown: {
          technical: data.skill_score || 0,
          experience: data.experience_score || 0,
          softSkills: data.soft_skill_score || 0,
        },
        summary: data.summary || '',
        keywordsFound: data.matched_skills || [],
        keywordsMissing: data.missing_skills || [],
        improvements: (data.improvement_plan || data.recommendations || []).map((r: string) => ({
          type: 'suggestion',
          description: 'Förbättring',
          suggestion: r,
        })),
        coverLetter: data.cover_letter || 'Generering misslyckades',
      };
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  }

  async searchJobs(
    query: string,
    location: string = '',
    limit: number = 10
  ): Promise<JobResult[]> {
    const response = await fetch(`${API_BASE}/jobs/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, location, limit }),
    });

    if (!response.ok) await this.handleError(response);
    const data = await response.json();
    return data.jobs || [];
  }
}

export const api = new APIClient();