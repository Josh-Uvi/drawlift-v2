# DrawLift - AI Architecture CAD & 3D Floor Plan Converter

DrawLift is an architectural floor plan conversion application rewritten as a high-performance React application powered by Vite, Tailwind CSS, Three.js, and React Three Fiber.

## Features

- **Architectural PDF Upload**: Drag & drop or browse architectural floor plan PDFs, or test instantly with one-click architectural sample blueprints.
- **Conversion Options**:
  - Mode: 2D CAD vs 3D Extruded BIM models
  - DPI configuration (150, 300, 600 DPI)
  - Floor Height (m), Slab Thickness (m), and optional Ceiling Slab
  - Output Formats: DXF, DWG, or both
  - Segmentation: Classic CV contour analysis or ML / ONNX Runtime
- **Live Progress Tracking**: Real-time progress bar with step-by-step pipeline stages (PDF parsing, raster filtering, semantic segmentation, CAD vectorization, 3D extrusion).
- **Blueprint Page Viewer**: Multi-page architectural sheet preview with full-screen lightbox modal.
- **Interactive 3D BIM Viewer**: Real-time Three.js viewport with OrbitControls, Solid Shading vs Wireframe toggles, and multi-directional lighting.
- **Direct CAD & 3D Model Downloads**:
  - AutoCAD-compatible ASCII DXF format
  - DWG CAD exchange files
  - Binary glTF/GLB 3D models ready for AutoCAD, Revit, Blender, or Rhino
- **Conversion History**: Filter jobs by status (`completed`, `processing`, `failed`, `queued`, `all`), sort by date, inspect past jobs, or delete records.

## Development

```bash
# Install dependencies
npm install

# Start Vite dev server on port 3000
npm run dev

# Build for production
npm run build
```
