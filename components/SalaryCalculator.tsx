import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, MapPin, Briefcase, TrendingUp, AlertCircle, CheckCircle, Search } from 'lucide-react';
import { estimateSalary } from '../services/geminiService';
import { SalaryEstimation } from '../types';
import Mascot from './Mascot';

const SalaryCalculator: React.FC = () => {
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('Stockholm');
  const [experience, setExperience] = useState('Junior (0-2 år)');
  const [result, setResult] = useState<SalaryEstimation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCalculate = async () => {
    if (!role.trim()) return;
    setIsLoading(true);
    try {
      const data = await estimateSalary(role, location, experience);
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const getGraphPositions = () => {
    if (!result) return { left: '0%', width: '0%', median: '0%' };
    
    const { low, median, high } = result.range;
    const minDisplay = low * 0.8;
    const maxDisplay = high * 1.2;
    const totalSpan = maxDisplay - minDisplay;

    const lowPercent = ((low - minDisplay) / totalSpan) * 100;
    const highPercent = ((high - minDisplay) / totalSpan) * 100;
    const medianPercent = ((median - minDisplay) / totalSpan) * 100;

    return {
      left: `${lowPercent}%`,
      width: `${highPercent - lowPercent}%`,
      median: `${medianPercent}%`
    };
  };

  const graphPos = getGraphPositions();

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">Lönestatistik & Kalkylator</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Förbered dig inför löneförhandlingen med AI-driven data anpassad för din roll, erfarenhet och geografiska plats.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-5 space-y-6">
          <div className="glass p-8 rounded-2xl shadow-soft bg-white/60 dark:bg-dark-card/60">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Yrkestitel</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="T.ex. Systemutvecklare"
                    className="w-full pl-10 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg focus:ring-2 focus:ring-ocean/20 dark:focus:ring-coral/20 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Ort</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="T.ex. Göteborg"
                    className="w-full pl-10 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg focus:ring-2 focus:ring-ocean/20 dark:focus:ring-coral/20 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Erfarenhet</label>
                <select 
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg focus:ring-2 focus:ring-ocean/20 dark:focus:ring-coral/20 outline-none"
                >
                  <option>Junior (0-2 år)</option>
                  <option>Mid-level (3-5 år)</option>
                  <option>Senior (5-10 år)</option>
                  <option>Expert (10+ år)</option>
                </select>
              </div>

              <button
                onClick={handleCalculate}
                disabled={isLoading || !role}
                // HÄR ÄR ÄNDRINGEN FÖR KNAPPEN
                className="w-full mt-4 bg-ocean dark:bg-coral text-white py-3 rounded-xl font-bold shadow-lg hover:opacity-90 disabled:opacity-50 transition-all flex justify-center items-center gap-2"
              >
                {isLoading ? (
                  <>Analyserar...</>
                ) : (
                  <><Search className="w-4 h-4" /> Beräkna Lön</>
                )}
              </button>
            </div>
          </div>
          
          <div className="hidden md:flex justify-center">
             <div className="w-32 h-32 opacity-80">
                <Mascot emotion={isLoading ? 'thinking' : 'idle'} />
             </div>
          </div>
        </div>

        <div className="md:col-span-7">
          {result ? (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="glass p-8 rounded-2xl bg-white dark:bg-dark-card border-t-4 border-ocean dark:border-coral shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-ocean dark:text-coral" /> 
                  Uppskattad Månadslön
                </h3>
                
                <div className="flex items-end justify-between mb-2">
                  <span className="text-sm text-gray-500">Låg</span>
                  <span className="text-sm font-bold text-ocean dark:text-coral">Median</span>
                  <span className="text-sm text-gray-500">Hög</span>
                </div>
                
                <div className="relative h-10 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 overflow-hidden border border-gray-200 dark:border-gray-700">
                   <motion.div 
                     initial={{ width: 0, opacity: 0 }}
                     animate={{ width: graphPos.width, opacity: 1 }}
                     transition={{ duration: 1, ease: "easeOut" }}
                     className="absolute top-2 bottom-2 bg-ocean/20 dark:bg-coral/30 rounded-md border border-ocean/30 dark:border-coral/30" 
                     style={{ left: graphPos.left }}
                   />
                   
                   <motion.div 
                      initial={{ left: '0%' }}
                      animate={{ left: graphPos.median }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                      className="absolute top-0 bottom-0 w-1 bg-ocean dark:bg-coral z-10 shadow-sm"
                   >
                     <div className="absolute -top-1 -left-1.5 w-4 h-4 bg-ocean dark:bg-coral rounded-full border-2 border-white dark:border-gray-800" />
                   </motion.div>
                </div>
                
                <div className="flex justify-between font-mono text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span>{result.range.low.toLocaleString()} kr</span>
                  <span className="text-ocean dark:text-coral font-bold text-lg transform -translate-y-1">{result.range.median.toLocaleString()} kr</span>
                  <span>{result.range.high.toLocaleString()} kr</span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                 <div className="glass p-6 rounded-2xl bg-white/60 dark:bg-dark-card/60">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                       <TrendingUp className="w-4 h-4 text-coral" /> Förhandlingstips
                    </h4>
                    <ul className="space-y-2">
                       {result.tips.slice(0, 3).map((tip, i) => (
                         <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex gap-2 items-start">
                           <CheckCircle className="w-4 h-4 text-teal-green flex-shrink-0 mt-0.5" />
                           {tip}
                         </li>
                       ))}
                    </ul>
                 </div>

                 <div className="glass p-6 rounded-2xl bg-white/60 dark:bg-dark-card/60">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                       <AlertCircle className="w-4 h-4 text-ocean" /> Påverkande Faktorer
                    </h4>
                    <div className="flex flex-wrap gap-2">
                       {result.factors.map((factor, i) => (
                         <span key={i} className="px-2 py-1 bg-ocean/10 text-ocean dark:text-teal-green text-xs font-bold rounded-lg border border-ocean/20">
                           {factor}
                         </span>
                       ))}
                    </div>
                 </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 glass rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 border-2 border-dashed border-gray-200 dark:border-gray-700">
               <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <DollarSign className="w-8 h-8 text-gray-400" />
               </div>
               <h3 className="text-lg font-bold text-gray-900 dark:text-white">Ingen data än</h3>
               <p className="text-gray-500 dark:text-gray-400 font-medium max-w-xs">
                 Fyll i formuläret för att se hur din lön står sig mot marknaden.
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalaryCalculator;