import React from 'react';
import { Lightbulb, Target, FileText } from 'lucide-react';
import { Improvement } from '../../types';

interface ImprovementsProps {
  improvements: Improvement[];
}

export const Improvements: React.FC<ImprovementsProps> = ({ improvements }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'missing_skill':
        return <Target className="w-5 h-5 text-secondary" />; // Orange
      case 'formatting':
        return <FileText className="w-5 h-5 text-primary" />; // Teal (istället för blå)
      case 'phrasing':
        return <Lightbulb className="w-5 h-5 text-primary" />; // Teal (istället för lila)
      default:
        return <Lightbulb className="w-5 h-5 text-neutral-600" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6 pt-4 border-t border-neutral-100">
        <Lightbulb className="w-6 h-6 text-secondary" />
        <h3 className="text-xl font-bold text-neutral-900">Rekommendationer</h3>
      </div>

      {improvements.length > 0 ? (
        <div className="space-y-3">
          {improvements.map((imp, idx) => (
            <div
              key={idx}
              className="p-4 bg-white border border-neutral-200 rounded-xl hover:border-primary/30 hover:shadow-md transition-all group"
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getIcon(imp.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-neutral-900 text-sm mb-1">{imp.description}</p>
                  <p className="text-sm text-neutral-600 leading-relaxed">{imp.suggestion}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 bg-primary/5 border border-primary/10 rounded-lg text-center">
          <p className="text-primary font-medium text-sm">✓ Inga förbättringsförslag just nu!</p>
        </div>
      )}
    </div>
  );
};