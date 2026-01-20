import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const TargetAudience: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-16 md:py-20 bg-blue-50 overflow-hidden">
      <motion.div
        className="container mx-auto px-6 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Para quem é esta solução?</h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
          Esta solução foi desenhada <span className="font-bold text-blue-600">exclusivamente para clínicas médicas privadas</span> que desejam um crescimento consistente e sustentável, utilizando o digital de forma estratégica — não improvisada.
        </p>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md max-w-2xl mx-auto">
          <p className="font-semibold">Não é indicada para clínicas que procuram apenas “presença online” sem compromisso com resultados.</p>
        </div>
      </motion.div>
    </section>
  );
};

export default TargetAudience;