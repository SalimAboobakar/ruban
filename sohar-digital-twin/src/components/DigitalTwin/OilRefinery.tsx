import type { EquipmentStatus } from '../../types';
import { getStatusColor } from '../../utils/statusColors';

interface OilRefineryProps {
  position: [number, number, number];
  status: EquipmentStatus;
}

/**
 * Oil Refinery - Petrochemical processing facility
 */
export function OilRefinery({ position, status }: OilRefineryProps) {
  const statusColor = getStatusColor(status);

  return (
    <group position={position}>
      {/* Main Processing Unit 1 */}
      <mesh position={[0, 15, 0]} castShadow>
        <cylinderGeometry args={[12, 12, 30, 16]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Main Processing Unit 2 */}
      <mesh position={[30, 18, 0]} castShadow>
        <cylinderGeometry args={[10, 10, 36, 16]} />
        <meshStandardMaterial color="#b0b0b0" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Storage Tanks */}
      <mesh position={[-25, 10, 20]} castShadow>
        <cylinderGeometry args={[8, 8, 20, 16]} />
        <meshStandardMaterial color="#8b0000" roughness={0.5} />
      </mesh>
      <mesh position={[-25, 10, -20]} castShadow>
        <cylinderGeometry args={[8, 8, 20, 16]} />
        <meshStandardMaterial color="#8b0000" roughness={0.5} />
      </mesh>

      {/* Distillation Tower */}
      <mesh position={[15, 25, -25]} castShadow>
        <cylinderGeometry args={[6, 8, 50, 16]} />
        <meshStandardMaterial color="#a9a9a9" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Smokestacks */}
      <mesh position={[-10, 35, 10]} castShadow>
        <cylinderGeometry args={[2, 3, 40, 12]} />
        <meshStandardMaterial color="#696969" />
      </mesh>
      <mesh position={[0, 35, -10]} castShadow>
        <cylinderGeometry args={[2, 3, 40, 12]} />
        <meshStandardMaterial color="#696969" />
      </mesh>

      {/* Pipes connecting units */}
      <mesh position={[15, 20, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[1, 1, 30, 8]} />
        <meshStandardMaterial color="#708090" metalness={0.8} />
      </mesh>

      {/* Control Building */}
      <mesh position={[35, 8, 30]} castShadow>
        <boxGeometry args={[15, 16, 12]} />
        <meshStandardMaterial color="#4b5563" />
      </mesh>

      {/* Status Light */}
      <mesh position={[0, 60, 0]}>
        <sphereGeometry args={[2, 16, 16]} />
        <meshStandardMaterial
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={0.8}
        />
      </mesh>
      <pointLight position={[0, 60, 0]} color={statusColor} intensity={60} distance={80} />
    </group>
  );
}

