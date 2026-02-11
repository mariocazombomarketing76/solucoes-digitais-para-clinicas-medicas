import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import TargetAudience from './components/TargetAudience';
import Problems from './components/Problems';
import Solution from './components/Solution';
import WhyItWorks from './components/WhyItWorks';
import Authority from './components/Authority';
import FAQ from './components/FAQ';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfUse from './components/TermsOfUse';

const App: React.FC = () => {
  const contactLink = "https://t.me/ClinicasDigitais_bot";
  const [modal, setModal] = useState<'privacy' | 'terms' | null>(null);

  return (
    <div className="bg-gray-50 text-gray-800 font-sans antialiased">
      <main>
        <Hero contactLink={contactLink} />
        <TargetAudience />
        <Problems />
        <Solution />
        <WhyItWorks />
        <Authority />
        <FAQ />
        <FinalCTA contactLink={contactLink} />
      </main>
      <Footer 
        onPrivacyClick={() => setModal('privacy')}
        onTermsClick={() => setModal('terms')}
      />
      <AnimatePresence>
        {modal === 'privacy' && <PrivacyPolicy onClose={() => setModal(null)} />}
        {modal === 'terms' && <TermsOfUse onClose={() => setModal(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default App;