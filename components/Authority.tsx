import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Building2, ShieldCheck, FileText, Landmark } from 'lucide-react';

const Authority: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-16 md:py-24 bg-white overflow-hidden border-b border-gray-100">
      {/* SEO Tags */}
      <h2 className="sr-only">Marketing Digital para Clínicas</h2>

      <div className="container mx-auto px-6">
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-8 md:p-14 border border-gray-200 shadow-sm max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            
            {/* Left side: Photo with micro frame to reduce freelancer look */}
            <div className="w-full lg:w-1/3 flex flex-col items-center">
              <div className="relative w-36 h-36 rounded-2xl bg-white flex items-center justify-center overflow-hidden border-2 border-gray-200 shadow-sm mb-4">
                <img 
                  src="https://i.imgur.com/oTgNEGC.jpg" 
                  alt="Especialista Mário Cazombo" 
                  className="w-full h-full object-cover object-[center_20%]" 
                />
              </div>
              <p className="text-sm font-bold text-gray-800">Mário Cazombo</p>
              <p className="text-xs text-blue-600 font-semibold text-center">Especialista em Marketing & Soluções Digitais</p>
            </div>

            {/* Right side: Institutional Copy */}
            <div className="w-full lg:w-2/3 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                Quem Somos
              </span>
              <h3 className="text-3xl font-extrabold text-gray-900 font-display">
                Sobre a ClinicasDigitais
              </h3>
              
              <p className="text-gray-700 leading-relaxed text-base">
                A <strong>ClinicasDigitais</strong> é uma iniciativa da <strong>Mario Cazombo e Filhos, Lda</strong>, especializada em transformação digital e consultoria tecnológica para clínicas privadas, consultórios e laboratórios de saúde em Angola.
              </p>
              <p className="text-gray-700 leading-relaxed text-base">
                Desenvolvemos ecossistemas recorrentes estruturados (websites, backups, automação inteligente e otimização no Google) para aproximar pacientes de tratamentos de excelência, com conformidade legal angolana completa.
              </p>

              {/* Legal Credentials Badge Box */}
              <div className="pt-6 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="bg-slate-200/60 text-slate-700 p-2 rounded-lg">
                    <Landmark className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">Entidade Gestora</p>
                    <p className="text-sm font-bold text-gray-800">Mario Cazombo e Filhos, Lda</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-slate-200/60 text-slate-700 p-2 rounded-lg">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">NIF de Angola</p>
                    <p className="text-sm font-mono font-bold text-gray-800">5417437034</p>
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