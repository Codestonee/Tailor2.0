import React from 'react';

interface MatchScoreProps {
  score: number;
  summary: string;
}

export const MatchScore: React.FC<MatchScoreProps> = ({ score, summary }) => {
  const getColor = (s: number) => {
    if (s >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (s >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className={`p-8 rounded-2xl border-2 text-center ${getColor(score)}`}>
      <div className="inline-flex flex-col items-center">
        <span className="text-6xl font-heading font-bold mb-2 tracking-tight">{score}%</span>
        <span className="text-xs font-bold uppercase tracking-widest opacity-80 mb-4">Matchningspoäng</span>
      </div>
      <p className="text-neutral-700 leading-relaxed max-w-lg mx-auto text-sm">
        {summary}
      </p>
    </div>
  );
};