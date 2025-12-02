import { useCallback } from 'react';

export function useAnalytics() {
  const trackEvent = useCallback((name: string, properties?: Record<string, any>) => {
    if (import.meta.env.DEV) {
      console.log(`[Analytics] ${name}`, properties);
    }
    // Här kan du lägga in Google Analytics eller Mixpanel senare
  }, []);

  return { trackEvent };
}