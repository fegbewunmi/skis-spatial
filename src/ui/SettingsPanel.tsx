import { useMemo } from "react";
import { useStudioStore } from "../store/useStudioStore";
import { ObjectPanel } from "./ObjectPanel";

const WALL_SWATCHES = [
  "#f5f1e8", // warm white
  "#e7dccb", // soft beige
  "#cfc6b4", // greige
  "#b8b1a1", // taupe
  "#c6d2c3", // sage green
  "#bcc9d6", // dusty blue
  "#d6c2cc", // muted blush
  "#c9b49c", // warm clay
];

const FLOOR_SWATCHES = [
  "#d9cbb6", // light oak
  "#c8b79f", // natural oak
  "#b49a7a", // warm honey
  "#9c856c", // walnut light

  "#7c6a58", // walnut dark
  "#6b5a4b", // espresso
  "#bfc2c7", // light concrete
  "#9ea3a8", // darker concrete
];

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

  const floorPreset = useStudioStore((s) => s.floorPreset);
  const setFloorPreset = useStudioStore((s) => s.setFloorPreset);

  return (
    <div className="settings-panel">
      <div className="settings-header">
        <div className="panel-title">Design Settings</div>
        {/* close button for later */}
        {/* <button className="icon-btn" aria-label="Close">×</button> */}
      </div>
      {/* Day/Night */}
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
      <div className="section">
        <div className="label">Floor</div>

        <div className="mode-tabs">
          <button
            className={floorPreset === "brown" ? "tab active" : "tab"}
            onClick={() => setFloorPreset("brown")}
            type="button"
          >
            Brown Wood
          </button>

          <button
            className={floorPreset === "grey" ? "tab active" : "tab"}
            onClick={() => setFloorPreset("grey")}
            type="button"
          >
            Grey Wood
          </button>
        </div>
      </div>
      {/* ;Floor Color
      <div className="section">
        <div className="label">Floor Color</div>
        <div className="swatches">
          {FLOOR_SWATCHES.map((c) => (
            <button
              key={c}
              className={floorColor === c ? "swatch active" : "swatch"}
              style={{ background: c }}
              onClick={() => setFloorColor(c)}
              aria-label={`Floor color ${c}`}
              type="button"
            />
          ))}
        </div>
      </div> */}
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
