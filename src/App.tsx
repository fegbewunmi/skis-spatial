import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Grid,
  GizmoHelper,
  GizmoViewport,
  Environment,
} from "@react-three/drei";

import { Room } from "./components/Room";
import { EditorObject } from "./components/EditorObject";
import type { StudioObject } from "./components/EditorObject";
import { ft } from "./lib/units";

export default function App() {
  // selected object id
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // simple test object list
  const objects: StudioObject[] = [
    {
      id: "table-1",
      type: "box",

      // position in meters
      position: [0, 0.45, 0],

      // rotation in radians
      rotation: [0, 0, 0],

      // scale multiplier
      scale: [1, 1, 1],

      // actual size in meters
      size: [1.5, 0.9, 1],

      color: "#c2a676",
    },
  ];

  return (
    <Canvas
      shadows
      camera={{ position: [4, 3, 4], fov: 50 }}
      onPointerMissed={() => setSelectedId(null)}
    >
      {/* background */}
      <color attach="background" args={["#141414"]} />

      {/* lighting */}
      <directionalLight position={[4, 6, 2]} intensity={1.2} castShadow />

      <ambientLight intensity={0.3} />

      {/* realistic lighting */}
      <Environment preset="apartment" />

      {/* grid floor */}
      <Grid
        position={[0, 0, 0]}
        infiniteGrid
        cellSize={0.3048} // 1 ft grid
        sectionSize={ft(5)} // every 5 ft bold
        fadeDistance={30}
      />

      {/* room */}
      <Room width={ft(12)} depth={ft(10)} height={ft(9)} thickness={0.12} />

      {/* objects */}
      {objects.map((obj) => (
        <EditorObject
          key={obj.id}
          obj={obj}
          selected={obj.id === selectedId}
          onSelect={setSelectedId}
        />
      ))}

      {/* axis helper bottom right */}
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport />
      </GizmoHelper>

      {/* camera control */}
      <OrbitControls
        target={[0, ft(4), 0]}
        enableDamping
        dampingFactor={0.08}
      />
    </Canvas>
  );
}
