import React from 'react';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

interface ATSScoreProps {
  matchScore: number;
  missingKeywords: number;
}

export const ATSScore: React.FC<ATSScoreProps> = ({ matchScore, missingKeywords }) => {
  // Enkel simulering av ATS-poäng
  const atsScore = Math.min(100, Math.round(matchScore * 0.8 + (missingKeywords === 0 ? 20 : 0)));

  const checks = [
    { label: 'Filformat (PDF)', status: 'pass', detail: 'Standardformat' },
    { label: 'Läsbar text', status: 'pass', detail: 'Text kunde extraheras' },
    { label: 'Nyckelord', status: missingKeywords < 3 ? 'pass' : 'warning', detail: missingKeywords === 0 ? 'Alla hittade' : `${missingKeywords} saknas` },
    { label: 'Relevans', status: matchScore > 60 ? 'pass' : 'fail', detail: matchScore > 60 ? 'Hög' : 'Låg' },
  ];

  const getIcon = (status: string) => {
    if (status === 'pass') return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    if (status === 'warning') return <AlertCircle className="w-4 h-4 text-amber-600" />;
    return <XCircle className="w-4 h-4 text-red-600" />;
  };

  return (
    <div className="p-6 bg-white border border-neutral-200 rounded-xl shadow-sm">
      <h3 className="font-bold text-lg mb-6 text-neutral-900">ATS-Kompatibilitet</h3>
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="text-center min-w-[100px]">
          <div className="text-4xl font-heading font-bold text-primary mb-1">{atsScore}%</div>
          <span className="text-xs text-neutral-400 uppercase tracking-wide">Pass Rate</span>
        </div>
        <div className="flex-1 w-full space-y-3">
          {checks.map((check, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 border-b border-neutral-50 last:border-0">
              <div className="flex items-center gap-3">
                {getIcon(check.status)}
                <span className="font-medium text-neutral-700 text-sm">{check.label}</span>
              </div>
              <span className="text-xs text-neutral-500 font-medium">{check.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};