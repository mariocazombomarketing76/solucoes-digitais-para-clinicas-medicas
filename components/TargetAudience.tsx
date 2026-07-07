import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Activity, 
  Smile, 
  FlaskConical, 
  BriefcaseMedical, 
  Sparkles, 
  HeartPulse, 
  Eye, 
  TrendingUp, 
  Baby, 
  Users 
} from 'lucide-react';

const specialties = [
  { name: "Clínicas Gerais", icon: Activity, color: "text-blue-600 bg-blue-50" },
  { name: "Clínicas Dentárias", icon: Smile, color: "text-teal-600 bg-teal-50" },
  { name: "Laboratórios", icon: FlaskConical, color: "text-amber-600 bg-amber-50" },
  { name: "Centros Médicos", icon: BriefcaseMedical, color: "text-indigo-600 bg-indigo-50" },
  { name: "Clínicas de Estética", icon: Sparkles, color: "text-pink-600 bg-pink-50" },
  { name: "Centros de Diagnóstico", icon: HeartPulse, color: "text-rose-600 bg-rose-50" },
  { name: "Clínicas Oftalmológicas", icon: Eye, color: "text-sky-600 bg-sky-50" },
  { name: "Fisioterapia", icon: TrendingUp, color: "text-emerald-600 bg-emerald-50" },
  { name: "Pediatria", icon: Baby, color: "text-orange-600 bg-orange-50" },
  { name: "Ginecologia", icon: Users, color: "text-purple-600 bg-purple-50" }
];

const TargetAudience: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
  };

  return (
    <section ref={ref} className="py-16 md:py-24 bg-blue-50/50 overflow-hidden border-b border-gray-100">
      {/* SEO Tag */}
      <h2 className="sr-only">Transformação Digital para Clínicas</h2>

      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
            Alinhamento Estratégico
          </span>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-3">
            Desenhado exclusivamente para clínicas privadas
          </h3>
          <p className="text-lg text-gray-600">
            Ajudamos instituições de saúde a modernizar a sua presença digital.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {specialties.map((spec, index) => {
            const IconComponent = spec.icon;
            return (
              <motion.div 
                key={index} 
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300 flex flex-col items-center text-center"
                variants={itemVariants}
                whileHover={{ y: -4 }}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${spec.color}`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-gray-800 leading-tight">{spec.name}</h4>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="mt-12 bg-white border border-gray-150 p-5 rounded-2xl max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-4 shadow-sm">
          <span className="flex-shrink-0 bg-amber-50 text-amber-600 font-bold px-3 py-1.5 rounded-lg text-xs uppercase border border-amber-200">
            Atenção
          </span>
          <p className="text-sm text-gray-600 text-center sm:text-left leading-relaxed">
            Não prestamos serviços pontuais de web design amador. Fornecemos um <span className="font-semibold text-gray-900">sistema profissional completo de presença e atendimento recorrente</span> para instituições de saúde sérias em Angola.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TargetAudience;