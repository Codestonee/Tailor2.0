import React, { useState, useEffect } from 'react';
import { Trash2, Eye } from 'lucide-react';
import { storageService } from '../../services/storage';
import { Button } from '../common/Button';

interface AnalysisRecord {
  id: string;
  timestamp: number;
  cvName: string;
  jobTitle: string;
  score: number;
  result: any;
}

export const HistoryView: React.FC = () => {
  const [history, setHistory] = useState<AnalysisRecord[]>([]);

  useEffect(() => {
    const records = storageService.getHistory();
    setHistory(records);
  }, []);

  const handleDelete = (id: string) => {
    storageService.deleteAnalysis(id);
    setHistory(history.filter(r => r.id !== id));
  };

  const handleClearAll = () => {
    if (confirm('Är du säker? Detta tar bort all historik.')) {
      storageService.clearHistory();
      setHistory([]);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-blue-600 bg-blue-50';
    if (score >= 40) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500 font-medium">Ingen historik än.</p>
        <p className="text-sm text-neutral-400 mt-1">Dina analyser sparas här automatiskt.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-heading font-bold text-neutral-900">Analyshistorik</h2>
        {history.length > 0 && (
          <Button
            onClick={handleClearAll}
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            Rensa allt
          </Button>
        )}
      </div>

      <div className="overflow-x-auto bg-white rounded-xl border border-neutral-200 shadow-sm">
        <table className="w-full">
          <thead className="bg-neutral-50">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-neutral-600 text-xs uppercase tracking-wider">CV Fil</th>
              <th className="text-left py-3 px-4 font-semibold text-neutral-600 text-xs uppercase tracking-wider">Tjänst</th>
              <th className="text-left py-3 px-4 font-semibold text-neutral-600 text-xs uppercase tracking-wider">Poäng</th>
              <th className="text-left py-3 px-4 font-semibold text-neutral-600 text-xs uppercase tracking-wider">Datum</th>
              <th className="text-right py-3 px-4 font-semibold text-neutral-600 text-xs uppercase tracking-wider">Åtgärd</th>
            </tr>
          </thead>
          <tbody>
            {history.map((record) => (
              <tr key={record.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors last:border-0">
                <td className="py-3 px-4 text-sm text-neutral-900 font-medium truncate max-w-[150px]">
                  {record.cvName}
                </td>
                <td className="py-3 px-4 text-sm text-neutral-600 truncate max-w-[150px]">{record.jobTitle}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${getScoreColor(record.score)}`}>
                    {record.score}%
                  </span>
                </td>
                <td className="py-3 px-4 text-xs text-neutral-500">
                  {formatDate(record.timestamp)}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-1.5 hover:bg-neutral-200 rounded transition-colors text-neutral-500">
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="p-1.5 hover:bg-red-100 rounded transition-colors text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};