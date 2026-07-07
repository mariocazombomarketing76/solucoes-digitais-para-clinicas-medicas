import React from 'react';
import { motion } from 'framer-motion';
import { XIcon } from './Icons';

interface ModalProps {
  onClose: () => void;
}

const PrivacyPolicy: React.FC<ModalProps> = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="relative bg-white rounded-lg shadow-xl w-11/12 md:w-3/4 lg:w-1/2 max-h-[90vh] overflow-y-auto p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors"
          aria-label="Fechar"
        >
          <XIcon className="w-6 h-6" />
        </button>
        <div className="prose max-w-none text-gray-700">
          <h2>Política de Privacidade</h2>
          <p className="text-sm text-gray-500">Última atualização: 22 de Maio de 2026</p>

          <p>A presente Política de Privacidade descreve como as suas informações são recolhidas, usadas e partilhadas quando visita este website. O responsável pelo tratamento dos seus dados é a <strong>Mario Cazombo e Filhos, Lda</strong> (NIF: 5417437034).</p>

          <h3>1. Que informações recolhemos?</h3>
          <p>Recolhemos informações de duas formas:</p>
          <ul>
            <li><strong>Informações que nos fornece diretamente:</strong> Quando preenche o formulário de diagnóstico gratuito no nosso website ou nos contacta através do WhatsApp, recolhemos as informações fornecidas por si (como nome, nome da clínica, especialidade, telefone de contacto, endereço de e-mail, cidade e website).</li>
            <li><strong>Informações recolhidas automaticamente:</strong> Quando navega no nosso website, podemos recolher informações técnicas como o seu endereço IP, tipo de navegador e sistema operativo, para fins de análise e melhoria do serviço.</li>
          </ul>

          <h3>2. Como usamos as suas informações?</h3>
          <p>As informações que recolhemos são utilizadas para:</p>
          <ul>
            <li>Processar o escaneamento inicial, fornecer o relatório de diagnóstico digital gratuito solicitado e dar seguimento ao contacto.</li>
            <li>Comunicar consigo e apresentar propostas comerciais adequadas sobre os nossos serviços.</li>
            <li>Melhorar a funcionalidade e a experiência de utilizador do nosso website.</li>
          </ul>

          <h3>3. Partilha de informações</h3>
          <p>Não vendemos nem partilhamos as suas informações pessoais com terceiros para fins de marketing. As suas informações podem ser partilhadas apenas nas seguintes circunstâncias:</p>
          <ul>
            <li>Com o seu consentimento explícito para fins de agendamento ou parcerias.</li>
            <li>Para cumprir obrigações legais ou fiscais junto das autoridades competentes de Angola.</li>
            <li>Com o WhatsApp, ao utilizar o canal de atendimento e contacto direto, estando essa interação sujeita às políticas de privacidade de terceiros.</li>
          </ul>

          <h3>4. Segurança dos dados</h3>
          <p>Implementamos medidas de segurança técnicas e organizacionais adequadas para proteger os seus dados pessoais contra perda, uso indevido e acesso não autorizado.</p>

          <h3>5. Os seus direitos</h3>
          <p>Tem o direito de aceder, corrigir ou solicitar a eliminação das suas informações pessoais. Para exercer estes direitos, por favor, contacte-nos através do e-mail: <a href="mailto:suporte@clinicasdigitais.com">suporte@clinicasdigitais.com</a>.</p>

          <h3>6. Alterações a esta política</h3>
          <p>Podemos atualizar esta política de privacidade periodicamente. A versão mais recente estará sempre disponível nesta página.</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PrivacyPolicy;