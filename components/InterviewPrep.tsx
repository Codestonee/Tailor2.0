import React, { useState, useEffect, useRef } from 'react';
import { Job, ChatMessage, MascotEmotion } from '../types';
import { getInterviewResponse } from '../services/geminiService';
import { Send, User, RotateCcw, Frown, Briefcase } from 'lucide-react';
import Mascot from './Mascot';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface InterviewPrepProps {
  job?: Job;
  cvText?: string;
}

const InterviewPrep: React.FC<InterviewPrepProps> = ({ job, cvText }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [satisfaction, setSatisfaction] = useState(50); 
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'lost' | 'won'>('setup');
  const [customRole, setCustomRole] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isStandalone = !job || !cvText;

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isStandalone) {
      startSession();
    }
  }, []);

  const startSession = async () => {
    if (isStandalone && !customRole.trim()) return;

    setGameState('playing');
    setSatisfaction(50);
    setIsLoading(true);
    
    // Simulate connection
    await new Promise(r => setTimeout(r, 1000));
    
    const initialHistory: ChatMessage[] = []; 
    const response = await getInterviewResponse(
      initialHistory, 
      job?.description, 
      cvText, 
      isStandalone ? customRole : undefined
    );
    
    setMessages([
      { id: 'init', role: 'model', text: response.text }
    ]);
    setIsLoading(false);
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#0F7C8A', '#FFA07A', '#20B2AA']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#0F7C8A', '#FFA07A', '#20B2AA']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleSend = async () => {
    if (!input.trim() || gameState !== 'playing') return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const newHistory = [...messages, userMsg];
    const response = await getInterviewResponse(
      newHistory, 
      job?.description, 
      cvText,
      isStandalone ? customRole : undefined
    );

    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: response.text
    };

    setMessages(prev => [...prev, modelMsg]);
    
    let newScore = satisfaction + response.scoreImpact;
    newScore = Math.max(0, Math.min(100, newScore));
    setSatisfaction(newScore);

    setIsLoading(false);

    if (newScore < 10) {
      setGameState('lost');
    } else if (newScore >= 100) {
      setGameState('won');
      triggerConfetti();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Render Setup Screen for Standalone Mode
  if (gameState === 'setup' && isStandalone) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-6 text-center">
        <div className="w-40 h-40 mx-auto mb-6">
          <Mascot emotion="happy" />
        </div>
        <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">Intervjusimulator</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Vilken roll vill du öva på? Jag agerar rekryterare och ställer frågorna.
        </p>
        
        <div className="relative max-w-md mx-auto">
          <Briefcase className="absolute left-4 top-4 text-gray-400" />
          <input
            type="text"
            value={customRole}
            onChange={(e) => setCustomRole(e.target.value)}
            placeholder="T.ex. Projektledare, Sjuksköterska..."
            className="w-full pl-12 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg text-lg shadow-sm focus:ring-2 focus:ring-ocean/20 dark:focus:ring-coral/20 outline-none"
            onKeyDown={(e) => e.key === 'Enter' && startSession()}
          />
        </div>
        
        <button
          onClick={startSession}
          disabled={!customRole.trim()}
          className="mt-6 bg-ocean dark:bg-coral text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
        >
          Starta Intervju
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[650px] w-full max-w-4xl mx-auto relative">
      <div className="flex items-center justify-between mb-4">
        <div>
           <h3 className="text-xl font-bold text-gray-900 dark:text-white">Intervju: {job?.title || customRole}</h3>
           <p className="text-sm text-gray-500 dark:text-gray-400">
             {isStandalone ? 'Fristående träningsläge' : `Baserat på annonsen från ${job?.employer}`}
           </p>
        </div>
        
        <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
           <span className="text-xs font-bold text-gray-500 uppercase">Nöjdhet</span>
           <div className="w-32 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: '50%' }}
                animate={{ width: `${satisfaction}%` }}
                className={`h-full transition-all duration-500 ${
                  satisfaction < 30 ? 'bg-red-500' : 
                  satisfaction > 80 ? 'bg-green-500' : 'bg-yellow-500'
                }`}
              />
           </div>
           <span className="font-bold text-gray-700 dark:text-gray-200">
             {satisfaction}%
           </span>
        </div>
      </div>

      <div className="flex-1 glass rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col shadow-soft bg-white/50 dark:bg-dark-card/50 relative">
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id}
              className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {msg.role === 'model' ? (
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border p-1 transition-colors bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700`}>
                   <Mascot emotion={gameState === 'lost' ? 'sad' : 'idle'} />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-ocean/10 dark:bg-coral/10 flex items-center justify-center flex-shrink-0 border border-ocean/20 dark:border-coral/20">
                  <User className="w-5 h-5 text-ocean dark:text-coral" />
                </div>
              )}
              
              <div className={`p-4 rounded-2xl max-w-[80%] shadow-sm text-sm leading-relaxed ${
                msg.role === 'user' 
                  // HÄR ÄR ÄNDRINGEN FÖR BUBBLAN
                  ? 'bg-gradient-to-r from-ocean to-teal-green dark:from-coral dark:to-orange-500 text-white rounded-tr-none' 
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-700'
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
            <div className="flex items-start gap-4">
               <div className="w-12 h-12 rounded-full p-1 border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                   <Mascot emotion="thinking" />
               </div>
               <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-700 flex gap-2 items-center">
                 <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                 <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                 <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <AnimatePresence>
          {gameState === 'lost' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-8"
            >
              <Frown className="w-20 h-20 text-gray-400 mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Intervjun avslutades</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md">
                Rekryteraren verkade inte helt nöjd med svaren denna gång. Men ge inte upp!
              </p>
              <button
                onClick={() => { setMessages([]); startSession(); }}
                className="bg-gray-800 dark:bg-white dark:text-gray-900 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform"
              >
                Försök igen
              </button>
            </motion.div>
          )}

          {gameState === 'won' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-8"
            >
              <div className="w-32 h-32 mb-6">
                 <Mascot emotion="excited" />
              </div>
              <h3 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-ocean to-teal-green dark:from-coral dark:to-orange-500 mb-2">
                Grattis, du är anställd!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md text-lg">
                Du spikade intervjun och nådde 100% nöjdhet. Grymt jobbat!
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => { setMessages([]); startSession(); }}
                  className="bg-white border border-gray-200 text-gray-800 px-6 py-3 rounded-xl font-bold shadow-sm hover:bg-gray-50 transition-colors"
                >
                  Kör en gång till
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-4">
             <input
               type="text"
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={handleKeyPress}
               disabled={gameState !== 'playing'}
               placeholder={gameState === 'playing' ? "Skriv ditt svar här..." : "Intervjun är avslutad"}
               className="flex-1 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-ocean/50 dark:focus:ring-coral/50 disabled:opacity-50"
             />
             <button
               onClick={handleSend}
               disabled={!input.trim() || isLoading || gameState !== 'playing'}
               // HÄR ÄR ÄNDRINGEN FÖR KNAPPEN
               className="p-3 bg-ocean dark:bg-coral text-white rounded-xl shadow-lg hover:opacity-90 disabled:opacity-50 transition-all"
             >
               <Send className="w-5 h-5" />
             </button>
             <button
               onClick={() => { setMessages([]); startSession(); }}
               title="Starta om"
               className="p-3 text-gray-400 hover:text-ocean dark:hover:text-coral hover:bg-ocean/10 dark:hover:bg-coral/10 rounded-xl transition-all"
             >
                <RotateCcw className="w-5 h-5" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPrep;