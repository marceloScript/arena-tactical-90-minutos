// src/components/simulator/RefPlayerWrapper.tsx
import { forwardRef } from 'react';
import * as THREE from 'three';

import Player from '../game3d/Player';
import type { Player as PlayerType } from '@/types/player'; // <-- ajuste o caminho conforme seu projeto REAL

interface Props {
  player: PlayerType;
  position: [number, number, number];
}

const RefPlayer = forwardRef<THREE.Group, Props>(({ player, position }, ref) => {
  return (
    <group ref={ref}>
      <Player
        position={position}
        name={player.name}
        color={player.color}
        player={player}
      />
    </group>
  );
});

RefPlayer.displayName = 'RefPlayer';

export default RefPlayer;
