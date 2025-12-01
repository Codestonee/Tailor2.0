export class APIError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleAPIError(error: unknown): string {
  if (error instanceof APIError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return `Ett fel uppstod: ${error.message}`;
  }
  
  return 'Ett oväntat fel uppstod. Försök igen senare.';
}