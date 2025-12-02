import { apiClient } from "./apiClient";
export type { PitchFeedback } from "./apiClient";

// Dessa funktioner agerar bara "brygga" till den riktiga klienten
export const parseCV = async (fileText: string): Promise<string> => { return fileText; };

export const findJobsForCV = (cvText: string, mode: any, params: any) => 
  apiClient.searchJobs(cvText, mode, params);

export const analyzeApplication = (cvText: string, jobDescription: string) => 
  apiClient.analyzeCV(cvText, jobDescription);

export const generateCoverLetter = (cvText: string, jobDescription: string) => 
  apiClient.generateCoverLetter(cvText, jobDescription);

export const getInterviewResponse = (history: any[], jobDescription?: string, cvText?: string, role?: string) => 
  apiClient.getInterviewResponse(history, jobDescription, cvText, role);

export const estimateSalary = (role: string, location: string, experience: string) => 
  apiClient.estimateSalary(role, location, experience);

export const roastCV = (cvText: string) => apiClient.roastCV(cvText);

export const evaluatePitch = (pitchText: string) => apiClient.evaluatePitch(pitchText);