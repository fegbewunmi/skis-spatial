import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  TransformControls,
  useTexture,
} from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import { useStudioStore } from "../store/useStudioStore";
import { useEditorStore } from "../store/editorStore";
import { kelvinToCSS } from "../ui/SettingsPanel";
import { Model } from "./Model";

function Room({ wallColor }: { wallColor: string }) {
  const W = 8;
  const D = 10;
  const H = 4;

  const floorPreset = useStudioStore((s) => s.floorPreset);

  // Memoize URLs so useTexture doesn't get a new object every render
  const urls = useMemo(() => {
    return floorPreset === "grey"
      ? {
          map: "/textures/floor_grey/color.jpg",
          normalMap: "/textures/floor_grey/normal.jpg",
          roughnessMap: "/textures/floor_grey/roughness.jpg",
        }
      : {
          map: "/textures/floor_brown/color.jpg",
          normalMap: "/textures/floor_brown/normal.jpg",
          roughnessMap: "/textures/floor_brown/roughness.jpg",
        };
  }, [floorPreset]);

  const { map, normalMap, roughnessMap } = useTexture(urls);

  useMemo(() => {
    const texs = [map, normalMap, roughnessMap].filter(
      Boolean,
    ) as THREE.Texture[];
    texs.forEach((t) => {
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.RepeatWrapping;

      t.repeat.set(2.2, 2.2);

      t.anisotropy = 8;
      t.needsUpdate = true;
    });

    if (map) (map as any).colorSpace = THREE.SRGBColorSpace;
  }, [map, normalMap, roughnessMap]);

  return (
    <group>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial
          key={floorPreset} // force refresh when preset changes
          map={map}
          normalMap={normalMap}
          roughnessMap={roughnessMap}
          roughness={1}
        />
      </mesh>

      {/* back wall */}
      <mesh position={[0, H / 2, -D / 2]} receiveShadow>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial
          color={wallColor}
          side={THREE.DoubleSide}
          roughness={0.9}
        />
      </mesh>

      {/* left wall */}
      <mesh
        position={[-W / 2, H / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial
          color={wallColor}
          side={THREE.DoubleSide}
          roughness={0.9}
        />
      </mesh>

      <mesh position={[0, 0.02, -D / 2 + 0.01]}>
        <planeGeometry args={[W, 0.06]} />
        <meshStandardMaterial color="#000000" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

export function Viewport() {
  // Studio settings
  const mode = useStudioStore((s) => s.mode);
  const wallColor = useStudioStore((s) => s.wallColor);
  const floorColor = useStudioStore((s) => s.floorColor);
  const lightIntensity = useStudioStore((s) => s.lightIntensity);
  const lightTemp = useStudioStore((s) => s.lightTemp);
  const lightColor = useMemo(() => kelvinToCSS(lightTemp), [lightTemp]);

  // Editor state
  const objects = useEditorStore((s) => s.objects);
  const selectedId = useEditorStore((s) => s.selectedId);
  const selectObject = useEditorStore((s) => s.selectObject);
  const toolMode = useEditorStore((s) => s.toolMode);
  const updateObject = useEditorStore((s) => s.updateObject);

  const orbitRef = useRef<OrbitControlsImpl>(null);
  const objectRefs = useRef<Record<string, THREE.Group | null>>({});

  const selectedObj3D = selectedId ? objectRefs.current[selectedId] : null;
  const tcEnabled = !!selectedObj3D && toolMode !== "select";
  const tcMode = toolMode === "move" ? "translate" : "rotate";

  return (
    <div className="viewport-shell">
      <div className="viewport-frame">
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [4.5, 2.2, 4.5], fov: 42, near: 0.1, far: 100 }}
          onPointerMissed={() => selectObject(null)}
        >
          <color
            attach="background"
            args={[mode === "day" ? "#111111" : "#0b0b0c"]}
          />

          <ambientLight intensity={mode === "day" ? 0.45 : 0.2} />

          <directionalLight
            position={[8, 9, 4]}
            intensity={lightIntensity}
            color={lightColor}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-near={1}
            shadow-camera-far={25}
            shadow-camera-left={-7}
            shadow-camera-right={7}
            shadow-camera-top={7}
            shadow-camera-bottom={-7}
          />

          <hemisphereLight
            intensity={mode === "day" ? 0.35 : 0.2}
            color={lightColor}
            groundColor="#1b1b1b"
          />

          <Room wallColor={wallColor} />

          {objects.map((obj) => (
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
              <Model type={obj.type as any} />
            </group>
          ))}

          <TransformControls
            enabled={tcEnabled}
            mode={tcMode}
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
            target={[0, 1.2, 0]}
            enableDamping
            dampingFactor={0.08}
            minDistance={2.5}
            maxDistance={12}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.05}
            enablePan={false}
          />
        </Canvas>
      </div>
    </div>
  );
}
