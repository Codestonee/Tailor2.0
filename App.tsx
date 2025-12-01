import React, { useState, useRef, useEffect } from 'react';
import { AppStage, UserState, Job, AppView } from './types';
import Hero from './components/Hero';
import FileUpload from './components/FileUpload';
import JobSelector from './components/JobSelector';
import AnalysisDashboard from './components/AnalysisDashboard';
import AppHeader from './components/AppHeader';
import Mascot from './components/Mascot';
import SalaryCalculator from './components/SalaryCalculator';
import About from './components/About';
import InterviewPrep from './components/InterviewPrep';
import RoastMyCV from './components/RoastMyCV';
import CareerGames from './components/CareerGames';
import { analyzeApplication } from './services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';
import { handleAPIError } from './src/utils/errorhandling';

// --- Loading Text Component (Personligare texter) ---
const LoadingText = () => {
  const [textIndex, setTextIndex] = useState(0);
  
  // MER MÄNSKLIGA TEXTER
  const texts = [
    "Läser igenom din erfarenhet...",
    "Hmm, intressant profil...",
    "Letar efter den röda tråden...",
    "Jämför med vad arbetsgivaren söker...",
    "Formulerar några skarpa tips...",
    "Putsar på detaljerna..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % texts.length);
    }, 2000); // Lite långsammare byte för att hinna läsa
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
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [stage, setStage] = useState<AppStage>(AppStage.LANDING);
  const [state, setState] = useState<UserState>({
    cvText: '',
    cvFileName: '',
    selectedJob: null,
    analysis: null,
    generatedCoverLetter: null
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
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

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleNavigate = (view: AppView) => {
    setCurrentView(view);
  };

  const handleFileLoaded = (text: string, fileName: string) => {
    setState(prev => ({ ...prev, cvText: text, cvFileName: fileName }));
    setStage(AppStage.JOB_SELECT);
  };

  const handleJobSelected = async (job: Job) => {
    setState(prev => ({ ...prev, selectedJob: job }));
    setStage(AppStage.ANALYZING);
    setIsAnalyzing(true);

    try {
      await new Promise(r => setTimeout(r, 2500)); // Lite längre för känslan
      
      const analysis = await analyzeApplication(state.cvText, job.description);
      setState(prev => ({ ...prev, analysis }));
      setStage(AppStage.RESULTS);
    } catch (e) {
      const errorMessage = handleAPIError(e);
      alert(errorMessage); 
      setStage(AppStage.JOB_SELECT); 
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setCurrentView(AppView.HOME);
    setStage(AppStage.LANDING);
    setState({
      cvText: '',
      cvFileName: '',
      selectedJob: null,
      analysis: null,
      generatedCoverLetter: null
    });
  };

  return (
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
          
          {/* --- HOME VIEW --- */}
          {currentView === AppView.HOME && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
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
                    <motion.div 
                      key="job"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <JobSelector cvText={state.cvText} onJobSelected={handleJobSelected} />
                    </motion.div>
                  )}

                  {stage === AppStage.ANALYZING && (
                    <motion.div 
                      key="analyzing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center min-h-[60vh] text-center relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-ocean/10 to-coral/10 dark:from-ocean/5 dark:to-coral/5 rounded-full blur-3xl animate-pulse" />

                      <div className="relative w-72 h-72 mb-10 flex items-center justify-center">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 rounded-full border-t-2 border-b-2 border-ocean/30 dark:border-coral/30"
                        />
                        <motion.div 
                          animate={{ rotate: -360 }}
                          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-8 rounded-full border-r-2 border-l-2 border-teal-green/40 dark:border-orange-400/40"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute inset-16 bg-white/50 dark:bg-gray-800/50 rounded-full blur-md"
                        />
                        <div className="w-44 h-44 relative z-10">
                          <Mascot emotion="analyzing" className="w-full h-full drop-shadow-2xl" />
                        </div>
                      </div>

                      <LoadingText />
                      
                      <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-6 overflow-hidden relative">
                        <motion.div 
                          initial={{ width: '5%' }}
                          animate={{ width: '90%' }}
                          transition={{ duration: 10, ease: "easeInOut" }}
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-ocean to-coral"
                        />
                         <motion.div 
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                          className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        />
                      </div>

                      <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-md font-medium animate-pulse font-hand text-xl rotate-1">
                        "Låt mig göra grovjobbet åt dig..."
                      </p>
                    </motion.div>
                  )}

                  {stage === AppStage.RESULTS && state.analysis && state.selectedJob && (
                    <motion.div 
                      key="results"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <AnalysisDashboard 
                        analysis={state.analysis} 
                        job={state.selectedJob}
                        cvText={state.cvText}
                      />
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* OTHER VIEWS */}
          {currentView === AppView.SALARY && (
            <motion.div key="salary" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <SalaryCalculator />
            </motion.div>
          )}

          {currentView === AppView.INTERVIEW && (
            <motion.div key="interview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="py-12">
              <InterviewPrep />
            </motion.div>
          )}

          {currentView === AppView.BINGO && (
            <motion.div key="games" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <CareerGames cvText={state.cvText} />
            </motion.div>
          )}

          {currentView === AppView.ROAST && (
            <motion.div key="roast" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <RoastMyCV cvText={state.cvText} />
            </motion.div>
          )}

          {currentView === AppView.ABOUT && (
            <motion.div key="about" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <About />
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;