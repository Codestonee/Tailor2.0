import React, { useEffect, useState } from 'react';
import { Loader2, Check } from 'lucide-react';

interface AnalysisProgressProps {
  isAnalyzing: boolean;
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ isAnalyzing }) => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!isAnalyzing) return;

    const interval = setInterval(() => {
      setActiveStep(prev => (prev < 2 ? prev + 1 : prev));
    }, 1500);

    return () => clearInterval(interval);
  }, [isAnalyzing]);

  if (!isAnalyzing) return null;

  const steps = [
    { label: 'Läser in och analyserar PDF...', icon: '📄' },
    { label: 'Matchar kompetens och erfarenhet...', icon: '🔍' },
    { label: 'Sammanställer rekommendationer...', icon: '✨' },
  ];

  return (
    <div className="space-y-6 p-8 bg-white rounded-2xl border border-neutral-100 shadow-lg">
      <h3 className="font-heading font-bold text-xl text-center text-neutral-800">Analys pågår</h3>

      <div className="space-y-4">
        {steps.map((step, idx) => {
          const isActive = idx === activeStep;
          const isComplete = idx < activeStep;

          return (
            <div key={idx} className="flex items-center gap-4 p-2 rounded-lg transition-colors">
              <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border ${
                  isComplete ? 'bg-primary border-primary text-white' : 
                  isActive ? 'border-primary text-primary' : 'border-neutral-200 bg-neutral-50'
              }`}>
                {isComplete ? (
                  <Check className="w-4 h-4" />
                ) : isActive ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-neutral-300" />
                )}
              </div>
              <span className={`text-sm font-medium ${isActive ? 'text-neutral-900' : 'text-neutral-500'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden mt-2">
        <div
          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out"
          style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );
};