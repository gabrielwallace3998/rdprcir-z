'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, PerspectiveCamera, Environment, ContactShadows, Float } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';

/**
 * INTERFACES E TIPOS
 */
export interface SceneConfig {
  modelPos: [number, number, number];
  modelRotation: [number, number, number];
  modelScale: number;
  pointLight: {
    pos: [number, number, number];
    intensity: number;
    color: string;
  };
  spotLight: {
    pos: [number, number, number];
    intensity: number;
    color: string;
    angle: number;
  };
  room: {
    floorColor: string;
    wallColor: string;
    gridColor: string;
    gridOpacity: number;
    roomPos: [number, number, number];
  };
  cardPos: [number, number];
  cardWidth: number;
}

/**
 * COMPONENTES INTERNOS DA CENA 3D
 */

// Partículas Biológicas (Efeito de contaminação aérea)
function BioParticles({ count = 1000, color = "#ff0000", intensity = 1 }) {
  const points = useRef<THREE.Points>(null!);
  
  const particles = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!points.current) return;
    const time = state.clock.elapsedTime;
    points.current.rotation.y = time * 0.05 * intensity;
    points.current.rotation.x = time * 0.02 * intensity;
    
    const positions = points.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3 + 1] += Math.sin(time + positions[i3]) * (0.002 * intensity);
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={particles.length / 3} 
          array={particles} 
          itemSize={3} 
          args={[particles, 3]} 
        />
      </bufferGeometry>
      <pointsMaterial size={0.05 * intensity} color={color} transparent opacity={0.4 * Math.min(1, intensity)} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
}

// Poeira e Partículas de Ambiente
function DustParticles({ count = 800 }) {
  const points = useRef<THREE.Points>(null!);
  const particles = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (points.current) points.current.rotation.y = state.clock.elapsedTime * 0.01;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={particles.length / 3} 
          array={particles} 
          itemSize={3} 
          args={[particles, 3]} 
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#ffffff" transparent opacity={0.1} sizeAttenuation />
    </points>
  );
}

// Modelo: Parado (Seção 01)
function IdleModel({ config, visible }: { config: SceneConfig, visible: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/models/parado.glb');
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    const action = actions[Object.keys(actions)[0]];
    if (action) {
      action.setLoop(THREE.LoopPingPong, Infinity);
      action.play();
    }
  }, [actions]);

  useFrame((state) => {
    if (group.current && visible) {
      const t = state.clock.elapsedTime;
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, config.modelRotation[1] + Math.sin(t * 0.5) * 0.1, 0.05);
      group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, config.modelPos[2], 0.1);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={group} visible={visible} position={config.modelPos} rotation={config.modelRotation}>
        <primitive object={scene} scale={config.modelScale} />
      </group>
    </Float>
  );
}

// Modelo: Andando (Seção 02)
function WalkingModel({ config, visible }: { config: SceneConfig, visible: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/models/andando2.glb');
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    if (actions && actions[Object.keys(actions)[0]]) actions[Object.keys(actions)[0]]?.play();
  }, [actions]);

  useFrame(() => {
    if (group.current && visible) {
      group.current.rotation.y = config.modelRotation[1];
      group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, config.modelPos[2] + 4, 0.01);
    }
  });

  return (
    <group ref={group} visible={visible} position={config.modelPos} rotation={config.modelRotation}>
      <primitive object={scene} scale={config.modelScale} />
    </group>
  );
}

// Modelo: Correndo (Seção 03)
function RunningModel({ config, visible }: { config: SceneConfig, visible: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/models/correndo.glb');
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    if (actions && actions[Object.keys(actions)[0]]) actions[Object.keys(actions)[0]]?.play();
  }, [actions]);

  useFrame(() => {
    if (group.current && visible) {
      group.current.rotation.y = config.modelRotation[1];
      group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, config.modelPos[2] + 8, 0.05);
    }
  });

  return (
    <group ref={group} visible={visible} position={config.modelPos} rotation={config.modelRotation}>
      <primitive object={scene} scale={config.modelScale} />
    </group>
  );
}

// Ambiente: Sala de Contenção
function ContainmentRoom({ config, sirenActive }: { config: SceneConfig, sirenActive: boolean }) {
  const sirenLight = useRef<THREE.PointLight>(null!);
  
  useFrame((state) => {
    if (sirenActive && sirenLight.current) {
      sirenLight.current.intensity = (Math.sin(state.clock.elapsedTime * 10) + 1) * 50;
    }
  });

  return (
    <group position={config.room.roomPos}>
      {/* Chão */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color={config.room.floorColor} roughness={0.8} />
      </mesh>
      
      {/* Parede de Fundo */}
      <mesh position={[0, 50, -20]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color={config.room.wallColor} />
      </mesh>

      {/* Luz de Alerta (Sirene) */}
      {sirenActive && <pointLight ref={sirenLight} position={[0, 5, -5]} color="#ff0000" intensity={0} />}

      {/* Efeito Volumétrico Simulado */}
      <mesh position={[0, 10, -19]}>
        <planeGeometry args={[40, 40]} />
        <meshBasicMaterial color="#ff0000" transparent opacity={sirenActive ? 0.15 : 0.05} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

/**
 * COMPONENTE PRINCIPAL: Scene3D
 * Renderiza o Canvas e gerencia a interpolação entre os estados baseada no progresso do scroll.
 */
interface Scene3DProps {
  progress?: number;
  configs: any;
  onUpdate: (key: string, newConfig: SceneConfig) => void;
}

export default function Scene3D({ progress = 0, configs }: Scene3DProps) {
  const [isMobileView, setIsMobileView] = useState(false);

  // Detecção de Resize para adaptar a visualização
  useEffect(() => {
    const check = () => setIsMobileView(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Seleção das configurações baseada no dispositivo
  const device = isMobileView ? 'mobile' : 'desktop';
  const c1 = device === 'mobile' ? configs.s1M : configs.s1D;
  const c2 = device === 'mobile' ? configs.s2M : configs.s2D;
  const c3 = device === 'mobile' ? configs.s3M : configs.s3D;

  // Lógica de Interpolação (Transição suave entre seções)
  const t = progress;
  let config: SceneConfig;

  if (t <= 1) {
    // Interpolação entre Seção 1 e 2
    config = {
      ...c1,
      modelPos: [
        THREE.MathUtils.lerp(c1.modelPos[0], c2.modelPos[0], t),
        THREE.MathUtils.lerp(c1.modelPos[1], c2.modelPos[1], t),
        THREE.MathUtils.lerp(c1.modelPos[2], c2.modelPos[2], t),
      ],
      modelScale: THREE.MathUtils.lerp(c1.modelScale, c2.modelScale, t),
      pointLight: {
        pos: [THREE.MathUtils.lerp(c1.pointLight.pos[0], c2.pointLight.pos[0], t), THREE.MathUtils.lerp(c1.pointLight.pos[1], c2.pointLight.pos[1], t), THREE.MathUtils.lerp(c1.pointLight.pos[2], c2.pointLight.pos[2], t)],
        intensity: THREE.MathUtils.lerp(c1.pointLight.intensity, c2.pointLight.intensity, t),
        color: t > 0.5 ? c2.pointLight.color : c1.pointLight.color
      },
      spotLight: { ...c1.spotLight, intensity: THREE.MathUtils.lerp(c1.spotLight.intensity, c2.spotLight.intensity, t) }
    };
  } else {
    // Interpolação entre Seção 2 e 3
    const t2 = Math.min(1, t - 1);
    config = {
      ...c2,
      modelPos: [
        THREE.MathUtils.lerp(c2.modelPos[0], c3.modelPos[0], t2),
        THREE.MathUtils.lerp(c2.modelPos[1], c3.modelPos[1], t2),
        THREE.MathUtils.lerp(c2.modelPos[2], c3.modelPos[2], t2),
      ],
      modelScale: THREE.MathUtils.lerp(c2.modelScale, c3.modelScale, t2),
      pointLight: {
        pos: [THREE.MathUtils.lerp(c2.pointLight.pos[0], c3.pointLight.pos[0], t2), THREE.MathUtils.lerp(c2.pointLight.pos[1], c3.pointLight.pos[1], t2), THREE.MathUtils.lerp(c2.pointLight.pos[2], c3.pointLight.pos[2], t2)],
        intensity: THREE.MathUtils.lerp(c2.pointLight.intensity, c3.pointLight.intensity, t2),
        color: t2 > 0.5 ? c3.pointLight.color : c2.pointLight.color
      },
      spotLight: { ...c2.spotLight, intensity: THREE.MathUtils.lerp(c2.spotLight.intensity, c3.spotLight.intensity, t2), color: t2 > 0.5 ? c3.spotLight.color : c2.spotLight.color }
    };
  }

  const sirenActive = t >= 1.5;

  return (
    <div className="fixed inset-0 z-0">
      <Canvas shadows={{ type: THREE.PCFShadowMap }} gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={35} />
        <color attach="background" args={['#000000']} />
        
        {/* Iluminação Dinâmica */}
        <pointLight position={config.pointLight.pos} intensity={config.pointLight.intensity} color={config.pointLight.color} />
        <spotLight position={config.spotLight.pos} angle={config.spotLight.angle} intensity={config.spotLight.intensity} castShadow color={config.spotLight.color} />
        
        <Suspense fallback={null}>
          <ContainmentRoom config={config} sirenActive={sirenActive} />
          <BioParticles count={1000} color="#ff0000" intensity={sirenActive ? 2 : 1} />
          <DustParticles count={1000} />
          
          {/* Modelos Visíveis baseados na seção */}
          <IdleModel config={config} visible={t < 0.5} />
          <WalkingModel config={config} visible={t >= 0.5 && t < 1.5} />
          <RunningModel config={config} visible={t >= 1.5} />
          
          <ContactShadows opacity={0.6} scale={15} blur={1} far={10} color="#000000" />
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
}
