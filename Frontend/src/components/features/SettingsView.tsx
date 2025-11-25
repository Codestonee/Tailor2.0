import React, { useState } from 'react';
import { Settings, Volume2, Globe } from 'lucide-react';
import { Button } from '../common/Button';

export const SettingsView: React.FC = () => {
  const [preferences, setPreferences] = useState({
    darkMode: false,
    notifications: true,
    autoSave: true,
    language: 'sv',
  });

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleLanguageChange = (lang: string) => {
    setPreferences(prev => ({
      ...prev,
      language: lang,
    }));
  };

  const handleSave = () => {
    localStorage.setItem('tailor_preferences', JSON.stringify(preferences));
    alert('Inställningar sparade!');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-white rounded-xl border border-neutral-200 p-8 shadow-sm">
        <h2 className="text-xl font-heading font-bold text-neutral-900 mb-8 flex items-center gap-3">
          <Settings size={24} className="text-neutral-400" />
          Inställningar
        </h2>

        {/* Language */}
        <div className="mb-8 pb-8 border-b border-neutral-100">
          <label className="text-sm font-bold text-neutral-900 block mb-4 flex items-center gap-2">
            <Globe size={16} className="text-neutral-500" /> Språk
          </label>
          <div className="flex gap-3">
            {[
              { code: 'sv', label: 'Svenska' },
              { code: 'en', label: 'English' },
            ].map(lang => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  preferences.language === lang.code
                    ? 'bg-neutral-900 text-white shadow-md'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="mb-8 pb-8 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-neutral-100 rounded-lg">
                <Volume2 size={20} className="text-neutral-600" />
            </div>
            <div>
              <p className="font-semibold text-neutral-900 text-sm">Aviseringar</p>
              <p className="text-xs text-neutral-500 mt-0.5">Få notiser när analysen är klar</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.notifications}
              onChange={() => handleToggle('notifications')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
          </label>
        </div>

        {/* Auto Save */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="font-semibold text-neutral-900 text-sm">Spara automatiskt</p>
            <p className="text-xs text-neutral-500 mt-0.5">Spara alla analyser i webbläsaren</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.autoSave}
              onChange={() => handleToggle('autoSave')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
          </label>
        </div>

        {/* Save Button */}
        <Button onClick={handleSave} className="w-full mt-4">
          Spara ändringar
        </Button>
      </div>
    </div>
  );
};