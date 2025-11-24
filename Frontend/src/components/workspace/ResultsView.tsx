import React, { useState } from 'react';
import { Download, Copy, Check } from 'lucide-react';
import { AnalysisResult } from '../../types';
import { MatchScore } from '../results/MatchScore';
import { ATSScore } from '../results/ATSScore';
import { SkillsAnalysis } from '../results/SkillsAnalysis';
import { Improvements } from '../results/Improvements';
import { Button } from '../common/Button';

interface ResultsViewProps {
  result: AnalysisResult;
  onReset: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ result, onReset }) => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'letter'>('analysis');
  const [copiedLetter, setCopiedLetter] = useState(false);

  const handleCopyLetter = () => {
    navigator.clipboard.writeText(result.coverLetter);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([
      `TAILOR ANALYSRAPPORT\n\nMatchningspoäng: ${result.matchScore}%\n\n${result.summary}\n\nPersonligt Brev:\n\n${result.coverLetter}`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'tailor-analys.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-200">
        <button
          onClick={() => setActiveTab('analysis')}
          className={`px-6 py-3 font-semibold border-b-2 transition-colors text-sm ${
            activeTab === 'analysis'
              ? 'border-primary text-primary'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          Analys
        </button>
        <button
          onClick={() => setActiveTab('letter')}
          className={`px-6 py-3 font-semibold border-b-2 transition-colors text-sm ${
            activeTab === 'letter'
              ? 'border-primary text-primary'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          Personligt Brev
        </button>
      </div>

      {/* Content */}
      {activeTab === 'analysis' ? (
        <div className="space-y-8">
          <MatchScore score={result.matchScore} summary={result.summary} />
          <ATSScore
            matchScore={result.matchScore}
            missingKeywords={result.keywordsMissing.length}
          />
          <SkillsAnalysis
            matchedSkills={result.keywordsFound}
            missingSkills={result.keywordsMissing}
          />
          <Improvements improvements={result.improvements} />

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-neutral-100">
            <Button onClick={handleDownload} variant="outline" className="flex-1">
              <Download size={16} />
              Spara Rapport
            </Button>
            <Button onClick={onReset} variant="outline" className="flex-1">
              Ny Analys
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200">
            <div>
              <h3 className="font-bold text-neutral-900">Ditt Personliga Brev</h3>
              <p className="text-xs text-neutral-500">Skräddarsytt för tjänsten</p>
            </div>
            <Button
              onClick={handleCopyLetter}
              size="sm"
              variant={copiedLetter ? 'outline' : 'primary'}
            >
              {copiedLetter ? (
                <>
                  <Check size={16} />
                  Kopierat!
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Kopiera text
                </>
              )}
            </Button>
          </div>

          <div className="p-8 bg-white border border-neutral-200 rounded-lg whitespace-pre-wrap font-serif text-neutral-800 leading-relaxed text-sm max-h-[600px] overflow-y-auto shadow-sm">
            {result.coverLetter}
          </div>
        </div>
      )}
    </div>
  );
};