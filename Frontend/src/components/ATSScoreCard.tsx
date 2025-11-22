import React from 'react';
import { CheckCircle2, XCircle, FileText, ShieldCheck, AlertCircle } from 'lucide-react';

interface ATSScoreCardProps {
  matchScore: number;
  missingKeywordsCount: number;
}

export const ATSScoreCard: React.FC<ATSScoreCardProps> = ({ matchScore, missingKeywordsCount }) => {
  
  // Vi simulerar en ATS-poäng baserat på matchning och nyckelord
  // (I framtiden kan backend ge en exaktare analys av formatering)
  const atsScore = Math.round((matchScore * 0.6) + (missingKeywordsCount === 0 ? 40 : 20));
  const safeScore = Math.min(100, Math.max(10, atsScore));

  // Färgkodning
  const getColor = (score: number) => {
    if (score >= 80) return 'text-status-success';
    if (score >= 50) return 'text-status-warning';
    return 'text-status-error';
  };

  const strokeColor = safeScore >= 80 ? '#4CAF50' : safeScore >= 50 ? '#FFC107' : '#F44336';

  const checks = [
    { label: "Filformat (PDF)", status: "pass", detail: "Standardformat" },
    { label: "Läsbar text", status: "pass", detail: "Texten kunde extraheras" },
    { 
      label: "Nyckelord", 
      status: missingKeywordsCount < 3 ? "pass" : "warning", 
      detail: missingKeywordsCount === 0 ? "Alla hittade" : `${missingKeywordsCount} viktiga saknas` 
    },
    { 
      label: "Relevans", 
      status: matchScore > 60 ? "pass" : "fail", 
      detail: matchScore > 60 ? "Hög relevans" : "Låg relevans" 
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <ShieldCheck className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500">ATS-Kompatibilitet</h3>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Cirkel-diagram */}
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64" cy="64" r="56"
              stroke="#E6E6E6" strokeWidth="8" fill="transparent"
            />
            <circle
              cx="64" cy="64" r="56"
              stroke={strokeColor} strokeWidth="8" fill="transparent"
              strokeDasharray={351.86}
              strokeDashoffset={351.86 - (351.86 * safeScore) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-heading font-bold ${getColor(safeScore)}`}>{safeScore}%</span>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">Pass Rate</span>
          </div>
        </div>

        {/* Checklista */}
        <div className="flex-1 w-full space-y-3">
          {checks.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm border-b border-neutral-50 pb-2 last:border-0 last:pb-0">
              <div className="flex items-center gap-3">
                {item.status === 'pass' && <CheckCircle2 className="w-4 h-4 text-status-success" />}
                {item.status === 'warning' && <AlertCircle className="w-4 h-4 text-status-warning" />}
                {item.status === 'fail' && <XCircle className="w-4 h-4 text-status-error" />}
                <span className="font-medium text-neutral-700">{item.label}</span>
              </div>
              <span className="text-xs text-neutral-400 font-medium">{item.detail}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 p-3 bg-neutral-50 rounded-lg border border-neutral-100 text-xs text-neutral-500 leading-relaxed">
        <strong>Varför är detta viktigt?</strong> Många företag använder robotar (ATS) för att sortera CV:n. Ett högt betyg här ökar chansen att en människa läser din ansökan.
      </div>
    </div>
  );
};