import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Play, ShieldCheck, Headphones, Zap, Clock, CheckCircle2, UserCheck, Calendar, Activity } from 'lucide-react';

interface HeroProps {
  contactLink: string;
  onOpenDemo?: () => void;
}

const Hero: React.FC<HeroProps> = ({ contactLink, onOpenDemo }) => {
  const whatsappTestMsg = "Olá! Quero testar a Secretária Digital 15 dias grátis na minha clínica.";
  const whatsappTestUrl = `https://wa.me/message/5LQTAOWAHBXLG1?text=${encodeURIComponent(whatsappTestMsg)}`;

  const handleOpenDemo = () => {
    if (onOpenDemo) {
      onOpenDemo();
      return;
    }
    if (typeof (window as any).abrirModalSofia === 'function') {
      (window as any).abrirModalSofia();
      return;
    }
    const btn = document.querySelector('[data-action="open-sofia"]') as HTMLElement;
    if (btn) {
      btn.click();
      return;
    }
    const overlay = document.getElementById("sofia-overlay");
    if (overlay) {
      overlay.classList.add("sofia-open");
    }
  };

  return (
    <section className="bg-white overflow-hidden border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 pt-8 md:pt-12 pb-14 md:pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
          
          {/* Main content side */}
          <motion.div
            className="lg:w-7/12 text-center lg:text-left"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.12 } },
              hidden: {},
            }}
          >
            {/* Etiqueta: Secretária Digital para Clínicas */}
            <motion.div 
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider mb-5 border border-emerald-200 shadow-sm"
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Secretária Digital para Clínicas</span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-gray-900 leading-[1.15] mb-5 font-display tracking-tight"
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              Nenhum paciente perdido. A sua clínica atende no WhatsApp 24 horas.
            </motion.h1>

            {/* Subtítulo */}
            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal"
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              A Sofia confirma consultas, reduz as faltas e chama de volta os pacientes que deixaram de vir. Sem contratar ninguém.
            </motion.p>

            {/* Botões primário e secundário */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 mb-8"
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              {/* Botão primário */}
              <motion.a
                href={whatsappTestUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-base md:text-lg font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all duration-300 gap-2.5 active:scale-95 text-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MessageSquare className="w-5 h-5 flex-shrink-0" />
                <span>Testar 15 dias grátis</span>
              </motion.a>

              {/* Botão secundário */}
              <motion.button
                type="button"
                data-action="open-sofia"
                onClick={handleOpenDemo}
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 bg-slate-900 hover:bg-slate-800 text-white text-base md:text-lg font-bold rounded-xl shadow-md transition-all duration-300 gap-2.5 active:scale-95 cursor-pointer text-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play className="w-4 h-4 flex-shrink-0 fill-current text-emerald-400" />
                <span>Ver demonstração</span>
              </motion.button>
            </motion.div>

            {/* Pílulas de confiança: Empresa angolana legalizada · Suporte em português por WhatsApp · Configuração em poucos dias */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-5 border-t border-gray-150 max-w-2xl mx-auto lg:mx-0 text-left"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
              }}
            >
              <div className="flex items-center gap-2.5 bg-slate-50/80 px-3 py-2.5 rounded-xl border border-gray-200/80">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-xs font-semibold text-gray-800 leading-tight">
                  Empresa angolana legalizada
                </span>
              </div>

              <div className="flex items-center gap-2.5 bg-slate-50/80 px-3 py-2.5 rounded-xl border border-gray-200/80">
                <Headphones className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-xs font-semibold text-gray-800 leading-tight">
                  Suporte em português por WhatsApp
                </span>
              </div>

              <div className="flex items-center gap-2.5 bg-slate-50/80 px-3 py-2.5 rounded-xl border border-gray-200/80">
                <Zap className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span className="text-xs font-semibold text-gray-800 leading-tight">
                  Configuração em poucos dias
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Lado direito do topo: pré-visualização da demo (conversa + ficha) */}
          <div className="lg:w-5/12 w-full flex flex-col items-center justify-center">
            <motion.div
              className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 p-3.5 sm:p-4 rounded-3xl border border-slate-800 shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {/* Título acima da demonstração */}
              <div className="text-center mb-2.5">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
                  <Play className="w-3.5 h-3.5" />
                  Veja a Sofia a atender um paciente
                </span>
              </div>

              {/* WhatsApp Interface Mockup Header */}
              <div className="bg-[#075E54] text-white px-3.5 py-2.5 rounded-2xl flex items-center justify-between mb-3 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-white text-sm border-2 border-white/30">
                    S
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-sm leading-none">Sofia · Secretária Digital</p>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 fill-emerald-500" />
                    </div>
                    <p className="text-[11px] text-emerald-100/90 leading-tight mt-0.5">Online 24 horas • Atendimento da Clínica</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold bg-emerald-700/80 px-2 py-0.5 rounded-full text-emerald-100">
                  Ao Vivo
                </span>
              </div>

              {/* Chat Simulation Area */}
              <div className="bg-[#0b141a] rounded-2xl p-3 space-y-2.5 text-xs mb-3 border border-slate-800/80">
                {/* Aviso visível junto ao chat */}
                <div className="bg-amber-950/70 border border-amber-500/40 text-amber-200 text-[11px] px-2.5 py-1.5 rounded-lg text-center font-medium leading-snug">
                  Demonstração com dados fictícios. Não escreva dados de saúde reais.
                </div>

                {/* Paciente Msg */}
                <div className="flex justify-end">
                  <div className="bg-[#005c4b] text-emerald-50 rounded-2xl rounded-tr-xs px-3.5 py-2 max-w-[85%] shadow-sm">
                    <p className="leading-snug">Boa tarde! Queria marcar consulta de Clínica Geral para amanhã à tarde.</p>
                    <p className="text-[9px] text-emerald-300/80 text-right mt-1">14:32 ✓✓</p>
                  </div>
                </div>

                {/* Sofia Msg */}
                <div className="flex justify-start">
                  <div className="bg-[#202c33] text-slate-100 rounded-2xl rounded-tl-xs px-3.5 py-2 max-w-[88%] shadow-sm border border-slate-700/40">
                    <p className="leading-snug">
                      Olá! Temos vaga amanhã às <strong>15h30</strong> com a <strong>Dra. Rosa</strong>. Qual é o seu nome completo para pré-agendar?
                    </p>
                    <p className="text-[9px] text-slate-400 text-right mt-1">14:32</p>
                  </div>
                </div>

                {/* Paciente Msg 2 */}
                <div className="flex justify-end">
                  <div className="bg-[#005c4b] text-emerald-50 rounded-2xl rounded-tr-xs px-3.5 py-1.5 max-w-[85%] shadow-sm">
                    <p className="leading-snug font-medium">Moisés Domingos.</p>
                    <p className="text-[9px] text-emerald-300/80 text-right mt-0.5">14:33 ✓✓</p>
                  </div>
                </div>

                {/* Sofia Confirmation */}
                <div className="flex justify-start">
                  <div className="bg-[#202c33] text-slate-100 rounded-2xl rounded-tl-xs px-3.5 py-2 max-w-[90%] shadow-sm border border-slate-700/40">
                    <p className="leading-snug">
                      Perfeito, Moisés! Consulta registada para amanhã às 15h30. Já ativei o lembrete automático 24h e 2h antes.
                    </p>
                    <p className="text-[9px] text-emerald-400 text-right mt-1 font-semibold">Lembrete agendado ✓</p>
                  </div>
                </div>
              </div>

              {/* Ficha do Paciente (CRM) Synchronized Box */}
              <div className="bg-white rounded-2xl p-3.5 shadow-md border border-gray-100 text-left">
                <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-[11px] font-bold text-gray-800 uppercase tracking-wide">
                      Ficha do Paciente (Triagem Automática)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Confirmada
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-50 p-2 rounded-lg border border-gray-150">
                    <span className="text-[9px] uppercase font-bold text-gray-400 block">Paciente</span>
                    <span className="font-bold text-gray-900 truncate block">Moisés Domingos</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-gray-150">
                    <span className="text-[9px] uppercase font-bold text-gray-400 block">Especialidade</span>
                    <span className="font-semibold text-gray-900 truncate block">Clínica Geral</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-gray-150">
                    <span className="text-[9px] uppercase font-bold text-gray-400 block">Médico</span>
                    <span className="font-semibold text-gray-900 truncate block">Dra. Rosa</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-gray-150">
                    <span className="text-[9px] uppercase font-bold text-gray-400 block">Data / Hora</span>
                    <span className="font-semibold text-emerald-700 truncate block">Amanhã • 15:30</span>
                  </div>
                </div>
              </div>

              {/* Trigger button to open full interactive demo */}
              <div className="mt-3">
                <button
                  type="button"
                  data-action="open-sofia"
                  onClick={handleOpenDemo}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Testar conversa ao vivo com a Sofia</span>
                </button>
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;