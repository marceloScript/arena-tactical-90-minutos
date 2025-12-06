import { useStore } from '@/store/useStore';
import { Sphere } from '@react-three/drei';

export default function Ball() {
  const position = useStore((s) => s.ball.position);
  return (
    <Sphere args={[0.32, 32, 32]} position={position}>
      <meshStandardMaterial color="#ffffff" />
    </Sphere>
  );
}