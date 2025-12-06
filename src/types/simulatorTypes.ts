import * as THREE from 'three';
import type { Player } from '@/types/player'; // <-- IMPORT DO TIPO PLAYER

export type GameState =
  | 'PRE_MATCH'
  | 'KICK_OFF'
  | 'PLAYING'
  | 'PAUSED'
  | 'GOAL_SCORED'
  | 'FULL_TIME';

export interface BallState {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
}

export interface PlayerWithRef extends Player {
  ref?: React.RefObject<THREE.Group>;
}
