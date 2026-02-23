import { create } from "zustand";

export type UiMode = "day" | "night";
export type Preset = "brown" | "grey";

type StudioState = {
  // UI / lighting settings
  mode: UiMode;
  wallColor: string;
  floorColor: string;
  floorPreset: Preset;
  lightIntensity: number; // 0..3
  lightTemp: number; // kelvin 2700..6500

  setMode: (mode: UiMode) => void;
  setFloorPreset: (floorPreset: Preset) => void;
  setWallColor: (color: string) => void;
  setFloorColor: (color: string) => void;
  setLightIntensity: (v: number) => void;
  setLightTemp: (k: number) => void;
};

export const useStudioStore = create<StudioState>((set) => ({
  mode: "day",
  wallColor: "#f3f0e9",
  floorColor: "#b9b0a3",
  floorPreset: "grey",
  lightIntensity: 1.2,
  lightTemp: 4500,

  setMode: (mode) => set({ mode }),
  setWallColor: (wallColor) => set({ wallColor }),
  setFloorColor: (floorColor) => set({ floorColor }),
  setFloorPreset: (floorPreset) => set({ floorPreset }),
  setLightIntensity: (lightIntensity) => set({ lightIntensity }),
  setLightTemp: (lightTemp) => set({ lightTemp }),
}));
