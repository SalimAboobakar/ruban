/**
 * Storage Tank - For oil, chemicals, or water
 */
export function StorageTank({
  position,
  color = '#c0c0c0',
  size = 10,
}: {
  position: [number, number, number];
  color?: string;
  size?: number;
}) {
  return (
    <group position={position}>
      {/* Main Tank */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[size, size, size * 1.5, 16]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Top Dome */}
      <mesh position={[0, size * 0.75 + 1, 0]} castShadow>
        <sphereGeometry args={[size, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Access Ladder */}
      <mesh position={[size - 0.5, 0, 0]} castShadow>
        <boxGeometry args={[0.3, size * 1.5, 0.3]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
    </group>
  );
}

