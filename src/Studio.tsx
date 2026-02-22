import { useEffect, useRef, useState } from "react";
import { Viewport } from "./viewport/Viewport";
import { SettingsPanel } from "./ui/SettingsPanel";
import { useEditorStore } from "./store/editorStore";

type AddType = "chair" | "table" | "lamp" | "rug";

export function Studio() {
  const addObject = useEditorStore((s) => s.addObject);
  const toolMode = useEditorStore((s) => s.toolMode);
  const setToolMode = useEditorStore((s) => s.setToolMode);
  const resetSelected = useEditorStore((s) => s.resetSelected);
  const selectedId = useEditorStore((s) => s.selectedId);

  const [addOpen, setAddOpen] = useState(false);
  const addWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!addWrapRef.current) return;
      if (!addWrapRef.current.contains(e.target as Node)) {
        setAddOpen(false);
      }
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, []);

  const toggleTool = (next: "move" | "rotate") => {
    setToolMode(toolMode === next ? "select" : next);
  };

  const handleAdd = (type: AddType) => {
    addObject(type);
    setAddOpen(false);
  };

  return (
    <div className="studio-root">
      {/* CENTERED CONTAINER */}
      <div className="studio-container">
        {/* CANVAS */}

        <Viewport />

        {/* SETTINGS PANEL (attached right) */}
        <SettingsPanel />

        {/* TOOLBAR (inside container bottom-left) */}
        <div className="toolbar">
          <div className="add-wrap" ref={addWrapRef}>
            <button onClick={() => setAddOpen((v) => !v)}>+ Add Object</button>

            {addOpen && (
              <div className="add-menu">
                <button onClick={() => handleAdd("chair")}>Chair</button>
                <button onClick={() => handleAdd("table")}>Table</button>
                <button onClick={() => handleAdd("lamp")}>Lamp</button>
                <button onClick={() => handleAdd("rug")}>Rug</button>
              </div>
            )}
          </div>

          <button
            onClick={() => toggleTool("move")}
            disabled={!selectedId}
            className={toolMode === "move" ? "active" : ""}
          >
            Move
          </button>

          <button
            onClick={() => toggleTool("rotate")}
            disabled={!selectedId}
            className={toolMode === "rotate" ? "active" : ""}
          >
            Rotate
          </button>

          <button onClick={resetSelected} disabled={!selectedId}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
