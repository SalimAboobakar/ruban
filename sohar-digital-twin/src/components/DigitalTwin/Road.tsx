interface RoadProps {
  start: [number, number, number];
  end: [number, number, number];
  width?: number;
}

/**
 * Road/Pathway component
 */
export function Road({ start, end, width = 8 }: RoadProps) {
  const length = Math.sqrt(
    Math.pow(end[0] - start[0], 2) +
    Math.pow(end[2] - start[2], 2)
  );

  const midX = (start[0] + end[0]) / 2;
  const midZ = (start[2] + end[2]) / 2;
  
  const angle = Math.atan2(end[2] - start[2], end[0] - start[0]);

  return (
    <group position={[midX, 0.1, midZ]} rotation={[0, angle, 0]}>
      {/* Road Surface */}
      <mesh receiveShadow>
        <boxGeometry args={[length, 0.2, width]} />
        <meshStandardMaterial color="#374151" roughness={0.9} />
      </mesh>

      {/* Road Markings */}
      <mesh position={[0, 0.11, 0]}>
        <boxGeometry args={[length, 0.05, 0.3]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.8} />
      </mesh>

      {/* Dashed center line */}
      {Array.from({ length: Math.floor(length / 10) }).map((_, i) => (
        <mesh key={i} position={[(i - Math.floor(length / 20)) * 10, 0.11, width / 4]}>
          <boxGeometry args={[4, 0.05, 0.2]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}
    </group>
  );
}

