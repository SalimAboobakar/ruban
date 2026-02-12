import type { EquipmentStatus } from '../../types';
import { getStatusColor } from '../../utils/statusColors';

interface WarehouseProps {
  position: [number, number, number];
  size?: [number, number, number];
  status: EquipmentStatus;
  name: string;
}

/**
 * Warehouse/Building component
 */
export function Warehouse({ position, size = [80, 20, 40], status, name }: WarehouseProps) {
  const statusColor = getStatusColor(status);

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

      {/* Windows - Front */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh
          key={`window-front-${i}`}
          position={[size[0] / 2 + 0.1, 0, (i - 2) * 8]}
        >
          <boxGeometry args={[0.2, 8, 6]} />
          <meshStandardMaterial
            color="#fef3c7"
            emissive="#fef3c7"
            emissiveIntensity={0.3}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}

      {/* Loading Dock */}
      <mesh position={[size[0] / 2 - 2, -size[1] / 2 + 2, 0]} castShadow>
        <boxGeometry args={[4, 4, 15]} />
        <meshStandardMaterial color="#9ca3af" />
      </mesh>

      {/* Company Name Sign */}
      <mesh position={[size[0] / 2 + 0.5, size[1] / 3, 0]}>
        <boxGeometry args={[0.5, 6, 20]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>

      {/* Status Light on Building */}
      <mesh position={[0, size[1] / 2 + 5, size[2] / 2]}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshStandardMaterial
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={0.8}
        />
      </mesh>

      <pointLight
        position={[0, size[1] / 2 + 5, size[2] / 2]}
        color={statusColor}
        intensity={30}
        distance={50}
      />
    </group>
  );
}

