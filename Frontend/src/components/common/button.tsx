import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  loading = false,
  variant = 'primary',
  size = 'md',
  children,
  disabled,
  className,
  ...props
}) => {
  const baseClass = 'font-semibold rounded-lg transition-all inline-flex items-center gap-2 justify-center';
  
  const variantClass = {
    primary: 'bg-primary text-white hover:bg-primary-hover hover:shadow-md hover:-translate-y-0.5',
    secondary: 'bg-secondary text-white hover:bg-secondary-hover',
    outline: 'border-2 border-neutral-300 text-neutral-700 hover:border-primary hover:text-primary',
  }[variant];

  const sizeClass = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }[size];

  return (
    <button
      className={`${baseClass} ${variantClass} ${sizeClass} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className || ''}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};