import { useMemo } from "react";
import { useStudioStore } from "../store/useStudioStore";
import { ObjectPanel } from "./ObjectPanel";

const WALL_SWATCHES = [
  "#f3f0e9",
  "#e8dfd0",
  "#d8cdb8",
  "#cbbba3",
  "#c2d4f5",
  "#d9c2f5",
  "#c2f5e6",
  "#f5c2d9",
] as const;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function kelvinToCSS(k: number) {
  const t = (clamp(k, 2700, 6500) - 2700) / (6500 - 2700);
  const warm = [255, 183, 107];
  const cool = [190, 220, 255];
  const r = Math.round(warm[0] + (cool[0] - warm[0]) * t);
  const g = Math.round(warm[1] + (cool[1] - warm[1]) * t);
  const b = Math.round(warm[2] + (cool[2] - warm[2]) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

export function SettingsPanel() {
  const mode = useStudioStore((s) => s.mode);
  const wallColor = useStudioStore((s) => s.wallColor);
  const lightIntensity = useStudioStore((s) => s.lightIntensity);
  const lightTemp = useStudioStore((s) => s.lightTemp);

  const setMode = useStudioStore((s) => s.setMode);
  const setWallColor = useStudioStore((s) => s.setWallColor);
  const setLightIntensity = useStudioStore((s) => s.setLightIntensity);
  const setLightTemp = useStudioStore((s) => s.setLightTemp);

  const lightColor = useMemo(() => kelvinToCSS(lightTemp), [lightTemp]);

  return (
    <div className="settings-panel">
      <div className="settings-header">
        <div className="panel-title">Design Settings</div>
        {/* optional close button for later */}
        {/* <button className="icon-btn" aria-label="Close">×</button> */}
      </div>

      {/* Day/Night segmented */}
      <div className="mode-tabs">
        <button
          className={mode === "day" ? "tab active" : "tab"}
          onClick={() => setMode("day")}
          type="button"
        >
          Day Mode
        </button>
        <button
          className={mode === "night" ? "tab active" : "tab"}
          onClick={() => setMode("night")}
          type="button"
        >
          Night Mode
        </button>
      </div>

      {/* Wall swatches */}
      <div className="section">
        <div className="label">Wall Color</div>
        <div className="swatches">
          {WALL_SWATCHES.map((c) => {
            const active = wallColor === c;
            return (
              <button
                key={c}
                className={active ? "swatch active" : "swatch"}
                style={{ background: c }}
                onClick={() => setWallColor(c)}
                aria-label={`Wall color ${c}`}
                type="button"
              />
            );
          })}
        </div>
      </div>

      {/* Light intensity */}
      <div className="section">
        <div className="label">Light Intensity</div>
        <input
          className="slider"
          type="range"
          min={0}
          max={3}
          step={0.05}
          value={lightIntensity}
          onChange={(e) => setLightIntensity(parseFloat(e.target.value))}
        />
      </div>

      {/* Light temperature */}
      <div className="section">
        <div className="label">Light Temperature</div>
        <input
          className="slider"
          type="range"
          min={2700}
          max={6500}
          step={50}
          value={lightTemp}
          onChange={(e) => setLightTemp(parseFloat(e.target.value))}
        />

        <div className="kelvin-row">
          <span className="kelvin-dot" style={{ background: lightColor }} />
          <span className="kelvin-text">{Math.round(lightTemp)}K</span>
        </div>
      </div>

      {/* Selected object section */}
      <ObjectPanel />
    </div>
  );
}
