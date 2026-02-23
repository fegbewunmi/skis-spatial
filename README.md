# Skis Spatial — 3D Room Editor

Live Demo: https://skis-spatial.vercel.app

An interactive browser-based 3D spatial editor built with React Three Fiber.  
Users can configure room environment settings and manipulate objects in real time.

## Features

- Interactive 3D camera controls
- Object placement and manipulation
- Move and rotate objects with transform controls
- Real-time lighting adjustment
- Floor material presets (wood textures)
- Dynamic wall color configuration
- State management using Zustand
- Production deployment with Vercel

## Tech Stack

- React
- TypeScript
- React Three Fiber
- Three.js
- Zustand
- Vite
- Vercel

## Architecture

State management is handled using Zustand stores:

- StudioStore — environment settings
- EditorStore — object state and manipulation

3D rendering is managed via React Three Fiber, with TransformControls and OrbitControls enabling direct interaction.

## Run locally

```bash
npm install
npm run dev
```

## Deployment

Deployed on Vercel for live interaction.

---

This project demonstrates real-time spatial interaction, state-driven rendering, and modern frontend architecture.