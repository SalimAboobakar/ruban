import { useState } from 'react';
import type { EquipmentStatus } from '../../types';
import { getStatusColor } from '../../utils/statusColors';

interface STSCraneProps {
  position: [number, number, number];
  status: EquipmentStatus;
  name: string;
  companyName: string;
  onClick?: () => void;
}

/**
 * STS (Ship-to-Shore) Crane component
 * Simplified geometric representation with color-coded status
 */
export function STSCrane({ position, status, name, companyName, onClick }: STSCraneProps) {
  const [hovered, setHovered] = useState(false);
  const statusColor = getStatusColor(status);

  return (
    <group
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.05 : 1}
    >
      {/* Base Platform */}
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[15, 5, 15]} />
        <meshStandardMaterial
          color="#ff6b35"
          roughness={0.6}
          metalness={0.4}
        />
      </mesh>

      {/* Main Tower */}
      <mesh position={[0, 32.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[5, 60, 5]} />
        <meshStandardMaterial
          color="#ff6b35"
          roughness={0.6}
          metalness={0.4}
        />
      </mesh>

      {/* Horizontal Boom (extends over berth and water) */}
      <mesh position={[40, 60, 0]} castShadow receiveShadow>
        <boxGeometry args={[80, 3, 8]} />
        <meshStandardMaterial
          color="#ff6b35"
          roughness={0.6}
          metalness={0.4}
        />
      </mesh>

      {/* Back Support */}
      <mesh position={[-20, 35, 0]} castShadow>
        <boxGeometry args={[40, 3, 6]} />
        <meshStandardMaterial
          color="#ff6b35"
          roughness={0.6}
          metalness={0.4}
        />
      </mesh>

      {/* Trolley on boom (simplified) */}
      <mesh position={[20, 61.5, 0]} castShadow>
        <boxGeometry args={[8, 4, 10]} />
        <meshStandardMaterial
          color="#1f2937"
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Status Indicator Light (color-coded) */}
      <mesh position={[0, 65, 0]}>
        <sphereGeometry args={[3, 16, 16]} />
        <meshStandardMaterial
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={0.8}
        >
          <color attach="color" args={[statusColor]} />
          <color attach="emissive" args={[statusColor]} />
        </meshStandardMaterial>
      </mesh>

      {/* Additional status light for visibility from distance */}
      <pointLight
        position={[0, 65, 0]}
        color={statusColor}
        intensity={50}
        distance={100}
      />

      {/* Hover indicator */}
      {hovered && (
        <mesh position={[0, 70, 0]}>
          <ringGeometry args={[4, 6, 32]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.6}
          />
        </mesh>
      )}
    </group>
  );
}

