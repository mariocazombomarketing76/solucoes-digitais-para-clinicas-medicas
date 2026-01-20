import React from 'react';

interface FooterProps {
  onPrivacyClick: () => void;
  onTermsClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onPrivacyClick, onTermsClick }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-400">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-4 md:space-y-0">
          <div className="order-2 md:order-1">
            <img src="https://i.imgur.com/e1EiP3w.png" alt="Clínica Digital Logo" className="h-10 mx-auto md:mx-0 mb-4" />
            <p className="font-bold text-white">Mario Cazombo e Filhos, Lda</p>
            <p>NIF: 5417437034</p>
          </div>
          <div className="order-3 md:order-2 flex space-x-6">
            <button onClick={onPrivacyClick} className="hover:text-white transition-colors duration-200">Política de Privacidade</button>
            <button onClick={onTermsClick} className="hover:text-white transition-colors duration-200">Termos de Uso</button>
          </div>
          <div className="order-1 md:order-3">
            <p>&copy; {currentYear} Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;