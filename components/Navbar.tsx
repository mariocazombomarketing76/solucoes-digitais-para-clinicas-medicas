import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Menu, X, Phone, Sparkles, Layers, CheckCircle2, ChevronRight } from 'lucide-react';

interface NavbarProps {
  contactLink: string;
}

const Navbar: React.FC<NavbarProps> = ({ contactLink }) => {
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

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-gray-600">
          <button 
            type="button" 
            onClick={() => scrollToSection('especialidades')}
            className="hover:text-blue-600 transition-colors"
          >
            Especialidades
          </button>
          <button 
            type="button" 
            onClick={() => scrollToSection('solucoes')}
            className="hover:text-blue-600 transition-colors"
          >
            Soluções
          </button>
          <button 
            type="button" 
            onClick={() => scrollToSection('planos')}
            className="hover:text-blue-600 transition-colors flex items-center gap-1"
          >
            <Layers className="w-4 h-4 text-blue-500" />
            Planos
          </button>
          <button 
            type="button" 
            onClick={() => scrollToSection('diagnostico')}
            className="hover:text-blue-600 transition-colors flex items-center gap-1.5 text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Diagnóstico IA
          </button>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => scrollToSection('diagnostico')}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all gap-1.5 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Diagnóstico Grátis</span>
          </button>

          <a
            href={contactLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-3.5 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all gap-1.5 active:scale-95"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden xs:inline">WhatsApp</span>
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
                  onClick={() => scrollToSection('diagnostico')}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-blue-700 bg-blue-50/80 border border-blue-200 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    Diagnóstico Gratuito com IA & n8n
                  </span>
                  <ChevronRight className="w-4 h-4 text-blue-500" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('planos')}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-gray-500" />
                    Planos (Start, Pro & Elite)
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('solucoes')}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-gray-500" />
                    Soluções e Tecnologias
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('especialidades')}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-gray-500" />
                    Especialidades Atendidas
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => scrollToSection('diagnostico')}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-center text-sm shadow-md flex items-center justify-center gap-2 active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  Preencher Diagnóstico Agora
                </button>

                <a
                  href={contactLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-center text-sm shadow-md flex items-center justify-center gap-2 active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                  Falar no WhatsApp com Diretor Técnico
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
