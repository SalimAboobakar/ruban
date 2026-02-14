import { useMemo, memo } from 'react';
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
 * Container stacks - Optimized for performance
 */
function ContainerStacksComponent({
  position,
  status,
  rows = 4,
  columns = 6,
  height = 3,
}: ContainerStacksProps) {
  const statusColor = getStatusColor(status);

  // Shipping company colors (realistic brands)
  const containerColors = useMemo(() => {
    const colors = [
      '#00a2e1', // Maersk blue
      '#004494', // MSC blue
      '#e30613', // COSCO red
      '#008651', // Evergreen
      '#ff6600', // Hapag-Lloyd orange
      '#8b5cf6', // Generic purple
      '#ef4444', // Generic red
      '#3b82f6', // Generic blue
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
            
            // Use status color for top layer, branded colors for others
            const color = level === height - 1 
              ? statusColor 
              : containerColors[(row * columns + col) % containerColors.length];

            return (
              <group key={`container-${row}-${col}-${level}`} position={[x, y, z]}>
                {/* Main container body */}
                <mesh castShadow receiveShadow>
                  <boxGeometry
                    args={[containerSize.width, containerSize.height, containerSize.depth]}
                  />
                  <meshStandardMaterial
                    color={color}
                    roughness={0.7}
                    metalness={0.3}
                  />
                </mesh>

                {/* Simplified door details - only for top layer */}
                {level === height - 1 && (
                  <>
                    <mesh position={[-containerSize.width / 2 - 0.05, 0, 0]}>
                      <boxGeometry args={[0.1, containerSize.height * 0.9, 0.15]} />
                      <meshStandardMaterial color="#1f2937" metalness={0.8} />
                    </mesh>
                    
                    {/* Logo sticker */}
                    <mesh position={[0, 0, containerSize.depth / 2 + 0.05]}>
                      <planeGeometry args={[3, 2]} />
                      <meshStandardMaterial 
                        color="#ffffff"
                        emissive={color}
                        emissiveIntensity={0.15}
                        transparent
                        opacity={0.85}
                      />
                    </mesh>
                  </>
                )}
              </group>
            );
          })
        )
      )}
      
      {/* Status indicator at the top - Optimized */}
      <mesh position={[0, height * 3 + 2, columns * 3]}>
        <sphereGeometry args={[1.5, 12, 12]} />
        <meshStandardMaterial
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={0.8}
        />
      </mesh>
      
      <pointLight
        position={[0, height * 3 + 2, columns * 3]}
        color={statusColor}
        intensity={25}
        distance={40}
      />

    </group>
  );
}

export const ContainerStacks = memo(ContainerStacksComponent);

