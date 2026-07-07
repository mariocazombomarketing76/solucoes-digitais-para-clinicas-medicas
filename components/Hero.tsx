import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Stethoscope, ShieldCheck, MessageSquare, ArrowRight, Activity } from 'lucide-react';

interface HeroProps {
  contactLink: string;
}

const Hero: React.FC<HeroProps> = ({ contactLink }) => {
  const scrollToDiagnostic = () => {
    const element = document.getElementById('diagnostico');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-white overflow-hidden border-b border-gray-100">
      {/* Micro-H1 for perfect SEO structure */}
      <h1 className="sr-only">Clínicas Digitais Angola</h1>

      <div className="container mx-auto px-6 pt-6 md:pt-10 pb-16 md:pb-24">
        {/* Header brand bar */}
        <motion.div
          className="mb-10 md:mb-14 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col space-y-1 text-left">
            <div className="flex items-center gap-2">
              <Activity className="w-6 h-6 text-emerald-500" />
              <span className="font-sans font-bold text-xl text-gray-900 tracking-tight">
                Clinicas<span className="text-blue-600">Digitais</span>
              </span>
            </div>
            <div className="pl-8">
              <p className="text-xs font-semibold text-gray-600 leading-tight">Mario Cazombo e Filhos, Lda</p>
              <p className="text-[10px] text-gray-400 font-mono mt-0.5">NIF: 5417437034 • Luanda, Angola</p>
            </div>
          </div>
          <div className="flex items-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Suporte Local Ativo (Angola)
            </span>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Main content side */}
          <motion.div
            className="lg:w-7/12 text-center lg:text-left"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.15 } },
              hidden: {},
            }}
          >
            {/* Tagline */}
            <motion.div 
              className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100"
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <Activity className="w-3.5 h-3.5 animate-pulse text-blue-600" />
              Sistemas Digitais Premium de Saúde
            </motion.div>

            {/* Headline */}
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6 font-display"
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
            >
              O sistema digital que ajuda clínicas privadas a atrair mais pacientes
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
            >
              Desenvolvemos websites profissionais, automação inteligente, presença digital e sistemas de atendimento que ajudam clínicas privadas em Angola a melhorar a experiência dos pacientes e aumentar pedidos de consulta.
            </motion.p>

            {/* Buttons row */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10"
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
            >
              <motion.button
                onClick={scrollToDiagnostic}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-base md:text-lg font-bold rounded-xl shadow-lg shadow-blue-500/10 transition-all duration-300 gap-2 hover:scale-[1.02]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Solicitar Diagnóstico Gratuito</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.a
                href={contactLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-base md:text-lg font-bold rounded-xl shadow-lg shadow-emerald-500/10 transition-all duration-300 gap-2 hover:scale-[1.02]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MessageSquare className="w-5 h-5 flex-shrink-0" />
                <span>Falar no WhatsApp</span>
              </motion.a>
            </motion.div>

            {/* Trust badges / seals requested */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-100 max-w-2xl mx-auto lg:mx-0 text-left"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
              }}
            >
              <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 uppercase tracking-wide">Empresa Angolana</p>
                  <p className="text-[11px] text-gray-500">Mário Cazombo & Filhos</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 uppercase tracking-wide">Especialistas</p>
                  <p className="text-[11px] text-gray-500">Exclusivos em Clínicas</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 uppercase tracking-wide">Suporte Contínuo</p>
                  <p className="text-[11px] text-gray-500">Prontidão e Backups</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right graphics / team trust side (smaller photo, institutional trust box) */}
          <div className="lg:w-5/12 flex flex-col items-center justify-center">
            <motion.div
              className="relative bg-gradient-to-tr from-slate-50 to-blue-50/30 p-6 rounded-3xl border border-gray-200 shadow-xl max-w-sm w-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {/* Image with decorative border */}
              <div className="relative w-48 h-48 rounded-2xl bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-md mx-auto mb-5">
                <img src="https://i.imgur.com/oTgNEGC.jpg" alt="Foto profissional de Mário Cazombo" className="w-full h-full object-cover object-[center_20%]" />
              </div>

              {/* Specialist Bio Info with Institutional backup */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900">Mário Cazombo</h3>
                <p className="text-xs font-semibold text-blue-600 mb-2">Diretor Técnico & Especialista Digital</p>
                
                <hr className="my-3 border-gray-200" />
                
                <div className="bg-white/80 backdrop-blur py-2 px-3.5 rounded-xl border border-gray-100 text-left text-xs space-y-1">
                  <p className="text-gray-500">Iniciativa por:</p>
                  <p className="font-bold text-gray-800">Mario Cazombo e Filhos, Lda</p>
                  <p className="text-gray-400 font-mono">NIF: 5417437034</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;