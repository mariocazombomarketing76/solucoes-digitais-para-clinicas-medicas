import React from 'react';
import { Sparkles } from 'lucide-react';
import WhatsAppLogo from './WhatsAppLogo';

interface MobileStickyBarProps {
  contactLink: string;
  onOpenDemo?: () => void;
}

const MobileStickyBar: React.FC<MobileStickyBarProps> = ({ contactLink, onOpenDemo }) => {
  const scrollToDiagnostic = () => {
    const element = document.getElementById('diagnostico');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const whatsappTestMsg = "Olá! Quero testar a Secretária Digital 15 dias grátis na minha clínica.";
  const whatsappTestUrl = `https://wa.me/message/5LQTAOWAHBXLG1?text=${encodeURIComponent(whatsappTestMsg)}`;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 p-2.5 shadow-2xl safe-area-bottom">
      <div className="flex items-center gap-2 max-w-md mx-auto">
        <button
          type="button"
          data-action="open-sofia"
          onClick={() => onOpenDemo ? onOpenDemo() : null}
          className="flex-1 py-3 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
          <span className="truncate">Ver demonstração</span>
        </button>

        <a
          href={whatsappTestUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 px-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all text-center"
        >
          <WhatsAppLogo className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">Testar 15 dias grátis</span>
        </a>
      </div>
    </div>
  );
};

export default MobileStickyBar;
