# Spatial Room Editor (React Three Fiber)

Interactive web-based 3D room editor built with React Three Fiber, TypeScript, and Zustand.  
Supports real-time object placement, selection, transformation, and configurable lighting and materials.

Live Demo: https://skis-spatial.vercel.app/

---

## Features

• Interactive 3D room environment  
• Add, select, and manipulate objects (move, rotate, scale)  
• TransformControls integration with stable object state synchronization  
• Camera orbit system with constrained navigation  
• Physically-based lighting with adjustable intensity and temperature  
• Real-time texture switching (wood floor presets)  
• GLTF model loading pipeline  
• Modular architecture with Zustand global state management  
• Responsive UI with real-time scene updates  

---

## Tech Stack

Frontend  
• React  
• TypeScript  
• React Three Fiber  
• Three.js  
• Zustand  

3D / Graphics  
• GLTF models  
• PBR materials  
• TransformControls  
• OrbitControls  

Tooling  
• Vite  
• ES Modules  

---

## Architecture Overview

The editor separates responsibilities into independent layers:

• Scene Layer  
Handles rendering, camera, lighting, and environment

• Object Layer  
Each object is represented as a stable THREE.Group  
TransformControls attaches dynamically to selected object

• State Layer (Zustand)  
Manages

- scene settings
- lighting
- object transforms
- selection state

• UI Layer  
Settings panel and editor controls update state, which synchronizes with the 3D scene

---

## Key Engineering Challenges Solved

Stable TransformControls integration without object reset  
Synchronizing 3D object transforms with global state  
Dynamic texture loading and switching  
Efficient rendering using memoization  
Separation of scene logic and editor state  

---

## Running Locally
- npm install
- npm run dev

---

## Future Improvements

Object snapping  
Grid system  
Collision detection  
Save / load scenes  
Undo / redo system  
