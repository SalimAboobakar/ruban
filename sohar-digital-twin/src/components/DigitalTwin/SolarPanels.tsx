/**
 * Solar Panel Array - Renewable Energy
 */
export function SolarPanels({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Solar Panel Rows */}
      {Array.from({ length: 8 }).map((_, row) => (
        <group key={row} position={[0, 0, row * 8]}>
          {Array.from({ length: 12 }).map((_, col) => (
            <mesh
              key={col}
              position={[col * 3, 2, 0]}
              rotation={[-Math.PI / 6, 0, 0]}
              castShadow
            >
              <boxGeometry args={[2.5, 0.1, 4]} />
              <meshStandardMaterial
                color="#1e3a8a"
                metalness={0.8}
                roughness={0.2}
                emissive="#0ea5e9"
                emissiveIntensity={0.2}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Support Structure */}
      <mesh position={[18, 0, 28]} receiveShadow>
        <boxGeometry args={[36, 0.5, 64]} />
        <meshStandardMaterial color="#6b7280" />
      </mesh>
    </group>
  );
}

