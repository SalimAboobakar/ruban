import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';

/**
 * Wind Turbine - Renewable Energy
 */
export function WindTurbine({ position }: { position: [number, number, number] }) {
  const bladesRef = useRef<Group>(null);

  useFrame(() => {
    if (bladesRef.current) {
      bladesRef.current.rotation.z += 0.01; // Slow rotation
    }
  });

  return (
    <group position={position}>
      {/* Tower */}
      <mesh castShadow>
        <cylinderGeometry args={[1.5, 3, 60, 16]} />
        <meshStandardMaterial color="#f0f0f0" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Nacelle (generator housing) */}
      <mesh position={[0, 30, 0]} castShadow>
        <boxGeometry args={[6, 4, 3]} />
        <meshStandardMaterial color="#e0e0e0" metalness={0.6} />
      </mesh>

      {/* Blades */}
      <group ref={bladesRef} position={[3, 30, 0]} rotation={[0, 0, 0]}>
        {/* Blade 1 */}
        <mesh position={[0, 15, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.8, 30, 0.3]} />
          <meshStandardMaterial color="#ffffff" metalness={0.3} />
        </mesh>
        {/* Blade 2 */}
        <mesh position={[0, -15, 0]} rotation={[0, 0, Math.PI]}>
          <boxGeometry args={[0.8, 30, 0.3]} />
          <meshStandardMaterial color="#ffffff" metalness={0.3} />
        </mesh>
        {/* Blade 3 */}
        <mesh position={[15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.8, 30, 0.3]} />
          <meshStandardMaterial color="#ffffff" metalness={0.3} />
        </mesh>
      </group>

      {/* Green indicator light */}
      <pointLight position={[0, 32, 0]} color="#10b981" intensity={30} distance={40} />
    </group>
  );
}

