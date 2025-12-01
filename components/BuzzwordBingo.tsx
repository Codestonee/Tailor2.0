import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, RefreshCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

const WORDS = [
  "Spindeln i nätet", "Många bollar i luften", "Synergieffekter", 
  "Agilt arbetssätt", "Högt i tak", "Brinner för", "Prestigelös", 
  "Hungrig", "Resultatorienterad", "Lagspelare", "Innovativ", 
  "Dynamisk miljö", "Kreativ", "Proaktiv", "Hands-on", "Frontend Ninja"
];

const BuzzwordBingo: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [hasWon, setHasWon] = useState(false);

  const toggleWord = (word: string) => {
    if (hasWon) return;
    
    const newSelected = selected.includes(word) 
      ? selected.filter(w => w !== word) 
      : [...selected, word];
    
    setSelected(newSelected);

    if (newSelected.length >= 4 && !hasWon) {
      setHasWon(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const reset = () => {
    setSelected([]);
    setHasWon(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 text-center">
      <h2 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
        Corporate <span className="text-ocean dark:text-coral">Bingo</span>
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Hittar du dessa klyschor i jobbannonsen? Klicka för att markera!
      </p>

      {hasWon && (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8 p-4 bg-teal-green/10 text-teal-green rounded-xl inline-flex items-center gap-2 font-bold"
        >
          <Trophy className="w-6 h-6" />
          <span>BINGO! Du är redo för Linkedin!</span>
        </motion.div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {WORDS.map((word) => (
          <motion.button
            key={word}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleWord(word)}
            // HÄR ÄR ÄNDRINGEN FÖR BUBBLORNA
            className={`
              p-4 rounded-xl font-bold text-sm transition-all shadow-sm h-24 flex items-center justify-center
              ${selected.includes(word) 
                ? 'bg-gradient-to-br from-ocean to-teal-green dark:from-coral dark:to-orange-500 text-white shadow-lg transform scale-105' 
                : 'bg-white dark:bg-dark-card text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }
            `}
          >
            {word}
          </motion.button>
        ))}
      </div>

      <button 
        onClick={reset}
        className="text-gray-500 hover:text-ocean dark:hover:text-coral flex items-center gap-2 mx-auto transition-colors"
      >
        <RefreshCcw className="w-4 h-4" /> Börja om
      </button>
    </div>
  );
};

export default BuzzwordBingo;