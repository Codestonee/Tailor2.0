import React, { useState } from 'react';
import { Menu, X, Settings } from 'lucide-react';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.location.reload()}>
          <img
            src="/logo.png"
            alt="Tailor"
            className="h-10 w-10 object-contain transition-transform group-hover:scale-110"
          />
          <span className="text-2xl font-bold text-neutral-900 font-heading">Tailor</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#"
            className="text-sm font-medium text-neutral-600 hover:text-primary transition-colors"
          >
            Funktioner
          </a>
          <a
            href="#"
            className="text-sm font-medium text-neutral-600 hover:text-primary transition-colors"
          >
            Priser
          </a>
          <a
            href="#"
            className="text-sm font-medium text-neutral-600 hover:text-primary transition-colors"
          >
            Om Oss
          </a>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors" title="Inställningar">
            <Settings size={20} className="text-neutral-600" />
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition-colors">
            Logga in
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 hover:bg-neutral-100 rounded-lg"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X size={24} className="text-neutral-600" />
          ) : (
            <Menu size={24} className="text-neutral-600" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white animate-in slide-in-from-top-2">
          <nav className="px-6 py-4 space-y-3">
            <a href="#" className="block text-sm font-medium text-neutral-700 hover:text-primary">
              Funktioner
            </a>
            <a href="#" className="block text-sm font-medium text-neutral-700 hover:text-primary">
              Priser
            </a>
            <a href="#" className="block text-sm font-medium text-neutral-700 hover:text-primary">
              Om Oss
            </a>
            <button className="w-full mt-4 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition-colors">
              Logga in
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};