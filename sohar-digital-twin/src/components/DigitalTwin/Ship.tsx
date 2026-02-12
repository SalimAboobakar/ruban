import { useState } from 'react';
import type { EquipmentStatus } from '../../types';
import { getStatusColor } from '../../utils/statusColors';

interface ShipProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  status: EquipmentStatus;
  name: string;
  type?: 'container' | 'tanker' | 'bulk';
}

/**
 * Ship/Vessel component - Container ships, tankers, or bulk carriers
 */
export function Ship({ position, rotation = [0, 0, 0], status, name, type = 'container' }: ShipProps) {
  const [hovered, setHovered] = useState(false);
  const statusColor = getStatusColor(status);

  const shipColor = type === 'tanker' ? '#8b0000' : type === 'bulk' ? '#4a4a4a' : '#1e3a8a';

  return (
    <group
      position={position}
      rotation={rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.02 : 1}
    >
      {/* Ship Hull */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[120, 15, 25]} />
        <meshStandardMaterial color={shipColor} roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Ship Deck */}
      <mesh position={[0, 8, 0]} castShadow>
        <boxGeometry args={[118, 1, 24]} />
        <meshStandardMaterial color="#2d3748" roughness={0.8} />
      </mesh>

      {/* Bridge/Superstructure */}
      <mesh position={[-40, 18, 0]} castShadow>
        <boxGeometry args={[20, 20, 20]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Bridge Windows */}
      <mesh position={[-30, 20, 0]}>
        <boxGeometry args={[2, 8, 18]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.7} />
      </mesh>

      {/* Smokestack */}
      <mesh position={[-45, 35, 0]} castShadow>
        <cylinderGeometry args={[3, 4, 10, 16]} />
        <meshStandardMaterial color="#d32f2f" roughness={0.7} />
      </mesh>

      {/* Container stacks on deck (if container ship) */}
      {type === 'container' && (
        <>
          {/* Front containers */}
          <mesh position={[20, 12, -8]} castShadow>
            <boxGeometry args={[50, 6, 6]} />
            <meshStandardMaterial color="#ff6b35" roughness={0.6} />
          </mesh>
          <mesh position={[20, 12, 0]} castShadow>
            <boxGeometry args={[50, 6, 6]} />
            <meshStandardMaterial color="#3b82f6" roughness={0.6} />
          </mesh>
          <mesh position={[20, 12, 8]} castShadow>
            <boxGeometry args={[50, 6, 6]} />
            <meshStandardMaterial color="#10b981" roughness={0.6} />
          </mesh>

          {/* Stacked containers */}
          <mesh position={[20, 18, -8]} castShadow>
            <boxGeometry args={[50, 6, 6]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.6} />
          </mesh>
          <mesh position={[20, 18, 0]} castShadow>
            <boxGeometry args={[50, 6, 6]} />
            <meshStandardMaterial color="#8b5cf6" roughness={0.6} />
          </mesh>
        </>
      )}

      {/* Cargo tanks (if tanker) */}
      {type === 'tanker' && (
        <>
          <mesh position={[10, 12, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[8, 8, 60, 16]} />
            <meshStandardMaterial color="#c0c0c0" roughness={0.3} metalness={0.7} />
          </mesh>
        </>
      )}

      {/* Status Indicator */}
      <mesh position={[-40, 38, 0]}>
        <sphereGeometry args={[2, 16, 16]} />
        <meshStandardMaterial
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Navigation lights */}
      <pointLight position={[60, 10, 0]} color="#00ff00" intensity={20} distance={30} />
      <pointLight position={[-60, 10, 0]} color="#ff0000" intensity={20} distance={30} />

      {/* Status light */}
      <pointLight position={[-40, 38, 0]} color={statusColor} intensity={40} distance={60} />
    </group>
  );
}

