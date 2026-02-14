import { useRef, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group, Mesh } from 'three';

interface TruckProps {
  position: [number, number, number];
  color?: string;
  isMoving?: boolean;
  route?: 'road1' | 'road2' | 'road3';
}

/**
 * Truck component - Enhanced with animated wheels, mirrors, lights
 */
function TruckComponent({ position, color = '#fbbf24', isMoving = true, route = 'road1' }: TruckProps) {
  const groupRef = useRef<Group>(null);
  const wheelRefs = useRef<(Mesh | null)[]>([]);

  useFrame((state) => {
    if (groupRef.current && isMoving) {
      const time = state.clock.getElapsedTime();
      
      // Movement
      if (route === 'road1') {
        groupRef.current.position.x = position[0] + Math.sin(time * 0.5) * 50;
      } else if (route === 'road2') {
        groupRef.current.position.z = position[2] + Math.cos(time * 0.3) * 40;
      } else {
        groupRef.current.position.x = position[0] + Math.cos(time * 0.4) * 30;
        groupRef.current.position.z = position[2] + Math.sin(time * 0.4) * 30;
      }

      // Rotate wheels
      wheelRefs.current.forEach(wheel => {
        if (wheel) wheel.rotation.x += 0.1;
      });
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Truck Cab - Enhanced */}
      <mesh position={[0, 2, 0]} castShadow>
        <boxGeometry args={[6, 4, 4]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.3} />
      </mesh>

      {/* Cab roof */}
      <mesh position={[0, 4.5, 0]} castShadow>
        <boxGeometry args={[6, 1, 4]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>

      {/* Windshield */}
      <mesh position={[2.8, 2.5, 0]}>
        <boxGeometry args={[0.6, 2.5, 3.8]} />
        <meshStandardMaterial 
          color="#87ceeb" 
          transparent 
          opacity={0.7}
          emissive="#87ceeb"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Side windows */}
      {[2, -2].map((z, i) => (
        <mesh key={`window-${i}`} position={[0.5, 2.5, z]}>
          <boxGeometry args={[4, 2, 0.2]} />
          <meshStandardMaterial 
            color="#87ceeb" 
            transparent 
            opacity={0.6}
          />
        </mesh>
      ))}

      {/* Side mirrors */}
      {[2.2, -2.2].map((z, i) => (
        <group key={`mirror-${i}`} position={[2, 3, z]}>
          <mesh castShadow>
            <boxGeometry args={[0.5, 0.8, 0.3]} />
            <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0.3, 0, 0]}>
            <boxGeometry args={[0.2, 0.6, 0.25]} />
            <meshStandardMaterial 
              color="#87ceeb" 
              metalness={0.9} 
              roughness={0.1}
              transparent
              opacity={0.8}
            />
          </mesh>
        </group>
      ))}

      {/* Front grille */}
      <mesh position={[3.2, 1.5, 0]}>
        <boxGeometry args={[0.4, 2, 3.5]} />
        <meshStandardMaterial color="#1f2937" metalness={0.7} />
      </mesh>

      {/* Grille bars */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={`bar-${i}`} position={[3.3, 0.5 + i * 0.5, 0]}>
          <boxGeometry args={[0.2, 0.2, 3.3]} />
          <meshStandardMaterial color="#6b7280" metalness={0.9} />
        </mesh>
      ))}

      {/* Container/Trailer - Enhanced */}
      <mesh position={[-8, 3, 0]} castShadow>
        <boxGeometry args={[12, 5, 4]} />
        <meshStandardMaterial color="#e5e7eb" roughness={0.7} />
      </mesh>

      {/* Trailer doors */}
      <mesh position={[-14.1, 3, 0]}>
        <boxGeometry args={[0.2, 4.5, 3.8]} />
        <meshStandardMaterial color="#9ca3af" />
      </mesh>
      <mesh position={[-14, 3, 0]}>
        <boxGeometry args={[0.1, 4, 0.1]} />
        <meshStandardMaterial color="#1f2937" metalness={0.8} />
      </mesh>

      {/* Wheels - Animated */}
      {[[2, 2], [2, -2], [-9, 2], [-9, -2], [-11, 2], [-11, -2]].map((pos, i) => (
        <group key={`wheel-${i}`} position={[pos[0], 0.8, pos[1]]}>
          <mesh 
            ref={el => wheelRefs.current[i] = el}
            rotation={[0, 0, Math.PI / 2]} 
            castShadow
          >
            <cylinderGeometry args={[0.8, 0.8, 0.6, 16]} />
            <meshStandardMaterial color="#1f2937" metalness={0.7} roughness={0.5} />
          </mesh>
          {/* Wheel rim */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.4, 0.4, 0.7, 8]} />
            <meshStandardMaterial color="#6b7280" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Wheel spokes */}
          {[0, 90, 180, 270].map((angle, j) => (
            <mesh 
              key={`spoke-${j}`}
              rotation={[0, (angle * Math.PI) / 180, Math.PI / 2]}
            >
              <boxGeometry args={[0.6, 0.1, 0.1]} />
              <meshStandardMaterial color="#9ca3af" metalness={0.8} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Headlights - Enhanced */}
      <mesh position={[3.3, 1.2, 1.3]}>
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshStandardMaterial 
          color="#fef3c7" 
          emissive="#fef3c7" 
          emissiveIntensity={0.8}
        />
      </mesh>
      <mesh position={[3.3, 1.2, -1.3]}>
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshStandardMaterial 
          color="#fef3c7" 
          emissive="#fef3c7" 
          emissiveIntensity={0.8}
        />
      </mesh>
      <pointLight position={[3.5, 1.2, 1.3]} color="#ffffff" intensity={15} distance={20} />
      <pointLight position={[3.5, 1.2, -1.3]} color="#ffffff" intensity={15} distance={20} />

      {/* Brake lights */}
      <mesh position={[-14.2, 3, 1.5]}>
        <sphereGeometry args={[0.25, 12, 12]} />
        <meshStandardMaterial 
          color="#ff0000" 
          emissive="#ff0000" 
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[-14.2, 3, -1.5]}>
        <sphereGeometry args={[0.25, 12, 12]} />
        <meshStandardMaterial 
          color="#ff0000" 
          emissive="#ff0000" 
          emissiveIntensity={0.5}
        />
      </mesh>
      <pointLight position={[-14.3, 3, 1.5]} color="#ff0000" intensity={10} distance={12} />
      <pointLight position={[-14.3, 3, -1.5]} color="#ff0000" intensity={10} distance={12} />

      {/* Turn signals (orange) */}
      <mesh position={[3.2, 2.5, 1.8]}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial 
          color="#f59e0b" 
          emissive="#f59e0b" 
          emissiveIntensity={0.4}
        />
      </mesh>
      <mesh position={[3.2, 2.5, -1.8]}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial 
          color="#f59e0b" 
          emissive="#f59e0b" 
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* License plate */}
      <mesh position={[3.4, 0.6, 0]}>
        <planeGeometry args={[1.5, 0.5]} />
        <meshStandardMaterial 
          color="#fef3c7"
          emissive="#fef3c7"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Exhaust pipe */}
      <mesh position={[-1, 3, -2.2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 2, 8]} />
        <meshStandardMaterial color="#1f2937" metalness={0.8} />
      </mesh>

      {/* Roof lights (typical for trucks) */}
      {[-1, 0, 1].map((x, i) => (
        <mesh key={`roof-light-${i}`} position={[x, 5.2, 0]}>
          <cylinderGeometry args={[0.2, 0.25, 0.3, 12]} />
          <meshStandardMaterial 
            color="#f59e0b"
            emissive="#f59e0b"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

export const Truck = memo(TruckComponent);

