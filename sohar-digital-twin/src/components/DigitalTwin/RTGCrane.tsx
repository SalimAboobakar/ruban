import { useState } from 'react';
import type { EquipmentStatus } from '../../types';
import { getStatusColor } from '../../utils/statusColors';

interface RTGCraneProps {
  position: [number, number, number];
  status: EquipmentStatus;
  name: string;
  companyName: string;
  onClick?: () => void;
}

/**
 * RTG (Rubber Tyred Gantry) Crane component
 * Portal frame structure used for moving containers in the yard
 */
export function RTGCrane({ position, status, onClick }: RTGCraneProps) {
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
      {/* Base/Wheels Platform */}
      <mesh position={[-15, 1, 0]} castShadow>
        <boxGeometry args={[4, 2, 10]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.6} metalness={0.4} />
      </mesh>
      
      <mesh position={[15, 1, 0]} castShadow>
        <boxGeometry args={[4, 2, 10]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Left Leg */}
      <mesh position={[-15, 15, 0]} castShadow>
        <boxGeometry args={[3, 30, 8]} />
        <meshStandardMaterial color="#2563eb" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Right Leg */}
      <mesh position={[15, 15, 0]} castShadow>
        <boxGeometry args={[3, 30, 8]} />
        <meshStandardMaterial color="#2563eb" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Top Beam (Portal Frame) */}
      <mesh position={[0, 28, 0]} castShadow receiveShadow>
        <boxGeometry args={[36, 3, 10]} />
        <meshStandardMaterial color="#1e40af" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Trolley/Spreader */}
      <mesh position={[0, 25, 0]} castShadow>
        <boxGeometry args={[6, 4, 8]} />
        <meshStandardMaterial color="#1f2937" roughness={0.7} metalness={0.3} />
      </mesh>

      {/* Status Indicator Light */}
      <mesh position={[0, 31, 0]}>
        <sphereGeometry args={[2, 16, 16]} />
        <meshStandardMaterial
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={0.8}
        >
          <color attach="color" args={[statusColor]} />
          <color attach="emissive" args={[statusColor]} />
        </meshStandardMaterial>
      </mesh>

      {/* Status point light */}
      <pointLight
        position={[0, 31, 0]}
        color={statusColor}
        intensity={30}
        distance={60}
      />

      {/* Hover indicator */}
      {hovered && (
        <mesh position={[0, 34, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.5, 4, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}

