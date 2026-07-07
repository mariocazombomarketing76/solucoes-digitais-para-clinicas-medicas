import React from 'react';
import { Activity } from 'lucide-react';

interface FooterProps {
  onPrivacyClick: () => void;
  onTermsClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onPrivacyClick, onTermsClick }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-6 md:space-y-0 max-w-6xl mx-auto">
          
          {/* Logo & Corporate Info */}
          <div className="order-2 md:order-1 space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <Activity className="w-6 h-6 text-emerald-400" />
              <span className="font-display font-bold text-xl text-white tracking-tight">
                Clinicas<span className="text-blue-400">Digitais</span>
              </span>
            </div>
            <p className="font-semibold text-slate-200">Mario Cazombo e Filhos, Lda</p>
            <p className="text-xs text-slate-500 font-mono">NIF: 5417437034 • Luanda, Angola</p>
          </div>
          
          {/* Legal Modals Links */}
          <div className="order-3 md:order-2 flex flex-col sm:flex-row gap-4 sm:gap-6 text-sm">
            <button 
              onClick={onPrivacyClick} 
              className="hover:text-white hover:underline transition-colors duration-200 text-slate-300 font-medium"
            >
              Política de Privacidade
            </button>
            <span className="hidden sm:inline text-slate-700">|</span>
            <button 
              onClick={onTermsClick} 
              className="hover:text-white hover:underline transition-colors duration-200 text-slate-300 font-medium"
            >
              Termos de Uso
            </button>
          </div>
          
          {/* Copyright */}
          <div className="order-1 md:order-3 text-sm text-slate-500">
            <p>&copy; {currentYear} ClinicasDigitais.com</p>
            <p className="text-[10px] mt-1 text-slate-600">Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;