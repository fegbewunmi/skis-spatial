import { create } from "zustand";

export type UiMode = "day" | "night";

type StudioState = {
  // UI / lighting settings
  mode: UiMode;
  wallColor: string;
  lightIntensity: number; // 0..3
  lightTemp: number; // kelvin 2700..6500

  setMode: (mode: UiMode) => void;
  setWallColor: (color: string) => void;
  setLightIntensity: (v: number) => void;
  setLightTemp: (k: number) => void;
};

export const useStudioStore = create<StudioState>((set) => ({
  mode: "day",
  wallColor: "#f3f0e9",
  lightIntensity: 1.2,
  lightTemp: 4500,

  setMode: (mode) => set({ mode }),
  setWallColor: (wallColor) => set({ wallColor }),
  setLightIntensity: (lightIntensity) => set({ lightIntensity }),
  setLightTemp: (lightTemp) => set({ lightTemp }),
}));
