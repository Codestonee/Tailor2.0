import React, { useState, useEffect } from 'react';
import { Activity, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';

interface SystemStatus {
  backend: 'operational' | 'error' | 'checking';
  database: 'operational' | 'error' | 'checking';
  gemini: 'operational' | 'error' | 'checking';
  timestamp: number;
}

export const AdminPanel: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus>({
    backend: 'checking',
    database: 'checking',
    gemini: 'checking',
    timestamp: Date.now(),
  });
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/health');
      if (response.ok) {
        setStatus({
          backend: 'operational',
          database: 'operational',
          gemini: 'operational',
          timestamp: Date.now(),
        });
      } else {
        setStatus({
          backend: 'error',
          database: 'error',
          gemini: 'error',
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      setStatus({
        backend: 'error',
        database: 'error',
        gemini: 'error',
        timestamp: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const getIcon = (status: string) => {
    if (status === 'operational') {
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    }
    return <AlertCircle className="w-5 h-5 text-red-600" />;
  };

  const services = [
    { name: 'Backend API', key: 'backend' as const },
    { name: 'Database', key: 'database' as const },
    { name: 'Gemini AI', key: 'gemini' as const },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
            <Activity size={24} />
            System Status
          </h2>
          <Button
            onClick={checkStatus}
            loading={loading}
            size="sm"
            variant="outline"
          >
            Refresh
          </Button>
        </div>

        <div className="space-y-3">
          {services.map(service => (
            <div
              key={service.key}
              className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200"
            >
              <div className="flex items-center gap-3">
                {getIcon(status[service.key])}
                <span className="font-medium text-neutral-900">{service.name}</span>
              </div>
              <span
                className={`text-sm font-semibold uppercase tracking-wider ${
                  status[service.key] === 'operational'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {status[service.key]}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
          <p className="text-xs text-neutral-500">
            Last checked: {new Date(status.timestamp).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};