import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, Copy, Sparkles, ArrowRight, Download } from 'lucide-react';
import { AnalysisResult } from '../types';
import { ATSScoreCard } from './ATSScoreCard';
import { EmailTemplates } from './EmailTemplates';

interface ResultsViewProps {
  result: AnalysisResult;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'letter' | 'emails'>('analysis');

  // Runda av poängen
  const roundedScore = Math.round(result.matchScore);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-status-success border-status-success bg-green-50';
    if (score >= 50) return 'text-status-warning border-status-warning bg-yellow-50';
    return 'text-status-error border-status-error bg-red-50';
  };

  const getBarColor = (score: number) => {
    if (score >= 80) return 'bg-status-success';
    if (score >= 50) return 'bg-status-warning';
    return 'bg-status-error';
  };

  const handleExport = () => {
    const content = `
      <html>
      <head><meta charset='utf-8'><title>Tailor CV Analys</title></head>
      <body>
        <h1>Tailor Analys</h1>
        <p>Matchningspoäng: ${roundedScore}%</p>
        <p>${result.summary}</p>
        <hr/>
        <h2>Personligt Brev</h2>
        <pre style="white-space: pre-wrap; font-family: serif;">${result.coverLetter}</pre>
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Tailor_Analys.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-card overflow-hidden h-full flex flex-col animate-in fade-in duration-700">
      
      {/* TABS */}
      <div className="border-b border-neutral-200 flex justify-between items-center px-4 bg-neutral-50/50 h-16">
        <div className="flex gap-1 overflow-x-auto no-scrollbar h-full items-end">
          <button
            onClick={() => setActiveTab('analysis')}
            className={`px-5 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'analysis' 
                ? 'border-primary text-primary bg-white rounded-t-lg' 
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Analys
          </button>
          <button
            onClick={() => setActiveTab('letter')}
            className={`px-5 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'letter' 
                ? 'border-primary text-primary bg-white rounded-t-lg' 
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Personligt Brev
          </button>
          <button
            onClick={() => setActiveTab('emails')}
            className={`px-5 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'emails' 
                ? 'border-primary text-primary bg-white rounded-t-lg' 
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Mallar
          </button>
        </div>
        
        <button
          onClick={handleExport}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 rounded-md transition-colors border border-primary/10"
        >
          <Download size={14} />
          Exportera
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-white">
        
        {/* FLIK 1: ANALYS */}
        {activeTab === 'analysis' && (
          <div className="space-y-8 max-w-3xl mx-auto">
            
            {/* 1. MATCHNINGS-KORT */}
            <div className="p-6 md:p-8 rounded-xl bg-white border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex flex-col items-center justify-center gap-2 min-w-[140px]">
                    <div className={`relative w-32 h-32 flex-shrink-0 rounded-full flex items-center justify-center border-[8px] text-4xl font-heading font-bold shadow-inner bg-white ${getScoreColor(roundedScore)}`}>
                      {roundedScore}%
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Match Score</span>
                </div>

                <div className="flex-1 w-full">
                  <h3 className="text-xl font-heading font-bold text-neutral-900 mb-2">Matchningsanalys</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed mb-6">{result.summary}</p>
                  
                  <div className="space-y-4 pt-4 border-t border-neutral-100">
                    {[
                      { label: 'Teknisk Kompetens', val: result.scoreBreakdown.technical },
                      { label: 'Erfarenhet & Relevans', val: result.scoreBreakdown.experience },
                      { label: 'Soft Skills', val: result.scoreBreakdown.softSkills }
                    ].map((item) => (
                      <div key={item.label} className="group">
                        <div className="flex justify-between text-xs mb-1.5 font-semibold tracking-wide">
                          <span className="text-neutral-500 uppercase">{item.label}</span>
                          <span className="text-neutral-900">{Math.round(item.val)}%</span>
                        </div>
                        <div className="h-2.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${getBarColor(item.val)} transition-all duration-1000 ease-out`} 
                            style={{ width: `${Math.round(item.val)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. ATS-KORT */}
            <div className="w-full">
                <ATSScoreCard 
                    matchScore={roundedScore} 
                    missingKeywordsCount={result.keywordsMissing.length} 
                />
            </div>

            {/* 3. IMPROVEMENTS (Flyttad upp!) */}
            <div className="border-t border-neutral-100 pt-8">
              <h4 className="text-neutral-900 font-heading font-bold text-lg mb-6 flex items-center gap-2">
                <div className="p-2 bg-secondary/10 rounded-lg text-secondary"><Sparkles size={20} /></div>
                Förslag till förbättring
              </h4>
              <div className="grid gap-4">
                {result.improvements.map((imp, idx) => (
                  <div key={idx} className="p-5 rounded-xl bg-white border border-neutral-200 hover:border-primary/40 hover:shadow-md transition-all duration-300 group">
                    <div className="flex gap-4">
                      <div className="mt-1 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs group-hover:bg-primary group-hover:text-white transition-colors">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-neutral-900 mb-1">{imp.description}</p>
                        <p className="text-sm text-neutral-600 leading-relaxed">{imp.suggestion}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. KEYWORDS (Flyttad ner!) */}
            <div className="grid md:grid-cols-2 gap-6 border-t border-neutral-100 pt-8">
              <div className="p-6 rounded-xl bg-green-50/40 border border-green-100 h-full">
                <h4 className="flex items-center gap-2 text-xs font-bold text-green-800 mb-4 uppercase tracking-widest">
                  <CheckCircle2 size={16} /> Matchade Nyckelord
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.keywordsFound.length > 0 ? result.keywordsFound.map(kw => (
                    <span key={kw} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white text-green-700 border border-green-200/60 shadow-sm">
                      {kw}
                    </span>
                  )) : <span className="text-xs text-green-600 italic">Inga specifika nyckelord hittades.</span>}
                </div>
              </div>
              <div className="p-6 rounded-xl bg-red-50/40 border border-red-100 h-full">
                <h4 className="flex items-center gap-2 text-xs font-bold text-red-800 mb-4 uppercase tracking-widest">
                  <AlertTriangle size={16} /> Saknas i ditt CV
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.keywordsMissing.length > 0 ? result.keywordsMissing.map(kw => (
                    <span key={kw} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white text-red-700 border border-red-200/60 shadow-sm">
                      {kw}
                    </span>
                  )) : <span className="text-xs text-green-600 font-medium">Snyggt! Inga viktiga nyckelord saknas.</span>}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ... FLIK 2 & 3 (Oförändrade) ... */}
        {activeTab === 'letter' && (
          <div className="h-full flex flex-col max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
              <div>
                  <h3 className="text-lg font-heading font-bold text-neutral-900">Ditt personliga brev</h3>
                  <p className="text-xs text-neutral-500">Skräddarsytt efter annonsen och din profil</p>
              </div>
              <button 
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-colors shadow-sm"
                onClick={() => navigator.clipboard.writeText(result.coverLetter)}
              >
                <Copy size={16} /> Kopiera text
              </button>
            </div>
            <div className="flex-1 p-8 md:p-12 bg-white border border-neutral-200 rounded-2xl font-serif text-neutral-800 text-lg leading-loose overflow-y-auto whitespace-pre-wrap shadow-sm">
              {result.coverLetter}
            </div>
          </div>
        )}

        {activeTab === 'emails' && (
           <div className="h-full max-w-3xl mx-auto">
             <div className="mb-8 text-center">
                <h3 className="text-xl font-heading font-bold text-neutral-900 mb-2">Mallar för kommunikation</h3>
                <p className="text-neutral-500">Använd dessa mallar för att följa upp din ansökan proffsigt.</p>
             </div>
             <EmailTemplates />
          </div>
        )}

      </div>
    </div>
  );
};