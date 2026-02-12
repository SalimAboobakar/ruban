import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

/**
 * Simple test scene to verify Three.js is working
 */
export function SimpleTestScene() {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#000' }}>
      <Canvas>
        {/* Camera */}
        <perspectiveCamera position={[5, 5, 5]} />
        
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        {/* Simple Test Cube - RED */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="red" />
        </mesh>
        
        {/* Ground Plane - BLUE */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="blue" />
        </mesh>
        
        {/* Controls */}
        <OrbitControls />
      </Canvas>
    </div>
  );
}

