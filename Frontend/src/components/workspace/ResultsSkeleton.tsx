import React, { useState, useEffect } from 'react';
import { Check, Loader2 } from 'lucide-react';

export const ResultsSkeleton: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < 2 ? prev + 1 : prev));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Ocean Mist & Sunset Hue Gradient
  const teal = '#0F7C8A';
  const peach = '#FFA07A';
  const gradient = `conic-gradient(from 0deg, ${peach}, ${teal}, ${peach}, ${teal}, ${peach})`;

  const steps = [
    "Läser in CV och analyserar struktur...",
    "Identifierar nyckelord och kompetenser...",
    "Sammanställer och presenterar resultat..."
  ];

  return (
    <div className="relative h-full min-h-[600px] w-full rounded-2xl overflow-hidden bg-white isolate shadow-2xl border border-neutral-100">
      
      {/* Snurrande bakgrund (Ramen) */}
      <div 
        className="absolute -left-[50%] -top-[50%] w-[200%] h-[200%] animate-spin-slow opacity-100"
        style={{ backgroundImage: gradient }}
      />
      
      {/* Blur-effekt för "Glow" */}
      <div 
        className="absolute -left-[50%] -top-[50%] w-[200%] h-[200%] animate-spin-slow blur-xl opacity-50"
        style={{ backgroundImage: gradient }}
      />

      {/* Det vita kortet i mitten */}
      <div className="absolute inset-1 bg-white rounded-2xl z-10 flex flex-col items-center justify-center px-8 py-12">
        <div className="max-w-xl w-full mx-auto text-center space-y-10">
          
          {/* Ikoncirkel */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full flex items-center justify-center bg-neutral-50 shadow-inner border border-neutral-100">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
              <div className="absolute -right-1 -bottom-1 w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary border-2 border-white flex items-center justify-center shadow-lg animate-bounce">
                 <span className="text-white text-xs font-bold">AI</span>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-neutral-900 tracking-tight">
              AI analyserar...
            </h2>
            <p className="text-lg text-neutral-500 max-w-md mx-auto">
              Vi matchar din profil mot <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-bold">drömjobbet</span>.
            </p>
          </div>

          {/* Steg-lista */}
          <div className="space-y-4 pt-4 max-w-md mx-auto w-full">
            {steps.map((text, index) => {
              const isActive = index === activeStep;
              const isCompleted = index < activeStep;

              return (
                <div
                  key={index}
                  className={`
                    flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-500
                    ${isActive ? 'bg-primary/5 border border-primary/20 shadow-sm scale-105' : 'border border-transparent opacity-70'}
                  `}
                >
                  <div className={`
                      flex items-center justify-center w-6 h-6 rounded-full border
                      ${isCompleted ? 'bg-primary border-primary text-white' : isActive ? 'border-primary text-primary' : 'border-neutral-300 text-neutral-300'}
                    `}>
                    {isCompleted ? <Check size={12} strokeWidth={3} /> : isActive ? <div className="w-2 h-2 bg-primary rounded-full animate-pulse" /> : <div className="w-2 h-2 bg-neutral-200 rounded-full" />}
                  </div>
                  
                  <span className={`text-sm font-medium ${isActive ? 'text-neutral-900' : 'text-neutral-500'}`}>
                    {text}
                  </span>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};