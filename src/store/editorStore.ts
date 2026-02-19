import { create } from "zustand";

export type ToolMode = "select" | "move" | "rotate";

export type StudioObject = {
  id: string;
  type: "box";
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  size: [number, number, number];
  color: string;
};

type EditorState = {
  objects: StudioObject[];
  selectedId: string | null;

  addObject: () => void;
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

  addObject: () =>
    set((state) => ({
      objects: [
        ...state.objects,
        {
          id: crypto.randomUUID(),
          type: "box",
          position: [0, 0.5, 0],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
          size: [1, 1, 1],
          color: "#c2a676",
        },
      ],
    })),

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
