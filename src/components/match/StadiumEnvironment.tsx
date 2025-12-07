import React from 'react';
import * as THREE from 'three';

// Estádio básico com arquibancadas e publicidade
const StadiumEnvironment: React.FC = () => {
  return (
    <group>
      {/* Arquibancadas - fundo */}
      <mesh position={[0, 0, -40]}>
        <boxGeometry args={[120, 10, 5]} />
        <meshStandardMaterial color="#2d3748" />
      </mesh>

      {/* Arquibancadas - laterais */}
      <mesh position={[-60, 0, 0]}>
        <boxGeometry args={[5, 10, 80]} />
        <meshStandardMaterial color="#2d3748" />
      </mesh>
      <mesh position={[60, 0, 0]}>
        <boxGeometry args={[5, 10, 80]} />
        <meshStandardMaterial color="#2d3748" />
      </mesh>

      {/* Placas de publicidade */}
      <mesh position={[0, 5, -35]}>
        <planeGeometry args={[20, 5]} />
        <meshBasicMaterial color="#ff6b35" />
      </mesh>
      <mesh position={[-50, 5, 0]}>
        <planeGeometry args={[10, 5]} />
        <meshBasicMaterial color="#ff6b35" />
      </mesh>
      <mesh position={[50, 5, 0]}>
        <planeGeometry args={[10, 5]} />
        <meshBasicMaterial color="#ff6b35" />
      </mesh>

      {/* Iluminação do estádio */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[0, 20, 10]} intensity={0.8} />
      <pointLight position={[0, 15, 0]} intensity={0.5} />
    </group>
  );
};

export default StadiumEnvironment;
