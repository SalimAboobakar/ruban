import { useState, memo } from 'react';
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
 * Enhanced with realistic details: cables, wheels, operator cabin, logo
 */
function STSCraneComponent({ position, status, onClick }: STSCraneProps) {
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
      {/* Base Platform - Enhanced */}
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[15, 5, 15]} />
        <meshStandardMaterial
          color="#ff6b35"
          roughness={0.6}
          metalness={0.4}
        />
      </mesh>

      {/* Wheels on Base (4 corners) */}
      {[[-6, -2, -6], [6, -2, -6], [-6, -2, 6], [6, -2, 6]].map((pos, i) => (
        <group key={`wheel-${i}`} position={pos as [number, number, number]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[1.5, 1.5, 2, 16]} />
            <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.4} />
          </mesh>
          {/* Wheel rim */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.7, 0.7, 2.2, 8]} />
            <meshStandardMaterial color="#6b7280" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Main Tower - Enhanced */}
      <mesh position={[0, 32.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[5, 60, 5]} />
        <meshStandardMaterial
          color="#ff6b35"
          roughness={0.6}
          metalness={0.4}
        />
      </mesh>

      {/* Ladder on Tower */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={`ladder-${i}`} position={[2.6, 3 + i * 3, 0]} castShadow>
          <boxGeometry args={[0.3, 0.2, 1.5]} />
          <meshStandardMaterial color="#1f2937" metalness={0.8} />
        </mesh>
      ))}

      {/* Operator Cabin - Glowing */}
      <group position={[0, 40, 5]}>
        <mesh castShadow>
          <boxGeometry args={[4, 6, 4]} />
          <meshStandardMaterial 
            color="#1f2937"
            roughness={0.5}
            metalness={0.3}
          />
        </mesh>
        {/* Windows (glowing) */}
        {[[-1.8, 1, 0], [1.8, 1, 0], [0, 1, 1.8]].map((pos, i) => (
          <mesh key={`window-${i}`} position={pos as [number, number, number]}>
            <boxGeometry args={[i === 2 ? 3 : 0.3, 2, i === 2 ? 0.3 : 3]} />
            <meshStandardMaterial
              color="#fef3c7"
              emissive="#fef3c7"
              emissiveIntensity={0.6}
              transparent
              opacity={0.9}
            />
          </mesh>
        ))}
        <pointLight position={[0, 0, 2]} color="#fef3c7" intensity={30} distance={20} />
      </group>

      {/* Horizontal Boom (extends over berth and water) */}
      <mesh position={[40, 60, 0]} castShadow receiveShadow>
        <boxGeometry args={[80, 3, 8]} />
        <meshStandardMaterial
          color="#ff6b35"
          roughness={0.6}
          metalness={0.4}
        />
      </mesh>

      {/* Support Beams under Boom */}
      {[10, 30, 50, 70].map((x, i) => (
        <mesh key={`beam-${i}`} position={[x, 59, 0]} castShadow>
          <boxGeometry args={[2, 1.5, 6]} />
          <meshStandardMaterial color="#d97706" metalness={0.6} />
        </mesh>
      ))}

      {/* Back Support */}
      <mesh position={[-20, 35, 0]} castShadow>
        <boxGeometry args={[40, 3, 6]} />
        <meshStandardMaterial
          color="#ff6b35"
          roughness={0.6}
          metalness={0.4}
        />
      </mesh>

      {/* Trolley on boom - Enhanced */}
      <group position={[20, 61.5, 0]}>
        <mesh castShadow>
          <boxGeometry args={[8, 4, 10]} />
          <meshStandardMaterial
            color="#1f2937"
            roughness={0.7}
            metalness={0.3}
          />
        </mesh>
        {/* Trolley wheels */}
        {[[-3, 2.5, 0], [3, 2.5, 0]].map((pos, i) => (
          <mesh key={`trolley-wheel-${i}`} position={pos as [number, number, number]} rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 8, 12]} />
            <meshStandardMaterial color="#374151" metalness={0.8} />
          </mesh>
        ))}
      </group>

      {/* Cables from Trolley (4 cables) */}
      {[[-2, 0, -3], [2, 0, -3], [-2, 0, 3], [2, 0, 3]].map((offset, i) => (
        <mesh 
          key={`cable-${i}`} 
          position={[20 + offset[0], 45, offset[2]]}
          castShadow
        >
          <cylinderGeometry args={[0.15, 0.15, 30, 8]} />
          <meshStandardMaterial color="#4b5563" metalness={0.9} roughness={0.3} />
        </mesh>
      ))}

      {/* Spreader (container grab mechanism) */}
      <group position={[20, 30, 0]}>
        <mesh castShadow>
          <boxGeometry args={[12, 1, 6]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.7} roughness={0.4} />
        </mesh>
        {/* Grab arms */}
        {[[-5, -1, -2], [5, -1, -2], [-5, -1, 2], [5, -1, 2]].map((pos, i) => (
          <mesh key={`arm-${i}`} position={pos as [number, number, number]}>
            <boxGeometry args={[1, 2, 1]} />
            <meshStandardMaterial color="#ef4444" metalness={0.8} />
          </mesh>
        ))}
      </group>

      {/* Company Logo on Tower */}
      <mesh position={[0, 20, 2.6]} rotation={[0, 0, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial 
          color="#ffffff"
          emissive="#ff6b35"
          emissiveIntensity={0.3}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Equipment ID on base */}
      <mesh position={[0, 5.5, 7.6]}>
        <planeGeometry args={[10, 2]} />
        <meshStandardMaterial 
          color="#1f2937"
          emissive="#fef3c7"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Status Indicator Light (color-coded) - Enhanced */}
      <mesh position={[0, 65, 0]}>
        <sphereGeometry args={[3, 16, 16]} />
        <meshStandardMaterial
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={1.2}
        />
      </mesh>

      {/* Additional status lights on boom ends */}
      <mesh position={[78, 60, 0]}>
        <sphereGeometry args={[1.5, 12, 12]} />
        <meshStandardMaterial
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Enhanced lighting */}
      <pointLight
        position={[0, 65, 0]}
        color={statusColor}
        intensity={80}
        distance={120}
      />
      <pointLight
        position={[78, 60, 0]}
        color={statusColor}
        intensity={40}
        distance={60}
      />

      {/* Work lights on boom */}
      {[10, 30, 50, 70].map((x, i) => (
        <pointLight
          key={`worklight-${i}`}
          position={[x, 58, 0]}
          color="#fef3c7"
          intensity={25}
          distance={40}
        />
      ))}

      {/* Hover indicator - Enhanced */}
      {hovered && (
        <>
          <mesh position={[0, 70, 0]}>
            <ringGeometry args={[4, 6, 32]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.7}
            />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <ringGeometry args={[18, 20, 32]} />
            <meshBasicMaterial
              color={statusColor}
              transparent
              opacity={0.3}
            />
          </mesh>
        </>
      )}
    </group>
  );
}

export const STSCrane = memo(STSCraneComponent);

