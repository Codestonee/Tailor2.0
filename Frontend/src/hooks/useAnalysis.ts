import { useState, useCallback } from 'react';
import { api, APIError } from '../lib/api';
import { AnalysisResult, AnalysisStatus } from '../types';

export const useAnalysisHook = (defaultLanguage = 'sv') => {
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (
    file: File,
    jobDescription: string,
    language: string = defaultLanguage
  ) => {
    setStatus('analyzing');
    setError(null);

    try {
      const result = await api.analyzeCV(file, jobDescription, language);
      setResult(result);
      setStatus('complete');
      return result;
    } catch (err) {
      const apiError = err as APIError;
      setError(apiError.message || "Ett fel uppstod vid analysen.");
      setStatus('error');
      throw err;
    }
  }, [defaultLanguage]);

  const reset = useCallback(() => {
    setStatus('idle');
    setResult(null);
    setError(null);
  }, []);

  return { status, result, error, analyze, reset };
};