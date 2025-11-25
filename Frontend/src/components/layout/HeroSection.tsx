import React from 'react';
import { ArrowRight, Sparkles, FileText, CheckCircle2, BrainCircuit, PenTool } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const scrollToWorkspace = () => {
    document.getElementById('workspace-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    // HÖJD: 65vh ger lagom luft.
    <section className="relative py-12 lg:py-0 lg:h-[65vh] min-h-[500px] flex items-center overflow-hidden font-sans bg-neutral-50">
      
      {/* Bakgrunds-Glow */}
      <div className="absolute top-0 inset-x-0 h-full bg-gradient-to-b from-white/90 to-transparent z-0 pointer-events-none" />
      <div className="absolute top-10 right-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center w-full relative z-10 h-full">
        
        {/* VÄNSTER: Textinnehåll */}
        <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left z-20 pt-10">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-white shadow-sm border border-primary/10 text-primary text-xs font-bold uppercase tracking-wider cursor-default animate-in">
            <Sparkles size={12} className="text-secondary" /> 
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">AI Karriärcoach</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-extrabold text-neutral-900 leading-[1] tracking-tight mb-6 drop-shadow-sm animate-in" style={{ animationDelay: '0.1s' }}>
            Optimera ditt CV & <br className="hidden lg:block" />
            landa <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">drömjobbet</span>.
          </h1>

          <p className="text-lg md:text-xl text-neutral-600 leading-relaxed max-w-md font-medium animate-in" style={{ animationDelay: '0.2s' }}>
            Ladda upp ditt CV, klistra in en annons och låt vår AI matcha dig mot din nästa roll på sekunder.
          </p>

          {/* (Knappar och annat borttaget enligt önskemål för kompaktare höjd) */}
        </div>

        {/* HÖGER: Grafik (Fixad positionering) */}
        <div className="lg:w-1/2 w-full h-[400px] lg:h-full relative flex justify-center items-center animate-in" style={{ animationDelay: '0.3s' }}>
          
          {/* MASKOT (Mitten - Längst bak z-10) */}
          <img 
              src="/mascot-transparent.png"  
              alt="Tailor AI" 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[250px] lg:w-[320px] object-contain drop-shadow-2xl animate-float"
          />

          {/* --- KORTEN --- */}
          {/* Vi använder margin (ml/mt) för att flytta dem från mitten (left-1/2 top-1/2). 
              Detta krockar INTE med animationen. */}

          {/* 1. Input (Uppe Vänster) */}
          <div className="absolute left-1/2 top-1/2 -ml-[240px] -mt-[160px] z-20 animate-float-slow bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white ring-1 ring-neutral-100 flex items-center gap-3 max-w-[160px]">
              <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-500">
                  <FileText size={20} />
              </div>
              <div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase">Input</p>
                  <p className="text-xs font-bold text-neutral-800">Ditt CV</p>
              </div>
          </div>

           {/* 2. Skills (Uppe Höger) */}
           <div className="absolute left-1/2 top-1/2 ml-[60px] -mt-[180px] z-0 animate-float-slower-reverse bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-primary/10 ring-1 ring-primary/5 flex items-center gap-3 max-w-[170px]">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  <BrainCircuit size={20} />
              </div>
              <div>
                  <p className="text-[10px] font-bold text-primary uppercase">Analys</p>
                  <p className="text-xs font-bold text-neutral-800">Hittar Skills</p>
              </div>
          </div>

          {/* 3. Matchning (Nere Höger) */}
          <div className="absolute left-1/2 top-1/2 ml-[80px] mt-[40px] z-30 animate-float bg-white p-3 rounded-xl shadow-xl border border-green-100 ring-1 ring-green-50 flex flex-col gap-2 w-[150px]">
              <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      <CheckCircle2 size={16} />
                  </div>
                  <div>
                      <p className="text-xs font-bold text-neutral-800">92% Match</p>
                      <p className="text-[10px] text-green-600 font-medium">Redo!</p>
                  </div>
              </div>
              <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full w-[92%] bg-green-500 rounded-full" />
              </div>
          </div>

          {/* 4. Brev (Nere Vänster) */}
          <div className="absolute left-1/2 top-1/2 -ml-[220px] mt-[50px] z-20 animate-float-slow bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-secondary/10 ring-1 ring-secondary/5 flex items-center gap-3 max-w-[170px]">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary">
                  <PenTool size={20} />
              </div>
              <div>
                  <p className="text-[10px] font-bold text-secondary uppercase">Output</p>
                  <p className="text-xs font-bold text-neutral-800">Skapar Brev</p>
              </div>
          </div>

        </div>
      </div>
    </section>
  );
};