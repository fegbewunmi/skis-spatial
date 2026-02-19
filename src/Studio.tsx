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

  // close the add menu when clicking outside
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
      <Viewport />
      <SettingsPanel />

      {/* bottom toolbar */}
      <div className="toolbar">
        {/* Add Object popover */}
        <div
          className="add-wrap"
          ref={addWrapRef}
          style={{ position: "relative" }}
        >
          <button onClick={() => setAddOpen((v) => !v)}>+ Add Object</button>

          {addOpen && (
            <div
              className="add-menu"
              style={{
                position: "absolute",
                bottom: "110%",
                left: 0,
                display: "grid",
                gap: 8,
                padding: 10,
                borderRadius: 12,
                background: "rgba(30, 30, 35, 0.92)",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(10px)",
                minWidth: 160,
              }}
            >
              <button onClick={() => handleAdd("chair")}>Chair</button>
              <button onClick={() => handleAdd("table")}>Table</button>
              <button onClick={() => handleAdd("lamp")}>Lamp</button>
              <button onClick={() => handleAdd("rug")}>Rug</button>
            </div>
          )}
        </div>

        <button
          onClick={() => toggleTool("move")}
          style={{ opacity: toolMode === "move" ? 1 : 0.7 }}
          disabled={!selectedId}
          title={!selectedId ? "Select an object first" : "Move"}
        >
          Move
        </button>

        <button
          onClick={() => toggleTool("rotate")}
          style={{ opacity: toolMode === "rotate" ? 1 : 0.7 }}
          disabled={!selectedId}
          title={!selectedId ? "Select an object first" : "Rotate"}
        >
          Rotate
        </button>

        <button onClick={resetSelected} disabled={!selectedId}>
          Reset
        </button>
      </div>
    </div>
  );
}
