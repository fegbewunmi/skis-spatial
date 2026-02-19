import { Canvas } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useStudioStore } from "../store/useStudioStore";
import { useEditorStore } from "../store/editorStore";
import { kelvinToCSS } from "../ui/SettingsPanel";
import { OrbitControls, TransformControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

function Room({ wallColor }: { wallColor: string }) {
  return (
    <group>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#bdbdbd" />
      </mesh>

      {/* back wall */}
      <mesh position={[0, 2.5, -5]} receiveShadow>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial color={wallColor} side={THREE.DoubleSide} />
      </mesh>

      {/* right wall */}
      <mesh
        position={[5, 2.5, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial color={wallColor} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export function Viewport() {
  // Studio settings
  const mode = useStudioStore((s) => s.mode);
  const wallColor = useStudioStore((s) => s.wallColor);
  const lightIntensity = useStudioStore((s) => s.lightIntensity);
  const lightTemp = useStudioStore((s) => s.lightTemp);
  const lightColor = useMemo(() => kelvinToCSS(lightTemp), [lightTemp]);

  // Editor state
  const objects = useEditorStore((s) => s.objects);
  const selectedId = useEditorStore((s) => s.selectedId);
  const selectObject = useEditorStore((s) => s.selectObject);
  const toolMode = useEditorStore((s) => s.toolMode);
  const updateObject = useEditorStore((s) => s.updateObject);

  // controls refs
  const orbitRef = useRef<OrbitControlsImpl>(null);

  // keep refs to every object group
  const objectRefs = useRef<Record<string, THREE.Group | null>>({});

  const selectedObj3D = selectedId ? objectRefs.current[selectedId] : null;
  const tcEnabled = !!selectedObj3D && toolMode !== "select";
  const tcMode = toolMode === "move" ? "translate" : "rotate";

  return (
    <div className="viewport">
      <Canvas
        shadows
        camera={{ position: [6, 5, 6], fov: 50 }}
        onPointerMissed={() => {
          // click empty space = deselect
          selectObject(null);
        }}
      >
        <color
          attach="background"
          args={[mode === "day" ? "#111111" : "#0b0b0c"]}
        />

        <directionalLight
          position={[5, 8, 5]}
          intensity={lightIntensity}
          color={lightColor}
          castShadow
        />
        <ambientLight intensity={mode === "day" ? 0.35 : 0.15} />

        <Room wallColor={wallColor} />

        {/* ✅ render objects as stable groups (no TransformControls wrapping) */}
        {objects.map((obj) => {
          const isSelected = selectedId === obj.id;

          return (
            <group
              key={obj.id}
              ref={(node) => {
                objectRefs.current[obj.id] = node;
              }}
              position={obj.position}
              rotation={obj.rotation}
              scale={obj.scale}
              onPointerDown={(e) => {
                e.stopPropagation();
                selectObject(obj.id);
              }}
            >
              <mesh castShadow>
                <boxGeometry args={obj.size} />
                <meshStandardMaterial
                  color={isSelected ? "#00e5ff" : obj.color}
                  roughness={0.7}
                  metalness={0}
                />
              </mesh>
            </group>
          );
        })}

        {/* ✅ ONE TransformControls that attaches to selected object */}
        <TransformControls
          enabled={tcEnabled}
          mode={tcMode}
          // this is the key part: attach to the real selected THREE.Group
          object={selectedObj3D as unknown as THREE.Object3D}
          onMouseDown={() => {
            if (orbitRef.current) orbitRef.current.enabled = false;
          }}
          onMouseUp={() => {
            if (orbitRef.current) orbitRef.current.enabled = true;
          }}
          onObjectChange={() => {
            if (!selectedId) return;
            const g = objectRefs.current[selectedId];
            if (!g) return;

            updateObject(selectedId, {
              position: [g.position.x, g.position.y, g.position.z],
              rotation: [g.rotation.x, g.rotation.y, g.rotation.z],
              scale: [g.scale.x, g.scale.y, g.scale.z],
            });
          }}
        />

        <OrbitControls
          ref={orbitRef}
          makeDefault
          target={[0, 1.5, 0]}
          enableDamping
        />
      </Canvas>
    </div>
  );
}
