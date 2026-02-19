import { useMemo } from "react";
import { useEditorStore } from "../store/editorStore";

function round(n: number) {
  return Math.round(n * 100) / 100;
}

export function ObjectPanel() {
  const selectedId = useEditorStore((s) => s.selectedId);
  const obj = useEditorStore(
    useMemo(
      () => (s) => s.objects.find((o) => o.id === selectedId) ?? null,
      [selectedId],
    ),
  );
  const updateObject = useEditorStore((s) => s.updateObject);

  if (!obj) return null;

  const setPos = (axis: 0 | 1 | 2, value: number) => {
    const p = [...obj.position] as [number, number, number];
    p[axis] = value;
    updateObject(obj.id, { position: p });
  };

  const setRotY = (value: number) => {
    const r = [...obj.rotation] as [number, number, number];
    r[1] = value;
    updateObject(obj.id, { rotation: r });
  };

  const setScale = (value: number) => {
    updateObject(obj.id, { scale: [value, value, value] });
  };

  return (
    <div className="object-panel">
      <div className="object-title">Selected Object</div>

      <div className="row">
        <div className="muted">Type</div>
        <div className="pill">{obj.type}</div>
      </div>

      <div className="row">
        <div className="muted">Color</div>
        <input
          className="color"
          type="color"
          value={obj.color}
          onChange={(e) => updateObject(obj.id, { color: e.target.value })}
        />
      </div>

      <div className="group">
        <div className="label">Position</div>
        <div className="xyz">
          <Num
            label="X"
            value={obj.position[0]}
            onChange={(v) => setPos(0, v)}
          />
          <Num
            label="Y"
            value={obj.position[1]}
            onChange={(v) => setPos(1, v)}
          />
          <Num
            label="Z"
            value={obj.position[2]}
            onChange={(v) => setPos(2, v)}
          />
        </div>
      </div>

      <div className="group">
        <div className="label">Rotation (Y)</div>
        <input
          className="slider"
          type="range"
          min={-Math.PI}
          max={Math.PI}
          step={0.01}
          value={obj.rotation[1]}
          onChange={(e) => setRotY(parseFloat(e.target.value))}
        />
        <div className="tiny">{round(obj.rotation[1])} rad</div>
      </div>

      <div className="group">
        <div className="label">Scale</div>
        <input
          className="slider"
          type="range"
          min={0.25}
          max={3}
          step={0.01}
          value={obj.scale[0]}
          onChange={(e) => setScale(parseFloat(e.target.value))}
        />
        <div className="tiny">{round(obj.scale[0])}x</div>
      </div>
    </div>
  );
}

function Num({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="num">
      <div className="num-label">{label}</div>
      <input
        className="num-input"
        type="number"
        step={0.01}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
}
