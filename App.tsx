import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import TargetAudience from './components/TargetAudience';
import Problems from './components/Problems';
import Solution from './components/Solution';
import WhyChooseUs from './components/WhyChooseUs';
import WhyItWorks from './components/WhyItWorks';
import Plans from './components/Plans';
import DiagnosticForm from './components/DiagnosticForm';
import Authority from './components/Authority';
import FAQ from './components/FAQ';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfUse from './components/TermsOfUse';

const App: React.FC = () => {
  const contactLink = "https://wa.me/244923000000"; // General institutional WhatsApp format
  const [modal, setModal] = useState<'privacy' | 'terms' | null>(null);

  return (
    <div className="bg-gray-50 text-gray-800 font-sans antialiased scroll-smooth">
      <main>
        {/* 1. Hero Section */}
        <Hero contactLink={contactLink} />

        {/* 2. Target Audience Specialty Filter */}
        <TargetAudience />

        {/* 3. Pain Points & Challenges */}
        <Problems />

        {/* 4. Complete System Solution */}
        <Solution />

        {/* 5. Institutional Trust Badges */}
        <WhyChooseUs />

        {/* 6. Professional 7-Step Timeline */}
        <WhyItWorks />

        {/* 7. Value Plans Selection */}
        <Plans />

        {/* 8. Interactive Diagnostic Form */}
        <DiagnosticForm />

        {/* 9. About the Company & Director */}
        <Authority />

        {/* 10. FAQ Friction Reducer */}
        <FAQ />

        {/* 11. Closing Persuasion Section */}
        <FinalCTA contactLink={contactLink} />
      </main>
      
      {/* Footer */}
      <Footer 
        onPrivacyClick={() => setModal('privacy')}
        onTermsClick={() => setModal('terms')}
      />
      
      {/* Modals */}
      <AnimatePresence>
        {modal === 'privacy' && <PrivacyPolicy onClose={() => setModal(null)} />}
        {modal === 'terms' && <TermsOfUse onClose={() => setModal(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default App;