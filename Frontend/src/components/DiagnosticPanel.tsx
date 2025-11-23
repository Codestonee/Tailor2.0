import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, XCircle, Activity, Terminal, Bug } from 'lucide-react';

interface DiagnosticResult {
  status: 'success' | 'error' | 'running' | 'idle';
  message: string;
  details?: any;
}

interface DiagnosticPanelProps {
  cvFile?: File;
}

export const DiagnosticPanel: React.FC<DiagnosticPanelProps> = ({ cvFile }) => {
  const [results, setResults] = useState<{
    backend: DiagnosticResult;
    ai: DiagnosticResult;
    pdf: DiagnosticResult;
  }>({
    backend: { status: 'idle', message: 'Väntar på test...' },
    ai: { status: 'idle', message: 'Väntar på test...' },
    pdf: { status: 'idle', message: 'Väntar på test...' }
  });

  const [isOpen, setIsOpen] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const testBackend = async () => {
    setResults(prev => ({ ...prev, backend: { status: 'running', message: 'Ansluter...' } }));
    
    try {
      const response = await fetch(`${API_URL}/`);
      const data = await response.json();
      
      setResults(prev => ({
        ...prev,
        backend: {
          status: 'success',
          message: `Online: ${data.model}`,
          details: data
        }
      }));
      return true;
    } catch (error) {
      setResults(prev => ({
        ...prev,
        backend: {
          status: 'error',
          message: 'Ingen kontakt med servern',
          details: error
        }
      }));
      return false;
    }
  };

  const testAI = async () => {
    setResults(prev => ({ ...prev, ai: { status: 'running', message: 'Kör AI-analys...' } }));
    
    try {
      // Vi använder en endpoint om den finns, annars simulerar vi
      // (Här antar vi att du har en /test-ai-scoring endpoint, annars får vi fel)
      const response = await fetch(`${API_URL}/test-ai-scoring`);
      if (!response.ok) throw new Error("Endpoint saknas");

      const data = await response.json();
      
      const isSuccess = data.test_status === 'success' && data.score >= 70;

      setResults(prev => ({
        ...prev,
        ai: {
          status: isSuccess ? 'success' : 'error',
          message: isSuccess ? `Score: ${data.score}/100` : `Låg score: ${data.score}`,
          details: data
        }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        ai: {
          status: 'error',
          message: 'AI-test misslyckades',
          details: error
        }
      }));
    }
  };

  const testPDF = async () => {
    if (!cvFile) {
      setResults(prev => ({ ...prev, pdf: { status: 'error', message: 'Inget CV valt' } }));
      return;
    }

    setResults(prev => ({ ...prev, pdf: { status: 'running', message: `Läser ${cvFile.name}...` } }));
    
    try {
      const formData = new FormData();
      formData.append('file', cvFile);
      formData.append('job_description', 'Test Job Description');
      formData.append('language', 'sv');

      const response = await fetch(`${API_URL}/debug-full-analysis`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Kunde inte analysera PDF');

      const data = await response.json();
      const isGood = data.cv_length > 500;

      setResults(prev => ({
        ...prev,
        pdf: {
          status: isGood ? 'success' : 'error',
          message: isGood ? `${data.cv_length} tecken extraherade` : 'För lite text hittades',
          details: data
        }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        pdf: {
          status: 'error',
          message: 'Kunde inte läsa PDF',
          details: error
        }
      }));
    }
  };

  const runAllTests = async () => {
    const backendOk = await testBackend();
    if (backendOk) {
        setTimeout(() => testAI(), 500);
        if (cvFile) setTimeout(() => testPDF(), 1500);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-status-success" />;
      case 'error': return <XCircle className="w-4 h-4 text-status-error" />;
      case 'running': return <Activity className="w-4 h-4 text-primary animate-spin" />;
      default: return <AlertCircle className="w-4 h-4 text-neutral-300" />;
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-neutral-900 text-white p-3 rounded-full shadow-lg hover:bg-neutral-800 transition-all z-50 hover:scale-110 group"
        title="Öppna Diagnostik"
      >
        <Bug className="w-5 h-5 group-hover:text-secondary transition-colors" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white border border-neutral-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
      
      {/* Header */}
      <div className="bg-neutral-900 text-white px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-secondary" />
            <h3 className="text-sm font-bold tracking-wide uppercase">Systemdiagnostik</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-white transition-colors">✕</button>
      </div>

      <div className="p-4 space-y-3 bg-neutral-50">
        
        {/* Test Items */}
        {[
            { label: 'Backend API', res: results.backend, action: testBackend },
            { label: 'AI Intelligence', res: results.ai, action: testAI },
            { label: 'PDF Extraction', res: results.pdf, action: testPDF }
        ].map((item, idx) => (
            <div key={idx} className="bg-white p-3 rounded-lg border border-neutral-200 shadow-sm flex items-center justify-between group">
                <div className="flex items-center gap-3">
                    {getStatusIcon(item.res.status)}
                    <div>
                        <p className="text-xs font-bold text-neutral-700">{item.label}</p>
                        <p className="text-[10px] text-neutral-500">{item.res.message}</p>
                    </div>
                </div>
                <button 
                    onClick={item.action}
                    disabled={item.res.status === 'running'}
                    className="text-[10px] bg-neutral-100 hover:bg-neutral-200 text-neutral-600 px-2 py-1 rounded font-medium transition-colors"
                >
                    Kör
                </button>
            </div>
        ))}

        {/* Main Action */}
        <button
          onClick={runAllTests}
          className="w-full mt-2 bg-primary text-white py-2 rounded-lg font-bold text-xs hover:bg-primary-hover transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <Activity className="w-3 h-3" /> Kör Fullständig Diagnos
        </button>

        {/* JSON Output */}
        {(results.ai.details || results.pdf.details) && (
            <div className="mt-2 pt-2 border-t border-neutral-200">
                <p className="text-[10px] font-bold text-neutral-400 mb-1 uppercase">Debug Data</p>
                <pre className="bg-neutral-900 text-green-400 p-2 rounded text-[9px] overflow-auto max-h-32 font-mono">
                    {JSON.stringify({ ai: results.ai.details, pdf: results.pdf.details }, null, 2)}
                </pre>
            </div>
        )}
      </div>
    </div>
  );
};