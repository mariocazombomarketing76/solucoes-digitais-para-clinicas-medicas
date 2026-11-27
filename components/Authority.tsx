import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Landmark } from 'lucide-react';

const Authority: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="sobre" ref={ref} className="py-16 md:py-24 bg-white overflow-hidden border-b border-gray-100">
      {/* SEO Tags */}
      <h2 className="sr-only">Marketing Digital para Clínicas</h2>

      <div className="container mx-auto px-6">
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-8 md:p-14 border border-gray-200 shadow-sm max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            
            {/* Left side: Photo with fallback */}
            <div className="w-full lg:w-1/3 flex flex-col items-center">
              <div className="relative w-36 h-36 rounded-2xl bg-blue-50 flex items-center justify-center overflow-hidden border border-slate-200 shadow-sm mb-4">
                <img 
                  src="https://i.imgur.com/oTgNEGC.jpg" 
                  alt="Especialista Mário Cazombo" 
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                  className="w-full h-full object-cover object-[center_20%]" 
                />
              </div>
              <p className="text-sm font-bold text-slate-900">Mário Cazombo</p>
              <p className="text-xs text-blue-700 font-semibold text-center">Especialista em Soluções Digitais para Clínicas</p>
            </div>

            {/* Right side: Institutional Copy */}
            <div className="w-full lg:w-2/3 space-y-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-700">
                Quem Somos
              </p>
              <h3 className="text-3xl font-bold text-slate-900 font-display">
                Sobre a Clínicas Digitais
              </h3>
              
              <p className="text-slate-700 leading-relaxed text-base">
                A <strong>Clínicas Digitais</strong> é uma iniciativa da <strong>Mario Cazombo e Filhos, Lda</strong>, especializada em Inteligência Artificial de Voz e automação de agendamentos para clínicas privadas, consultórios e centros médicos em Angola.
              </p>
              <p className="text-slate-700 leading-relaxed text-base">
                Desenvolvemos recepcionistas virtuais de voz integradas em tempo real ao calendário clínico para garantir que nenhuma chamada se perca e que a sua equipa foque no atendimento presencial de excelência.
              </p>

              {/* Legal Credentials Box */}
              <div className="pt-6 border-t border-slate-200">
                <div className="flex items-start gap-3">
                  <div className="bg-slate-200/70 text-slate-700 p-2 rounded-lg">
                    <Landmark className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold">Entidade Gestora</p>
                    <p className="text-sm font-bold text-slate-900">Mario Cazombo e Filhos, Lda</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Authority;