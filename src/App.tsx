import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { DoubleSide } from "three";

// function Box() {
//   return (
//     <mesh
//       position={[2, 0, 0]}
//       rotation={[Math.PI / 4, Math.PI / 4, 0]}
//       scale={[2, 1, 1]}
//     >
//       <boxGeometry args={[1, 1, 1]} />
//       <meshStandardMaterial />
//     </mesh>
//   );
// }
function Scene() {
  const w = 6; // width (x)
  const d = 6; // depth (z)
  const h = 3; // height (y)
  const t = 0.2; // wall thickness

  const halfW = w / 2;
  const halfD = d / 2;

  return (
    <group>
      {/* Floor */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[w, t, d]} />
        <meshStandardMaterial
          side={DoubleSide}
          color="#9e9e9e"
          roughness={0.8}
        />
      </mesh>
      {/* Back Wall */}
      <mesh position={[0, 1.5, -2.9]}>
        <boxGeometry args={[w, h, t]} />
        <meshStandardMaterial side={DoubleSide} roughness={1} />
      </mesh>
      {/* Front Wall */}
      <mesh position={[0, 1.5, 2.9]}>
        <boxGeometry args={[w, h, t]} />
        <meshStandardMaterial side={DoubleSide} roughness={1} />
      </mesh>
      {/* Left Wall */}
      <mesh position={[-2.9, 1.5, 0]}>
        <boxGeometry args={[t, h, w]} />
        <meshStandardMaterial side={DoubleSide} roughness={1} />
      </mesh>
      {/* Right Wall */}
      <mesh position={[2.9, 1.5, 0]}>
        <boxGeometry args={[t, h, w]} />
        <meshStandardMaterial side={DoubleSide} roughness={1} />
      </mesh>
      {/* Ceiling */}
      <mesh position={[0, 3.1, 0]}>
        <boxGeometry args={[w, t, d]} />
        <meshStandardMaterial side={DoubleSide} roughness={1} />
      </mesh>
    </group>
  );
}
export default function App() {
  return (
    <Canvas shadows camera={{ position: [6, 4, 6], fov: 50 }}>
      {/* <ambientLight intensity={0.05} /> */}
      <hemisphereLight intensity={0.25} />
      <directionalLight position={[4, 6, 2]} intensity={1} castShadow />
      <Environment preset="apartment" />
      <color attach="background" args={["#1e1e1e"]} />
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[0.2, 1, 0.2]} />
        <meshStandardMaterial color="#444" />
      </mesh>
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[1.5, 0.7, 1]} />
        <meshStandardMaterial color="#c2a676" metalness={0.0} roughness={0.6} />
      </mesh>
      <Scene />
      <OrbitControls target={[0, 1, 0]} enableDamping dampingFactor={0.08} />
    </Canvas>
  );
}
