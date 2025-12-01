export interface Job {
  id: string;
  title: string;
  employer: string;
  description: string;
  location?: string;
  url?: string;
}

export interface Improvement {
  id: string;
  title: string;
  explanation: string;
  example: string;
  impactScore: number; // 1-10 scale or percentage impact
}

export interface AnalysisResult {
  matchScore: number;
  atsScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  improvements: Improvement[];
  summary: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export enum AppStage {
  LANDING = 'LANDING', // Combined Hero + Upload
  JOB_SELECT = 'JOB_SELECT',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
}

export enum AppView {
  HOME = 'HOME',
  INTERVIEW = 'INTERVIEW',
  SALARY = 'SALARY',
  BINGO = 'BINGO', // "KarriärGymmet" i UI:t
  ROAST = 'ROAST', // Ny sida för Roast My CV
  ABOUT = 'ABOUT'
}

export interface UserState {
  cvText: string;
  cvFileName: string;
  selectedJob: Job | null;
  analysis: AnalysisResult | null;
  generatedCoverLetter: string | null;
}

export type MascotEmotion = 'idle' | 'thinking' | 'happy' | 'sad' | 'excited' | 'neutral' | 'sceptical' | 'analyzing' | 'dance' | 'sleep' | 'wave' | 'welcome';

export interface InterviewResponse {
  text: string;
  scoreImpact: number;
}

export interface SalaryEstimation {
  role: string;
  location: string;
  range: {
    low: number;
    median: number;
    high: number;
  };
  tips: string[];
  factors: string[];
}