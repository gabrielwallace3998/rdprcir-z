'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

/**
 * COMPONENTE HUD (Heads-Up Display)
 * Interface fixa que sobrepõe a aplicação com dados técnicos e branding.
 */
export default function HUD() {
  const [time, setTime] = useState('');
  const [hex, setHex] = useState('0x4F2A');

  // Relógio e ID de Sessão dinâmico
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('pt-BR', { hour12: false }));
      setHex(`0x${Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0')}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* 1. BARRA DE SCANNER VERDE (Efeito de varredura visual) */}
      <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-accent-green/20 shadow-[0_0_8px_rgba(0,255,65,0.3)] animate-scanner" />
        <div className="absolute top-0 left-0 w-full h-[100px] bg-gradient-to-b from-accent-green/5 to-transparent animate-scanner opacity-10" />
      </div>

      {/* 2. OVERLAYS DE DADOS TÉCNICOS */}
      <header className="fixed inset-0 p-6 z-[90] font-jetbrains pointer-events-none select-none">
        
        {/* Superior Esquerda: Informações do Sujeito */}
        <div className="absolute top-8 left-8 flex flex-col gap-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-6 relative opacity-80">
                <Image 
                    src="/assets/logo.png" 
                    alt="Logo Umbrella" 
                    fill 
                    className="object-contain" 
                    sizes="24px" 
                />
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] md:text-xs font-black text-accent-blood tracking-[0.3em] uppercase leading-none">U. CORP BIOHAZARD</span>
                <span className="text-[8px] md:text-[10px] text-white/40 tracking-widest uppercase">Protocolo de Pesquisa 4.0</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-accent-blood animate-pulse rounded-full shadow-[0_0_8px_#ff0000]" />
            <span className="text-[9px] md:text-[11px] font-bold text-accent-blood tracking-widest uppercase">MODO_REC: MONITORAMENTO_AO_VIVO</span>
          </div>

          <div className="text-[9px] md:text-[11px] text-white/60 flex gap-4 font-mono tracking-tighter mt-1 bg-black/20 p-1 px-2 border-l border-accent-blood">
            <span className="animate-pulse">CONFIDENCIAL // TOP SECRET</span>
            <span className="opacity-40">ACESSO_RESTRITO</span>
          </div>
        </div>

        {/* Superior Direita: Status e Relógio */}
        <div className="absolute top-8 right-8 flex flex-col items-end gap-1 text-right">
          <div className="flex items-center gap-2">
            <div className="text-[9px] md:text-[11px] border border-accent-blood px-2 py-0.5 text-accent-blood font-black uppercase animate-pulse bg-accent-blood/5">
              [SISTEMA_TRAVADO: ON]
            </div>
            <div className="text-[9px] md:text-[11px] bg-accent-blood px-2 py-0.5 text-white font-black uppercase shadow-[0_0_15px_rgba(139,0,0,0.4)]">
              BIO_SEGURANÇA
            </div>
          </div>
          <div className="text-2xl md:text-4xl font-mono text-white tabular-nums tracking-tighter mt-2 drop-shadow-lg">
            {time || '00:00:00'}
          </div>
          <div className="text-[9px] md:text-[11px] text-accent-green/60 font-mono tracking-widest">
            ID_SESSÃO: {hex}
          </div>
        </div>

        {/* Decoração Canto Inferior Esquerdo */}
        <div className="absolute bottom-10 left-10 opacity-20 flex flex-col gap-1">
            <div className="h-[1px] w-20 bg-white/40" />
            <span className="text-[7px] text-white/40 font-mono uppercase">Rede Umbrella // Setor 7</span>
        </div>

      </header>
    </>
  );
}
