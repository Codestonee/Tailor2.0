import React, { useState } from 'react';
import { Search, ChevronRight, Sparkles, MapPin, FileText, ExternalLink } from 'lucide-react';
import { Job } from '../types';
import { findJobsForCV } from '../services/geminiService';
import { motion } from 'framer-motion';

interface JobSelectorProps {
  cvText: string;
  onJobSelected: (job: Job) => void;
}

type SearchMode = 'match' | 'search' | 'manual';

// --- FIX: InputField ligger nu HÄR (utanför komponenten) ---
const InputField = ({ icon: Icon, ...props }: any) => (
  <div className="relative group">
    <Icon className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-ocean dark:group-focus-within:text-coral transition-colors w-5 h-5" />
    <input 
      {...props}
      className="w-full pl-10 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-gray-100 focus:border-ocean dark:focus:border-coral focus:ring-2 focus:ring-ocean/10 dark:focus:ring-coral/20 outline-none transition-all"
    />
  </div>
);

const JobSelector: React.FC<JobSelectorProps> = ({ cvText, onJobSelected }) => {
  const [mode, setMode] = useState<SearchMode>('match');
  const [manualText, setManualText] = useState('');
  
  // Search State
  const [city, setCity] = useState('Stockholm');
  const [radius, setRadius] = useState(30);
  const [roleSearch, setRoleSearch] = useState('');
  
  const [foundJobs, setFoundJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const tabs = [
    { 
      id: 'match', 
      label: 'Matcha mitt CV', 
      icon: Sparkles,
      desc: 'Låt AI hitta de bästa jobbannonserna åt dig baserat på din profil.'
    },
    { 
      id: 'search', 
      label: 'Sök Yrke', 
      icon: Search,
      desc: 'Sök manuellt efter specifika tjänster och yrkestitlar.'
    },
    { 
      id: 'manual', 
      label: 'Klistra in', 
      icon: FileText,
      desc: 'Klistra in en annonstext du hittat själv för att få den analyserad.'
    },
  ];

  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(true);
    const searchModeForService = mode === 'match' ? 'match' : 'search';
    const jobs = await findJobsForCV(cvText, searchModeForService, {
      city,
      radius,
      role: roleSearch
    });
    setFoundJobs(jobs);
    setIsLoading(false);
  };

  const handleManualSubmit = () => {
    if (!manualText.trim()) return;
    const job: Job = {
      id: 'manual',
      title: 'Klistrad Annons',
      employer: 'Okänd Arbetsgivare',
      description: manualText
    };
    onJobSelected(job);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">Välj Jobb</h2>
        <p className="text-gray-500 dark:text-gray-400">Hur vill du hitta ditt nästa jobb?</p>
      </div>

      <div className="flex flex-col items-center mb-8 space-y-3">
        {/* Tab Buttons */}
        <div className="p-1 rounded-xl inline-flex bg-white/50 dark:bg-dark-card/50 border border-gray-200 dark:border-gray-700 shadow-sm flex-wrap justify-center gap-2 backdrop-blur-md">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => { setMode(item.id as SearchMode); setHasSearched(false); setFoundJobs([]); }}
              className={`px-4 md:px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                mode === item.id 
                  ? 'bg-gradient-to-r from-coral to-teal-green text-white shadow-md' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Dynamic Description Text */}
        <motion.p 
          key={mode} 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-gray-500 dark:text-gray-400 font-medium text-center max-w-lg"
        >
          {tabs.find(t => t.id === mode)?.desc}
        </motion.p>
      </div>

      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {mode === 'manual' ? (
          <div className="glass p-6 rounded-2xl shadow-soft">
            <textarea
              className="w-full h-48 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-gray-100 focus:border-ocean dark:focus:border-coral focus:ring-2 focus:ring-ocean/10 dark:focus:ring-coral/20 outline-none resize-none transition-all"
              placeholder="Klistra in hela jobbannonsen här..."
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleManualSubmit}
                disabled={!manualText.trim()}
                className="bg-gradient-to-r from-coral to-teal-green text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Analysera Matchning
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="glass p-8 rounded-2xl border border-white/60 dark:border-gray-700/60 bg-white/60 dark:bg-dark-card/60 shadow-sm">
              <div className="grid md:grid-cols-2 gap-6">
                
                {mode === 'search' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Yrkestitel</label>
                    <InputField 
                      icon={Search}
                      type="text" 
                      value={roleSearch}
                      onChange={(e: any) => setRoleSearch(e.target.value)}
                      placeholder="T.ex. Sjuksköterska, Systemutvecklare..."
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Stad / Område</label>
                  <InputField 
                    icon={MapPin}
                    type="text" 
                    value={city}
                    onChange={(e: any) => setCity(e.target.value)}
                    placeholder="T.ex. Stockholm"
                  />
                </div>

                <div>
                   <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Radie: {radius} km</label>
                   <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={radius} 
                    onChange={(e) => setRadius(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-ocean dark:accent-coral"
                   />
                   <div className="flex justify-between text-xs text-gray-400 mt-1">
                     <span>0 km</span>
                     <span>100 km</span>
                   </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-coral to-teal-green text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-ocean/20 transition-all hover:scale-105 hover:shadow-xl"
                >
                  {isLoading ? 'Söker...' : 'Hitta Jobb'}
                </button>
              </div>
            </div>

            {/* Results */}
            {isLoading && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="glass p-6 rounded-2xl h-32 animate-pulse flex flex-col justify-between border border-white/50 dark:border-gray-700/50">
                    <div className="w-1/3 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="w-full h-4 bg-gray-100 dark:bg-gray-800 rounded"></div>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && hasSearched && foundJobs.length === 0 && (
               <div className="text-center py-10">
                 <p className="text-gray-500 dark:text-gray-400">Inga jobb hittades. Försök utöka din sökning.</p>
               </div>
            )}

            <div className="grid gap-4">
              {foundJobs.map((job, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass p-6 rounded-2xl hover:shadow-lg hover:border-ocean/30 dark:hover:border-coral/30 border border-white/50 dark:border-gray-700/50 transition-all cursor-pointer group bg-white/80 dark:bg-dark-card/80"
                  onClick={() => onJobSelected(job)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-ocean dark:group-hover:text-coral transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 font-medium">{job.employer}</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-coral"></span>
                        {job.location || city}
                      </p>
                      {job.url && (
                        <a 
                          href={job.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-ocean dark:text-coral hover:underline flex items-center gap-1 mt-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-3 h-3" />
                          Visa annons
                        </a>
                      )}
                    </div>
                    <div className="bg-ocean/5 dark:bg-coral/10 p-2 rounded-full shadow-sm group-hover:bg-ocean group-hover:text-white dark:group-hover:bg-coral transition-all text-ocean dark:text-coral">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default JobSelector;