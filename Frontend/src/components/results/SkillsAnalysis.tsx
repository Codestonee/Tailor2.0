import React from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

interface SkillsAnalysisProps {
  matchedSkills: string[];
  missingSkills: string[];
}

export const SkillsAnalysis: React.FC<SkillsAnalysisProps> = ({
  matchedSkills,
  missingSkills,
}) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Matched Skills */}
      <div className="p-6 bg-green-50/50 rounded-xl border border-green-100">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <h4 className="font-bold text-green-900 text-sm uppercase tracking-wide">Matchade Kompetenser</h4>
        </div>

        {matchedSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {matchedSkills.map(skill => (
              <span
                key={skill}
                className="px-3 py-1 bg-white border border-green-200 rounded-md text-xs font-semibold text-green-700 shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-green-700 text-xs italic">Inga specifika kompetenser matchade.</p>
        )}
      </div>

      {/* Missing Skills */}
      <div className="p-6 bg-red-50/50 rounded-xl border border-red-100">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h4 className="font-bold text-red-900 text-sm uppercase tracking-wide">Saknas i ditt CV</h4>
        </div>

        {missingSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {missingSkills.map(skill => (
              <span
                key={skill}
                className="px-3 py-1 bg-white border border-red-200 rounded-md text-xs font-semibold text-red-700 shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-green-700 text-xs font-medium">✓ Snyggt! Inga viktiga kompetenser saknas.</p>
        )}
      </div>
    </div>
  );
};