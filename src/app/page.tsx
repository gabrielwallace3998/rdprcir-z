'use client';

import { useState, useEffect, useMemo } from 'react';
import HUD from '@/components/HUD';
import TechnicalData from '@/components/TechnicalData';
import IDCard from '@/components/IDCard';
import Scene3D from '@/components/Scene3D';
import { ShieldAlert, Minus, Maximize2, ChevronUp } from 'lucide-react';

/**
 * COMPONENTE PRINCIPAL (HOME)
 * Gerencia o estado global do scroll, configurações de cena 3D e interface do usuário.
 */
export default function Home() {
  // --- ESTADOS ---
  const [currentSection, setCurrentSection] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileView, setIsMobileView] = useState(false);
  const [minimizedSections, setMinimizedSections] = useState<Record<number, boolean>>({});

  // --- CONFIGURAÇÕES DA CENA 3D (Desktop e Mobile) ---
  const [configs, setConfigs] = useState({
    // Seção 01: Estado Inicial (Parado)
    s1D: {
      modelPos: [3.7, -9.3, -0.4] as [number, number, number],
      modelRotation: [-0.031, -0.471, -0.031] as [number, number, number],
      modelScale: 5.8,
      pointLight: { pos: [-3.5, -0.7, -3.9] as [number, number, number], intensity: 49, color: "#ff0000" },
      spotLight: { pos: [20, 6.3, 20] as [number, number, number], intensity: 626, color: "#ffffff", angle: 0.3 },
      room: { floorColor: "#000000", wallColor: "#470000", gridColor: "#1a1a1a", gridOpacity: 0.1, roomPos: [0, -6.5, 0] as [number, number, number] },
      cardPos: [10, 66] as [number, number],
      cardWidth: 680
    },
    s1M: {
      modelPos: [0, -6, 0] as [number, number, number],
      modelRotation: [-0.0315, 0.2184, -0.0315] as [number, number, number],
      modelScale: 4.5,
      pointLight: { pos: [9.5, 11.4, 0.9] as [number, number, number], intensity: 57, color: "#ff0000" },
      spotLight: { pos: [-11.6, 9, 4.5] as [number, number, number], intensity: 626, color: "#ffffff", angle: 0.3 },
      room: { floorColor: "#000000", wallColor: "#470000", gridColor: "#1a1a1a", gridOpacity: 0.1, roomPos: [0, -6.5, 0] as [number, number, number] },
      cardPos: [56, 90] as [number, number],
      cardWidth: 370
    },
    // Seção 02: Locomoção Básica (Andando)
    s2D: {
      modelPos: [3, -3.4, -2.3] as [number, number, number],
      modelRotation: [-0.031, -0.471, -0.031] as [number, number, number],
      modelScale: 2.3,
      pointLight: { pos: [-3.5, -0.7, -3.9] as [number, number, number], intensity: 771, color: "#ff0000" },
      spotLight: { pos: [20, 6.3, 20] as [number, number, number], intensity: 626, color: "#ffffff", angle: 0.3 },
      room: { floorColor: "#000000", wallColor: "#470000", gridColor: "#1a1a1a", gridOpacity: 0.1, roomPos: [0, -6.5, 0] as [number, number, number] },
      cardPos: [11, 66] as [number, number],
      cardWidth: 690
    },
    s2M: {
      modelPos: [-1.4, -3, -12.5] as [number, number, number],
      modelRotation: [-0.0315, 0.2184, -0.0315] as [number, number, number],
      modelScale: 3.6,
      pointLight: { pos: [9.5, 11.4, 0.9] as [number, number, number], intensity: 420, color: "#ff0000" },
      spotLight: { pos: [-11.6, 9, 4.5] as [number, number, number], intensity: 626, color: "#ffffff", angle: 0.3 },
      room: { floorColor: "#000000", wallColor: "#470000", gridColor: "#1a1a1a", gridOpacity: 0.1, roomPos: [0, -6.5, 0] as [number, number, number] },
      cardPos: [53, 88] as [number, number],
      cardWidth: 350
    },
    // Seção 03: Predador (Correndo)
    s3D: {
      modelPos: [5.4, -2.1, -12] as [number, number, number],
      modelRotation: [-0.031, -2.6515, -0.031] as [number, number, number],
      modelScale: 2.1,
      pointLight: { pos: [-3.5, -0.7, -3.9] as [number, number, number], intensity: 1480, color: "#ff0000" },
      spotLight: { pos: [20, 6.3, 20] as [number, number, number], intensity: 800, color: "#ff0000", angle: 0.3 },
      room: { floorColor: "#000000", wallColor: "#470000", gridColor: "#1a1a1a", gridOpacity: 0.1, roomPos: [0, -6.5, 0] as [number, number, number] },
      cardPos: [9, 67] as [number, number],
      cardWidth: 690
    },
    s3M: {
      modelPos: [-1.5, -1.8, -13.3] as [number, number, number],
      modelRotation: [-0.0315, 0.2184, -0.0315] as [number, number, number],
      modelScale: 2.1,
      pointLight: { pos: [9.5, 11.4, 0.9] as [number, number, number], intensity: 800, color: "#ff0000" },
      spotLight: { pos: [-11.6, 9, 4.5] as [number, number, number], intensity: 400, color: "#ff0000", angle: 0.3 },
      room: { floorColor: "#000000", wallColor: "#470000", gridColor: "#1a1a1a", gridOpacity: 0.1, roomPos: [0, -6.5, 0] as [number, number, number] },
      cardPos: [50, 85] as [number, number],
      cardWidth: 350
    }
  });

  // --- EFEITOS E LÓGICA ---

  // Detecção de tamanho de tela (Mobile vs Desktop)
  useEffect(() => {
    const check = () => setIsMobileView(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Monitoramento do Scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const windowHeight = window.innerHeight || 1;
      const progress = scrollPos / windowHeight;
      setScrollProgress(progress);
      const section = Math.round(progress);
      if (section !== currentSection) setCurrentSection(section);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentSection]);

  // Simulação de Carregamento
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(prev + Math.random() * 20, 100);
      });
    }, 400);
    return () => clearInterval(timer);
  }, []);

  // Finalização do Carregamento
  useEffect(() => {
    if (loadingProgress === 100) {
      const timeout = setTimeout(() => setIsLoading(false), 600);
      return () => clearTimeout(timeout);
    }
  }, [loadingProgress]);

  // Funções Utilitárias
  const toggleMinimize = (id: number) => {
    setMinimizedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleConfigUpdate = (key: string, newConfig: any) => {
    setConfigs(prev => ({ ...prev, [key]: newConfig }));
  };

  // Partículas decorativas de fundo
  const particles = useMemo(() => Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
  })), []);

  // Configuração ativa para renderização baseada no scroll e dispositivo
  const activeS1 = isMobileView ? configs.s1M : configs.s1D;
  const activeS2 = isMobileView ? configs.s2M : configs.s2D;
  const activeS3 = isMobileView ? configs.s3M : configs.s3D;

  // --- RENDERIZAÇÃO ---

  // Tela de Loading
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#050505] flex items-center justify-center font-jetbrains overflow-hidden px-6">
        <div className="absolute inset-0 scanlines opacity-30" />
        <div className="relative z-10 p-12 blood-border bg-black/80 backdrop-blur-xl max-w-2xl w-full">
          <div className="flex flex-col items-center gap-10">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="relative w-48 h-48 mb-4 border border-accent-blood/30 bg-black/40 shadow-[0_0_30px_rgba(139,0,0,0.2)]">
                <img 
                  src="/assets/carregamento-gif.gif" 
                  alt="Carregando..." 
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <h2 className="text-xl text-accent-blood font-bold tracking-[0.6em] uppercase animate-pulse">ESTABELECENDO CONEXÃO</h2>
              <p className="text-[10px] text-white/40 tracking-[0.3em] uppercase">Base de Dados Umbrella Corp // Protocolo 4.0.1</p>
            </div>
            <div className="w-full space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] text-accent-green font-mono animate-pulse">BYPASSING QUANTUM FIREWALL...</span>
                <span className="text-2xl font-bold text-white tabular-nums">{Math.floor(loadingProgress)}%</span>
              </div>
              <div className="w-full h-1 bg-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-accent-blood/30 transition-all duration-300" style={{ width: `${loadingProgress}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className={`font-jetbrains relative h-[400vh] transition-colors duration-500 selection:bg-accent-blood selection:text-white ${currentSection >= 2 ? 'bg-[#1a0000]' : 'bg-black'}`}>
      {/* 1. HUD GLOBAL E INTERFACES FIXAS */}
      <HUD />
      
      {/* Efeito de Sirene (Ativo na seção final) */}
      {currentSection === 2 && (
        <div className="fixed inset-0 z-50 pointer-events-none animate-pulse bg-accent-blood/10 mix-blend-overlay" />
      )}

      {/* 2. CAMADA DE FUNDO COM PARTÍCULAS */}
      <div className="sticky top-0 h-screen w-full pointer-events-none z-20 overflow-hidden">
        <div className="absolute inset-0">
          {particles.map((p) => (
            <div key={p.id} className="absolute w-1 h-1 bg-accent-blood rounded-full animate-float" style={{ left: p.left, top: p.top, animationDelay: p.delay, opacity: 0.6 }} />
          ))}
        </div>
        <div className="absolute inset-0 transition-opacity duration-300 bg-gradient-to-b from-transparent via-black/40 to-black/90" style={{ opacity: Math.min(1, scrollProgress) }} />
      </div>

      {/* 3. CONTEÚDO DAS SEÇÕES */}
      <div className="relative z-40 -mt-[100vh]">
        
        {/* SEÇÃO 01: Identificação do Espécime */}
        <section className="h-screen w-full relative scroll-snap-align-start overflow-hidden">
          <div className={`absolute transition-all duration-300 ${isMobileView && minimizedSections[0] ? 'translate-y-20 scale-95 opacity-50' : ''}`}
            style={{
              left: `${activeS1.cardPos[0]}%`,
              top: `${activeS1.cardPos[1]}%`,
              transform: `translate(-${activeS1.cardPos[0]}%, -${activeS1.cardPos[1]}%) translateY(${Math.max(0, (Math.abs(scrollProgress - 0) - 0.3)) * 100}px)`,
              opacity: Math.max(0, Math.min(1, 1 - (Math.abs(scrollProgress - 0) - 0.3) * 4)),
              maxWidth: `${activeS1.cardWidth}px`,
              width: '90%'
            }}
          >
            {isMobileView && (
              <button 
                onClick={() => toggleMinimize(0)}
                className="absolute -top-10 right-0 z-50 p-2 bg-black/60 blood-border text-accent-blood rounded-full backdrop-blur-md"
              >
                {minimizedSections[0] ? <Maximize2 size={16} /> : <Minus size={16} />}
              </button>
            )}
            
            <div className={`transition-all duration-500 overflow-hidden ${isMobileView && minimizedSections[0] ? 'h-0 opacity-0' : 'h-auto opacity-100'}`}>
                <IDCard />
            </div>

            {isMobileView && minimizedSections[0] && (
                <div onClick={() => toggleMinimize(0)} className="bg-black/60 blood-border p-2 px-4 flex items-center justify-between cursor-pointer">
                    <span className="text-[10px] font-black text-accent-blood tracking-widest">ID_CARD [REDUZIDO]</span>
                    <ChevronUp size={12} className="text-accent-blood" />
                </div>
            )}
          </div>
        </section>

        {/* SEÇÃO 02: Locomoção Básica */}
        <section className="h-screen w-full relative scroll-snap-align-start overflow-hidden">
          <div className={`absolute blood-border bg-black/30 backdrop-blur-xl p-3 md:p-4 transition-all duration-300 ${isMobileView && minimizedSections[1] ? 'translate-y-20 scale-95 opacity-50' : ''}`}
            style={{
              left: `${activeS2.cardPos[0]}%`,
              top: `${activeS2.cardPos[1]}%`,
              transform: `translate(-${activeS2.cardPos[0]}%, -${activeS2.cardPos[1]}%) translateY(${Math.max(0, (Math.abs(scrollProgress - 1) - 0.3)) * 100}px)`,
              opacity: Math.max(0, Math.min(1, 1 - (Math.abs(scrollProgress - 1) - 0.3) * 4)),
              maxWidth: `${activeS2.cardWidth}px`,
              width: '90%'
            }}
          >
            {isMobileView && (
              <button 
                onClick={() => toggleMinimize(1)}
                className="absolute top-2 right-2 z-50 p-1.5 bg-black/40 border border-white/10 text-white/60 rounded-sm"
              >
                {minimizedSections[1] ? <Maximize2 size={14} /> : <Minus size={14} />}
              </button>
            )}

            <div className={`transition-all duration-500 overflow-hidden ${isMobileView && minimizedSections[1] ? 'h-0 opacity-0' : 'h-auto opacity-100'}`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="h-[1px] w-6 md:w-10 bg-accent-blood shadow-[0_0_10px_#8B0000]" />
                  <span className="text-[7px] md:text-[10px] font-bold text-accent-blood tracking-[0.4em] uppercase">Confidencial</span>
                </div>
                <h1 className="text-lg md:text-3xl font-bold text-white tracking-tighter leading-tight mb-2 uppercase">
                  ESTADO 02: <br /><span className="text-accent-blood opacity-90 text-[10px] md:text-lg font-black">LOCOMOÇÃO BÁSICA</span>
                </h1>
                <p className="text-[9px] md:text-[12px] text-white/70 leading-relaxed mb-3 font-mono uppercase tracking-tight">
                  O espécime demonstra persistência muscular severa. O instinto de busca por biomassa é o único drive neural ativo detectado.
                </p>
                <TechnicalData compact />
            </div>

            {isMobileView && minimizedSections[1] && (
                <div onClick={() => toggleMinimize(1)} className="flex items-center justify-between cursor-pointer py-1">
                    <span className="text-[10px] font-black text-accent-blood tracking-widest uppercase">ESTADO 02 [REDUZIDO]</span>
                    <ChevronUp size={12} className="text-accent-blood" />
                </div>
            )}
          </div>
        </section>

        {/* SEÇÃO 03: Predador (Alerta Crítico) */}
        <section className="h-screen w-full relative scroll-snap-align-start overflow-hidden">
          <div className={`absolute blood-border border-accent-blood bg-black/30 backdrop-blur-xl p-3 md:p-4 transition-all duration-300 shadow-[0_0_30px_rgba(139,0,0,0.5)] ${isMobileView && minimizedSections[2] ? 'translate-y-20 scale-95 opacity-50' : ''}`}
            style={{
              left: `${activeS3.cardPos[0]}%`,
              top: `${activeS3.cardPos[1]}%`,
              transform: `translate(-${activeS3.cardPos[0]}%, -${activeS3.cardPos[1]}%) translateY(${Math.max(0, (Math.abs(scrollProgress - 2) - 0.3)) * 100}px)`,
              opacity: Math.max(0, Math.min(1, 1 - (Math.abs(scrollProgress - 2) - 0.3) * 4)),
              maxWidth: `${activeS3.cardWidth}px`,
              width: '90%'
            }}
          >
             {isMobileView && (
              <button 
                onClick={() => toggleMinimize(2)}
                className="absolute top-2 right-2 z-50 p-1.5 bg-black/40 border border-accent-blood/30 text-accent-blood rounded-sm"
              >
                {minimizedSections[2] ? <Maximize2 size={14} /> : <Minus size={14} />}
              </button>
            )}

            <div className={`transition-all duration-500 overflow-hidden ${isMobileView && minimizedSections[2] ? 'h-0 opacity-0' : 'h-auto opacity-100'}`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="h-[1px] w-6 md:w-10 bg-accent-blood animate-pulse shadow-[0_0_15px_#ff0000]" />
                  <span className="text-[8px] md:text-[11px] font-black text-accent-blood tracking-[0.4em] uppercase animate-pulse">ALERTA MÁXIMO</span>
                </div>
                <h1 className="text-lg md:text-3xl font-bold text-white tracking-tighter leading-tight mb-2 uppercase">
                  ESTADO 03: <br /><span className="text-accent-blood opacity-90 text-[10px] md:text-lg font-black italic">O PREDADOR</span>
                </h1>
                <p className="text-[9px] md:text-[12px] text-white font-bold leading-relaxed mb-3 uppercase tracking-tight">
                  Surtos de adrenalina necrótica detectados. 
                  <span className="block text-accent-blood animate-pulse">DISTÂNCIA DE SEGURANÇA: COMPROMETIDA.</span>
                </p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="p-1.5 md:p-2 border border-accent-blood/30 bg-accent-blood/5">
                        <span className="text-[6px] md:text-[8px] block opacity-50 text-white">VELOCIDADE</span>
                        <span className="text-[8px] md:text-[12px] font-bold text-accent-blood tracking-tighter">24.5 KM/H</span>
                    </div>
                    <div className="p-1.5 md:p-2 border border-accent-blood/30 bg-accent-blood/5">
                        <span className="text-[6px] md:text-[8px] block opacity-50 text-white">BIOMETRIA</span>
                        <span className="text-[8px] md:text-[12px] font-bold text-accent-blood tracking-tighter">CRÍTICA</span>
                    </div>
                </div>
                <TechnicalData compact />
            </div>

             {isMobileView && minimizedSections[2] && (
                <div onClick={() => toggleMinimize(2)} className="flex items-center justify-between cursor-pointer py-1">
                    <span className="text-[10px] font-black text-accent-blood tracking-widest uppercase italic">ESTADO 03 [ALERTA]</span>
                    <ChevronUp size={12} className="text-accent-blood" />
                </div>
            )}
          </div>
        </section>

        {/* SEÇÃO 04: Grand Finale (Créditos e Encerramento) */}
        <section className="h-screen w-full relative scroll-snap-align-start overflow-hidden flex items-center justify-center">
          {/* Transição para Preto */}
          <div className="absolute inset-0 z-50 bg-black transition-opacity duration-1000 pointer-events-none"
            style={{ opacity: Math.max(0, Math.min(1, 1 - (Math.abs(scrollProgress - 3) * 2))) }}
          />
          
          <div className="relative z-[60] text-center max-w-4xl px-6 transition-all duration-700"
            style={{
              opacity: Math.max(0, Math.min(1, 1 - (Math.abs(scrollProgress - 3) - 0.2) * 5)),
              transform: `scale(${0.8 + Math.max(0, 1 - Math.abs(scrollProgress - 3)) * 0.2}) translateY(${(scrollProgress - 3) * 50}px)`
            }}
          >
            <div className="mb-8 inline-block p-4 border-2 border-accent-blood bg-accent-blood/10 backdrop-blur-xl animate-glitch-text">
                <ShieldAlert size={64} className="text-accent-blood mx-auto mb-4 animate-pulse" />
                <h1 className="text-4xl md:text-6xl font-black text-accent-blood tracking-tighter mb-2">
                    FALHA_CRÍTICA
                </h1>
                <div className="h-[2px] w-full bg-accent-blood animate-shimmer" />
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl md:text-5xl font-black text-white tracking-[0.2em] uppercase leading-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                    A INFECÇÃO NÃO PODE <br />
                    <span className="text-accent-blood animate-pulse italic">SER CONTIDA.</span>
                </h2>
                
                <p className="text-xs md:text-sm text-white/60 font-mono tracking-widest max-w-2xl mx-auto uppercase">
                    Protocolo de Auto-Destruição da Colmeia iniciado. <br />
                    Falha na contenção do Espécime Z detectada em 100% dos setores.
                </p>

                <div className="pt-12 md:pt-20 border-t border-white/10 mt-20">
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-12 h-12 relative opacity-40 grayscale hover:grayscale-0 transition-all cursor-pointer">
                            <img src="/assets/logo.png" alt="Umbrella" className="w-full h-full object-contain" />
                        </div>
                        
                        <div className="space-y-2">
                            <p className="text-[10px] md:text-xs text-white/40 tracking-[0.4em] uppercase">Projeto para fins de Estudo</p>
                            <div className="flex flex-wrap justify-center gap-3 text-[8px] md:text-[10px] text-accent-green font-mono uppercase tracking-widest opacity-60">
                                <span>React 19</span>
                                <span>•</span>
                                <span>Next.js 16</span>
                                <span>•</span>
                                <span>Three.js</span>
                                <span>•</span>
                                <span>Tailwind CSS</span>
                            </div>
                            <p className="text-lg md:text-xl font-black text-white tracking-widest uppercase mt-4">
                                DESENVOLVIDO POR <span className="text-accent-blood italic">GABRIEL LIMA</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* Efeitos de Overlay Final */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute top-1/4 left-0 w-full h-[1px] bg-accent-blood animate-data-stream" style={{ animationDelay: '1s' }} />
            <div className="absolute top-2/3 left-0 w-full h-[1px] bg-accent-blood animate-data-stream" style={{ animationDelay: '3s' }} />
          </div>
        </section>
      </div>

      {/* 4. CAMADA 3D (RENDERIZADA POR TRÁS DA UI) */}
      <Scene3D progress={scrollProgress} configs={configs} onUpdate={handleConfigUpdate} />
    </main>
  );
}
