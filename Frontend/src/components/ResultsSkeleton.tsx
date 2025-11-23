// ResultsSkeleton.tsx
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
    <div className="relative h-full min-h-[600px] w-full rounded-2xl overflow-hidden bg-white isolate shadow-[0_0_45px_rgba(15,124,138,0.45),0_0_90px_rgba(255,160,122,0.35)]">
      
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
      <div className="relative z-10 h-full w-full flex flex-col items-center justify-center px-8 py-12 bg-gradient-to-br from-white/80 via-white/95 to-white/80 backdrop-blur-[2px]">
        <div className="max-w-xl w-full mx-auto text-center space-y-10">
          
          {/* Ikoncirkel */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Yttre ring med gradient border */}
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center bg-white shadow-[0_10px_40px_rgba(0,0,0,0.15)]"
                style={{
                  border: `2.5px solid rgba(15,124,138,0.12)`,
                  boxShadow: `
                    0 0 0 1px rgba(255,255,255,0.9),
                    0 18px 30px rgba(0,0,0,0.08)
                  `,
                }}
              >
                {/* Inre cirkel */}
                <div 
                  className="w-18 h-18 rounded-full flex items-center justify-center bg-white"
                  style={{
                    background: 'radial-gradient(circle at 30% 20%, rgba(15,124,138,0.08), transparent 55%), radial-gradient(circle at 70% 80%, rgba(255,160,122,0.15), transparent 55%)'
                  }}
                >
                  {/* Minimal stjärnikon */}
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    className="w-9 h-9 text-primary"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 3.5l1.2 3.1c.2.5.7.8 1.2.9l3.2.3-2.5 2c-.4.3-.6.9-.5 1.4l.8 3.1-2.8-1.7a1.4 1.4 0 0 0-1.4 0l-2.8 1.7.8-3.1c.1-.5-.1-1.1-.5-1.4l-2.5-2 3.2-.3c.5 0 1-.4 1.2-.9L12 3.5z" />
                    <circle cx="18.5" cy="5" r="1.1" />
                    <circle cx="6" cy="7" r="0.9" />
                    <circle cx="8.5" cy="17.5" r="1" />
                  </svg>
                </div>

                {/* Liten “plusprick” indikator */}
                <div className="absolute -right-1 -bottom-1 w-6 h-6 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 border-2 border-white flex items-center justify-center shadow-md">
                  <span className="text-white text-xs font-semibold"></span>
                </div>
              </div>
            </div>
          </div>

          {/* Titel & undertitel */}
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-neutral-900 tracking-tight">
              AI analyserar...
            </h2>
            <p className="text-base md:text-lg text-neutral-500 max-w-md mx-auto leading-relaxed">
              Vi matchar din profil mot <span className="text-primary font-semibold">drömjobbet</span>.
            </p>
          </div>

          {/* Progressbar linje */}
          <div className="w-full max-w-md mx-auto">
            <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-700 ease-out"
                style={{
                  width: `${((activeStep + 1) / 3) * 100}%`,
                }}
              />
            </div>
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-neutral-400 font-medium">
              MATCHNING PÅGÅR
            </p>
          </div>

          {/* STEG-LISTA */}
          <div className="space-y-4 pt-4">
            {steps.map((text, index) => {
              const isActive = index === activeStep;
              const isCompleted = index < activeStep;

              return (
                <div
                  key={index}
                  className={`
                    flex items-center gap-3 rounded-xl px-4 py-3 text-left
                    border transition-all duration-500
                    ${isActive ? 'bg-primary-light/40 border-primary/30 shadow-sm' : 'bg-white/80 border-neutral-100'}
                  `}
                >
                  <div
                    className={`
                      flex items-center justify-center w-7 h-7 rounded-full
                      border 
                      ${isCompleted ? 'bg-primary border-primary text-white shadow-sm' : isActive ? 'border-primary/50 text-primary' : 'border-neutral-200 text-neutral-300'}
                    `}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : isActive ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-200" />
                    )}
                  </div>
                  
                  <span className={isActive ? 'text-neutral-900 font-medium transform scale-105 transition-transform origin-left' : 'text-neutral-500'}>
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
