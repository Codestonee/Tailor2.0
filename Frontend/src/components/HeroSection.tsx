import React from 'react';
import { ArrowRight, FileText, Sparkles, CheckCircle2 } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const scrollToWorkspace = () => {
    document.getElementById('workspace-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative bg-neutral-50 overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-white to-neutral-50 pointer-events-none"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none opacity-60 animate-pulse-slow"></div>
      <div className="absolute top-1/2 -left-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none opacity-60 animate-pulse-slow delay-700"></div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative z-10">
        
        {/* Vänster: Textinnehåll */}
        <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 animate-in slide-in-from-bottom-10 duration-700">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary-dark text-xs font-bold uppercase tracking-wider border border-primary/20 shadow-sm transition-transform hover:scale-105 cursor-default">
            <Sparkles size={14} className="text-primary" /> AI-Driven Karriärcoach
          </div>

          {/* Huvudrubrik */}
          <h1 className="text-5xl md:text-6xl lg:text-[72px] font-heading font-bold text-neutral-900 leading-[1.1] tracking-tight">
            Optimera ditt CV och landa <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-secondary animate-gradient-x">drömjobbet</span>.
          </h1>

          {/* Underrubrik */}
          <p className="text-xl text-neutral-600 leading-relaxed max-w-lg font-normal">
            Få personlig AI-feedback som lyfter fram dina styrkor. Matcha ditt CV mot din nästa roll på sekunder, inte timmar.
          </p>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
            <button 
              onClick={scrollToWorkspace}
              className="group relative flex items-center justify-center gap-3 bg-primary text-white px-8 py-4 rounded-brand text-lg font-semibold shadow-lg hover:bg-primary-hover transition-all hover:shadow-primary/30 hover:-translate-y-1 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Testa Nu - Det är Gratis <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              {/* Shine effekt vid hover */}
              <div className="absolute inset-0 h-full w-full scale-0 rounded-brand transition-all duration-300 group-hover:scale-100 group-hover:bg-white/10"></div>
            </button>
            <a href="#how-it-works" className="flex items-center justify-center gap-2 px-8 py-4 rounded-brand text-lg font-semibold text-neutral-700 border-2 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-100 transition-all">
              Se hur det funkar
            </a>
          </div>

          {/* Social Proof / Trust */}
          <div className="pt-6 flex items-center gap-4 text-sm text-neutral-500 font-medium">
             <div className="flex -space-x-3">
                 <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-300"></div>
                 <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-400"></div>
                 <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs text-gray-600">+2k</div>
             </div>
             <p>Används redan av tusentals arbetssökande.</p>
          </div>
        </div>

        {/* Höger: Renare Visuell Illustration */}
        <div className="lg:w-1/2 w-full relative h-[500px] flex justify-center items-center animate-in fade-in duration-1000 delay-300">
          
          {/* Central Mjuk Glöd */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-tr from-primary/30 to-secondary/30 rounded-full blur-[80px] -z-10"></div>

          {/* 1. Input-kortet (Flyter till vänster) */}
          <div className="absolute left-0 top-1/4 bg-white p-4 rounded-2xl shadow-soft border border-neutral-100 flex items-center gap-3 animate-float z-20">
              <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-500">
                  <FileText size={20} />
              </div>
              <div>
                  <p className="text-xs font-bold text-neutral-700">Ditt Nuvarande CV</p>
                  <div className="h-1.5 w-16 bg-neutral-200 rounded-full mt-1"></div>
              </div>
          </div>

          {/* 2. Maskoten (Centrum för processen) */}
          <img 
              src="/mascot.png" 
              alt="Tailor AI Assistant" 
              className="relative z-30 w-64 h-64 object-contain drop-shadow-2xl animate-bounce-slow"
          />

          {/* 3. Resultat-kortet (Flyter till höger) */}
          <div className="absolute right-0 bottom-1/4 bg-white p-5 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-green-100 flex flex-col gap-3 animate-float-delayed z-20">
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      <CheckCircle2 size={20} />
                  </div>
                  <div>
                      <p className="text-sm font-bold text-neutral-800">Matchning: 92%</p>
                      <p className="text-xs text-green-600 font-medium">Redo för ansökan</p>
                  </div>
              </div>
              <div className="space-y-1.5 py-1">
                  <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden"><div className="h-full w-[92%] bg-green-500 rounded-full"></div></div>
              </div>
          </div>

          {/* Anslutande linjer (SVG för mjukhet) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" xmlns="http://www.w3.org/2000/svg">
              {/* Linje från Input till Maskot */}
              <path d="M 80,160 C 150,160 180,220 220,250" stroke="url(#grad1)" strokeWidth="2" fill="none" strokeDasharray="4 4" className="animate-dash" />
              {/* Linje från Maskot till Output */}
              <path d="M 350,250 C 400,280 420,350 480,350" stroke="url(#grad2)" strokeWidth="2" fill="none" strokeDasharray="4 4" className="animate-dash delay-500" />
              
              <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
                  </linearGradient>
              </defs>
          </svg>

        </div>
      </div>
    </section>
  );
};