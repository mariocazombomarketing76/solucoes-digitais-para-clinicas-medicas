import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Users, 
  Globe, 
  FileWarning, 
  CalendarOff, 
  MessageSquareOff, 
  Search, 
  VolumeX, 
  Clock, 
  ShieldAlert 
} from 'lucide-react';

const challenges = [
  {
    title: "Poucos pacientes novos",
    description: "Falta de fluxo constante de pacientes particulares todos os meses para sustentar a infraestrutura da clínica.",
    icon: Users
  },
  {
    title: "Website inexistente",
    description: "A sua clínica não existe nos resultados de pesquisa quando os pacientes procuram por uma especialidade médica.",
    icon: Globe
  },
  {
    title: "Website desatualizado",
    description: "Design antigo, lento nos telemóveis e que transmite amadorismo em vez da excelência médica real.",
    icon: FileWarning
  },
  {
    title: "Agenda totalmente manual",
    description: "Erros de agendamento, dependência de cadernos físicos e ausência de confirmações automáticas.",
    icon: CalendarOff
  },
  {
    title: "WhatsApp desorganizado",
    description: "Dezenas de conversas misturadas no mesmo telemóvel, sem etiquetas, sem controlo e com perda frequente de mensagens.",
    icon: MessageSquareOff
  },
  {
    title: "Dificuldade em aparecer no Google",
    description: "A clínica não aparece listada no mapa ou nos primeiros resultados orgânicos quando procuram na sua cidade.",
    icon: Search
  },
  {
    title: "Dependência apenas do boca a boca",
    description: "Se não houver recomendações indiretas, a clínica simplesmente não atrai novos pacientes adicionais.",
    icon: VolumeX
  },
  {
    title: "Demora nas respostas",
    description: "Pacientes esperam horas por um orçamento ou confirmação, desistindo e marcando noutras clínicas concorrentes.",
    icon: Clock
  },
  {
    title: "Falta de credibilidade digital",
    description: "Ausência de um domínio corporativo próprio (.com ou .co.ao) ou de um e-mail profissional para contacto formal.",
    icon: ShieldAlert
  }
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  },
};

const Problems: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section ref={ref} className="py-16 md:py-24 bg-white overflow-hidden">
      {/* SEO Tag */}
      <h2 className="sr-only">Presença Digital para Clínicas Privadas</h2>

      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-red-600 bg-red-100 px-3 py-1 rounded-full">
            Diagnóstico de Dificuldades
          </span>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-4">
            A sua clínica enfrenta algum destes desafios?
          </h3>
          <p className="text-lg text-gray-600">
            Muitas clínicas privadas excelentes perdem prestígio e receitas simplesmente por não terem as suas frentes de atração e atendimento digital devidamente integradas.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {challenges.map((challenge, index) => {
            const IconComponent = challenge.icon;
            return (
              <motion.div 
                key={index} 
                className="bg-red-50/50 p-6 rounded-2xl border border-red-100 hover:border-red-200 shadow-sm transition-all duration-300 flex items-start gap-4"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex-shrink-0 bg-red-500 text-white rounded-xl p-2.5 shadow-sm">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1 leading-snug">{challenge.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{challenge.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Problems;