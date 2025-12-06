// src/components/Field3D.tsx
import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';

import SidebarOverlay from './OverlaySidebar';
import BackHomeButton from './ui/BackHomeButton';
import Drawer from './Drawer';

import { useStore } from '@/store/useStore';
import Player from './game3d/Player';
import { TACTICAL_FORMATIONS } from '@/config/formations';
import Ball from './simulator/Ball';
import GameManager from './simulator/GameManager';
import RefPlayer from './simulator/refPlayerWrapper';

// ----------------- Campo base -----------------
const Field: React.FC = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
    <planeGeometry args={[105, 68]} />
    <meshStandardMaterial color="green" />
  </mesh>
);

// ----------------- Linhas do campo -----------------
const Line = ({ points }: { points: THREE.Vector3[] }) => {
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 'white' });
  return <primitive object={new THREE.Line(geometry, material)} />;
};

const FieldLines: React.FC = () => {
  const lines: THREE.Vector3[][] = [];
  const w = 105;
  const h = 68;

  // Perímetro
  lines.push([
    new THREE.Vector3(-w / 2, 0.01, -h / 2),
    new THREE.Vector3(-w / 2, 0.01, h / 2),
    new THREE.Vector3(w / 2, 0.01, h / 2),
    new THREE.Vector3(w / 2, 0.01, -h / 2),
    new THREE.Vector3(-w / 2, 0.01, -h / 2),
  ]);

  // Linha central
  lines.push([
    new THREE.Vector3(0, 0.01, -h / 2),
    new THREE.Vector3(0, 0.01, h / 2),
  ]);

  return (
    <>
      {lines.map((pts, i) => (
        <Line key={i} points={pts} />
      ))}

      {/* Círculo central */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[9.05, 9.15, 64]} />
        <meshBasicMaterial color="white" side={THREE.DoubleSide} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.3, 32]} />
        <meshBasicMaterial color="white" />
      </mesh>
    </>
  );
};

// ===============================
//  COMPONENTE PARA RENDERIZAR UM TIME
// ===============================
const TeamRenderer = ({
  team,
  formation,
}: {
  team: any[];
  formation: any;
}) => {
  return (
    <>
      {team.map((player) => {
        const pos = formation[player.role] ?? [0, 0, 0];
        const ref = useRef<THREE.Group>(null);

        // Salva referência e posição base
        player.ref = ref;
        player.formationPosition = pos;

        return (
          <RefPlayer
            key={player.id}
            player={player}
            position={[pos[0], pos[1], pos[2]]}
            ref={ref}
          />
        );
      })}
    </>
  );
};

// ===============================
//           FIELD 3D
// ===============================
const Field3D: React.FC = () => {
  const navigate = useNavigate();
  const handleBackHome = () => navigate('/');

  const homeTeam = useStore((s) => s.homeTeam);
  const awayTeam = useStore((s) => s.awayTeam);
  const homeFormationName = useStore((s) => s.homeFormation);
  const awayFormationName = useStore((s) => s.awayFormation);

  const homeFormationPositions =
    TACTICAL_FORMATIONS[homeFormationName]?.home ?? {};
  const awayFormationPositions =
    TACTICAL_FORMATIONS[awayFormationName]?.away ?? {};

  return (
    <div className="w-full h-screen relative bg-gray-900">
      <SidebarOverlay />
      <Drawer />
      <BackHomeButton onClick={handleBackHome} />

      <Canvas shadows camera={{ position: [0, 50, 100], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 20, 10]} intensity={1} castShadow />

        <Suspense fallback={null}>
          <Environment preset="sunset" />
        </Suspense>

        <Field />
        <FieldLines />

        {/* ===== SISTEMA DO SIMULADOR ===== */}
        <Ball />
        <GameManager />

        <TeamRenderer
          team={homeTeam}
          formation={homeFormationPositions}
        />

        <TeamRenderer
          team={awayTeam}
          formation={awayFormationPositions}
        />

        <OrbitControls enablePan enableZoom enableRotate />
      </Canvas>
    </div>
  );
};

export default Field3D;
