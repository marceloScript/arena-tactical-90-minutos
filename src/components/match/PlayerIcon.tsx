import React from 'react';
import * as THREE from 'three';

interface PlayerIconProps {
  position: [number, number, number];
  color: string;
  isHome: boolean;
  role: string;
}

// Ícone simples do jogador (ponteiro colorido)
const PlayerIcon: React.FC<PlayerIconProps> = ({ position, color, isHome, role }) => {
  return (
    <group position={position}>
      {/* Base circular */}
      <mesh>
        <cylinderGeometry args={[0.8, 0.8, 0.1, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Seta de direção (para ataque) */}
      <mesh position={[0, 0.5, isHome ? 1 : -1]}>
        <coneGeometry args={[0.3, 0.8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Texto da posição (opcional, pode ser removido se performance ruim) */}
      <mesh position={[0, 1.2, 0]}>
        <planeGeometry args={[1, 0.5]} />
        <meshBasicMaterial color="white" transparent opacity={0.8} />
      </mesh>
    </group>
  );
};

export default PlayerIcon;
