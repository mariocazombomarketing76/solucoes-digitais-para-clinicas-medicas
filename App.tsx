import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import MobileStickyBar from './components/MobileStickyBar';
import Hero from './components/Hero';
import Problems from './components/Problems';
import WhyItWorks from './components/WhyItWorks';
import Plans from './components/Plans';
import WhyChooseUs from './components/WhyChooseUs';
import DiagnosticForm from './components/DiagnosticForm';
import Authority from './components/Authority';
import FAQ from './components/FAQ';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfUse from './components/TermsOfUse';
import WhatsAppLogo from './components/WhatsAppLogo';

const App: React.FC = () => {
  const contactLink = 'https://wa.me/message/5LQTAOWAHBXLG1';
  const whatsappDemoMsg =
    'Olá! Gostaria de agendar uma demonstração de voz gratuita da Joana para a minha clínica.';
  const whatsappDemoUrl = `https://wa.me/message/5LQTAOWAHBXLG1?text=${encodeURIComponent(
    whatsappDemoMsg
  )}`;
  const [modal, setModal] = useState<'privacy' | 'terms' | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>('Plano CLÍNICA');

  const handleOpenDemo = () => {
    const el = document.getElementById('diagnostico');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white text-slate-800 font-sans antialiased scroll-smooth relative pb-16 md:pb-0">
      {/* Top Navigation */}
      <Navbar contactLink={contactLink} onOpenDemo={handleOpenDemo} />

      <main>
        {/* 1. Hero Section: Recepcionista Virtual de Voz com IA (Joana) */}
        <Hero contactLink={contactLink} onOpenDemo={handleOpenDemo} />

        {/* 2. O Problema vs A Nossa Solução de Voz */}
        <Problems />

        {/* 3. Como Funciona (3 Passos) */}
        <WhyItWorks />

        {/* 4. Preços em Kwanza (Starter, Clínica, Enterprise) */}
        <Plans
          onSelectPlan={(plan) => setSelectedPlan(plan)}
          contactLink={contactLink}
          onOpenDemo={handleOpenDemo}
        />

        {/* 5. Secção de Confiança e Tecnologia */}
        <WhyChooseUs />

        {/* 6. Agendar Demonstração de Voz Gratuita */}
        <DiagnosticForm
          selectedPlan={selectedPlan}
          onOpenDemo={handleOpenDemo}
          onPrivacyClick={() => setModal('privacy')}
        />

        {/* 7. Sobre a Clínicas Digitais */}
        <Authority />

        {/* 8. Perguntas Frequentes */}
        <FAQ contactLink={contactLink} />

        {/* 9. CTA Final */}
        <FinalCTA contactLink={contactLink} />
      </main>

      {/* Footer */}
      <Footer
        onPrivacyClick={() => setModal('privacy')}
        onTermsClick={() => setModal('terms')}
      />

      {/* Floating WhatsApp Direct Support Button for Desktop */}
      <a
        href={whatsappDemoUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Agendar Demonstração de Voz Gratuita pelo WhatsApp"
        className="hidden md:flex fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-lg transition-all duration-200 hover:scale-105 items-center justify-center group"
      >
        <WhatsAppLogo className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 font-semibold text-sm ml-0 group-hover:ml-2">
          Falar com Consultor
        </span>
      </a>

      {/* Mobile Bottom Fixed Action Bar (< 15% viewport height) */}
      <MobileStickyBar
        contactLink={whatsappDemoUrl}
        onOpenDemo={handleOpenDemo}
      />

      {/* Legal Modals */}
      <AnimatePresence>
        {modal === 'privacy' && <PrivacyPolicy onClose={() => setModal(null)} />}
        {modal === 'terms' && <TermsOfUse onClose={() => setModal(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default App;