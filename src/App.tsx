import { Canvas } from "@react-three/fiber";

function Box() {
  return (
    <mesh
      position={[2, 0, 0]}
      rotation={[Math.PI / 4, Math.PI / 4, 0]}
      scale={[2, 1, 1]}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial />
    </mesh>
  );
}
export default function App() {
  return (
    <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Box />
    </Canvas>
  );
}
