'use client';

import Image from 'next/image';
import TechnicalData from './TechnicalData';

/**
 * COMPONENTE IDCard
 * Cartão de Identificação Biométrica no estilo Umbrella Corporation.
 */
export default function IDCard() {
  return (
    <div className="relative w-full bg-black/60 backdrop-blur-xl border border-accent-blood/50 rounded-lg overflow-hidden font-jetbrains group shadow-[0_0_50px_rgba(139,0,0,0.2)]">
      
      {/* Barra de Cabeçalho Institucional */}
      <div className="bg-black/90 border-b border-accent-blood/30 p-2 flex justify-between items-center px-4 relative z-10">
        <div className="flex items-center gap-2">
            <div className="w-5 h-5 md:w-6 md:h-6 relative">
                <Image 
                    src="/assets/logo.png" 
                    alt="Logo Umbrella" 
                    fill 
                    className="object-contain" 
                    sizes="(max-width: 768px) 24px, 32px" 
                />
            </div>
            <span className="font-serif text-white text-xs md:text-base tracking-tight italic">Umbrella corp.</span>
        </div>
        <span className="text-white font-bold text-xs md:text-sm tracking-widest">UBCS</span>
      </div>

      <div className="flex h-full p-4 gap-4 relative z-10">
        
        {/* Barra Numérica de Segurança (Lateral) */}
        <div className="flex flex-col text-[8px] md:text-[10px] text-accent-blood font-mono gap-1 leading-none select-none opacity-80">
            {['9','4','8','-','6','3','7','-','3','2','6','-','9','1','5'].map((n, i) => (
                <span key={i}>{n}</span>
            ))}
        </div>

        {/* Área de Conteúdo Principal */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex gap-5">
            
            {/* Moldura da Foto do Sujeito */}
            <div className="w-28 h-36 md:w-36 md:h-44 border-2 border-accent-blood/40 p-1 bg-black/40 shadow-[0_0_20px_rgba(139,0,0,0.1)]">
              <div className="relative w-full h-full grayscale hover:grayscale-0 transition-all duration-700 cursor-crosshair">
                <Image 
                  src="/assets/perfil.png" 
                  alt="Perfil do Sujeito" 
                  fill 
                  className="object-cover"
                  sizes="(max-width: 768px) 112px, 144px"
                />
                {/* Efeitos de Scan e Cor */}
                <div className="absolute inset-0 bg-accent-blood/10 mix-blend-color" />
                <div className="absolute inset-0 border border-white/10" />
              </div>
            </div>

            {/* Detalhes do Registro */}
            <div className="flex-1 space-y-2 pt-1">
              <span className="text-[8px] md:text-[10px] text-accent-blood font-black block uppercase tracking-[0.3em] animate-pulse">PASSE DE ACESSO - NÍVEL 4</span>
              <div className="space-y-1.5 md:space-y-2 mt-4">
                <DetailRow label="NOME" value="ESPÉCIME Z" />
                <DetailRow label="POSTO" value="ESTÁGIO FINAL" />
                <DetailRow label="SANGUE" value="T-TYPE POS" />
                <DetailRow label="ID #" value="U-1998-Z" />
                <DetailRow label="STATUS" value="INFECTADO" color="text-accent-blood" />
              </div>
            </div>
          </div>

          {/* Rodapé do Cartão */}
          <div className="flex justify-between items-end mt-2">
            <div className="space-y-2">
                <div className="border border-accent-blood/40 p-2 md:p-3 px-4 bg-accent-blood/10 backdrop-blur-md">
                    <span className="text-[10px] md:text-xs font-bold text-white/70 block tracking-widest uppercase">Nível de Segurança</span>
                    <span className="text-xl md:text-3xl font-black text-accent-blood italic leading-none tracking-tighter">CLEARANCE C</span>
                </div>
                {/* Mock de Código de Barras Dinâmico */}
                <div className="flex gap-0.5 h-8 md:h-10 opacity-80 items-end">
                    {[2,1,4,1,2,6,2,1,3,1,5,2,4,1,2,1,5].map((w, i) => (
                        <div key={i} className="bg-white/90" style={{ width: `${w}px`, height: `${60 + Math.random() * 40}%` }} />
                    ))}
                </div>
            </div>
            
            <div className="text-right flex flex-col items-end pb-1">
                <span className="text-[7px] md:text-[9px] text-white/60 font-black uppercase tracking-widest leading-relaxed">
                    White Umbrella Biological<br/>Divisão de Pesquisa
                </span>
            </div>
          </div>
          
          {/* Dados Técnicos Integrados (Compactos) */}
          <div className="mt-auto border-t border-white/10 pt-4 pb-6">
            <TechnicalData compact />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * COMPONENTE AUXILIAR: Linha de Detalhe
 */
function DetailRow({ label, value, color = "text-white" }: { label: string, value: string, color?: string }) {
  return (
    <div className="flex gap-3 md:gap-4 items-baseline border-b border-white/5 pb-1">
      <span className="text-[8px] md:text-[10px] text-accent-blood/50 font-black w-14 md:w-16 tracking-tighter uppercase">{label}:</span>
      <span className={`text-xs md:text-sm font-bold tracking-tight ${color}`}>{value}</span>
    </div>
  );
}
