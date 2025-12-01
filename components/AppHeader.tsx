import React from 'react';
import { AppStage, AppView } from '../types';
import { Moon, Sun, Home, Briefcase, DollarSign, Info, Trophy, Flame } from 'lucide-react';

interface AppHeaderProps {
  onReset: () => void;
  onNavigate: (view: AppView) => void;
  currentView: AppView;
  stage: AppStage;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onReset, onNavigate, currentView, stage, isDarkMode, toggleTheme }) => {
  
  const NavButton = ({ view, label, icon: Icon }: { view: AppView, label: string, icon: any }) => (
    <button
      onClick={() => onNavigate(view)}
      className={`
        px-3 py-2 lg:px-4 lg:py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all duration-300
        ${currentView === view 
          ? 'bg-ocean/10 text-ocean border-ocean/20 dark:bg-coral/10 dark:text-coral dark:border-coral/20 border shadow-sm' 
          : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent'}
      `}
    >
      <Icon className={`w-4 h-4 ${currentView === view ? 'text-ocean dark:text-coral' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600'}`} />
      <span className="hidden md:inline">{label}</span>
    </button>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm transition-colors duration-300 backdrop-blur-md bg-white/70 dark:bg-gray-900/70">
      <div className="container mx-auto px-4 md:px-6 h-24 flex items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex items-center gap-2 cursor-pointer group" onClick={onReset}>
          <img 
            src="/logo.png" 
            alt="Tailor Logo" 
            className="w-16 h-16 object-contain transition-transform group-hover:scale-105" 
          />
          {/* Subtil gradient på texten i dark mode */}
          <span className="font-display font-bold text-3xl tracking-tight hidden sm:inline
            text-gray-900 
            dark:bg-gradient-to-br dark:from-coral/80 dark:to-ocean/80 dark:bg-clip-text dark:text-transparent
          ">
            Tailor
          </span>
        </div>
        
        {/* Navigation */}
        <div className="flex items-center gap-1 lg:gap-2 overflow-x-auto no-scrollbar px-2">
          <NavButton view={AppView.HOME} label="Hem" icon={Home} />
          <NavButton view={AppView.INTERVIEW} label="Simulator" icon={Briefcase} />
          <NavButton view={AppView.SALARY} label="Lön" icon={DollarSign} />
          
          {/* Uppdaterat: Bingo heter nu "Träning" */}
          <NavButton view={AppView.BINGO} label="Träning" icon={Trophy} />
          
          {/* Ny knapp: Roast */}
          <NavButton view={AppView.ROAST} label="Roast" icon={Flame} />
          
          <NavButton view={AppView.ABOUT} label="Om oss" icon={Info} />
        </div>

        {/* Theme Toggle */}
        <div className="flex-shrink-0 ml-2">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
            title="Växla tema"
          >
            {isDarkMode ? <Sun className="w-6 h-6 text-coral" /> : <Moon className="w-6 h-6 text-ocean" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;