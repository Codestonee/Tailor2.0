import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Star, ArrowDown, Mic, Coins, ShieldCheck } from 'lucide-react';
import Mascot from './Mascot';

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden py-4 lg:py-8 flex items-center justify-center min-h-[400px]">
      
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-teal-green/10 dark:bg-teal-green/5 rounded-full blur-[100px] animate-pulse opacity-70" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-coral/10 dark:bg-coral/5 rounded-full blur-[100px] opacity-70" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      {/* --- CONTENT --- */}
      <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-4 items-center">
        
        {/* Left Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-left space-y-3"
        >
          <div className="inline-flex items-center space-x-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-gray-100 dark:border-coral/30">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-coral"></span>
            </span>
            <span className="text-xs font-bold text-gray-700 dark:text-coral tracking-wide">Tailor 2.0 AI Coach</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-gray-900 dark:text-white leading-[1.1] tracking-tight">
            Optimera ditt CV & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral to-teal-green">
              landa drömjobbet
            </span>
          </h1>

          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-md leading-relaxed font-normal">
            Få personlig AI-feedback, matcha ditt CV mot din nästa roll på sekunder, och generera skräddarsydda personliga brev.
          </p>

          <div className="pt-1 flex items-center gap-4 text-xs md:text-sm font-semibold">
            <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-200">
              <div className="p-1 rounded-full bg-teal-green/10 dark:bg-teal-green/20 text-teal-green dark:text-teal-400">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
              <span>AI-Matchning</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-200">
              <div className="p-1 rounded-full bg-coral/10 dark:bg-coral/20 text-coral">
                <Star className="w-3.5 h-3.5" />
              </div>
              <span>ATS-Optimering</span>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="pt-4 flex flex-col items-start gap-1"
          >
             <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold">Ladda upp nedan</span>
             <ArrowDown className="w-4 h-4 text-gray-300 dark:text-gray-600 animate-bounce" />
          </motion.div>
        </motion.div>

        {/* Right Mascot Section - STÖRRE OCH MER LEVANDE */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden md:flex justify-center items-center h-[320px]"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-teal-green/20 to-coral/20 rounded-full blur-3xl transform scale-90"></div>
          
          {/* Maskotcontainer: 380px storlek (större än förut) */}
          <div className="w-[380px] h-[380px] relative z-20 flex items-center justify-center">
             <Mascot emotion="wave" />

             {/* Cards - Uppskalade och positionerade */}
             
             {/* 1: Intervju (Top Right) */}
             <motion.div 
               initial={{ x: 20, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ delay: 1.1 }}
               className="absolute top-0 -right-6 glass p-3.5 rounded-2xl flex items-center gap-3 shadow-md animate-[bounce_5s_infinite] bg-white/90 dark:bg-dark-card/90 border border-white/50 dark:border-gray-700 z-30"
             >
               <div className="w-9 h-9 bg-coral/10 dark:bg-coral/20 rounded-full flex items-center justify-center text-coral">
                 <Mic className="w-5 h-5" />
               </div>
               <div>
                 <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight">Intervju-redo</p>
               </div>
             </motion.div>

             {/* 2: Lön (Bottom Right) */}
             <motion.div 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 1.3 }}
               className="absolute bottom-6 -right-4 glass p-3.5 rounded-2xl flex items-center gap-3 shadow-md animate-[bounce_3.5s_infinite] bg-white/90 dark:bg-dark-card/90 border border-white/50 dark:border-gray-700 z-30"
             >
               <div className="w-9 h-9 bg-ocean/10 dark:bg-ocean/20 rounded-full flex items-center justify-center text-ocean">
                 <Coins className="w-5 h-5" />
               </div>
               <div>
                 <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight">Löneanalys</p>
               </div>
             </motion.div>

             {/* 3: CV Analys (Bottom Left) */}
             <motion.div 
               initial={{ x: -20, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ delay: 0.8 }}
               className="absolute bottom-2 -left-10 glass p-4 rounded-2xl flex items-center gap-3 shadow-md animate-[bounce_4s_infinite] bg-white/90 dark:bg-dark-card/90 border border-white/50 dark:border-gray-700 z-30"
             >
               <div className="w-10 h-10 bg-teal-green/10 dark:bg-teal-green/20 rounded-full flex items-center justify-center text-teal-green">
                 <CheckCircle className="w-6 h-6" />
               </div>
               <div>
                 <p className="text-sm font-bold text-gray-900 dark:text-white">CV Analyserat</p>
                 <p className="text-xs text-gray-500 dark:text-gray-400">Match: 94%</p>
               </div>
             </motion.div>

             {/* 4: ATS Score (Top Left) */}
             <motion.div 
               initial={{ y: -20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 1.5 }}
               className="absolute top-4 -left-6 glass p-3.5 rounded-2xl flex items-center gap-3 shadow-md animate-[bounce_6s_infinite] bg-white/90 dark:bg-dark-card/90 border border-white/50 dark:border-gray-700 z-10"
             >
               <div className="w-9 h-9 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-500">
                 <ShieldCheck className="w-5 h-5" />
               </div>
               <div>
                 <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight">ATS-Säkrad</p>
               </div>
             </motion.div>

          </div>
        </motion.div>

      </div>

      {/* --- SEAMLESS FADE TO BACKGROUND --- */}
      {/* Denna gradient matchar den nya globala bakgrunden för en osynlig kant */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#F9FAFB] via-[#F9FAFB]/80 dark:from-[#0f172a] dark:via-[#0f172a]/80 to-transparent z-0 pointer-events-none" />
      
    </div>
  );
};

export default Hero;