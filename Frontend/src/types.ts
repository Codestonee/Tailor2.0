export interface JobResult {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
}

export interface AnalysisRequest {
  cvFile: File | undefined;
  jobDescription: string;
  language: 'sv' | 'en';
  tone: 'professional' | 'casual' | 'creative';
  selectedJob?: JobResult;
}

export interface Improvement {
  type: 'missing_skill' | 'formatting' | 'phrasing';
  description: string;
  suggestion: string;
}

export interface ScoreBreakdown {
  technical: number;
  softSkills: number;
  experience: number;
}

export interface AnalysisResult {
  matchScore: number;
  scoreBreakdown: ScoreBreakdown;
  keywordsFound: string[];
  keywordsMissing: string[];
  improvements: Improvement[];
  coverLetter: string;
  summary: string;
}

export type AnalysisStatus = 'idle' | 'analyzing' | 'complete' | 'error';