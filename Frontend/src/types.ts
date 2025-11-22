// Lägg till detta i slutet av filen
export interface JobResult {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
}

// Uppdatera AnalysisRequest om du vill spara vilket jobb som valdes (frivilligt men bra)
export interface AnalysisRequest {
  cvFile: File | undefined; // Ändrad till undefined för att matcha InputSection
  jobDescription: string;
  language: 'sv' | 'en';
  tone: 'formal' | 'casual' | 'creative';
  selectedJob?: JobResult; // Nytt fält för att hålla koll på valt jobb
}

// ... (resten av filen kan vara kvar som den är, se till att Improvement etc finns kvar)
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

export type AnalysisStatus = 'idle' | 'uploading' | 'analyzing' | 'complete' | 'error';