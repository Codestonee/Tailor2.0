import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Shield, Zap, Heart } from 'lucide-react';
import Mascot from './Mascot';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="w-32 h-32 mx-auto mb-6">
           <Mascot emotion="happy" />
        </div>
        <h1 className="text-5xl font-display font-bold text-gray-900 dark:text-white mb-6">
          Om <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral to-teal-green">Tailor 2.0</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Vi bygger framtidens karriärcoach. Vårt mål är att demokratisera tillgången till professionell CV-feedback och hjälpa arbetssökande att landa sina drömjobb snabbare.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="glass p-8 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-700">
           <div className="w-12 h-12 rounded-xl bg-teal-green/10 text-teal-green flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
           </div>
           <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">AI-Driven Teknik</h3>
           <p className="text-gray-600 dark:text-gray-400">
             Vi använder Googles Gemini-modeller för att analysera språk, struktur och relevans i realtid, vilket ger dig feedback som tidigare krävde dyra konsulter.
           </p>
        </div>

        <div className="glass p-8 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-700">
           <div className="w-12 h-12 rounded-xl bg-coral/10 text-coral flex items-center justify-center mb-4">
              <Shield className="w-6 h-6" />
           </div>
           <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Integritet Först</h3>
           <p className="text-gray-600 dark:text-gray-400">
             Dina dokument sparas aldrig permanent. Vi analyserar dem i stunden och glömmer dem direkt efteråt. Din data tillhör dig.
           </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-ocean to-teal-green rounded-3xl p-10 text-white shadow-xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
               <h3 className="text-2xl font-bold mb-4">Varför Tailor?</h3>
               <ul className="space-y-3">
                  <li className="flex gap-3 items-center">
                    <CheckCircle className="w-5 h-5 text-coral" />
                    <span>Ökar chansen att klara ATS-system</span>
                  </li>
                  <li className="flex gap-3 items-center">
                    <CheckCircle className="w-5 h-5 text-coral" />
                    <span>Konkreta exempel, inte bara floskler</span>
                  </li>
                  <li className="flex gap-3 items-center">
                    <CheckCircle className="w-5 h-5 text-coral" />
                    <span>Helt gratis att testa</span>
                  </li>
               </ul>
            </div>
            <div className="text-center md:text-right">
               <div className="inline-block p-4 rounded-full bg-white/20 backdrop-blur-md mb-2">
                 <Heart className="w-8 h-8 text-white fill-current" />
               </div>
               <p className="font-bold text-lg">Skapat med passion</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default About;