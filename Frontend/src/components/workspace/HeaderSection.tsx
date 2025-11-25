import React from 'react';
import { Upload, Search, Type } from 'lucide-react';

interface HeaderSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  title,
  description,
  icon,
}) => {
  return (
    <div className="mb-6 pb-6 border-b border-neutral-200">
      <div className="flex items-start gap-3">
        <div className="p-3 bg-primary/10 rounded-lg text-primary mt-1">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-bold text-neutral-900">{title}</h3>
          <p className="text-sm text-neutral-600 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};