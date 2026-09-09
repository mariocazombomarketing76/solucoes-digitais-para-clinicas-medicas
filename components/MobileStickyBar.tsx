import React from 'react';
import { Sparkles, MessageSquare } from 'lucide-react';

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

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 p-2 shadow-2xl safe-area-bottom">
      <div className="flex items-center gap-1.5 max-w-md mx-auto">
        <button
          type="button"
          onClick={() => onOpenDemo ? onOpenDemo() : null}
          className="py-2.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1 shadow-sm transition-all"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
          <span className="truncate">Testar Secretária 24/7</span>
        </button>

        <button
          type="button"
          onClick={scrollToDiagnostic}
          className="flex-1 py-2.5 px-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 flex-shrink-0 text-blue-200" />
          <span className="truncate">Diagnóstico IA</span>
        </button>

        <a
          href={contactLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2.5 px-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-all"
        >
          <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">WhatsApp</span>
        </a>
      </div>
    </div>
  );
};

export default MobileStickyBar;
