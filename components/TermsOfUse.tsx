import React from 'react';
import { motion } from 'framer-motion';
import { XIcon } from './Icons';

interface ModalProps {
  onClose: () => void;
}

const TermsOfUse: React.FC<ModalProps> = ({ onClose }) => {
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
          <h2>Termos de Uso</h2>
          <p className="text-sm text-gray-500">Última atualização: 20 de Julho de 2024</p>

          <p>Bem-vindo! Ao aceder e utilizar este website, concorda em cumprir os seguintes termos e condições de uso. Estes termos aplicam-se a todos os visitantes e utilizadores do site.</p>

          <h3>1. Uso do Website</h3>
          <p>Este website destina-se a fornecer informações sobre os serviços prestados pela <strong>Mario Cazombo e Filhos, Lda</strong> e a facilitar o contacto para potenciais clientes. Concorda em usar o site apenas para fins lícitos e de uma forma que não infrinja os direitos de, restrinja ou iniba o uso e gozo do site por qualquer terceiro.</p>

          <h3>2. Propriedade Intelectual</h3>
          <p>Todo o conteúdo presente neste website, incluindo textos, gráficos, logotipos e design, é propriedade da <strong>Mario Cazombo e Filhos, Lda</strong> e está protegido por leis de direitos de autor. Nenhuma parte do conteúdo pode ser copiada, reproduzida ou distribuída sem a nossa permissão prévia por escrito.</p>

          <h3>3. Limitação de Responsabilidade</h3>
          <p>As informações neste site são fornecidas "como estão", sem garantias de qualquer tipo. Embora nos esforcemos para manter as informações atualizadas e corretas, não fazemos representações ou garantias de qualquer tipo, expressas ou implícitas, sobre a integridade, precisão ou fiabilidade das informações contidas.</p>
          <p>A <strong>Mario Cazombo e Filhos, Lda</strong> não será responsável por qualquer perda ou dano, incluindo, sem limitação, perdas ou danos indiretos ou consequenciais, decorrentes do uso deste website.</p>
          
          <h3>4. Links para Terceiros</h3>
          <p>O nosso website contém links para sites de terceiros (como o Telegram) que não são controlados por nós. Não temos controlo sobre o conteúdo, políticas de privacidade ou práticas de sites de terceiros e não assumimos qualquer responsabilidade por eles.</p>

          <h3>5. Lei Aplicável</h3>
          <p>Estes termos e condições serão regidos e interpretados de acordo com as leis de Angola, e qualquer litígio estará sujeito à jurisdição exclusiva dos tribunais de Angola.</p>

          <h3>6. Alterações aos Termos</h3>
          <p>Reservamo-nos o direito de modificar estes termos a qualquer momento. Quaisquer alterações entrarão em vigor imediatamente após a sua publicação no website.</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TermsOfUse;