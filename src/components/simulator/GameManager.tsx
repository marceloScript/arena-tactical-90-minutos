import { useFrame, useThree } from '@react-three/fiber';
import { useStore } from '@/store/useStore';
import * as THREE from 'three';
import { Line } from '@react-three/drei';
import { useState, useEffect } from 'react';

export default function GameManager() {
  const gameState = useStore((s) => s.gameState);
  const ball = useStore((s) => s.ball);
  const updateBall = useStore((s) => s.updateBall);
  const homeTeam = useStore((s) => s.homeTeam);
  const awayTeam = useStore((s) => s.awayTeam);
  const selectedPlayer = useStore((s) => s.selectedPlayer);
  const setSelectedPlayer = useStore((s) => s.setSelectedPlayer);

  const { camera, gl } = useThree();
  const [mousePos, setMousePos] = useState(new THREE.Vector3());

  // Referências injetadas via wrapper (Field3D adiciona no .current de cada jogador)
  const allPlayers = [...homeTeam, ...awayTeam] as any[];

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      const vector = new THREE.Vector3(x, y, 0.5);
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const pos = camera.position.clone().add(dir.multiplyScalar(distance));
      pos.y = 0.5; // ground level
      setMousePos(pos);
    };

    const handleClick = () => {
      if (selectedPlayer && (selectedPlayer as any).ref?.current) {
        const playerPos = (selectedPlayer as any).ref.current.position;
        const direction = mousePos.clone().sub(playerPos).normalize();
        const velocity = direction.multiplyScalar(20); // pass speed
        updateBall({ position: playerPos.clone().add(new THREE.Vector3(0, 0.5, 0)), velocity });
        setSelectedPlayer(null);
      }
    };

    gl.domElement.addEventListener('mousemove', handleMouseMove);
    gl.domElement.addEventListener('click', handleClick);

    return () => {
      gl.domElement.removeEventListener('mousemove', handleMouseMove);
      gl.domElement.removeEventListener('click', handleClick);
    };
  }, [camera, gl, selectedPlayer, mousePos, updateBall, setSelectedPlayer]);

  useFrame((_, delta) => {
    if (gameState !== 'PLAYING') return;

    // Física da bola
    if (ball.velocity.lengthSq() > 0.001) {
      const newVel = ball.velocity.clone().multiplyScalar(0.96); // atrito
      const newPos = ball.position.clone().add(newVel.clone().multiplyScalar(delta * 30));
      updateBall({ position: newPos, velocity: newVel });
    }

    // IA ultra-simples (melhoraremos na próxima sprint)
    allPlayers.forEach((player: any) => {
      if (!player.ref?.current) return;

      const playerPos = player.ref.current.position;
      const distToBall = playerPos.distanceTo(ball.position);

      let target: THREE.Vector3;

      if (distToBall < 12) {
        // corre pra bola
        target = ball.position.clone();
        target.y = 0.6;
      } else {
        // volta pra posição base da formação
        const base = new THREE.Vector3(...player.formationPosition);
        target = base.clone();
        target.y = 0.6;  // Fix: Sempre Y fixo
      }

      // Fix: Lerp só X e Z (movimento horizontal)
      playerPos.x = THREE.MathUtils.lerp(playerPos.x, target.x, delta * 6);
      playerPos.z = THREE.MathUtils.lerp(playerPos.z, target.z, delta * 6);
      // Y permanece 0.6 (sem lerp vertical)
      playerPos.y = 0.6;
      player.ref.current.lookAt(ball.position);
    });
  });

  return (
    <>
      {selectedPlayer && (selectedPlayer as any).ref?.current && (
        <Line
          points={[(selectedPlayer as any).ref.current.position, mousePos]}
          color="yellow"
          lineWidth={5}
        />
      )}
    </>
  );
}
