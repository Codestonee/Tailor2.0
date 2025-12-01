import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Skull, RefreshCcw, AlertTriangle } from 'lucide-react';
import { roastCV } from '../services/geminiService';
import Mascot from './Mascot';

interface RoastProps {
  cvText: string;
}

const RoastMyCV: React.FC<RoastProps> = ({ cvText }) => {
  const [roast, setRoast] = useState<string>('');
  const [loading, setLoading] = useState(false);
  // Ny state för att spara felmeddelanden
  const [error, setError] = useState<string | null>(null);

  const handleRoast = async () => {
    if (!cvText) return;
    setLoading(true);
    setError(null); // Rensa gamla fel
    
    try {
      const result = await roastCV(cvText);
      if (!result) throw new Error("Fick inget svar från AI:n.");
      setRoast(result);
    } catch (e: any) {
      console.error("Roast error:", e);
      setError("Kunde inte roasta just nu. AI:n kanske blev för elak och kraschade? Försök igen!");
    } finally {
      setLoading(false);
    }
  };

  if (!cvText) {
    return (
      <div className="text-center py-20">
        <div className="w-32 h-32 mx-auto mb-4">
           <Mascot emotion="neutral" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ladda upp ett CV först!</h2>
        <p className="text-gray-500">Jag kan inte grilla ingenting. Gå till Hem och ladda upp ditt CV.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 text-center">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <div className="inline-block p-4 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
          <Flame className="w-12 h-12 text-red-600 dark:text-red-500 animate-pulse" />
        </div>
        <h1 className="text-5xl font-display font-black text-gray-900 dark:text-white mb-4 uppercase tracking-tight">
          Roast My <span className="text-red-600 dark:text-red-500">CV</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto">
          Vågar du? Vår AI tar av sig silkesvantarna och berättar exakt vad rekryteraren tänker men inte säger.
        </p>

        {/* Start-knapp (visas bara om vi inte laddar och inte har resultat) */}
        {!roast && !loading && (
          <div className="space-y-4">
            <button
              onClick={handleRoast}
              className="bg-gradient-to-r from-red-500 to-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
            >
              <Skull className="w-6 h-6" /> KÖTTA PÅ!
            </button>
            
            {/* Felmeddelande visas här om något gick snett */}
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 font-bold bg-red-100 dark:bg-red-900/20 p-4 rounded-xl inline-flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                {error}
              </motion.div>
            )}
          </div>
        )}

        {/* Laddnings-state */}
        {loading && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-48 h-48">
               {/* ANVÄNDER DIN NYA MASKOT HÄR */}
               <Mascot emotion="mischievous" />
            </div>
            <p className="text-red-500 font-bold text-xl animate-pulse">Vässar knivarna...</p>
          </div>
        )}

        {/* Resultat */}
        {roast && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            className="mt-8 bg-white dark:bg-dark-card border-2 border-red-500 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-left"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-orange-500"></div>
            
            {/* Din nya maskot kikar fram även vid resultatet */}
            <div className="absolute -top-6 -right-6 w-24 h-24 opacity-20 rotate-12">
               <Mascot emotion="mischievous" />
            </div>

            <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed whitespace-pre-wrap font-medium">
              {roast}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-center">
                <button onClick={() => setRoast('')} className="text-gray-500 hover:text-red-500 flex items-center gap-2 text-sm font-bold uppercase tracking-wide transition-colors">
                    <RefreshCcw className="w-4 h-4" /> En gång till?
                </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default RoastMyCV;