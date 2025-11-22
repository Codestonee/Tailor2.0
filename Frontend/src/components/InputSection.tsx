import React, { useState } from 'react';
import { UploadCloud, FileText, X, Search, Type, Briefcase, CheckCircle2, MapPin } from 'lucide-react';
import { AnalysisRequest, JobResult } from '../types';
import { searchJobs } from '../lib/api';

interface InputSectionProps {
  data: Partial<AnalysisRequest>;
  onChange: (updates: Partial<AnalysisRequest>) => void;
  disabled: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ data, onChange, disabled }) => {
  const [mode, setMode] = useState<'search' | 'paste'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<JobResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false); // Ny state för att veta om vi sökt

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) onChange({ cvFile: e.target.files[0] });
  };
  const removeFile = () => onChange({ cvFile: undefined });
  
  const performSearch = async () => {
    // Tillåt sökning om antingen query ELLER location är ifyllt
    if (!searchQuery && !searchLocation) return;
      
      setIsSearching(true);
      setHasSearched(true); // Markera att vi har gjort ett försök
      setSearchResults([]); // Rensa gamla resultat
      
      try {
        const results = await searchJobs(searchQuery, searchLocation);
        setSearchResults(results);
      } catch (error) {
        console.error("Sökfel:", error);
      } finally {
        setIsSearching(false);
      }
  };

  const selectJob = (job: JobResult) => onChange({ jobDescription: job.description, selectedJob: job });
  const clearSelectedJob = () => onChange({ jobDescription: '', selectedJob: undefined });

  // Style classes
  const cardClass = "bg-neutral-50 p-5 rounded-brand border border-neutral-200 transition-all duration-300 hover:border-primary/50 hover:shadow-md group relative overflow-hidden";
  const labelClass = "text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3 flex items-center justify-between font-heading";

  return (
    <div className="space-y-5">
      
      {/* 1. CV UPLOAD */}
      <div className={cardClass}>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className={labelClass}>
          <span>1. Ditt CV</span>
          {data.cvFile && <CheckCircle2 className="w-4 h-4 text-status-success" />}
        </div>
        
        {!data.cvFile ? (
          <label className={`
            flex flex-col items-center justify-center w-full h-28 
            border-2 border-dashed rounded-brand cursor-pointer transition-all duration-200
            ${disabled ? 'bg-neutral-100 border-neutral-300' : 'bg-white border-neutral-300 hover:border-primary hover:bg-primary-light/20'}
          `}>
            <div className="flex flex-col items-center justify-center pt-4 pb-4 text-center">
              <UploadCloud className="w-6 h-6 text-neutral-300 mb-2 group-hover:text-primary transition-colors" />
              <p className="text-xs font-semibold text-neutral-500 group-hover:text-primary uppercase tracking-wide">Klicka för PDF</p>
            </div>
            <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} disabled={disabled} />
          </label>
        ) : (
          <div className="flex items-center justify-between p-3 bg-white border border-primary/30 rounded-brand shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-light/30 rounded text-primary">
                <FileText className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-neutral-900 truncate max-w-[180px]">{data.cvFile.name}</p>
                <p className="text-[10px] text-neutral-500 font-medium">{(data.cvFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button onClick={removeFile} disabled={disabled} className="p-1.5 hover:bg-neutral-100 rounded text-neutral-400 hover:text-status-error transition-colors">
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {/* 2. JOB DESCRIPTION */}
      <div className={cardClass}>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className={labelClass}>
          <span>2. Jobbannons</span>
          <div className="flex bg-neutral-200/50 p-0.5 rounded-md">
             <button onClick={() => setMode('search')} className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-sm transition-all ${mode === 'search' ? 'bg-white text-primary shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}>Sök</button>
             <button onClick={() => setMode('paste')} className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-sm transition-all ${mode === 'paste' ? 'bg-white text-primary shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}>Text</button>
          </div>
        </div>

        {data.selectedJob ? (
          <div className="p-4 bg-white border border-primary/30 rounded-brand relative shadow-sm">
            <button onClick={clearSelectedJob} className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-900 p-1 hover:bg-neutral-50 rounded transition-colors">
              <X size={14} />
            </button>
            <h4 className="text-neutral-900 font-heading font-semibold flex items-center gap-2 mb-1 text-sm">
              <Briefcase size={14} className="text-primary" /> {data.selectedJob.title}
            </h4>
            <p className="text-xs text-neutral-500 font-medium uppercase tracking-wide">{data.selectedJob.company} • {data.selectedJob.location}</p>
          </div>
        ) : mode === 'search' ? (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input type="text" placeholder="T.ex. Systemutvecklare" className="flex-1 bg-white border border-neutral-300 focus:border-primary focus:ring-1 focus:ring-primary rounded-brand px-3 py-2 text-sm outline-none transition-all" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && performSearch()} />
              <button onClick={performSearch} disabled={isSearching || !searchQuery} className="bg-neutral-800 text-white px-3 rounded-brand hover:bg-neutral-900 transition-colors"><Search size={16} /></button>
            </div>
            
            {/* RESULTAT-LISTA MED FEEDBACK */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar min-h-[20px]">
                
                {/* LADDAR... */}
                {isSearching && (
                    <div className="text-center py-6">
                        <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                        <p className="text-xs text-neutral-400 font-medium">Söker i Platsbanken...</p>
                    </div>
                )}

                {/* INGA TRÄFFAR */}
                {!isSearching && hasSearched && searchResults.length === 0 && (
                    <div className="text-center py-6 text-neutral-400">
                        <p className="text-xs font-medium">Inga jobb hittades.</p>
                        <p className="text-[10px] mt-1">Prova att söka på en annan titel eller ort.</p>
                    </div>
                )}

                {/* LISTA MED JOBB */}
                {!isSearching && searchResults.map((job) => (
                    <div key={job.id} onClick={() => selectJob(job)} className="p-3 bg-white border border-neutral-200 rounded-brand hover:border-primary cursor-pointer transition-all group/item hover:shadow-sm">
                        <h5 className="text-sm font-semibold text-neutral-800 group-hover/item:text-primary line-clamp-1">{job.title}</h5>
                        <div className="flex justify-between mt-1 text-xs text-neutral-500 font-medium">
                            <span>{job.company}</span>
                            <span className="flex items-center gap-1"><MapPin size={10} /> {job.location}</span>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        ) : (
          <textarea value={data.jobDescription || ''} onChange={(e) => onChange({ jobDescription: e.target.value, selectedJob: undefined })} disabled={disabled} placeholder="Klistra in texten här..." className="w-full h-28 bg-white border border-neutral-300 focus:border-primary focus:ring-1 focus:ring-primary rounded-brand p-3 text-sm resize-none outline-none transition-all" />
        )}
      </div>
    </div>
  );
};