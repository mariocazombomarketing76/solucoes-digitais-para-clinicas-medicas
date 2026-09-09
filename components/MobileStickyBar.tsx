import React from 'react';
import { Sparkles, MessageSquare } from 'lucide-react';

interface MobileStickyBarProps {
  contactLink: string;
}

const MobileStickyBar: React.FC<MobileStickyBarProps> = ({ contactLink }) => {
  const scrollToDiagnostic = () => {
    const element = document.getElementById('diagnostico');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 p-2.5 shadow-2xl safe-area-bottom">
      <div className="flex items-center gap-2 max-w-md mx-auto">
        <button
          type="button"
          onClick={scrollToDiagnostic}
          className="flex-1 py-3 px-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
        >
          <Sparkles className="w-4 h-4 flex-shrink-0 text-blue-200" />
          <span className="truncate">Diagnóstico IA Grátis</span>
        </button>

        <a
          href={contactLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 px-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
        >
          <MessageSquare className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">Falar no WhatsApp</span>
        </a>
      </div>
    </div>
  );
};

export default MobileStickyBar;
