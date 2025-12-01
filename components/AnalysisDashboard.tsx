import React, { useState } from 'react';
import { AnalysisResult, Job, Improvement } from '../types';
import { CheckCircle, AlertCircle, FileText, ArrowRight, Download, Copy, TrendingUp, Star, ChevronDown, ChevronUp, Lightbulb, MessageSquare, Target } from 'lucide-react';
import { generateCoverLetter } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';
import InterviewPrep from './InterviewPrep';
import Mascot from './Mascot';

// --- NY KOMPONENT: Cirkulär Progress ---
const CircularProgress = ({ score, label, colorClass }: { score: number, label: string, colorClass: string }) => {
  const radius = 50;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = '#20B2AA'; 
  if (colorClass.includes('red')) strokeColor = '#EF4444';
  if (colorClass.includes('yellow')) strokeColor = '#EAB308';
  if (colorClass.includes('ocean')) strokeColor = '#0F7C8A';
  if (colorClass.includes('coral')) strokeColor = '#FFA07A';

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg] drop-shadow-sm">
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="text-gray-200 dark:text-gray-700"
          />
          <motion.circle
            stroke={strokeColor}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className={`text-3xl font-bold ${colorClass}`}
          >
            {score}%
          </motion.span>
        </div>
      </div>
      <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</span>
    </div>
  );
};

// --- Improvement Card ---
interface ImprovementCardProps {
  imp: Improvement;
  index: number;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  currentScore: number;
}

const ImprovementCard: React.FC<ImprovementCardProps> = ({ imp, index, isExpanded, onToggle, currentScore }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-dark-card rounded-xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-coral shadow-md' : 'border-gray-300 dark:border-gray-700 shadow-sm hover:border-coral/50'}`}
    >
      <div 
        className="p-4 flex gap-4 items-center cursor-pointer group"
        onClick={() => onToggle(imp.id)}
      >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 transition-all ${
           isExpanded 
             ? 'bg-gradient-to-br from-coral to-orange-400 text-white shadow-lg' 
             : 'bg-coral/10 text-coral group-hover:bg-coral group-hover:text-white'
        }`}>
          {index + 1}
        </div>
        <div className="flex-1">
          <h5 className="font-bold text-gray-800 dark:text-gray-100">{imp.title}</h5>
          {!isExpanded && (
             <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{imp.explanation}</p>
          )}
        </div>
        
        <div className="flex items-center gap-3">
           <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Score Boost</span>
              <div className="flex items-center gap-1 text-teal-green font-bold">
                <TrendingUp className="w-3 h-3" />
                <span>+{imp.impactScore}%</span>
              </div>
           </div>
           {isExpanded ? <ChevronUp className="text-gray-400 w-5 h-5" /> : <ChevronDown className="text-gray-400 w-5 h-5" />}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-4 sm:pl-[4.5rem]"
          >
            <div className="p-5 bg-neutral-50 dark:bg-gray-900/50 rounded-xl space-y-4 border border-gray-200 dark:border-gray-700/50">
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed border-l-2 border-coral/50 pl-3">
                {imp.explanation}
              </p>
              
              <div className="bg-white dark:bg-dark-bg p-4 rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-1 h-full bg-teal-green"></div>
                 {/* HANDSKRIVEN NOTERING */}
                 <div className="flex items-center gap-2 mb-2">
                   <div className="text-xs font-bold text-teal-green uppercase tracking-wide flex items-center gap-1">
                     <Lightbulb className="w-4 h-4" /> Förslag
                   </div>
                   <span className="font-hand text-lg text-gray-400 dark:text-gray-500 rotate-1">
                     Testa att skriva såhär istället:
                   </span>
                 </div>
                 <p className="text-sm text-gray-600 dark:text-gray-300 italic font-medium">
                    "{imp.example}"
                 </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- Huvudkomponent ---
interface AnalysisDashboardProps {
  analysis: AnalysisResult;
  job: Job;
  cvText: string;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ analysis, job, cvText }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'improvements' | 'coverletter' | 'interview'>('overview');
  const [generatedLetter, setGeneratedLetter] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedImprovement, setExpandedImprovement] = useState<string | null>(null);

  const totalPotentialBoost = analysis.improvements.reduce((sum, imp) => sum + imp.impactScore, 0);
  const potentialScore = Math.min(100, analysis.matchScore + totalPotentialBoost);

  // MASKOT-KOMMENTAR (Personlig touch)
  const getMascotComment = (score: number) => {
    if (score > 85) return "Wow! Det här ser riktigt vasst ut! Bara finlir kvar.";
    if (score > 60) return "En bra start! Med lite justeringar blir det här toppen.";
    return "Ingen fara, vi fixar det här tillsammans! Jag har en plan.";
  };

  const getMascotEmotion = (score: number) => {
    if (score >= 80) return 'excited';
    if (score >= 60) return 'happy';
    return 'thinking';
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    const letter = await generateCoverLetter(cvText, job.description);
    setGeneratedLetter(letter);
    setActiveTab('coverletter');
    setIsGenerating(false);
  };

  const toggleImprovement = (id: string) => {
    setExpandedImprovement(expandedImprovement === id ? null : id);
  };

  return (
    <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 pb-12">
      
      {/* Sidebar / Stats */}
      <div className="lg:col-span-4 space-y-6">
        {/* Score Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 rounded-2xl shadow-soft flex flex-col items-center text-center border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-card relative overflow-visible"
        >
          {/* MASKOT MED PRATBUBBLA - HUMAN TOUCH */}
          <div className="absolute -top-16 right-0 md:-right-4 w-28 h-28 hidden lg:block z-20">
             <div className="absolute -top-12 -right-16 bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-bl-none shadow-lg border border-gray-200 dark:border-gray-600 w-44 text-sm font-hand text-gray-700 dark:text-gray-200 rotate-2">
                "{getMascotComment(analysis.matchScore)}"
             </div>
             <Mascot emotion={getMascotEmotion(analysis.matchScore)} />
          </div>

          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-coral to-teal-green"></div>
          
          <CircularProgress 
            score={analysis.matchScore} 
            label="Match Score" 
            colorClass="text-transparent bg-clip-text bg-gradient-to-r from-coral to-teal-green" 
          />
          
          <div className="mt-8 w-full grid grid-cols-2 gap-4 relative z-10">
             <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <span className="text-xl font-bold text-gray-900 dark:text-white">{analysis.atsScore}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase">ATS Score</span>
             </div>
             <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <span className="text-xl font-bold text-gray-900 dark:text-white">{analysis.matchedSkills.length}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Skills</span>
             </div>
          </div>
        </motion.div>

        {/* Potential Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-6 rounded-2xl shadow-soft bg-white dark:bg-dark-card border border-gray-300 dark:border-gray-700"
        >
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-coral" /> Potential
          </h3>
          
          <div className="space-y-4">
             <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Nuvarande</span>
                <span className="font-bold text-gray-900 dark:text-white">{analysis.matchScore}%</span>
             </div>
             
             <div className="relative h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-gray-400 dark:bg-gray-500"
                  style={{ width: `${analysis.matchScore}%` }}
                ></div>
                <div 
                  className="absolute top-0 h-full bg-gradient-to-r from-coral to-teal-green opacity-70 striped-bg"
                  style={{ left: `${analysis.matchScore}%`, width: `${potentialScore - analysis.matchScore}%` }}
                ></div>
             </div>

             <div className="flex justify-between items-end">
                <span className="text-xs text-gray-500 italic max-w-[150px] font-hand text-base rotate-1">Med enkla fixar:</span>
                <span className="text-2xl font-bold text-teal-green">{potentialScore}%</span>
             </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-8 space-y-6">
        {/* Tabs */}
        <div className="p-1 rounded-xl inline-flex w-full bg-white/80 dark:bg-dark-card/80 border border-gray-300 dark:border-gray-700 shadow-sm backdrop-blur-sm">
          {[
            { id: 'overview', label: 'Analys & Åtgärder', icon: CheckCircle },
            { id: 'interview', label: 'Intervju-träning', icon: MessageSquare },
            { id: 'coverletter', label: 'Personligt Brev', icon: FileText }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-coral to-teal-green text-white shadow-md' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass p-8 rounded-2xl shadow-soft min-h-[500px] border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-dark-card/90"
        >
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                   <Target className="w-6 h-6 text-ocean" /> Sammanfattning
                </h3>
                <div className="p-6 rounded-xl bg-gradient-to-br from-teal-green/5 to-transparent border-l-4 border-teal-green relative">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                    {analysis.summary}
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-coral fill-coral" />
                    Åtgärder för att Höja din Score
                  </h4>
                </div>
                
                <div className="space-y-4">
                  {analysis.improvements.map((imp, i) => (
                    <ImprovementCard 
                      key={imp.id || i} 
                      imp={imp} 
                      index={i} 
                      isExpanded={expandedImprovement === imp.id}
                      onToggle={toggleImprovement}
                      currentScore={analysis.matchScore}
                    />
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-teal-green" /> Matchande Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.matchedSkills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-200 text-sm font-medium rounded-full border border-teal-200 dark:border-teal-800/50">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-coral" /> Saknade Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingSkills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-coral dark:text-orange-200 text-sm font-medium rounded-full border border-orange-200 dark:border-orange-800/50">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'interview' && (
            <InterviewPrep job={job} cvText={cvText} />
          )}

          {activeTab === 'coverletter' && (
            <div className="h-full flex flex-col">
              {!generatedLetter ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                   <div className="w-24 h-24 bg-gradient-to-tr from-coral/20 to-teal-green/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                     <FileText className="w-10 h-10 text-teal-green" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Skapa ditt Personliga Brev</h3>
                   <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
                     Använd AI för att generera ett skräddarsytt brev baserat på analysen av ditt CV och jobbannonsen.
                   </p>
                   <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="bg-gradient-to-r from-coral to-teal-green hover:brightness-110 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-coral/20 transition-all flex items-center gap-2 transform hover:scale-105"
                   >
                     {isGenerating ? 'Skriver...' : 'Generera Brev Nu'}
                     {!isGenerating && <ArrowRight className="w-5 h-5" />}
                   </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Ditt Brev</h3>
                    <div className="flex gap-2">
                       <button className="p-2 text-gray-500 hover:text-teal-green hover:bg-teal-green/10 rounded-lg transition-colors" title="Kopiera">
                         <Copy className="w-5 h-5" />
                       </button>
                       <button className="p-2 text-gray-500 hover:text-teal-green hover:bg-teal-green/10 rounded-lg transition-colors" title="Ladda ner">
                         <Download className="w-5 h-5" />
                       </button>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-dark-bg p-10 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed font-serif relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-coral to-teal-green"></div>
                    {generatedLetter}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;