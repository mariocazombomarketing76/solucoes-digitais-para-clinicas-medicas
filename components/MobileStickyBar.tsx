import React from 'react';
import { PhoneCall } from 'lucide-react';
import WhatsAppLogo from './WhatsAppLogo';

interface MobileStickyBarProps {
  contactLink: string;
  onOpenDemo?: () => void;
}

const MobileStickyBar: React.FC<MobileStickyBarProps> = ({ contactLink, onOpenDemo }) => {
  const handleScheduleClick = () => {
    if (onOpenDemo) {
      onOpenDemo();
      return;
    }
    const element = document.getElementById('diagnostico');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 shadow-lg safe-area-bottom">
      <div className="flex items-center gap-2 max-w-md mx-auto">
        <button
          type="button"
          onClick={handleScheduleClick}
          className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer whitespace-nowrap"
        >
          <PhoneCall className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Agendar Demo de Voz</span>
        </button>

        <a
          href={contactLink}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
        >
          <WhatsAppLogo className="w-3.5 h-3.5 shrink-0" />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
};

export default MobileStickyBar;
