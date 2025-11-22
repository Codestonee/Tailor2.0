import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hantera scroll-effekt för att göra headern mer transparent/oskarp
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Funktioner', href: '#features' },
    { name: 'Hur det funkar', href: '#how-it-works' },
    { name: 'Priser', href: '#pricing' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Logo */}
        <div 
          className="flex items-center gap-3 select-none cursor-pointer group" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img 
            src="/logo.png" 
            alt="Tailor Logo" 
            className="h-10 w-10 md:h-12 md:w-12 object-contain transition-transform group-hover:scale-105"
          />
          <span className="font-heading font-bold text-2xl md:text-3xl text-neutral-900 tracking-tight">
            Tailor
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href} 
              className="text-sm font-medium text-neutral-600 hover:text-primary transition-colors relative group py-2"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </a>
          ))}
        </nav>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <button className="text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors px-4 py-2">
            Logga in
          </button>
          <button className="bg-primary text-white px-5 py-2.5 rounded-brand text-sm font-semibold hover:bg-primary-hover transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0">
            Kom igång gratis
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-neutral-600 hover:text-neutral-900"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-neutral-200 shadow-lg px-6 py-8 animate-in slide-in-from-top-5">
          <nav className="flex flex-col space-y-6 text-center">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href}
                className="text-lg font-medium text-neutral-700 hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <hr className="border-neutral-100 my-4"/>
            <button className="text-neutral-600 font-semibold hover:text-neutral-900">Logga in</button>
            <button className="bg-primary text-white px-6 py-3 rounded-brand font-semibold hover:bg-primary-hover transition-all w-full">
                Kom igång gratis
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};