import { useMemo, memo } from 'react';
import type { EquipmentStatus } from '../../types';
import { getStatusColor } from '../../utils/statusColors';

interface WarehouseProps {
  position: [number, number, number];
  size?: [number, number, number];
  status: EquipmentStatus;
  name: string;
}

/**
 * Warehouse/Building component - Optimized for performance
 */
function WarehouseComponent({ position, size = [80, 20, 40], status }: WarehouseProps) {
  const statusColor = getStatusColor(status);

  // Random window lighting pattern (70% lit) - Reduced to 16 windows
  const windowLights = useMemo(() => 
    Array.from({ length: 16 }, () => Math.random() > 0.3),
    []
  );

  return (
    <group position={position}>
      {/* Main Building */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color="#6b7280" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Roof */}
      <mesh position={[0, size[1] / 2 + 2, 0]} castShadow>
        <boxGeometry args={[size[0] + 2, 4, size[2] + 2]} />
        <meshStandardMaterial color="#4b5563" roughness={0.7} />
      </mesh>

      {/* Windows Grid - Front (4 rows x 4 columns) - Optimized */}
      {Array.from({ length: 4 }).map((_, row) =>
        Array.from({ length: 4 }).map((_, col) => {
          const isLit = windowLights[row * 4 + col];
          return (
            <mesh
              key={`window-front-${row}-${col}`}
              position={[
                size[0] / 2 + 0.1,
                size[1] / 2 - 3 - row * 5,
                (col - 1.5) * (size[2] * 0.7) / 4
              ]}
            >
              <boxGeometry args={[0.2, 3.5, 6]} />
              <meshStandardMaterial
                color={isLit ? "#fef3c7" : "#374151"}
                emissive={isLit ? "#fef3c7" : "#000000"}
                emissiveIntensity={isLit ? 0.5 : 0}
                transparent
                opacity={isLit ? 0.9 : 0.4}
              />
            </mesh>
          );
        })
      )}

      {/* AC Units on Roof - Optimized */}
      {Array.from({ length: 2 }).map((_, i) => (
        <group key={`ac-${i}`} position={[(i - 0.5) * 25, size[1] / 2 + 4, 0]}>
          <mesh castShadow>
            <boxGeometry args={[8, 2.5, 5]} />
            <meshStandardMaterial color="#9ca3af" metalness={0.6} roughness={0.5} />
          </mesh>
          <mesh position={[0, 1.5, 0]} castShadow>
            <cylinderGeometry args={[1.8, 1.8, 0.5, 12]} />
            <meshStandardMaterial color="#1f2937" metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Exhaust Pipe - Optimized to 1 */}
      <group position={[-size[0] * 0.25, size[1] / 2, size[2] / 2 - 5]}>
        <mesh castShadow>
          <cylinderGeometry args={[1, 1.2, size[1] + 8, 10]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.7} roughness={0.4} />
        </mesh>
        <mesh position={[0, (size[1] + 8) / 2 + 1, 0]}>
          <cylinderGeometry args={[1.5, 1, 2, 10]} />
          <meshStandardMaterial color="#4b5563" metalness={0.8} />
        </mesh>
      </group>

      {/* Loading Docks (3 docks) */}
      {[-size[2] * 0.3, 0, size[2] * 0.3].map((z, i) => (
        <group key={`dock-${i}`} position={[size[0] / 2 - 1, -size[1] / 2 + 3, z]}>
          <mesh castShadow>
            <boxGeometry args={[2, 6, 10]} />
            <meshStandardMaterial color="#374151" roughness={0.9} />
          </mesh>
          {/* Dock door (roll door texture simulation) */}
          {Array.from({ length: 8 }).map((_, j) => (
            <mesh 
              key={`door-line-${j}`} 
              position={[1.1, 2.5 - j * 0.7, 0]}
            >
              <boxGeometry args={[0.1, 0.5, 9.8]} />
              <meshStandardMaterial color="#1f2937" />
            </mesh>
          ))}
          {/* Loading ramp */}
          <mesh position={[3, -4, 0]} rotation={[0, 0, -Math.PI / 6]}>
            <boxGeometry args={[4, 0.5, 10]} />
            <meshStandardMaterial color="#9ca3af" />
          </mesh>
        </group>
      ))}

      {/* Company Logo Sign - Glowing */}
      <mesh position={[size[0] / 2 + 0.5, size[1] * 0.4, 0]}>
        <planeGeometry args={[15, 8]} />
        <meshStandardMaterial 
          color="#ffffff"
          emissive={statusColor}
          emissiveIntensity={0.5}
          transparent
          opacity={0.95}
        />
      </mesh>
      <pointLight 
        position={[size[0] / 2 + 2, size[1] * 0.4, 0]} 
        color={statusColor} 
        intensity={40} 
        distance={30} 
      />

      {/* Building lights - Optimized to 2 */}
      {[
        [size[0] / 2 - 5, size[1] / 2, size[2] / 2 - 5],
        [-size[0] / 2 + 5, size[1] / 2, -size[2] / 2 + 5],
      ].map((pos, i) => (
        <group key={`corner-light-${i}`} position={pos as [number, number, number]}>
          <mesh>
            <sphereGeometry args={[0.7, 10, 10]} />
            <meshStandardMaterial
              color="#fef3c7"
              emissive="#fef3c7"
              emissiveIntensity={0.6}
            />
          </mesh>
          <pointLight color="#fef3c7" intensity={15} distance={30} />
        </group>
      ))}

      {/* Status Light on Building - Enhanced */}
      <mesh position={[0, size[1] / 2 + 6, size[2] / 2]}>
        <sphereGeometry args={[2, 16, 16]} />
        <meshStandardMaterial
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={1.2}
        />
      </mesh>

      <pointLight
        position={[0, size[1] / 2 + 6, size[2] / 2]}
        color={statusColor}
        intensity={35}
        distance={50}
      />
    </group>
  );
}

export const Warehouse = memo(WarehouseComponent);

