import React from 'react';
import { MascotEmotion } from '../types';

interface MascotProps {
  className?: string;
  // Lägg till 'mischievous' i listan över tillåtna känslor
  emotion?: MascotEmotion | 'wave' | 'welcome' | 'analyzing' | 'dance' | 'sleep' | 'mischievous'; 
}

const Mascot: React.FC<MascotProps> = ({ className = "w-full h-full", emotion = 'idle' }) => {
  
  const getMascotSrc = (emotion: string) => {
    switch (emotion) {
      case 'happy':
        return '/mascot-happy.png';
      case 'sad':
        return '/mascot-sad.png';
      case 'excited':
      case 'dance': 
        return '/mascot-dance.png'; 
      case 'thinking':
        return '/mascot-thinking.png';
      case 'analyzing':
        return '/mascot-analyzing.png';
      case 'neutral':
        return '/mascot-neutral.png';
      case 'wave':
        return '/mascot-wave.png';
      case 'welcome':
        return '/mascot-welcome.png';
      case 'sleep':
        return '/mascot-sleep.png';
      case 'sceptical':
        return '/mascot-sceptical.png';
      // HÄR ÄR DIN NYA MASKOT
      case 'mischievous':
        return '/mascot-mischievous.png'; 
      case 'idle':
      default:
        return '/mascot-idle.png';
    }
  };

  return (
    <div className={`${className} relative flex items-center justify-center`}>
      <img 
        src={getMascotSrc(emotion)} 
        alt={`Tailor Mascot - ${emotion}`}
        className="w-full h-full object-contain drop-shadow-xl transition-all duration-500"
      />
    </div>
  );
};

export default Mascot;