import React, { useState } from 'react';
import { UploadCloud, FileText, X, Search, MapPin } from 'lucide-react';
import { AnalysisRequest, JobResult } from '../../types';
import { api } from '../../lib/api';
import { Button } from '../common/button';

interface InputSectionProps {
  data: Partial<AnalysisRequest>;
  onChange: (updates: Partial<AnalysisRequest>) => void;
  disabled: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ data, onChange, disabled }) => {
  const [mode, setMode] = useState<'search' | 'paste'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<JobResult[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) onChange({ cvFile: e.target.files[0] });
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    setIsSearching(true);
    try {
      const jobs = await api.searchJobs(searchQuery);
      setSearchResults(jobs);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* CV Upload */}
      <div className="relative overflow-hidden group border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center hover:border-primary transition-all duration-300 bg-neutral-50/50 hover:bg-primary/5 cursor-pointer">
        
        {!data.cvFile ? (
          <label className="cursor-pointer block w-full h-full">
            <div className="relative z-10">
                <div className="w-14 h-14 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-6 h-6 text-neutral-400 group-hover:text-primary transition-colors" />
                </div>
                <p className="font-semibold text-neutral-700 mb-1 group-hover:text-primary transition-colors">Klicka för att ladda upp CV</p>
                <p className="text-xs text-neutral-500 font-medium uppercase tracking-wide">Endast PDF, max 10MB</p>
            </div>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              disabled={disabled}
              className="hidden"
            />
          </label>
        ) : (
          <div className="flex items-center justify-between p-4 bg-white border border-primary/20 rounded-lg shadow-sm relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                <FileText className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-neutral-900 truncate max-w-[180px]">{data.cvFile.name}</p>
                <p className="text-xs text-neutral-500 font-medium">{(data.cvFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button
              onClick={(e) => { e.preventDefault(); onChange({ cvFile: undefined }); }}
              className="p-2 hover:bg-red-50 text-neutral-400 hover:text-red-500 rounded-lg transition-all"
              title="Ta bort fil"
            >
              <X size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Job Description */}
      <div>
        <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-bold text-neutral-700 uppercase tracking-wide">Jobbannons</label>
            <div className="flex bg-neutral-100 p-1 rounded-lg">
                <button
                    onClick={() => setMode('search')}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    mode === 'search' ? 'bg-white text-primary shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
                    }`}
                >
                    Sök
                </button>
                <button
                    onClick={() => setMode('paste')}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    mode === 'paste' ? 'bg-white text-primary shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
                    }`}
                >
                    Klistra in
                </button>
            </div>
        </div>

        {mode === 'search' ? (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="T.ex. Systemutvecklare Stockholm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
              />
              <Button onClick={handleSearch} loading={isSearching} size="md">
                <Search size={18} />
              </Button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 custom-scrollbar pr-1">
                {searchResults.length > 0 && searchResults.map((job) => (
                <div
                    key={job.id}
                    onClick={() => onChange({ jobDescription: job.description, selectedJob: job })}
                    className="p-3 border border-neutral-200 rounded-lg hover:border-primary cursor-pointer transition-all hover:shadow-md group bg-white"
                >
                    <h4 className="font-semibold text-neutral-900 group-hover:text-primary transition-colors text-sm">{job.title}</h4>
                    <div className="flex justify-between text-xs text-neutral-500 mt-1.5 font-medium">
                    <span>{job.company}</span>
                    <span className="flex items-center gap-1">
                        <MapPin size={10} /> {job.location}
                    </span>
                    </div>
                </div>
                ))}
                {!isSearching && searchResults.length === 0 && searchQuery && (
                    <div className="text-center py-6">
                        <p className="text-sm text-neutral-400">Inga jobb hittades.</p>
                    </div>
                )}
            </div>
          </div>
        ) : (
          <textarea
            value={data.jobDescription || ''}
            onChange={(e) => onChange({ jobDescription: e.target.value })}
            placeholder="Klistra in texten från jobbannonsen här..."
            className="w-full h-40 p-4 border border-neutral-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none transition-all shadow-sm text-sm leading-relaxed"
          />
        )}
      </div>
    </div>
  );
};