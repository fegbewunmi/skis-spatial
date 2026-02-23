import { create } from "zustand";

export type ToolMode = "select" | "move" | "rotate";

export type StudioObject = {
  id: string;
  type: "box" | "chair" | "table" | "lamp" | "rug";
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  size: [number, number, number];
  color: string;
};

type EditorState = {
  objects: StudioObject[];
  selectedId: string | null;

  addObject: (type?: StudioObject["type"]) => void;
  selectObject: (id: string | null) => void;
  updateObject: (id: string, updates: Partial<StudioObject>) => void;
  toolMode: ToolMode;
  setToolMode: (mode: ToolMode) => void;
  resetSelected: () => void;
};

export const useEditorStore = create<EditorState>((set, get) => ({
  objects: [],
  selectedId: null,

  toolMode: "select",
  setToolMode: (toolMode) => set({ toolMode }),

  addObject: (type: StudioObject["type"] = "box") =>
    set((state) => {
      const id = crypto.randomUUID();

      const defaults = {
        box: {
          size: [1, 1, 1],
          position: [0, 0.5, 0],
          color: "#c2a676",
        },
        chair: {
          size: [0.6, 0.9, 0.6],
          position: [0, 0.45, 0],
          color: "#c2a676",
        },
        table: {
          size: [1.4, 0.75, 0.8],
          position: [0, 0.375, 0],
          color: "#b28b5c",
        },
        lamp: {
          size: [0.3, 1.6, 0.3],
          position: [0, 0.8, 0],
          color: "#f4e7c5",
        },
        rug: {
          size: [2.5, 0.05, 1.5],
          position: [0, 0.025, 0],
          color: "#cbb7f7",
        },
      }[type];

      return {
        objects: [
          ...state.objects,
          {
            id,
            type,
            position: defaults.position as [number, number, number],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
            size: defaults.size as [number, number, number],
            color: defaults.color,
          },
        ],
        selectedId: id,
        toolMode: "move",
      };
    }),

  selectObject: (id) => set({ selectedId: id }),

  updateObject: (id, updates) =>
    set((state) => ({
      objects: state.objects.map((o) =>
        o.id === id ? { ...o, ...updates } : o,
      ),
    })),

  resetSelected: () => {
    const id = get().selectedId;
    if (!id) return;
    set((state) => ({
      objects: state.objects.map((o) =>
        o.id !== id
          ? o
          : {
              ...o,
              position: [0, 0.5, 0],
              rotation: [0, 0, 0],
              scale: [1, 1, 1],
            },
      ),
    }));
  },
}));
