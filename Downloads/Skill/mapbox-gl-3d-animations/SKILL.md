---
name: mapbox-gl-3d-animations
description: Comprehensive skill for creating 3D map animations with Mapbox GL JS including camera movements, terrain, globe projection, custom layers, and visual effects. Use when building interactive maps with flyTo/easeTo transitions, 3D terrain/buildings, globe projections, WebGL custom layers, path animations, atmospheric effects, or Mapbox storytelling projects.
---

# Mapbox GL JS 3D Animations Skill

A comprehensive guide to creating stunning 3D map animations using Mapbox GL JS.

## Table of Contents

1. [Setup](#setup)
2. [Camera Animations](references/camera-animations.md) — flyTo, easeTo, rotateTo, easing functions
3. [Free Camera API](references/free-camera.md) — Low-level camera control, orbit animations
4. [3D Terrain & Buildings](references/terrain-buildings.md) — Elevation, hillshade, extrusion
5. [Globe Projection & Atmosphere](references/globe-atmosphere.md) — Globe, fog, lighting presets
6. [Custom WebGL Layers](references/webgl-layers.md) — Three.js integration, 3D models
7. [Path Animations](references/path-animations.md) — Line drawing, moving points, data-driven styling
8. [Performance](references/performance.md) — Optimization techniques
9. [API Quick Reference](references/api-quick-reference.md)
10. [Troubleshooting](references/troubleshooting.md)

---

## Setup

### Installation

Via npm:
```bash
npm install mapbox-gl
```

Via CDN:
```html
<script src='https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.js'></script>
<link href='https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.css' rel='stylesheet' />
```

### Basic Map Setup

```javascript
mapboxgl.accessToken = 'YOUR_ACCESS_TOKEN';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/standard',
    center: [-122.4194, 37.7749],
    zoom: 15,
    pitch: 60,
    bearing: -17,
    antialias: true
});
```

### Map Configuration Options

| Option | Type | Description |
|--------|------|-------------|
| `container` | string | ID of DOM element |
| `style` | string | Mapbox style URL |
| `center` | [lng, lat] | Initial center |
| `zoom` | number | Initial zoom (0-22) |
| `pitch` | number | Initial pitch (0-85 degrees) |
| `bearing` | number | Initial bearing (0-360 degrees) |
| `projection` | string | 'mercator', 'globe', etc. |
| `antialias` | boolean | Enable antialiasing |

---

## Quick Reference

### Camera Methods

| Method | Description | Use Case |
|--------|-------------|----------|
| `flyTo()` | Smooth flight animation | Long-distance transitions |
| `easeTo()` | Linear animation | UI-driven transitions |
| `rotateTo()` | Bearing animation | Map rotation |
| `jumpTo()` | Instant change | Immediate repositioning |

### Common Animation Pattern

```javascript
map.flyTo({
    center: [-74.5, 40],
    zoom: 14,
    pitch: 60,
    bearing: 30,
    duration: 5000,
    essential: true
});
```

### Camera Events

```javascript
map.on('movestart', () => console.log('Movement started'));
map.on('move', () => console.log('Moving'));
map.on('moveend', () => console.log('Movement ended'));
map.on('zoomstart', () => console.log('Zoom started'));
map.on('pitch', () => console.log('Pitch changed'));
map.on('rotate', () => console.log('Bearing changed'));
```

### 3D Terrain Quick Setup

```javascript
map.on('load', () => {
    map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14
    });
    
    map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
});
```

### Globe Projection Quick Setup

```javascript
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/standard',
    center: [0, 20],
    zoom: 1.5,
    projection: 'globe'
});

map.on('load', () => {
    map.setFog({
        color: 'rgb(186, 210, 235)',
        'high-color': 'rgb(36, 92, 223)',
        'horizon-blend': 0.02,
        'space-color': 'rgb(11, 11, 25)',
        'star-intensity': 0.6
    });
});
```

---

## Resources

### Official Documentation
- [Mapbox GL JS API](https://docs.mapbox.com/mapbox-gl-js/api/)
- [Style Specification](https://docs.mapbox.com/style-spec/)
- [Examples Gallery](https://docs.mapbox.com/mapbox-gl-js/examples/)

### Useful Libraries
- [Turf.js](https://turfjs.org/) - Geospatial analysis
- [Three.js](https://threejs.org/) - 3D graphics
- [Threebox](https://github.com/jscastro76/threebox) - Three.js + Mapbox integration
- [deck.gl](https://deck.gl/) - Large-scale data visualization

### Interactive Examples

Located in the `assets/` folder:
- [Camera Animation Demo](assets/camera-animation-demo.html)
- [3D Terrain Demo](assets/3d-terrain-demo.html)
- [Globe Projection Demo](assets/globe-projection-demo.html)
- [Path Animation Demo](assets/path-animation-demo.html)
