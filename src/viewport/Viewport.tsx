import { Canvas } from "@react-three/fiber";
import { useMemo, useRef, useEffect } from "react";
import { useStudioStore } from "../store/useStudioStore";
import { useEditorStore } from "../store/editorStore";
import { kelvinToCSS } from "../ui/SettingsPanel";
import { OrbitControls, TransformControls } from "@react-three/drei";
import type {
  OrbitControls as OrbitControlsImpl,
  TransformControls as TransformControlsImpl,
} from "three-stdlib";

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
        <meshStandardMaterial color={wallColor} side={2} />
      </mesh>

      {/* right wall */}
      <mesh
        position={[5, 2.5, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial color={wallColor} side={2} />
      </mesh>
    </group>
  );
}

export function Viewport() {
  // Studio settings (already in your project)
  const mode = useStudioStore((s) => s.mode);
  const wallColor = useStudioStore((s) => s.wallColor);
  const lightIntensity = useStudioStore((s) => s.lightIntensity);
  const lightTemp = useStudioStore((s) => s.lightTemp);

  const lightColor = useMemo(() => kelvinToCSS(lightTemp), [lightTemp]);

  // Editor objects (new)
  const objects = useEditorStore((s) => s.objects);
  const selectedId = useEditorStore((s) => s.selectedId);
  const selectObject = useEditorStore((s) => s.selectObject);

  const toolMode = useEditorStore((s) => s.toolMode);
  const updateObject = useEditorStore((s) => s.updateObject);
  const orbitRef = useRef<OrbitControlsImpl>(null);
  const transformRef = useRef<TransformControlsImpl>(null);

  useEffect(() => {
    const tc = transformRef.current;
    if (!tc) return;

    const onDraggingChanged = (e: any) => {
      const dragging = !!e.value;

      // disable orbit while dragging
      if (orbitRef.current) orbitRef.current.enabled = !dragging;

      // when drag ends, commit to store
      if (!dragging && selectedId) {
        const obj3d = tc.object;
        if (!obj3d) return;

        updateObject(selectedId, {
          position: [obj3d.position.x, obj3d.position.y, obj3d.position.z],
          rotation: [obj3d.rotation.x, obj3d.rotation.y, obj3d.rotation.z],
          scale: [obj3d.scale.x, obj3d.scale.y, obj3d.scale.z],
        });
      }
    };

    tc.addEventListener("dragging-changed", onDraggingChanged);
    return () => tc.removeEventListener("dragging-changed", onDraggingChanged);
  }, [selectedId, updateObject]);

  return (
    <div className="viewport">
      <Canvas
        shadows
        camera={{ position: [6, 5, 6], fov: 50 }}
        // onPointerMissed={() => selectObject(null)} // click empty = deselect
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

        {/* Render objects */}
        {objects.map((obj) => {
          const isSelected = selectedId === obj.id;

          // wrapper group holds transforms (THIS is what we transform)
          const groupNode = (
            <group
              position={obj.position}
              rotation={obj.rotation}
              scale={obj.scale}
              onPointerDown={(e) => {
                e.stopPropagation();
                selectObject(obj.id);
              }}
            >
              {/* mesh at origin inside group */}
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

          // no gizmo if not selected or in select mode
          if (!isSelected || toolMode === "select") {
            return <group key={obj.id}>{groupNode}</group>;
          }

          const tcMode = toolMode === "move" ? "translate" : "rotate";

          return (
            <TransformControls ref={transformRef} key={obj.id} mode={tcMode}>
              {groupNode}
            </TransformControls>
          );
        })}

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
