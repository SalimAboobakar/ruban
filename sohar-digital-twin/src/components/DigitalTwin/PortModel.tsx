/**
 * PortModel - Main port infrastructure including ocean, berths, and environment
 */
export function PortModel() {
  return (
    <group>
      {/* Ocean Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1, 0]}
        receiveShadow
      >
        <planeGeometry args={[2000, 2000]} />
        <meshStandardMaterial
          color="#0c4a6e"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Sky Gradient Background - Upper hemisphere */}
      <mesh position={[0, 500, 0]}>
        <sphereGeometry args={[1500, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshBasicMaterial
          color="#0ea5e9"
          side={2} // DoubleSide
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Berth 1: Hutchison Container Terminal */}
      <group position={[0, 0, 100]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[300, 5, 100]} />
          <meshStandardMaterial
            color="#333333"
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
        
        {/* Berth edge marking */}
        <mesh position={[0, 3, -52]}>
          <boxGeometry args={[300, 1, 4]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#f59e0b"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>

      {/* Berth 2: Steinweg */}
      <group position={[350, 0, 100]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[200, 5, 100]} />
          <meshStandardMaterial
            color="#2d3748"
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
        
        {/* Berth edge marking */}
        <mesh position={[0, 3, -52]}>
          <boxGeometry args={[200, 1, 4]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#f59e0b"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>

      {/* Berth 3: Oiltanking */}
      <group position={[600, 0, 90]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[200, 5, 80]} />
          <meshStandardMaterial
            color="#374151"
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
        
        {/* Berth edge marking */}
        <mesh position={[0, 3, -42]}>
          <boxGeometry args={[200, 1, 4]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#f59e0b"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>

      {/* Grid lines for reference (optional, helps with depth perception) */}
      <gridHelper args={[2000, 40, '#1e40af', '#1e3a8a']} position={[0, -0.5, 0]} />

      {/* Port Lighting Poles along the berths */}
      {Array.from({ length: 15 }).map((_, i) => (
        <group key={`light-pole-${i}`} position={[(i - 7) * 80, 0, 140]}>
          {/* Pole */}
          <mesh castShadow>
            <cylinderGeometry args={[0.5, 0.8, 25, 8]} />
            <meshStandardMaterial color="#4b5563" metalness={0.6} />
          </mesh>
          
          {/* Light fixture */}
          <mesh position={[0, 12.5, 0]}>
            <cylinderGeometry args={[2, 1, 1, 8]} />
            <meshStandardMaterial
              color="#fef3c7"
              emissive="#fef3c7"
              emissiveIntensity={0.5}
            />
          </mesh>
          
          {/* Light */}
          <pointLight
            position={[0, 12, 0]}
            color="#fef3c7"
            intensity={80}
            distance={60}
            castShadow
          />
        </group>
      ))}

      {/* Port Control Tower */}
      <group position={[-200, 0, 180]}>
        {/* Tower Base */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[10, 12, 40, 16]} />
          <meshStandardMaterial color="#6b7280" />
        </mesh>
        
        {/* Control Room */}
        <mesh position={[0, 25, 0]} castShadow>
          <cylinderGeometry args={[8, 8, 10, 16]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        
        {/* Windows */}
        <mesh position={[0, 25, 0]}>
          <cylinderGeometry args={[8.1, 8.1, 8, 16]} />
          <meshStandardMaterial
            color="#87ceeb"
            transparent
            opacity={0.6}
          />
        </mesh>
        
        {/* Radar/Antenna */}
        <mesh position={[0, 32, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 4, 8]} />
          <meshStandardMaterial color="#d32f2f" />
        </mesh>
        
        {/* Rotating radar dish */}
        <mesh position={[0, 34, 0]} rotation={[Math.PI / 4, 0, 0]}>
          <boxGeometry args={[6, 0.5, 6]} />
          <meshStandardMaterial color="#4b5563" metalness={0.8} />
        </mesh>
      </group>

      {/* Fuel Station Area */}
      <group position={[700, 0, 150]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[30, 15, 20]} />
          <meshStandardMaterial color="#991b1b" />
        </mesh>
        <mesh position={[0, 8, 0]}>
          <boxGeometry args={[28, 1, 18]} />
          <meshStandardMaterial color="#fef3c7" emissive="#fef3c7" emissiveIntensity={0.3} />
        </mesh>
      </group>

      {/* Security Gates */}
      <group position={[-180, 0, 140]}>
        <mesh castShadow>
          <boxGeometry args={[4, 6, 0.5]} />
          <meshStandardMaterial color="#f59e0b" />
        </mesh>
        <mesh position={[0, 6, 0]}>
          <boxGeometry args={[6, 2, 0.5]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      </group>
    </group>
  );
}

