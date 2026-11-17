import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Menu, X, ChevronRight, PhoneCall } from 'lucide-react';

interface NavbarProps {
  contactLink: string;
  onOpenDemo?: () => void;
}

const Navbar: React.FC<NavbarProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200 py-3'
          : 'bg-white/95 backdrop-blur-sm border-b border-slate-100 py-3.5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-8">
        {/* Zone 1: Clean Single-Line Wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0056b3] rounded-lg"
        >
          <div className="w-9 h-9 rounded-lg bg-[#eff6ff] border border-[#bfdbfe] flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5 text-[#0056b3]" />
          </div>
          <span className="font-display font-bold text-lg sm:text-xl text-slate-900 tracking-tight whitespace-nowrap shrink-0">
            Clínicas <span className="text-[#0056b3]">Digitais</span>
          </span>
        </a>

        {/* Zone 2: 4 Clean Single-Line Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={() => scrollToSection('ciclo-vida')}
            className="hover:text-[#0056b3] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Ciclo do Paciente
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('processo')}
            className="hover:text-[#0056b3] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Como Funciona
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('planos')}
            className="hover:text-[#0056b3] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Preços
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('perguntas')}
            className="hover:text-[#0056b3] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Perguntas
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => scrollToSection('diagnostico')}
            className="inline-flex items-center justify-center px-4 py-2.5 bg-[#28a745] hover:bg-[#218838] text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm transition-colors gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 shrink-0" />
            <span>Agendar Demo</span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0056b3]"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white border-b border-slate-200 shadow-lg overflow-hidden"
          >
            <div className="max-w-6xl mx-auto px-4 py-4 space-y-2">
              <button
                type="button"
                onClick={() => scrollToSection('ciclo-vida')}
                className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between"
              >
                <span>Ciclo do Paciente</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('processo')}
                className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between"
              >
                <span>Como Funciona</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('planos')}
                className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between"
              >
                <span>Preços</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('perguntas')}
                className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between"
              >
                <span>Perguntas</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => scrollToSection('diagnostico')}
                  className="w-full py-3 bg-[#28a745] hover:bg-[#218838] text-white font-bold rounded-lg text-center text-sm flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Agendar Demonstração Gratuita</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
