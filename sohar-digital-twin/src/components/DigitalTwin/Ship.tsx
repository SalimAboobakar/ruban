import { useState, useRef, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
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
 * Ship/Vessel component - Enhanced with realistic details
 */
function ShipComponent({ position, rotation = [0, 0, 0], status, type = 'container' }: ShipProps) {
  const [hovered, setHovered] = useState(false);
  const statusColor = getStatusColor(status);
  const propellerRef = useRef<Group>(null);
  const waveRef = useRef<Group>(null);

  const shipColor = type === 'tanker' ? '#8b0000' : type === 'bulk' ? '#4a4a4a' : '#1e3a8a';

  // Animate propeller and waves
  useFrame((state) => {
    if (propellerRef.current) {
      propellerRef.current.rotation.z += 0.15;
    }
    if (waveRef.current) {
      waveRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

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

      {/* Bow (front tapered) */}
      <mesh position={[62, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <coneGeometry args={[12.5, 24, 4]} />
        <meshStandardMaterial color={shipColor} roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Hull ribs/reinforcements */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`rib-${i}`} position={[-55 + i * 15, -6, 0]} castShadow>
          <boxGeometry args={[1, 3, 26]} />
          <meshStandardMaterial color="#1f2937" metalness={0.8} />
        </mesh>
      ))}

      {/* Ship Deck */}
      <mesh position={[0, 8, 0]} castShadow>
        <boxGeometry args={[118, 1, 24]} />
        <meshStandardMaterial color="#2d3748" roughness={0.8} />
      </mesh>

      {/* Deck railings */}
      {[12.5, -12.5].map((z, idx) => (
        <mesh key={`railing-${idx}`} position={[0, 9, z]} castShadow>
          <boxGeometry args={[120, 1.5, 0.3]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.4} />
        </mesh>
      ))}

      {/* Bridge/Superstructure - Multi-level */}
      <group position={[-40, 18, 0]}>
        {/* Main bridge */}
        <mesh castShadow>
          <boxGeometry args={[20, 20, 20]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.5} metalness={0.3} />
        </mesh>
        
        {/* Upper bridge level */}
        <mesh position={[0, 12, 0]} castShadow>
          <boxGeometry args={[16, 4, 16]} />
          <meshStandardMaterial color="#e5e7eb" roughness={0.5} metalness={0.3} />
        </mesh>

        {/* Bridge Wings (sides) */}
        {[-12, 12].map((z, i) => (
          <mesh key={`wing-${i}`} position={[3, 5, z]} castShadow>
            <boxGeometry args={[8, 10, 4]} />
            <meshStandardMaterial color="#d1d5db" roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* Bridge Windows - More detailed */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={`window-${i}`} position={[-30, 20, (i - 2) * 4]}>
          <boxGeometry args={[0.3, 4, 3]} />
          <meshStandardMaterial 
            color="#87ceeb" 
            transparent 
            opacity={0.8}
            emissive="#87ceeb"
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}

      {/* Smokestack */}
      <mesh position={[-45, 35, 0]} castShadow>
        <cylinderGeometry args={[3, 4, 10, 16]} />
        <meshStandardMaterial color="#d32f2f" roughness={0.7} />
      </mesh>

      {/* Smokestack bands */}
      {[0, 3, 6].map((y, i) => (
        <mesh key={`band-${i}`} position={[-45, 30 + y, 0]}>
          <cylinderGeometry args={[3.2, 3.2, 1, 16]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#fef3c7" : "#1f2937"} />
        </mesh>
      ))}

      {/* Antenna/Mast */}
      <mesh position={[-40, 45, 5]} castShadow>
        <cylinderGeometry args={[0.3, 0.5, 12, 8]} />
        <meshStandardMaterial color="#6b7280" metalness={0.9} />
      </mesh>

      {/* Radar */}
      <mesh position={[-40, 52, 5]} castShadow>
        <boxGeometry args={[4, 0.5, 0.5]} />
        <meshStandardMaterial 
          color="#10b981" 
          emissive="#10b981" 
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Container stacks on deck (if container ship) */}
      {type === 'container' && (
        <>
          {/* Multiple container rows with varied heights */}
          {Array.from({ length: 3 }).map((_, row) =>
            Array.from({ length: 3 }).map((_, stack) => (
              <mesh 
                key={`container-${row}-${stack}`} 
                position={[10 + row * 20, 12 + stack * 6, (row - 1) * 8]} 
                castShadow
              >
                <boxGeometry args={[18, 5.5, 6]} />
                <meshStandardMaterial 
                  color={['#ff6b35', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][Math.floor(Math.random() * 5)]}
                  roughness={0.7}
                  metalness={0.3}
                />
              </mesh>
            ))
          )}
        </>
      )}

      {/* Cargo tanks (if tanker) - Multiple tanks */}
      {type === 'tanker' && (
        <>
          {[-20, 0, 20].map((x, i) => (
            <mesh key={`tank-${i}`} position={[x, 12, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[8, 8, 20, 16]} />
              <meshStandardMaterial color="#c0c0c0" roughness={0.3} metalness={0.7} />
            </mesh>
          ))}
          {/* Tank pipes */}
          {[-20, 0, 20].map((x, i) => (
            <mesh key={`pipe-${i}`} position={[x, 20, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.5, 0.5, 22, 8]} />
              <meshStandardMaterial color="#374151" metalness={0.9} />
            </mesh>
          ))}
        </>
      )}

      {/* Anchor */}
      <group position={[55, 2, 10]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.5, 0.5, 8, 8]} />
          <meshStandardMaterial color="#1f2937" metalness={0.8} />
        </mesh>
        <mesh position={[0, -5, 0]} castShadow>
          <boxGeometry args={[3, 1, 0.5]} />
          <meshStandardMaterial color="#1f2937" metalness={0.8} />
        </mesh>
      </group>

      {/* Propeller - Animated */}
      <group ref={propellerRef} position={[-65, -6, 0]}>
        {[0, 90, 180, 270].map((angle, i) => (
          <mesh key={`blade-${i}`} rotation={[0, 0, (angle * Math.PI) / 180]} castShadow>
            <boxGeometry args={[12, 1.5, 0.5]} />
            <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}
        <mesh>
          <sphereGeometry args={[2, 12, 12]} />
          <meshStandardMaterial color="#374151" metalness={0.8} />
        </mesh>
      </group>

      {/* Water waves around ship */}
      <group ref={waveRef} position={[0, -8, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[26, 38, 32]} />
          <meshStandardMaterial 
            color="#0c4a6e"
            transparent
            opacity={0.5}
            emissive="#3b82f6"
            emissiveIntensity={0.2}
          />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
          <ringGeometry args={[32, 42, 32]} />
          <meshStandardMaterial 
            color="#0c4a6e"
            transparent
            opacity={0.3}
            emissive="#1e40af"
            emissiveIntensity={0.1}
          />
        </mesh>
      </group>

      {/* Status Indicator - Enhanced */}
      <mesh position={[-40, 38, 0]}>
        <sphereGeometry args={[2.5, 16, 16]} />
        <meshStandardMaterial
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={1.2}
        />
      </mesh>

      {/* Navigation lights - Enhanced */}
      <mesh position={[60, 10, 12]}>
        <sphereGeometry args={[0.8, 12, 12]} />
        <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={1} />
      </mesh>
      <pointLight position={[60, 10, 12]} color="#00ff00" intensity={30} distance={40} />
      
      <mesh position={[-60, 10, -12]}>
        <sphereGeometry args={[0.8, 12, 12]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={1} />
      </mesh>
      <pointLight position={[-60, 10, -12]} color="#ff0000" intensity={30} distance={40} />

      {/* Mast light (white) */}
      <mesh position={[-40, 52, 0]}>
        <sphereGeometry args={[0.6, 12, 12]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
      </mesh>
      <pointLight position={[-40, 52, 0]} color="#ffffff" intensity={25} distance={35} />

      {/* Status light */}
      <pointLight position={[-40, 38, 0]} color={statusColor} intensity={60} distance={80} />

      {/* Hover glow */}
      {hovered && (
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[28, 32, 32]} />
          <meshBasicMaterial
            color={statusColor}
            transparent
            opacity={0.4}
          />
        </mesh>
      )}
    </group>
  );
}

export const Ship = memo(ShipComponent);

