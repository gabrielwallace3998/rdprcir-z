'use client';

import { useMemo } from 'react';

/**
 * COMPONENTE TechnicalData
 * Exibe barras de biometria e fluxos de dados técnicos simulados.
 */
export default function TechnicalData({ compact = false }: { compact?: boolean }) {
  
  // Barras de Biometria (Efeito de carregamento e pulso)
  const biometricBars = useMemo(() => [
    { label: 'BATIMENTO', value: '142 BPM', width: '75%', color: 'bg-accent-blood' },
    { label: 'ADRENALINA', value: '0.84 MG/L', width: '92%', color: 'bg-accent-blood/80' },
    { label: 'DEGRADAÇÃO', value: '42.1%', width: '45%', color: 'bg-white/40' },
  ], []);

  return (
    <div className={`space-y-4 font-jetbrains ${compact ? 'max-w-xs' : 'max-w-md'}`}>
      
      {/* Fluxo de Dados Digitais */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-end mb-2">
            <span className="text-[8px] md:text-[10px] font-black text-accent-blood tracking-widest uppercase">Biometria em Tempo Real</span>
            <span className="text-[7px] md:text-[9px] text-white/30 font-mono animate-pulse">MONITORAMENTO ATIVO</span>
        </div>
        
        {/* Barras de Status */}
        <div className="space-y-3">
          {biometricBars.map((bar, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-[7px] md:text-[9px] font-bold text-white/70">
                <span>{bar.label}</span>
                <span className="text-accent-blood">{bar.value}</span>
              </div>
              <div className="h-[2px] w-full bg-white/5 relative overflow-hidden">
                {/* Camada de Fundo (Barra) */}
                <div 
                  className={`absolute top-0 left-0 h-full ${bar.color} transition-all duration-1000 ease-out`}
                  style={{ width: bar.width }}
                />
                {/* Efeito de Scan (Animação Shimmer) */}
                <div className="absolute top-0 left-0 h-full w-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicadores de Status Binários (Mock) */}
      {!compact && (
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent-blood animate-pulse" />
            <span className="text-[8px] md:text-[10px] text-white/50 font-black uppercase">FALHA_MOTORA: POSITIVA</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent-green opacity-40" />
            <span className="text-[8px] md:text-[10px] text-white/50 font-black uppercase">SINAPSE_ATIVA: 12%</span>
          </div>
        </div>
      )}
    </div>
  );
}
