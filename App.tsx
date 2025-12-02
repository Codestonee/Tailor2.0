import React, { useState, useRef, useEffect, Suspense } from 'react';
import { AppStage, UserState, Job, AppView } from './types';
import Hero from './components/Hero';
import FileUpload from './components/FileUpload';
import JobSelector from './components/JobSelector';
import AppHeader from './components/AppHeader';
import Mascot from './components/Mascot';
import ErrorBoundary from './components/ErrorBoundary';
import { analyzeApplication } from './services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';
import { handleAPIError } from './src/utils/errorhandling';
import { useLocalStorage } from './src/hooks/useLocalStorage';
import { useAnalytics } from './src/hooks/useAnalytics';

const AnalysisDashboard = React.lazy(() => import('./components/AnalysisDashboard'));
const SalaryCalculator = React.lazy(() => import('./components/SalaryCalculator'));
const About = React.lazy(() => import('./components/About'));
const InterviewPrep = React.lazy(() => import('./components/InterviewPrep'));
const RoastMyCV = React.lazy(() => import('./components/RoastMyCV'));
const CareerGames = React.lazy(() => import('./components/CareerGames'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-16 h-16 border-4 border-ocean border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const LoadingText = () => {
  const [textIndex, setTextIndex] = useState(0);
  const texts = [
    "Läser igenom ditt CV...",
    "Analyserar jobbannonsen...",
    "Identifierar nyckelord...",
    "Matchar kompetenser...",
    "Slutställer rapport..."
  ];

  useEffect(() => {
    const interval = setInterval(() => setTextIndex((prev) => (prev + 1) % texts.length), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-12 overflow-hidden relative flex items-center justify-center">
      <AnimatePresence mode='wait'>
        <motion.h2 
          key={textIndex}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className="text-2xl md:text-3xl font-bold font-display text-gray-900 dark:text-white"
        >
          {texts[textIndex]}
        </motion.h2>
      </AnimatePresence>
    </div>
  );
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useLocalStorage<AppView>('tailor_view', AppView.HOME);
  const [stage, setStage] = useLocalStorage<AppStage>('tailor_stage', AppStage.LANDING);
  const [state, setState] = useLocalStorage<UserState>('tailor_state', {
    cvText: '',
    cvFileName: '',
    selectedJob: null,
    analysis: null,
    generatedCoverLetter: null
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { trackEvent } = useAnalytics();
  const uploadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
      html.classList.remove('light');
    } else {
      html.classList.remove('dark');
      html.classList.add('light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    trackEvent('toggle_theme');
  };

  const handleNavigate = (view: AppView) => {
    setCurrentView(view);
    trackEvent('navigate', { view });
  };

  const handleFileLoaded = (text: string, fileName: string) => {
    setState(prev => ({ ...prev, cvText: text, cvFileName: fileName }));
    setStage(AppStage.JOB_SELECT);
    trackEvent('file_upload');
  };

  const handleJobSelected = async (job: Job) => {
    setState(prev => ({ ...prev, selectedJob: job }));
    setStage(AppStage.ANALYZING);
    setIsAnalyzing(true);
    trackEvent('analyze_start');

    try {
      await new Promise(r => setTimeout(r, 1500)); 
      
      const analysis = await analyzeApplication(state.cvText, job.description);
      
      // Check if analysis is valid
      if (!analysis || typeof analysis.matchScore !== 'number') {
        throw new Error("Ojdå, AI:n kunde inte analysera detta jobb. Försök igen.");
      }

      setState(prev => ({ ...prev, analysis }));
      setStage(AppStage.RESULTS);
      trackEvent('analyze_success');
    } catch (e: any) {
      console.error("Analysis failed:", e);
      alert(e.message || "Ett fel uppstod vid analysen."); 
      setStage(AppStage.JOB_SELECT); // Gå tillbaka så man kan försöka igen
      trackEvent('analyze_error', { error: e.message });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    if(window.confirm("Är du säker? Detta rensar all din data.")) {
      setCurrentView(AppView.HOME);
      setStage(AppStage.LANDING);
      setState({
        cvText: '',
        cvFileName: '',
        selectedJob: null,
        analysis: null,
        generatedCoverLetter: null
      });
      localStorage.removeItem('tailor_state');
      trackEvent('reset_app');
    }
  };

  return (
    <ErrorBoundary>
      <div className={`min-h-screen font-sans selection:bg-coral/30 selection:text-ocean dark:text-gray-100 transition-colors duration-300`}>
        <AppHeader 
          onReset={handleReset} 
          onNavigate={handleNavigate}
          currentView={currentView}
          stage={stage} 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme} 
        />

        <main className="container mx-auto px-4 md:px-6 relative z-10">
          <AnimatePresence mode="wait">
            
            {currentView === AppView.HOME && (
              <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {stage === AppStage.LANDING && (
                  <div className="relative">
                    <Hero />
                    <div id="upload-section" ref={uploadRef} className="pb-24 pt-12 relative z-10">
                      <FileUpload onFileLoaded={handleFileLoaded} />
                    </div>
                  </div>
                )}

                {stage !== AppStage.LANDING && (
                  <div className="py-12">
                    {stage === AppStage.JOB_SELECT && (
                      <motion.div key="job" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        <JobSelector cvText={state.cvText} onJobSelected={handleJobSelected} />
                      </motion.div>
                    )}

                    {stage === AppStage.ANALYZING && (
                      <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center min-h-[60vh] text-center relative">
                        <div className="relative w-72 h-72 mb-10 flex items-center justify-center">
                           <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border-t-2 border-b-2 border-ocean/30 dark:border-coral/30" />
                           <div className="w-44 h-44 relative z-10"><Mascot emotion="analyzing" className="w-full h-full" /></div>
                        </div>
                        <LoadingText />
                        <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-6 overflow-hidden relative">
                          <motion.div initial={{ width: '5%' }} animate={{ width: '90%' }} transition={{ duration: 10 }} className="absolute top-0 left-0 h-full bg-gradient-to-r from-ocean to-coral" />
                        </div>
                      </motion.div>
                    )}

                    {stage === AppStage.RESULTS && state.analysis && state.selectedJob && (
                      <Suspense fallback={<LoadingFallback />}>
                        <motion.div key="results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                          <AnalysisDashboard analysis={state.analysis} job={state.selectedJob} cvText={state.cvText} />
                        </motion.div>
                      </Suspense>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* Övriga vyer (Salary, Interview, etc.) */}
            {currentView === AppView.SALARY && (
              <Suspense fallback={<LoadingFallback />}>
                <motion.div key="salary" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                  <SalaryCalculator />
                </motion.div>
              </Suspense>
            )}

            {currentView === AppView.INTERVIEW && (
              <Suspense fallback={<LoadingFallback />}>
                <motion.div key="interview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="py-12">
                  <InterviewPrep />
                </motion.div>
              </Suspense>
            )}

            {currentView === AppView.BINGO && (
              <Suspense fallback={<LoadingFallback />}>
                <motion.div key="games" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                  <CareerGames cvText={state.cvText} />
                </motion.div>
              </Suspense>
            )}

            {currentView === AppView.ROAST && (
              <Suspense fallback={<LoadingFallback />}>
                <motion.div key="roast" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                  <RoastMyCV cvText={state.cvText} />
                </motion.div>
              </Suspense>
            )}

            {currentView === AppView.ABOUT && (
              <Suspense fallback={<LoadingFallback />}>
                <motion.div key="about" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                  <About />
                </motion.div>
              </Suspense>
            )}

          </AnimatePresence>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default App;