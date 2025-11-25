import React from 'react';
import { ScoreBreakdown } from '../../types';

interface ScoreBreakdownProps {
  breakdown: ScoreBreakdown;
}

export const ScoreBreakdownChart: React.FC<ScoreBreakdownProps> = ({ breakdown }) => {
  const metrics = [
    { label: 'Technical Skills', value: breakdown.technical },
    { label: 'Experience', value: breakdown.experience },
    { label: 'Soft Skills', value: breakdown.softSkills },
  ];

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl border border-neutral-200">
      <h3 className="font-bold text-lg text-neutral-900">Score Breakdown</h3>

      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-neutral-700 uppercase tracking-wide">
                {metric.label}
              </span>
              <span className="text-sm font-bold text-primary">{metric.value}%</span>
            </div>
            <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${metric.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-neutral-100">
        <p className="text-xs text-neutral-500">
          Overall score combines all factors to give you a comprehensive match rating.
        </p>
      </div>
    </div>
  );
};