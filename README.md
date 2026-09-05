# Techfest 2026 — Official IIT Bombay Landing Page Concept

A modern, high-contrast, editorial concept website designed for **Techfest 2026, IIT Bombay** (Asia's Largest Science & Technology Festival).

Theme: **"THE FUTURE IS BEING ENGINEERED."**

---

## Technical Highlights & Implementation

- **Zero 3D/WebGL Overheads:** Completely avoids heavy 3D loaders (Three.js, GLTF, Babylon.js) while maintaining visual depth via pure CSS geometry, conic radar sweeps, radial glows, orbital dashes, and procedural noise shaders.
- **Micro-Interaction Architecture:** - Dual-stage custom cursor with physics-based linear interpolation (`lerp`).
  - Proximity-based magnetic button fields.
  - Perspective card tilts based on local mouse coordinates.
  - Hover-triggered chromatic aberration / glitch text distortion on `TECHFEST`.
- **Zero Build Tooling:** Pure HTML5, CSS3, and Vanilla JavaScript. Runs immediately without `npm install`, Node.js, Vite, or bundlers.
- **Accessibility:** Fully supports `prefers-reduced-motion: reduce` by dampening transforms and disabling infinite orbital animations.

---

## Directory Setup
