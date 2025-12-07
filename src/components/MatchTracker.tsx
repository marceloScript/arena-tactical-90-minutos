// src/components/MatchTracker.tsx - VERSÃO CORRIGIDA
import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Line } from '@react-three/drei'; // ✅ Import Line do drei
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';

import SidebarOverlay from './OverlaySidebar';
import BackHomeButton from './ui/BackHomeButton';
import Drawer from './Drawer';

// Import dos novos componentes
import StadiumEnvironment from './match/StadiumEnvironment';
import Scoreboard from './match/Scoreboard';
import MomentumBar from './match/MomentumBar';
import TacticalCommandPanel from './match/TacticalCommandPanel';

// Import do store para pegar dados
import { useStore } from '@/store/useStore';

// Campo básico
const Field: React.FC = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
    <planeGeometry args={[105, 68]} />
    <meshStandardMaterial color="green" />
  </mesh>
);

// Linha central CORRIGIDA usando Line do drei
const CenterLine: React.FC = () => {
  const points = useMemo(() => [
    new THREE.Vector3(0, 0.01, -34),
    new THREE.Vector3(0, 0.01, 34),
  ], []);

  return (
    <Line
      points={points}
      color="white"
      lineWidth={2}
      position={[0, 0, 0]}
    />
  );
};

// Círculo central
const CenterCircle: React.FC = () => {
  return (
    <>
      {/* Anel do círculo central */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[9.05, 9.15, 64]} />
        <meshBasicMaterial color="white" side={THREE.DoubleSide} />
      </mesh>
      
      {/* Ponto central */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.3, 32]} />
        <meshBasicMaterial color="white" />
      </mesh>
    </>
  );
};

const MatchTracker: React.FC = () => {
  const navigate = useNavigate();
  const handleBackHome = () => navigate('/');
  
  // Pegar dados do store
  const matchState = useStore((state) => state.matchState);
  
  // Função para decisões táticas
  const handleTacticalDecision = (decision: string) => {
    console.log(`Decisão tática: ${decision}`);
    // Aqui vai integrar com o MatchSimulationEngine depois
  };

  return (
    <div className="w-full h-screen relative bg-gray-900">
      {/* Componentes de UI */}
      <SidebarOverlay />
      <Drawer />
      <BackHomeButton onClick={handleBackHome} />
      
      {/* Overlays do Match Tracker */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
        <Scoreboard 
          homeScore={matchState.homeScore}
          awayScore={matchState.awayScore}
          currentTime={matchState.currentTime}
          totalTime={matchState.totalTime}
          isFirstHalf={matchState.isFirstHalf}
        />
      </div>
      
      <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-50 w-1/2">
        <MomentumBar 
          attackMomentum={matchState.attackMomentum}
          defenseMomentum={matchState.defenseMomentum}
        />
      </div>
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <TacticalCommandPanel 
          onTacticalDecision={handleTacticalDecision}
          isDecisionPending={matchState.isDecisionPending}
          decisionTimeLeft={matchState.decisionTimeLeft}
        />
      </div>

      {/* Canvas 3D */}
      <Canvas shadows camera={{ position: [0, 50, 100], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
        
        <Suspense fallback={null}>
          <Environment preset="sunset" />
        </Suspense>

        {/* Estádio completo */}
        <StadiumEnvironment />
        
        {/* Campo de jogo */}
        <Field />
        <CenterLine />
        <CenterCircle />
        
        {/* Aqui futuramente: PlayerIcon components */}
      </Canvas>
    </div>
  );
};

export default MatchTracker;