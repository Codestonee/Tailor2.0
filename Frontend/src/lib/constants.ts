export const API_ENDPOINTS = {
  ANALYZE_CV: '/api/v1/analyze/cv',
  MATCH_CV: '/api/v1/match/analyze',
  SEARCH_JOBS: '/api/v1/jobs/search',
  BATCH_ANALYZE: '/api/v1/analyze/batch',
  EXTRACT_SKILLS: '/api/v1/extract/skills',
  NORMALIZE_TEXT: '/api/v1/normalize/text',
} as const;

export const MATCH_QUALITY = {
  EXCELLENT: { label: 'Utmärkt Matchning', range: [80, 100], color: 'text-primary' }, // Ändrat till Primary
  GOOD: { label: 'Bra Matchning', range: [60, 79], color: 'text-primary' }, // Ändrat från Blue till Primary
  MODERATE: { label: 'Måttlig Matchning', range: [40, 59], color: 'text-secondary' }, // Orange
  POOR: { label: 'Låg Matchning', range: [0, 39], color: 'text-red-500' },
} as const;

export const LANGUAGES = [
  { code: 'sv', label: 'Svenska' },
  { code: 'en', label: 'Engelska' },
] as const;

export const TONES = [
  { value: 'professional', label: 'Professionell' },
  { value: 'casual', label: 'Avslappnad' },
  { value: 'creative', label: 'Kreativ' },
] as const;