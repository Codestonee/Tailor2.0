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

  const teal = '#0F7C8A';
  const peach = '#FFA07A';
  // Starkare färger i gradienten för tydligare "kors"
  const gradient = `conic-gradient(from 0deg, ${peach}, ${teal}, ${peach}, ${teal}, ${peach})`;

  const steps = [
    "Läser in CV och analyserar struktur...",
    "Identifierar nyckelord och kompetenser...",
    "Sammanställer och presenterar resultat..."
  ];

  return (
    // HUVUDCONTAINER: "relative" och "overflow-hidden" är nyckeln här.
    // Det tvingar glowet att stanna INNANFÖR de rundade hörnen.
    <div className="relative h-full min-h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl bg-white isolate">
      
      {/* --- 1. DEN SNURRANDE BAKGRUNDEN (Glow + Ram) --- */}
      {/* Vi gör den 150% stor och centrerar den med -left/top för att täcka hela ytan när den snurrar */}
      <div 
        className="absolute -left-[25%] -top-[25%] w-[150%] h-[150%] animate-spin-slow opacity-100"
        style={{ backgroundImage: gradient }}
      />
      
      {/* Extra Blur-lager för "Neon-effekten" */}
      <div 
        className="absolute -left-[25%] -top-[25%] w-[150%] h-[150%] animate-spin-slow blur-xl opacity-60"
        style={{ backgroundImage: gradient }}
      />

      {/* --- 2. DET VITA KORTET (Innehåll) --- */}
      {/* inset-1 skapar en 4px marginal runt om, där den snurrande bakgrunden syns igenom */}
      <div className="absolute inset-1 bg-white rounded-xl z-10 flex flex-col items-center justify-center p-12">
        
        {/* Subtilt mönster inuti det vita */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />
        
        <div className="relative z-20 flex flex-col items-center text-center space-y-12 max-w-md w-full">
          
          {/* --- LOADER (Radar) --- */}
          <div className="relative w-24 h-24 flex items-center justify-center">
             {/* Yttre ring */}
             <div className="absolute inset-0 border-4 border-neutral-100 rounded-full" />
             {/* Snurrande del */}
             <div className="absolute inset-0 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
             {/* Inre puls */}
             <div className="w-12 h-12 bg-primary/10 rounded-full animate-pulse" />
          </div>

          {/* --- TEXT MED FUNGERANDE ANIMATION --- */}
          <div className="space-y-4">
            <h3 className="text-3xl font-heading font-bold text-neutral-900">
              AI Analyserar...
            </h3>
            <p className="text-neutral-500 text-lg leading-relaxed">
              Vi matchar din profil mot 
              <span className="font-bold ml-1.5 inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary animate-gradient-x bg-[length:200%_auto]">
                drömjobbet
              </span>.
            </p>
          </div>

          {/* --- STEG-LISTA --- */}
          <div className="w-full space-y-6 pt-4 pl-8 text-left">
            {steps.map((text, index) => {
              const isActive = index === activeStep;
              const isCompleted = index < activeStep;

              return (
                <div 
                  key={index} 
                  className={`flex items-center gap-4 text-sm font-medium transition-all duration-500 ${isActive || isCompleted ? 'opacity-100' : 'opacity-40'}`}
                >
                  {isCompleted ? (
                    // KLAR: Ifylld cirkel
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-sm scale-110 transition-transform">
                      <Check size={14} className="text-white" strokeWidth={3} />
                    </div>
                  ) : isActive ? (
                    // AKTIV: Snurrande loader
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  ) : (
                    // VÄNTAR: Tom ring
                    <div className="w-6 h-6 rounded-full border-2 border-neutral-200" />
                  )}
                  
                  <span className={isActive ? 'text-neutral-900 font-bold scale-105 transition-transform origin-left' : 'text-neutral-500'}>
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