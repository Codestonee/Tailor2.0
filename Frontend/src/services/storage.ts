interface AnalysisRecord {
  id: string;
  timestamp: number;
  cvName: string;
  jobTitle: string;
  score: number;
  result: any;
}

export const storageService = {
  saveAnalysis(record: AnalysisRecord): void {
    try {
      const history = JSON.parse(localStorage.getItem('tailor_history') || '[]') as AnalysisRecord[];
      history.unshift(record);
      // Keep only last 20 analyses
      if (history.length > 20) history.pop();
      localStorage.setItem('tailor_history', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving analysis:', error);
    }
  },

  getHistory(): AnalysisRecord[] {
    try {
      return JSON.parse(localStorage.getItem('tailor_history') || '[]') as AnalysisRecord[];
    } catch (error) {
      console.error('Error reading history:', error);
      return [];
    }
  },

  getAnalysis(id: string): AnalysisRecord | null {
    const history = this.getHistory();
    return history.find(r => r.id === id) || null;
  },

  deleteAnalysis(id: string): void {
    try {
      const history = this.getHistory().filter(r => r.id !== id);
      localStorage.setItem('tailor_history', JSON.stringify(history));
    } catch (error) {
      console.error('Error deleting analysis:', error);
    }
  },

  clearHistory(): void {
    try {
      localStorage.removeItem('tailor_history');
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  },
};