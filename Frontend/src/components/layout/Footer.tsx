import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-white border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-bold text-lg mb-4">Tailor</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Din AI-drivna karriärcoach. Vi hjälper dig att landa drömjobbet med smartare analyser.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold mb-4">Produkten</h4>
            <ul className="space-y-2 text-neutral-400 text-sm">
              <li><a href="#" className="hover:text-white transition">Funktioner</a></li>
              <li><a href="#" className="hover:text-white transition">Priser</a></li>
              <li><a href="#" className="hover:text-white transition">API Dokumentation</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold mb-4">Företaget</h4>
            <ul className="space-y-2 text-neutral-400 text-sm">
              <li><a href="#" className="hover:text-white transition">Om oss</a></li>
              <li><a href="#" className="hover:text-white transition">Blogg</a></li>
              <li><a href="#" className="hover:text-white transition">Kontakt</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold mb-4">Följ oss</h4>
            <div className="flex gap-4">
              <a href="#" className="p-2 hover:bg-neutral-800 rounded-lg transition">
                <Github size={20} />
              </a>
              <a href="#" className="p-2 hover:bg-neutral-800 rounded-lg transition">
                <Linkedin size={20} />
              </a>
              <a href="#" className="p-2 hover:bg-neutral-800 rounded-lg transition">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-neutral-400 text-sm">
            <p>&copy; {currentYear} Tailor. Alla rättigheter förbehållna.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">Integritet</a>
              <a href="#" className="hover:text-white transition">Villkor</a>
              <a href="#" className="hover:text-white transition">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};