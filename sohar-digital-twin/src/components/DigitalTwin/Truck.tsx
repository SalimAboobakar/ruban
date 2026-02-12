import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';

interface TruckProps {
  position: [number, number, number];
  color?: string;
  isMoving?: boolean;
  route?: 'road1' | 'road2' | 'road3';
}

/**
 * Truck component - Moves along roads in the port
 */
export function Truck({ position, color = '#fbbf24', isMoving = true, route = 'road1' }: TruckProps) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current && isMoving) {
      // Simple movement animation
      const time = state.clock.getElapsedTime();
      
      if (route === 'road1') {
        groupRef.current.position.x = position[0] + Math.sin(time * 0.5) * 50;
      } else if (route === 'road2') {
        groupRef.current.position.z = position[2] + Math.cos(time * 0.3) * 40;
      } else {
        groupRef.current.position.x = position[0] + Math.cos(time * 0.4) * 30;
        groupRef.current.position.z = position[2] + Math.sin(time * 0.4) * 30;
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Truck Cab */}
      <mesh position={[0, 2, 0]} castShadow>
        <boxGeometry args={[6, 4, 4]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.3} />
      </mesh>

      {/* Truck Windshield */}
      <mesh position={[2.5, 2.5, 0]}>
        <boxGeometry args={[1, 2, 3.5]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.6} />
      </mesh>

      {/* Container/Trailer */}
      <mesh position={[-8, 3, 0]} castShadow>
        <boxGeometry args={[12, 5, 4]} />
        <meshStandardMaterial color="#e5e7eb" roughness={0.7} />
      </mesh>

      {/* Wheels */}
      <mesh position={[2, 0.5, 2]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.8, 0.8, 0.5, 16]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[2, 0.5, -2]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.8, 0.8, 0.5, 16]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[-10, 0.5, 2]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.8, 0.8, 0.5, 16]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[-10, 0.5, -2]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.8, 0.8, 0.5, 16]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>

      {/* Headlights */}
      <pointLight position={[3, 1.5, 1.5]} color="#ffffff" intensity={10} distance={15} />
      <pointLight position={[3, 1.5, -1.5]} color="#ffffff" intensity={10} distance={15} />
    </group>
  );
}

