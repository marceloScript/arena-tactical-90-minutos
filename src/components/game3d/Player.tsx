// src/components/game3d/Player.tsx
import { FC } from 'react';
import { Text, Cylinder, Ring } from '@react-three/drei';
import { GroupProps } from '@react-three/fiber';
import { useStore } from '@/store/useStore';
import type { Player } from '@/types/player';

interface PlayerProps extends GroupProps {
  position: [number, number, number];
  name: string;
  color: string;
  player: Player;
  isSelected?: boolean;
}

const Player: FC<PlayerProps> = ({ position, name, color, player, isSelected = false, ...props }) => {
  const setSelectedPlayer = useStore((s) => s.setSelectedPlayer);

  const handleClick = () => {
    setSelectedPlayer(player);
  };

  return (
    <group position={position} onClick={handleClick} {...props}>
      {/* Corpo do jogador */}
      <Cylinder args={[0.3, 0.3, 1.2, 16]}>
        <meshStandardMaterial color={color} />
      </Cylinder>

      {/* Nome do jogador acima do modelo */}
      <Text
        position={[0, 1.2, 0]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="bottom"
      >
        {name}
      </Text>

      {/* Efeito visual quando selecionado */}
      {isSelected && (
        <Ring
          args={[0.35, 0.45, 32]}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.01, 0]}
        >
          <meshStandardMaterial color="yellow" emissive="yellow" />
        </Ring>
      )}
    </group>
  );
};

export default Player;
