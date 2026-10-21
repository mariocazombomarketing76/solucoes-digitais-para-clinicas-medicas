import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Menu, X, Phone, Sparkles, Layers, CheckCircle2, ChevronRight, MessageSquare } from 'lucide-react';
import WhatsAppLogo from './WhatsAppLogo';

interface NavbarProps {
  contactLink: string;
  onOpenDemo?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ contactLink, onOpenDemo }) => {
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
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-white/95 backdrop-blur-md shadow-md border-b border-gray-200/80 py-2.5" 
        : "bg-white/90 backdrop-blur-sm border-b border-gray-100 py-3"
    }`}>
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-2.5 text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 group-hover:scale-105 transition-transform flex-shrink-0">
            <Activity className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-lg sm:text-xl text-gray-900 tracking-tight">
                Clinicas<span className="text-blue-600">Digitais</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                AO
              </span>
            </div>
            <p className="text-[10px] text-gray-500 hidden sm:block leading-none mt-0.5">
              Mario Cazombo e Filhos, Lda
            </p>
          </div>
        </a>

        {/* Desktop Navigation Links: Resultados · Demonstração · Planos · Perguntas */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-gray-700">
          <button 
            type="button" 
            onClick={() => scrollToSection('resultados')}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            Resultados
          </button>
          <button 
            type="button" 
            data-action="open-sofia"
            onClick={() => onOpenDemo ? onOpenDemo() : scrollToSection('demonstracao')}
            className="hover:text-emerald-600 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Demonstração</span>
          </button>
          <button 
            type="button" 
            onClick={() => scrollToSection('planos')}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            Planos
          </button>
          <button 
            type="button" 
            onClick={() => scrollToSection('perguntas')}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            Perguntas
          </button>
        </nav>

        {/* Right Fixed CTA Action: Testar grátis */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={`https://wa.me/message/5LQTAOWAHBXLG1?text=${encodeURIComponent("Olá! Quero testar a Secretária Digital 15 dias grátis na minha clínica.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-4 sm:px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all gap-1.5 active:scale-95"
          >
            <WhatsAppLogo className="w-4 h-4" />
            <span>Testar grátis</span>
          </a>

          {/* Mobile/Tablet Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Abrir menu"
            className="lg:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile / Tablet Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-white border-b border-gray-200 shadow-xl overflow-hidden"
          >
            <div className="container mx-auto px-4 py-5 space-y-4">
              
              <div className="bg-slate-50 p-3 rounded-xl border border-gray-200 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-gray-800">Mario Cazombo e Filhos, Lda</span>
                  <p className="text-gray-500 font-mono text-[10px]">NIF: 5417437034 • Luanda, AO</p>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="flex flex-col space-y-1">
                <button
                  type="button"
                  onClick={() => scrollToSection('resultados')}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                >
                  <span>Resultados</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                <button
                  type="button"
                  data-action="open-sofia"
                  onClick={() => {
                    setIsOpen(false);
                    if (onOpenDemo) onOpenDemo();
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 flex items-center justify-between shadow-sm"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    Demonstração (Sofia no WhatsApp)
                  </span>
                  <ChevronRight className="w-4 h-4 text-emerald-600" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('planos')}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                >
                  <span>Planos</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('perguntas')}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                >
                  <span>Perguntas</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/message/5LQTAOWAHBXLG1?text=${encodeURIComponent("Olá! Quero testar a Secretária Digital 15 dias grátis na minha clínica.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-center text-sm shadow-md flex items-center justify-center gap-2 active:scale-95"
                >
                  <WhatsAppLogo className="w-5 h-5" />
                  <span>Testar grátis no WhatsApp (15 dias)</span>
                </a>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
