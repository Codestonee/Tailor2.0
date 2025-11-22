import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, Copy, Sparkles, ArrowRight, Download, FileText } from 'lucide-react';
import { AnalysisResult } from '../types';

interface ResultsViewProps {
  result: AnalysisResult;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'letter'>('analysis');

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400 border-green-500/50 bg-green-900/20';
    if (score >= 50) return 'text-yellow-400 border-yellow-500/50 bg-yellow-900/20';
    return 'text-red-400 border-red-500/50 bg-red-900/20';
  };

  const getBarColor = (score: number) => {
    if (score >= 80) return 'bg-gradient-to-r from-green-500 to-emerald-400';
    if (score >= 50) return 'bg-gradient-to-r from-yellow-500 to-amber-400';
    return 'bg-gradient-to-r from-red-500 to-rose-400';
  };

  const handleExport = () => {
    // Enhanced HTML template for Word export with styling and Score Breakdown
    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Tailor CV Analysis</title>
        <style>
          body { font-family: 'Calibri', 'Segoe UI', Helvetica, sans-serif; line-height: 1.5; color: #111827; }
          .header { border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-bottom: 24px; }
          h1 { color: #1e40af; margin: 0; font-size: 24px; }
          h2 { color: #1f2937; font-size: 18px; margin-top: 24px; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; }
          h3 { color: #374151; font-size: 16px; margin-top: 16px; }
          
          .score-card { background-color: #eff6ff; padding: 16px; border: 1px solid #dbeafe; border-radius: 8px; margin-bottom: 20px; }
          .score-large { font-size: 32px; font-weight: bold; color: #1d4ed8; }
          
          .breakdown-table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          .breakdown-table td { padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
          .breakdown-label { font-weight: bold; color: #4b5563; }
          .breakdown-value { text-align: right; font-family: monospace; }
          
          .improvements-list { margin-top: 10px; }
          .improvements-list li { margin-bottom: 12px; }
          .imp-desc { font-weight: bold; color: #b91c1c; }
          
          .letter-container { background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 24px; border-radius: 8px; font-family: 'Times New Roman', serif; white-space: pre-wrap; margin-top: 16px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Tailor 2.0 - Application Analysis</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="score-card">
          <div>Overall Match Score</div>
          <div class="score-large">${result.matchScore}%</div>
          <p>${result.summary}</p>
          
          <h3>Detailed Breakdown</h3>
          <table class="breakdown-table">
            <tr>
              <td class="breakdown-label">Technical Skills</td>
              <td class="breakdown-value">${result.scoreBreakdown.technical}%</td>
            </tr>
            <tr>
              <td class="breakdown-label">Experience Relevance</td>
              <td class="breakdown-value">${result.scoreBreakdown.experience}%</td>
            </tr>
            <tr>
              <td class="breakdown-label">Soft Skills</td>
              <td class="breakdown-value">${result.scoreBreakdown.softSkills}%</td>
            </tr>
          </table>
        </div>
        
        <h2>Suggested Improvements</h2>
        <ul class="improvements-list">
          ${result.improvements.map(imp => `
            <li>
              <div class="imp-desc">${imp.description}</div>
              <div>${imp.suggestion}</div>
            </li>
          `).join('')}
        </ul>

        <h2>Cover Letter</h2>
        <div class="letter-container">
          ${result.coverLetter.replace(/\n/g, '<br/>')}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', content], {
      type: 'application/msword'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Tailor_Analysis_Export.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="border-b border-gray-800 flex justify-between items-center pr-4">
        <div className="flex flex-1">
          <button
            onClick={() => setActiveTab('analysis')}
            className={`flex-1 py-4 text-sm font-medium text-center transition-colors border-b-2 ${
              activeTab === 'analysis' 
                ? 'border-blue-500 text-blue-400 bg-blue-900/10' 
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            Analysis & Improvements
          </button>
          <button
            onClick={() => setActiveTab('letter')}
            className={`flex-1 py-4 text-sm font-medium text-center transition-colors border-b-2 ${
              activeTab === 'letter' 
                ? 'border-blue-500 text-blue-400 bg-blue-900/10' 
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            Cover Letter
          </button>
        </div>
        <button
          onClick={handleExport}
          className="ml-4 flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-200 bg-blue-900/40 hover:bg-blue-900/60 border border-blue-800/50 rounded-md transition-colors"
          title="Export Analysis & Letter to Word"
        >
          <Download size={14} />
          Export .doc
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'analysis' ? (
          <div className="space-y-6">
            {/* Score Section */}
            <div className="p-6 rounded-xl bg-gray-950 border border-gray-800 space-y-6">
              <div className="flex items-center gap-6">
                <div className={`relative w-24 h-24 flex-shrink-0 rounded-full flex items-center justify-center border-4 text-2xl font-bold shadow-[0_0_15px_rgba(0,0,0,0.3)] ${getScoreColor(result.matchScore).split(' ')[0]} ${getScoreColor(result.matchScore).split(' ')[1]}`}>
                  {result.matchScore}%
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">Match Analysis</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{result.summary}</p>
                </div>
              </div>
              
              {/* Score Breakdown */}
              <div className="pt-5 border-t border-gray-800 grid grid-cols-3 gap-8">
                {[
                  { label: 'Technical', val: result.scoreBreakdown.technical },
                  { label: 'Experience', val: result.scoreBreakdown.experience },
                  { label: 'Soft Skills', val: result.scoreBreakdown.softSkills }
                ].map((item) => (
                  <div key={item.label} className="group">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-gray-400 font-medium">{item.label}</span>
                      <span className={`${item.val >= 80 ? 'text-green-400' : item.val >= 50 ? 'text-yellow-400' : 'text-red-400'} font-bold`}>
                        {item.val}%
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-gray-800 rounded-full overflow-hidden ring-1 ring-gray-800">
                      <div 
                        className={`h-full rounded-full ${getBarColor(item.val)} transition-all duration-700 ease-out group-hover:brightness-110 shadow-[0_0_10px_rgba(0,0,0,0.2)]`} 
                        style={{ width: `${item.val}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Keywords Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-green-900/10 border border-green-900/30">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-green-400 mb-3">
                  <CheckCircle2 size={16} /> Matched Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.keywordsFound.map(kw => (
                    <span key={kw} className="px-2.5 py-1 text-xs font-medium rounded-md bg-green-900/40 text-green-200 border border-green-800/50 shadow-sm">{kw}</span>
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-red-900/10 border border-red-900/30">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-red-400 mb-3">
                  <AlertTriangle size={16} /> Missing Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.keywordsMissing.map(kw => (
                    <span key={kw} className="px-2.5 py-1 text-xs font-medium rounded-md bg-red-900/40 text-red-200 border border-red-800/50 shadow-sm">{kw}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Improvements */}
            <div>
              <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                <Sparkles className="text-yellow-500" size={18} />
                Suggested Improvements
              </h4>
              <div className="space-y-3">
                {result.improvements.map((imp, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-gray-800/40 border border-gray-800 hover:border-gray-700 hover:bg-gray-800/60 transition-all duration-200">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-1.5 rounded bg-blue-500/10 text-blue-400 shrink-0">
                        <ArrowRight size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-200 mb-1">{imp.description}</p>
                        <p className="text-sm text-gray-400 leading-relaxed">{imp.suggestion}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Generated Cover Letter</h3>
              <div className="flex gap-2">
                <button 
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
                  onClick={() => navigator.clipboard.writeText(result.coverLetter)}
                >
                  <Copy size={14} />
                  Copy Text
                </button>
              </div>
            </div>
            <div className="flex-1 p-8 bg-white text-gray-900 rounded-lg font-serif text-sm leading-7 overflow-y-auto whitespace-pre-wrap shadow-inner border border-gray-300">
              {result.coverLetter}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};