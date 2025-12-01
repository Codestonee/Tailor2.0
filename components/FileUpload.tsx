import React, { useCallback, useState } from 'react';
import { Upload, FileText, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { extractTextFromFile } from '../src/utils/pdfparser';

interface FileUploadProps {
  onFileLoaded: (text: string, fileName: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileLoaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const readFile = async (file: File) => {
    try {
      setError(null);
      const text = await extractTextFromFile(file);
      onFileLoaded(text, file.name);
    } catch (err) {
      setError('Kunde inte läsa filen. Försök med ett annat format.');
      console.error(err);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      readFile(e.dataTransfer.files[0]);
    }
  }, [onFileLoaded]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      readFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">Ladda upp ditt CV</h2>
        <p className="text-gray-500 dark:text-gray-400">Vi accepterar PDF eller textfiler.</p>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`
          relative border-2 border-dashed rounded-3xl p-16 text-center transition-all duration-300
          ${isDragging 
            ? 'border-ocean dark:border-coral bg-ocean/5 dark:bg-coral/10 scale-[1.02] shadow-xl' 
            : 'border-gray-300 dark:border-gray-700 hover:border-ocean/40 dark:hover:border-coral/40 bg-white/50 dark:bg-dark-card/50 hover:bg-white dark:hover:bg-dark-card shadow-sm'
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".pdf,.txt,.md"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleInputChange}
        />
        
        <div className="flex flex-col items-center pointer-events-none">
          <div className={`
            w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-300
            ${isDragging 
              ? 'bg-ocean dark:bg-coral text-white scale-110' 
              : 'bg-ocean/10 dark:bg-coral/10 text-ocean dark:text-coral'
            }
          `}>
            {isDragging ? <Check className="w-10 h-10" /> : <Upload className="w-10 h-10" />}
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Dra och släpp ditt CV här
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
            eller klicka var som helst i rutan för att välja fil från din enhet
          </p>
        </div>
      </motion.div>
      
      {error && (
        <p className="mt-4 text-red-500 text-sm text-center font-medium bg-red-50 dark:bg-red-900/20 py-2 rounded-lg">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;