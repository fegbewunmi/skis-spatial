import { Viewport } from "./viewport/Viewport";
import { SettingsPanel } from "./ui/SettingsPanel";
import { useEditorStore } from "./store/editorStore";

export function Studio() {
  const addObject = useEditorStore((s) => s.addObject);
  const toolMode = useEditorStore((s) => s.toolMode);
  const setToolMode = useEditorStore((s) => s.setToolMode);
  const resetSelected = useEditorStore((s) => s.resetSelected);

  return (
    <div className="studio-root">
      <Viewport />

      <SettingsPanel />

      <div className="toolbar">
        <button onClick={addObject}>+ Add Object</button>

        <button
          onClick={() => setToolMode("move")}
          style={{ opacity: toolMode === "move" ? 1 : 0.7 }}
        >
          Move
        </button>

        <button
          onClick={() => setToolMode("rotate")}
          style={{ opacity: toolMode === "rotate" ? 1 : 0.7 }}
        >
          Rotate
        </button>

        <button onClick={resetSelected}>Reset</button>
      </div>
    </div>
  );
}
