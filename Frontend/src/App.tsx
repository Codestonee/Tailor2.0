import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Zap, BarChart3, User, Check, FileText, Menu } from 'lucide-react';
import { InputSection } from './components/InputSection';
import { ResultsView } from './components/ResultsView';
import { ResultsSkeleton } from './components/ResultsSkeleton';
import { ProgressStepper } from './components/ProgressStepper'; // <--- NY IMPORT
import { analyzeApplication } from './lib/api';
import { AnalysisRequest, AnalysisResult, AnalysisStatus } from './types';

export default function App() {
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [requestData, setRequestData] = useState<Partial<AnalysisRequest>>({
    language: 'sv',
    tone: 'professional',
    jobDescription: ''
  });
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleInputChange = (updates: Partial<AnalysisRequest>) => {
    setRequestData(prev => ({ ...prev, ...updates }));
    if (status === 'error') setStatus('idle');
  };

  const handleAnalyze = async () => {
    if (!requestData.cvFile || !requestData.jobDescription) return;
    setStatus('analyzing');
    setError(null);
    try {
      const result = await analyzeApplication(requestData as AnalysisRequest);
      setResult(result);
      setStatus('complete');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ett okänt fel inträffade");
      setStatus('error');
    }
  };

  const isValid = !!(requestData.cvFile && requestData.jobDescription && requestData.jobDescription.length > 20);

  // --- NY LOGIK: Räkna ut vilket steg användaren är på ---
  let currentStep = 1;
  if (requestData.cvFile) currentStep = 2; // Har CV -> Gå till steg 2
  if (requestData.cvFile && requestData.jobDescription) currentStep = 3; // Har båda -> Redo att analysera
  if (result) currentStep = 4; // Har resultat -> Klart
  // -------------------------------------------------------

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 font-sans text-neutral-900 overflow-x-hidden">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-neutral-200/80 shadow-sm transition-all">
        {/* Dekorativ Topp-linje */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary" />

        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          {/* LOGOTYP */}
          <div className="flex items-center gap-4 select-none cursor-pointer group" onClick={() => window.location.reload()}>
            <img 
              src="/logo.png" 
              alt="Tailor Logo" 
              className="h-16 w-16 object-contain transition-transform group-hover:scale-105" 
            />
            <span className="font-heading font-bold text-3xl text-neutral-900 tracking-tight">
              Tailor
            </span>
          </div>

          <div className="flex items-center gap-8">
            <nav className="hidden md:flex gap-8 text-sm font-medium text-neutral-500">
              <a href="#" className="hover:text-primary transition-colors">Funktioner</a>
              <a href="#" className="hover:text-primary transition-colors">Priser</a>
              <a href="#" className="hover:text-primary transition-colors">Om Oss</a>
            </nav>
            <button className="bg-primary text-white px-6 py-3 rounded-brand text-sm font-semibold hover:bg-primary-hover transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
              Logga in
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full pb-24">
        
        {/* HERO SEKTION */}
        <div className="relative bg-neutral-50 overflow-hidden pt-12 pb-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
            
            {/* Vänster: Text */}
            <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 z-10 relative">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#E0F2F4] text-[#333333] text-xs font-bold uppercase tracking-wider border border-[#0F7C8A]/10 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                AI-DRIVEN KARRIÄRCOACH
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-[56px] font-heading font-bold text-[#333333] leading-[1.1] tracking-tight">
                Optimera ditt CV och landa <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">drömjobbet</span> med AI.
              </h1>
              <p className="text-lg text-[#707070] leading-relaxed max-w-lg font-normal">
                Få personlig feedback som lyfter fram dina styrkor. Ladda upp ditt CV och låt vår AI matcha dig mot din nästa roll på sekunder.
              </p>
            </div>

            {/* Höger: Illustration */}
            <div className="lg:w-1/2 relative w-full h-[380px] flex justify-center items-center perspective-1000">
              <div className="absolute w-[450px] h-[450px] bg-gradient-to-tr from-primary/10 via-secondary/10 to-transparent rounded-full blur-3xl animate-pulse-slow pointer-events-none" />

              {/* Dashboard Kort */}
              <div className="absolute top-0 right-4 w-[340px] bg-white rounded-xl shadow-2xl border border-neutral-100 overflow-hidden z-10 transform rotate-[-3deg] translate-x-4 transition-transform hover:rotate-0 duration-700">
                 <div className="h-8 bg-neutral-50 border-b border-neutral-100 flex items-center px-3 gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-300/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-300/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-300/80" />
                 </div>
                 <div className="p-6 space-y-5">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-6 h-6 text-primary" />
                       </div>
                       <div className="space-y-2">
                          <div className="h-3 w-32 bg-neutral-200 rounded-full" />
                          <div className="h-2 w-20 bg-neutral-100 rounded-full" />
                       </div>
                    </div>
                    <div className="h-24 bg-neutral-50 rounded-lg border border-neutral-100 p-4 flex items-end justify-between gap-2">
                       <div className="w-full h-[40%] bg-primary/20 rounded-t-sm" />
                       <div className="w-full h-[60%] bg-primary/30 rounded-t-sm" />
                       <div className="w-full h-[85%] bg-primary rounded-t-sm relative group cursor-pointer">
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">92%</div>
                       </div>
                       <div className="w-full h-[55%] bg-primary/40 rounded-t-sm" />
                    </div>
                 </div>
              </div>

              {/* Maskoten */}
              <img 
                  src="/mascot.png" 
                  alt="Tailor Bot" 
                  className="absolute w-40 h-40 object-contain drop-shadow-lg z-20 -left-2 top-16 animate-bounce-slow"
              />

              {/* Match Kort */}
              <div className="absolute bottom-8 left-8 w-[220px] bg-white rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-neutral-100 p-5 z-30 transform rotate-[2deg] hover:scale-105 transition-transform duration-300">
                 <div className="flex justify-between items-start mb-4">
                    <div>
                       <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Match Score</div>
                       <div className="text-3xl font-heading font-bold text-neutral-900">92%</div>
                    </div>
                 </div>
                 <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden mb-4">
                    <div className="h-full w-[92%] bg-gradient-to-r from-primary to-secondary" />
                 </div>
                 <div className="flex items-center gap-2 text-[10px] text-primary font-medium bg-primary/5 p-2 rounded-lg border border-primary/10">
                    <Check className="w-3 h-3" />
                    <span>Perfekt match</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* WORKSPACE SECTION */}
        <div className="max-w-7xl mx-auto px-6 -mt-6 relative z-20">
          
          {/* --- NYTT: Progress Stepper --- */}
          <div className="mb-10 max-w-3xl mx-auto">
            <ProgressStepper currentStep={currentStep} />
          </div>
          {/* ----------------------------- */}

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* VÄNSTER: INPUT */}
            <div className="lg:col-span-5 space-y-6">
               <div className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 shadow-soft space-y-8 relative overflow-hidden">
                  {/* Gradient Linje */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-secondary" />

                  <div className="space-y-2 mb-6">
                     <h3 className="text-lg font-heading font-bold text-neutral-800">1. Börja här</h3>
                     <p className="text-sm text-neutral-500">Ladda upp ditt CV så sätter vi igång.</p>
                  </div>

                  <InputSection 
                    data={requestData} 
                    onChange={handleInputChange} 
                    disabled={status === 'analyzing'} 
                  />

                  <button
                    onClick={handleAnalyze}
                    disabled={!isValid || status === 'analyzing'}
                    className={`
                      group w-full py-4 px-6 rounded-brand font-heading font-semibold text-lg text-white shadow-lg transition-all duration-300 relative overflow-hidden
                      ${!isValid 
                        ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed shadow-none' 
                        : 'bg-primary hover:bg-primary-hover hover:shadow-hover hover:-translate-y-0.5'
                      }
                    `}
                  >
                    <div className="relative z-10 flex items-center justify-center gap-3">
                      {status === 'analyzing' ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Analyserar...</span>
                        </>
                      ) : (
                        <>
                          <span>Starta Analys</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </button>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-brand text-status-error text-sm text-center font-medium">
                      {error}
                    </div>
                  )}
               </div>
               
               <div className="flex justify-center gap-8 text-neutral-400/80">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> GDPR Säkrad
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                    <Zap className="w-4 h-4 text-secondary" /> AI-Powered
                  </div>
               </div>
            </div>

            {/* HÖGER: RESULTAT / MASKOT */}
            <div className="lg:col-span-7">
              {status === 'analyzing' ? (
                <ResultsSkeleton />
              ) : result ? (
                <ResultsView result={result} />
              ) : (
                <div className="h-full min-h-[600px] bg-white border border-neutral-200 rounded-2xl shadow-card flex flex-col items-center justify-center text-center p-12 relative overflow-hidden group">
                  {/* Gradient Header */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-secondary to-primary" />
                  
                  <div className="absolute inset-0 bg-[radial-gradient(#E6E6E6_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />
                  <div className="relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="relative mx-auto w-72 h-72 mb-6 transition-transform duration-700 group-hover:scale-105">
                        <img 
                            src="/mascot.png" 
                            alt="Tailor Bot" 
                            className="w-full h-full object-contain drop-shadow-2xl"
                        />
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-neutral-900 mb-3">
                      2. Få personlig feedback
                    </h3>
                    <p className="text-neutral-500 max-w-md mx-auto text-lg leading-relaxed">
                      Jag analyserar ditt CV mot jobbannonsen och ger dig konkreta tips och ett färdigt brev.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}