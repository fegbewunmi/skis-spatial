import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";

type Props = {
  type: "chair" | "table" | "lamp" | "rug";
};

const PATHS = {
  chair: "/models/chair.glb",
  table: "/models/table.glb",
  lamp: "/models/lamp.glb",
  rug: "/models/rug.glb",
};

export function Model({ type }: Props) {
  const { scene } = useGLTF(PATHS[type]);

  const cloned = useMemo(() => scene.clone(), [scene]);

  return <primitive object={cloned} />;
}
