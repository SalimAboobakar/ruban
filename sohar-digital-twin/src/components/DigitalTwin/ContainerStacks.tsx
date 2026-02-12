import { useMemo } from 'react';
import type { EquipmentStatus } from '../../types';
import { getStatusColor } from '../../utils/statusColors';

interface ContainerStacksProps {
  position: [number, number, number];
  status: EquipmentStatus;
  rows?: number;
  columns?: number;
  height?: number;
}

/**
 * Container stacks in the yard
 * Simplified representation as colored boxes
 */
export function ContainerStacks({
  position,
  status,
  rows = 4,
  columns = 6,
  height = 3,
}: ContainerStacksProps) {
  const statusColor = getStatusColor(status);

  // Generate container colors (varied but themed)
  const containerColors = useMemo(() => {
    const colors = [
      '#ef4444', // red
      '#3b82f6', // blue
      '#10b981', // green
      '#f59e0b', // orange
      '#8b5cf6', // purple
      '#ec4899', // pink
    ];
    return colors;
  }, []);

  return (
    <group position={position}>
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) =>
          Array.from({ length: height }).map((_, level) => {
            const containerSize = { width: 12, height: 2.5, depth: 6 };
            const spacing = 0.2;
            
            const x = col * (containerSize.width + spacing) - (columns * (containerSize.width + spacing)) / 2;
            const y = level * (containerSize.height + spacing) + containerSize.height / 2;
            const z = row * (containerSize.depth + spacing);
            
            // Use status color for top layer, random colors for others
            const color = level === height - 1 
              ? statusColor 
              : containerColors[(row * columns + col) % containerColors.length];

            return (
              <mesh
                key={`container-${row}-${col}-${level}`}
                position={[x, y, z]}
                castShadow
                receiveShadow
              >
                <boxGeometry
                  args={[containerSize.width, containerSize.height, containerSize.depth]}
                />
                <meshStandardMaterial
                  color={color}
                  roughness={0.7}
                  metalness={0.3}
                />
              </mesh>
            );
          })
        )
      )}
      
      {/* Status indicator at the top */}
      <mesh position={[0, height * 3, columns * 3]}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshStandardMaterial
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={0.6}
        />
      </mesh>
      
      <pointLight
        position={[0, height * 3, columns * 3]}
        color={statusColor}
        intensity={20}
        distance={40}
      />
    </group>
  );
}

