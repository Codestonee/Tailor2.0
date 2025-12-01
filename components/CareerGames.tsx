import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Mic, MessageCircle, BrainCircuit, CheckCircle } from 'lucide-react';
import BuzzwordBingo from './BuzzwordBingo';
import InterviewPrep from './InterviewPrep';
import { evaluatePitch, PitchFeedback } from '../services/geminiService';
import Mascot from './Mascot';

// --- SUB-KOMPONENT: ELEVATOR PITCH ---
const ElevatorPitch = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<PitchFeedback | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!text || text.length < 50) return;
    setLoading(true);
    try {
      const data = await evaluatePitch(text);
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center space-y-6">
      <div className="bg-ocean/10 dark:bg-ocean/20 p-6 rounded-2xl mb-6">
        <h3 className="text-xl font-bold text-ocean dark:text-teal-green mb-2">30-sekunders regeln</h3>
        <p className="text-gray-600 dark:text-gray-300">
          Kan du sälja in dig själv på tiden det tar att åka hiss? Skriv din pitch nedan så agerar AI:n investerare.
        </p>
      </div>

      {!result ? (
        <div className="glass p-6 rounded-2xl shadow-soft">
          <textarea
            className="w-full h-40 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg focus:ring-2 focus:ring-ocean/50 outline-none resize-none mb-4"
            placeholder="Hej, jag heter... och jag är expert på..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
             <span>{text.length} tecken</span>
             <span>Minst 50 tecken</span>
          </div>
          <button
            onClick={handleAnalyze}
            disabled={loading || text.length < 50}
            className="w-full bg-ocean text-white py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
          >
            {loading ? 'Analyserar...' : 'Analysera Pitch'}
          </button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-left space-y-6">
           <div className="flex items-center justify-center gap-4 mb-6">
              <div className="relative w-24 h-24 flex items-center justify-center">
                 <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
                 <div className="absolute inset-0 border-4 border-ocean rounded-full" style={{ clipPath: `inset(${100 - (result.score * 10)}% 0 0 0)` }}></div>
                 <span className="text-3xl font-bold text-ocean">{result.score}/10</span>
              </div>
           </div>
           
           <div className="glass p-6 rounded-2xl border-l-4 border-ocean">
              <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Feedback</h4>
              <p className="text-gray-700 dark:text-gray-300">{result.feedback}</p>
           </div>

           <div className="glass p-6 rounded-2xl border-l-4 border-teal-green bg-teal-green/5">
              <h4 className="font-bold text-lg mb-2 text-teal-green">Förslag på förbättring</h4>
              <p className="italic text-gray-700 dark:text-gray-300">"{result.improved_version}"</p>
           </div>
           
           <button onClick={() => setResult(null)} className="text-gray-500 hover:text-ocean underline w-full text-center">Testa igen</button>
        </motion.div>
      )}
    </div>
  );
};

// --- SUB-KOMPONENT: KARRIÄR QUIZ (UPPDATERAD) ---
const CareerQuiz = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  
  // De "roliga" svaren som leder till Joker-status
  const funnyOptions = [
    "Gömmer mig under skrivbordet",
    "Gratis kaffe och fredagsfika",
    "Minst möjligt",
    "Zonade ut för 10 min sen",
    "Hoppas ingen märker att jag är sen",
    "Skyller på praktikanten",
    "Äter upp alla bullar",
    "Slår på datorn i ren ilska",
    "Markerar allt som läst utan att läsa",
    "Ber om lön i trisslotter",
    "Söker andra jobb på arbetstid",
    "Dansar på bordet"
  ];
  
  // Totalt 12 frågor
  const questions = [
    { 
      q: "När ett problem uppstår, vad gör du först?", 
      a: ["Analyserar datan", "Samlar teamet", "Testar en lösning direkt", "Gömmer mig under skrivbordet"] 
    },
    { 
      q: "Vad motiverar dig mest?", 
      a: ["Att lösa kluriga problem", "Att hjälpa andra växa", "Resultat & bonus", "Gratis kaffe och fredagsfika"] 
    },
    { 
      q: "Hur jobbar du helst?", 
      a: ["Djupt fokus, ensam", "I workshops med andra", "Agilt och snabbt", "Minst möjligt"] 
    },
    {
      q: "Vad gör du under ett långtråkigt möte?",
      a: ["Antecknar allt viktigt", "Försöker styra upp agendan", "Planerar veckans middagar", "Zonade ut för 10 min sen"]
    },
    {
      q: "Hur hanterar du en deadline som närmar sig?",
      a: ["Är klar veckan innan", "Gör en detaljerad plan", "Jobbar natt sista dagen", "Hoppas ingen märker att jag är sen"]
    },
    {
      q: "Du fick precis negativ feedback. Vad gör du?",
      a: ["Ber om konkreta exempel", "Ser det som en chans att växa", "Förklarar varför de har fel", "Skyller på praktikanten"]
    },
    {
      q: "Det vankas fredagsfika. Vilken är din roll?",
      a: ["Jag har bakat själv!", "Jag ser till att alla är med", "Jag pratar jobbstrategi", "Äter upp alla bullar"]
    },
    {
      q: "Datorn kraschar och du har inte sparat. Reaktion?",
      a: ["Andas djupt, börjar om", "Ringer IT-supporten direkt", "Försöker återskapa ur minnet", "Slår på datorn i ren ilska"]
    },
    {
      q: "Hur ser din inkorg ut?",
      a: ["Inbox Zero - total ordning", "Mappar för allt", "Kaos men jag har koll", "Markerar allt som läst utan att läsa"]
    },
    {
      q: "Löneförhandling! Vad är din strategi?",
      a: ["Presenterar min prestation", "Jämför med marknadslön", "Visar min potential", "Ber om lön i trisslotter"]
    },
    {
      q: "Chefen går förbi din skärm. Vad har du uppe?",
      a: ["Excel-ark", "Mailen", "Företagets vision", "Söker andra jobb på arbetstid"]
    },
    {
      q: "Företagsfest! Vart hittar vi dig?",
      a: ["Nätverkar med ledningen", "Ser till att alla har kul", "Vid buffén", "Dansar på bordet"]
    }
  ];

  const handleAnswer = (ans: string) => {
    const newAnswers = [...answers, ans];
    if (newAnswers.length === questions.length) {
       setAnswers(newAnswers);
       setStep(100); 
    } else {
       setAnswers(newAnswers);
       setStep(step + 1);
    }
  };

  // Resultat-logik
  if (step === 100) {
     const funnyCount = answers.filter(ans => funnyOptions.includes(ans)).length;
     // Om man svarat "roligt" på minst 4 frågor (ca 33%) blir man Joker
     const isJoker = funnyCount >= 4;

     return (
        <div className="text-center py-10">
           <div className="w-40 h-40 mx-auto mb-6">
             <Mascot emotion={isJoker ? "dance" : "excited"} />
           </div>
           
           <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
             {isJoker ? 'Du är "Kontorets Joker"!' : 'Du är en "Strategisk Visionär"!'}
           </h3>
           
           <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-8">
             {isJoker 
               ? "Du tar inte livet på för stort allvar. Din superkraft är att hålla stämningen uppe, hitta fikat och undvika onödiga möten. En sann glädjespridare (eller maskare)!" 
               : "Du ser helheten där andra ser detaljer. Du är organiserad, driven och förmodligen den som faktiskt får saker gjorda. Roller som Produktägare eller Team Lead passar dig."}
           </p>
           
           <button onClick={() => {setStep(0); setAnswers([])}} className="bg-ocean text-white px-6 py-2 rounded-xl font-bold shadow-md hover:scale-105 transition-transform">
             Gör om testet
           </button>
        </div>
     )
  }

  return (
    <div className="max-w-xl mx-auto text-center">
       <div className="mb-8">
          <span className="text-xs font-bold text-ocean uppercase tracking-widest">Fråga {step + 1} av {questions.length}</span>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
             <div className="h-full bg-ocean transition-all duration-500" style={{ width: `${((step + 1) / questions.length) * 100}%` }}></div>
          </div>
       </div>
       
       <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">{questions[step].q}</h3>
       
       <div className="grid gap-4">
          {questions[step].a.map((ans, i) => (
             <button 
               key={i} 
               onClick={() => handleAnswer(ans)}
               className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-card hover:border-ocean hover:bg-ocean/5 transition-all text-left font-medium text-gray-700 dark:text-gray-200 shadow-sm"
             >
               {ans}
             </button>
          ))}
       </div>
    </div>
  );
};

// --- MAIN CONTAINER ---
interface CareerGamesProps {
  cvText: string;
}

const CareerGames: React.FC<CareerGamesProps> = ({ cvText }) => {
  const [activeTab, setActiveTab] = useState<'bingo' | 'pitch' | 'negotiation' | 'quiz'>('bingo');

  const tabs = [
    { id: 'bingo', label: 'Buzzword Check', icon: Trophy },
    { id: 'pitch', label: 'Hiss-pitchen', icon: Mic },
    { id: 'negotiation', label: 'Löneförhandling', icon: MessageCircle },
    { id: 'quiz', label: 'Karriär-Quiz', icon: BrainCircuit },
  ];

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
          Karriär<span className="text-ocean dark:text-coral">Gymmet</span>
        </h2>
        <p className="text-gray-500 dark:text-gray-400">Träna dina färdigheter, testa din profil och ha lite kul på vägen.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
              activeTab === tab.id 
                ? 'bg-ocean text-white shadow-lg scale-105' 
                : 'bg-white dark:bg-dark-card text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="glass p-8 rounded-3xl shadow-soft min-h-[500px] border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-dark-card/50">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'bingo' && <BuzzwordBingo />}
            
            {activeTab === 'pitch' && <ElevatorPitch />}
            
            {activeTab === 'negotiation' && (
               <div className="h-[600px]">
                  <InterviewPrep 
                    cvText={cvText} 
                    job={{
                       id: 'neg', 
                       title: 'Löneförhandling', 
                       employer: 'Tuff Arbetsgivare AB', 
                       description: 'Rollspel: Du är en chef som ska hålla nere lönen. Jag ska försöka höja den. Var tuff men rättvis.'
                    } as any} 
                  />
               </div>
            )}
            
            {activeTab === 'quiz' && <CareerQuiz />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CareerGames;