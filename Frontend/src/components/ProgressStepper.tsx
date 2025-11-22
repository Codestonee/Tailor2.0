import React from 'react';
import { Check } from 'lucide-react';

interface ProgressStepperProps {
  currentStep: number; // 1, 2, 3 eller 4
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({ currentStep }) => {
  
  const steps = [
    { id: 1, label: "Ladda upp CV" },
    { id: 2, label: "Välj Jobb" },
    { id: 3, label: "Analysera" },
    { id: 4, label: "Resultat" }
  ];

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between relative">
        
        {/* Bakgrundslinje (Grå) */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-neutral-200 rounded-full -z-10" />
        
        {/* Aktiv Linje (Teal - Animerad bredd) */}
        <div 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-primary rounded-full -z-10 transition-all duration-500 ease-in-out"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {/* Steg-cirklar */}
        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <div key={step.id} className="flex flex-col items-center group">
              <div 
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10
                  ${isCompleted 
                    ? 'bg-primary border-primary text-white scale-110' 
                    : isActive 
                      ? 'bg-white border-primary text-primary scale-125 shadow-md' 
                      : 'bg-neutral-50 border-neutral-300 text-neutral-400'
                  }
                `}
              >
                {isCompleted ? (
                  <Check size={14} strokeWidth={3} />
                ) : (
                  <span className="text-xs font-bold">{step.id}</span>
                )}
              </div>
              
              {/* Etikett under cirkeln */}
              <span 
                className={`
                  absolute top-10 text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 w-24 text-center
                  ${isActive || isCompleted ? 'text-primary' : 'text-neutral-400'}
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};