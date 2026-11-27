import React from 'react';
import { Activity } from 'lucide-react';

interface FooterProps {
  onPrivacyClick: () => void;
  onTermsClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onPrivacyClick, onTermsClick }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
          {/* Brand & Exact Requested Copyright Copy */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <Activity className="w-5 h-5 text-[#28a745]" />
              <span className="font-display font-bold text-lg text-white tracking-tight">
                Clínicas <span className="text-blue-400">Digitais</span>
              </span>
            </div>
            <p className="text-sm text-slate-200 font-medium">
              © 2026 Clínicas Digitais. Transformando a saúde em Angola com Inteligência Artificial de Voz. Luanda, Angola.
            </p>
            <p className="text-xs text-slate-500 font-mono">
              Mario Cazombo e Filhos, Lda
            </p>
          </div>

          {/* Legal Modals Links */}
          <div className="flex items-center gap-4 text-sm shrink-0">
            <button
              type="button"
              onClick={onPrivacyClick}
              className="hover:text-white hover:underline transition-colors duration-150 text-slate-300 font-medium cursor-pointer"
            >
              Política de Privacidade
            </button>
            <span className="text-slate-700" aria-hidden="true">·</span>
            <button
              type="button"
              onClick={onTermsClick}
              className="hover:text-white hover:underline transition-colors duration-150 text-slate-300 font-medium cursor-pointer"
            >
              Termos de Uso
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;