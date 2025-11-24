import React, { useState } from 'react';

// Importera typsnitt här istället för i CSS
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/layout/HeroSection';
import { InputSection } from './components/workspace/InputSection';
import { ResultsSkeleton } from './components/workspace/ResultsSkeleton';
import { ResultsView } from './components/workspace/ResultsView';
import { Button } from './components/common/Button';
import { useAnalysisHook } from './hooks/useAnalysis';
import { AnalysisRequest } from './types';
import { storageService } from './services/storage';

export default function App() {
  const [requestData, setRequestData] = useState<Partial<AnalysisRequest>>({
    language: 'sv',
    tone: 'professional',
    jobDescription: '',
  });

  const { status, result, error, analyze, reset } = useAnalysisHook();

  const handleInputChange = (updates: Partial<AnalysisRequest>) => {
    setRequestData(prev => ({ ...prev, ...updates }));
  };

  const handleAnalyze = async () => {
    if (!requestData.cvFile || !requestData.jobDescription) return;
    try {
      const analysisResult = await analyze(
        requestData.cvFile,
        requestData.jobDescription,
        requestData.language
      );
      storageService.saveAnalysis({
        id: Date.now().toString(),
        timestamp: Date.now(),
        cvName: requestData.cvFile.name,
        jobTitle: requestData.selectedJob?.title || 'Okänt Jobb',
        score: analysisResult.matchScore,
        result: analysisResult,
      });
    } catch (err) {
      console.error('Analysis failed:', err);
    }
  };

  const handleReset = () => {
    reset();
    setRequestData({ language: 'sv', tone: 'professional', jobDescription: '' });
  };

  const isValid = !!(requestData.cvFile && requestData.jobDescription?.length);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 font-sans text-neutral-900 overflow-x-hidden">
      <Header />

      {!result && status !== 'analyzing' && <HeroSection />}

      <main id="workspace-section" className="flex-1 w-full py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="mb-10 flex justify-center">
             <div className="flex items-center gap-4 text-sm font-medium text-neutral-400">
                <span className={`flex items-center gap-2 ${!result ? 'text-primary font-bold' : ''}`}>
                   <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${!result ? 'border-primary bg-primary text-white' : 'border-neutral-300'}`}>1</span> Uppgifter
                </span>
                <div className="w-12 h-px bg-neutral-300" />
                <span className={`flex items-center gap-2 ${result ? 'text-primary font-bold' : ''}`}>
                   <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${result ? 'border-primary bg-primary text-white' : 'border-neutral-300'}`}>2</span> Resultat
                </span>
             </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* VÄNSTER: INPUT */}
            <div className="lg:col-span-5 space-y-6">
               <div className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 shadow-soft space-y-8 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-secondary" />

                  <div className="space-y-2 mb-6">
                     <h3 className="text-lg font-heading font-bold text-neutral-800 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-secondary" />
                        Börja här
                     </h3>
                     <p className="text-sm text-neutral-500">Ladda upp ditt CV för att starta analysen.</p>
                  </div>

                  <InputSection 
                    data={requestData} 
                    onChange={handleInputChange} 
                    disabled={status === 'analyzing'} 
                  />

                  <Button
                    onClick={handleAnalyze}
                    disabled={!isValid || status === 'analyzing'}
                    loading={status === 'analyzing'}
                    className="w-full py-4 text-lg shadow-lg hover:shadow-primary/20"
                  >
                    {status === 'analyzing' ? 'Analyserar...' : 'Starta Analys'}
                    {!status && <ArrowRight className="w-5 h-5 ml-2" />}
                  </Button>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-brand text-red-600 text-sm text-center font-medium animate-in">
                      ⚠️ {error}
                    </div>
                  )}
               </div>
               
               {/* Trust Badges */}
               <div className="flex flex-col gap-3">
                  <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <p className="text-xs text-primary-hover font-medium">
                        <strong>Tips:</strong> Använd PDF för bäst resultat.
                    </p>
                  </div>
                  <div className="p-3 bg-neutral-100 border border-neutral-200 rounded-lg flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-neutral-500" />
                    <p className="text-xs text-neutral-600 font-medium">
                        <strong>Säkert:</strong> Din data sparas aldrig.
                    </p>
                  </div>
               </div>
            </div>

            {/* HÖGER: RESULTAT */}
            <div className="lg:col-span-7 min-h-[600px]">
              {status === 'analyzing' ? (
                <ResultsSkeleton />
              ) : result ? (
                <ResultsView result={result} onReset={handleReset} />
              ) : (
                <div className="h-full bg-white border border-neutral-200 rounded-2xl shadow-card flex flex-col items-center justify-center text-center p-12 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-secondary to-primary" />
                  <div className="absolute inset-0 bg-[radial-gradient(#E6E6E6_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />
                  <div className="relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="relative mx-auto w-72 h-72 mb-6 transition-transform duration-700 group-hover:scale-105">
                        <img src="/mascot.png" alt="Tailor Bot" className="w-full h-full object-contain drop-shadow-2xl" />
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-neutral-900 mb-3">
                      Redo att analysera?
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

      <Footer />
    </div>
  );
}