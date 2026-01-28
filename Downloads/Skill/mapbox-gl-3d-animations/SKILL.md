---
name: Mapbox GL JS 3D Animations
description: Comprehensive skill for creating 3D map animations with Mapbox GL JS including camera movements, terrain, globe projection, custom layers, and visual effects
---

# Mapbox GL JS 3D Animations Skill

This skill provides comprehensive guidance for creating stunning 3D map animations using Mapbox GL JS. It covers everything from basic camera animations to advanced custom WebGL layers with Three.js integration.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Camera Animations](#camera-animations)
3. [Free Camera API](#free-camera-api)
4. [3D Terrain](#3d-terrain)
5. [Globe Projection](#globe-projection)
6. [3D Buildings](#3d-buildings)
7. [Custom WebGL Layers](#custom-webgl-layers)
8. [Path Animations](#path-animations)
9. [Atmosphere and Fog](#atmosphere-and-fog)
10. [Data-Driven Styling](#data-driven-styling)
11. [Performance Optimization](#performance-optimization)

---

## Getting Started

### Installation

```html
<!-- Include Mapbox GL JS -->
<script src="https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.js"></script>
<link href="https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.css" rel="stylesheet" />
```

```javascript
// Or via npm
npm install mapbox-gl
```

### Basic Map Setup

```javascript
mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/standard',
    center: [-122.4194, 37.7749], // [lng, lat]
    zoom: 12,
    pitch: 60,      // Tilt the map (0-85 degrees)
    bearing: -17.6, // Rotate the map (0-360 degrees)
    projection: 'globe', // Enable globe projection
    config: {
        basemap: {
            lightPreset: 'dusk' // 'dawn', 'day', 'dusk', 'night'
        }
    }
});
```

### Key Map Options for 3D

| Option | Description | Default |
|--------|-------------|---------|
| `pitch` | Camera tilt angle (0-85°) | 0 |
| `bearing` | Map rotation angle (0-360°) | 0 |
| `projection` | Map projection ('mercator', 'globe') | 'mercator' |
| `antialias` | Enable antialiasing for custom layers | false |

---

## Camera Animations

Mapbox GL JS provides several methods for animating the camera. Each serves different use cases.

### flyTo() - Smooth Flight Animation

Best for long-distance transitions with a cinematic feel.

```javascript
map.flyTo({
    center: [-74.5, 40],
    zoom: 14,
    pitch: 60,
    bearing: 30,
    duration: 5000,  // Animation duration in ms
    curve: 1.42,     // Zoom curve (higher = more dramatic)
    speed: 1.2,      // Animation speed multiplier
    essential: true, // Respects prefers-reduced-motion
    easing: (t) => t // Custom easing function
});
```

#### flyTo Options Reference

| Option | Type | Description |
|--------|------|-------------|
| `center` | LngLatLike | Target coordinates |
| `zoom` | number | Target zoom level |
| `pitch` | number | Target pitch (0-85) |
| `bearing` | number | Target bearing |
| `duration` | number | Animation duration (ms) |
| `curve` | number | Zoom curve (default: 1.42) |
| `speed` | number | Speed multiplier |
| `screenSpeed` | number | Avg speed in px/sec |
| `maxDuration` | number | Max animation time |
| `padding` | PaddingOptions | Map padding |
| `easing` | function | Custom easing (t→number) |

### easeTo() - Direct Linear Animation

Best for shorter, UI-driven transitions.

```javascript
map.easeTo({
    center: [-74.5, 40],
    zoom: 14,
    pitch: 45,
    bearing: 0,
    duration: 2000,
    easing: (t) => t * (2 - t) // ease-out quadratic
});
```

### rotateTo() - Bearing Animation

Animate only the bearing (rotation) of the map.

```javascript
map.rotateTo(180, {
    duration: 3000,
    easing: (t) => t
});
```

### jumpTo() - Instant Camera Change

Instantly move camera without animation.

```javascript
map.jumpTo({
    center: [-74.5, 40],
    zoom: 14,
    pitch: 60,
    bearing: 30
});
```

### Continuous Rotation Animation

```javascript
function rotateCamera(timestamp) {
    // Rotate the map slowly
    map.rotateTo((timestamp / 100) % 360, { duration: 0 });
    requestAnimationFrame(rotateCamera);
}

map.on('load', () => {
    rotateCamera(0);
});
```

### Easing Functions

```javascript
// Common easing functions
const easings = {
    // Linear
    linear: (t) => t,
    
    // Ease in (slow start)
    easeInQuad: (t) => t * t,
    easeInCubic: (t) => t * t * t,
    easeInQuart: (t) => t * t * t * t,
    
    // Ease out (slow end)
    easeOutQuad: (t) => t * (2 - t),
    easeOutCubic: (t) => (--t) * t * t + 1,
    easeOutQuart: (t) => 1 - (--t) * t * t * t,
    
    // Ease in-out (slow start and end)
    easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    
    // Bounce effect
    bounce: (t) => {
        const n1 = 7.5625, d1 = 2.75;
        if (t < 1 / d1) return n1 * t * t;
        if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
        if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
        return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
};

// Usage with flyTo
map.flyTo({
    center: [-74.5, 40],
    zoom: 14,
    easing: easings.easeOutCubic
});
```

---

## Free Camera API

The Free Camera API provides low-level control for advanced camera animations.

### Accessing the Free Camera

```javascript
const camera = map.getFreeCameraOptions();

// Set camera position (altitude in meters)
camera.position = mapboxgl.MercatorCoordinate.fromLngLat(
    [-122.4194, 37.7749],
    1500 // altitude in meters
);

// Point camera at a location
camera.lookAtPoint([-122.4194, 37.7749]);

// Apply the camera
map.setFreeCameraOptions(camera);
```

### Orbit Animation Around a Point

```javascript
function orbitCamera(centerLngLat, radius, altitude, duration) {
    const startTime = performance.now();
    
    function animate() {
        const elapsed = performance.now() - startTime;
        const progress = (elapsed % duration) / duration;
        const angle = progress * Math.PI * 2;
        
        // Calculate camera position on orbit
        const lng = centerLngLat[0] + radius * Math.cos(angle);
        const lat = centerLngLat[1] + radius * Math.sin(angle);
        
        const camera = map.getFreeCameraOptions();
        camera.position = mapboxgl.MercatorCoordinate.fromLngLat(
            [lng, lat],
            altitude
        );
        camera.lookAtPoint(centerLngLat);
        
        map.setFreeCameraOptions(camera);
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Orbit around San Francisco
orbitCamera([-122.4194, 37.7749], 0.01, 2000, 30000);
```

### Path-Following Camera Animation

```javascript
async function animateAlongPath(path, duration) {
    const startTime = performance.now();
    const totalDistance = turf.length(turf.lineString(path), { units: 'kilometers' });
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Get current position along path
        const distance = progress * totalDistance;
        const point = turf.along(turf.lineString(path), distance, { units: 'kilometers' });
        const currentPos = point.geometry.coordinates;
        
        // Get next point for bearing calculation
        const nextDistance = Math.min(distance + 0.1, totalDistance);
        const nextPoint = turf.along(turf.lineString(path), nextDistance, { units: 'kilometers' });
        const bearing = turf.bearing(point, nextPoint);
        
        // Update camera
        const camera = map.getFreeCameraOptions();
        camera.position = mapboxgl.MercatorCoordinate.fromLngLat(
            currentPos,
            500 // altitude
        );
        camera.setPitchBearing(75, bearing);
        
        map.setFreeCameraOptions(camera);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}
```

---

## 3D Terrain

Enable realistic 3D terrain with elevation data.

### Basic Terrain Setup

```javascript
map.on('load', () => {
    // Add terrain source
    map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14
    });
    
    // Enable 3D terrain
    map.setTerrain({
        source: 'mapbox-dem',
        exaggeration: 1.5 // Vertical exaggeration factor
    });
});
```

### Adding Hillshade

```javascript
map.on('load', () => {
    // Add DEM source
    map.addSource('dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512
    });
    
    // Add hillshade layer
    map.addLayer({
        id: 'hillshading',
        source: 'dem',
        type: 'hillshade',
        paint: {
            'hillshade-shadow-color': '#473B24',
            'hillshade-highlight-color': '#FFFFFF',
            'hillshade-accent-color': '#2D5016',
            'hillshade-exaggeration': 0.5,
            'hillshade-illumination-direction': 335
        }
    }, 'waterway-shadow');
});
```

### Animated Terrain Exaggeration

```javascript
function animateTerrainExaggeration(from, to, duration) {
    const startTime = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease the exaggeration value
        const eased = progress * (2 - progress); // ease-out
        const exaggeration = from + (to - from) * eased;
        
        map.setTerrain({
            source: 'mapbox-dem',
            exaggeration: exaggeration
        });
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

// Animate from flat to exaggerated terrain
animateTerrainExaggeration(0, 2, 3000);
```

---

## Globe Projection

Transform your map into a 3D globe view.

### Enable Globe Projection

```javascript
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/standard',
    center: [0, 20],
    zoom: 1.5,
    projection: 'globe'
});

// Or dynamically
map.setProjection('globe');
```

### Globe with Atmosphere

```javascript
map.on('load', () => {
    map.setFog({
        color: 'rgb(186, 210, 235)',      // Lower atmosphere color
        'high-color': 'rgb(36, 92, 223)', // Upper atmosphere color
        'horizon-blend': 0.02,             // Atmosphere blending
        'space-color': 'rgb(11, 11, 25)',  // Space background
        'star-intensity': 0.6              // Star brightness
    });
});
```

### Globe Spin Animation

```javascript
function spinGlobe() {
    const secondsPerRevolution = 120;
    const maxSpinZoom = 5;
    const slowSpinZoom = 3;
    
    let userInteracting = false;
    let spinEnabled = true;
    
    map.on('mousedown', () => { userInteracting = true; });
    map.on('mouseup', () => { userInteracting = false; });
    map.on('dragend', () => { userInteracting = false; });
    map.on('touchend', () => { userInteracting = false; });
    
    function spin() {
        const zoom = map.getZoom();
        
        if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
            let distancePerSecond = 360 / secondsPerRevolution;
            
            if (zoom > slowSpinZoom) {
                const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
                distancePerSecond *= zoomDif;
            }
            
            const center = map.getCenter();
            center.lng -= distancePerSecond / 60; // 60fps
            map.easeTo({ center, duration: 1000, easing: (t) => t });
        }
        
        requestAnimationFrame(spin);
    }
    
    spin();
}
```

---

## 3D Buildings

Add extruded 3D buildings to your map.

### Using Mapbox Standard Style

The Mapbox Standard style includes 3D buildings by default.

```javascript
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/standard',
    center: [-74.0066, 40.7135],
    zoom: 15.5,
    pitch: 45
});
```

### Custom 3D Building Layer

```javascript
map.on('load', () => {
    // Add 3D building layer
    map.addLayer({
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 15,
        paint: {
            'fill-extrusion-color': [
                'interpolate',
                ['linear'],
                ['get', 'height'],
                0, '#aaa',
                50, '#6a89cc',
                100, '#4a69bd',
                200, '#1e3799'
            ],
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': ['get', 'min_height'],
            'fill-extrusion-opacity': 0.85
        }
    });
});
```

### Animated Building Rise Effect

```javascript
function animateBuildingRise(duration) {
    const startTime = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        
        map.setPaintProperty(
            '3d-buildings',
            'fill-extrusion-height',
            ['*', ['get', 'height'], eased]
        );
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

map.on('load', () => {
    animateBuildingRise(2000);
});
```

---

## Custom WebGL Layers

Integrate Three.js for advanced 3D rendering.

### Basic Custom Layer Structure

```javascript
const customLayer = {
    id: 'custom-threejs-layer',
    type: 'custom',
    renderingMode: '3d',
    
    onAdd: function(map, gl) {
        this.camera = new THREE.Camera();
        this.scene = new THREE.Scene();
        
        // Add lights
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, -70, 100).normalize();
        this.scene.add(directionalLight);
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);
        
        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: map.getCanvas(),
            context: gl,
            antialias: true
        });
        this.renderer.autoClear = false;
        
        this.map = map;
    },
    
    render: function(gl, matrix) {
        // Sync camera with Mapbox
        const m = new THREE.Matrix4().fromArray(matrix);
        this.camera.projectionMatrix = m;
        
        this.renderer.resetState();
        this.renderer.render(this.scene, this.camera);
        this.map.triggerRepaint();
    }
};

map.on('load', () => {
    map.addLayer(customLayer);
});
```

### Adding a 3D Model (GLTF)

```javascript
const modelOrigin = [-122.4194, 37.7749];
const modelAltitude = 0;

// Transform to Mercator coordinates
const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
    modelOrigin,
    modelAltitude
);

const modelTransform = {
    translateX: modelAsMercatorCoordinate.x,
    translateY: modelAsMercatorCoordinate.y,
    translateZ: modelAsMercatorCoordinate.z,
    rotateX: Math.PI / 2,
    rotateY: 0,
    rotateZ: 0,
    scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
};

const customLayer = {
    id: '3d-model',
    type: 'custom',
    renderingMode: '3d',
    
    onAdd: function(map, gl) {
        this.camera = new THREE.Camera();
        this.scene = new THREE.Scene();
        
        // Lighting
        const directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(0, -70, 100);
        this.scene.add(directionalLight);
        
        // Load model
        const loader = new THREE.GLTFLoader();
        loader.load('path/to/model.gltf', (gltf) => {
            this.scene.add(gltf.scene);
        });
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: map.getCanvas(),
            context: gl,
            antialias: true
        });
        this.renderer.autoClear = false;
        
        this.map = map;
    },
    
    render: function(gl, matrix) {
        // Apply model transform
        const rotationX = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(1, 0, 0), modelTransform.rotateX
        );
        const rotationY = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(0, 1, 0), modelTransform.rotateY
        );
        const rotationZ = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(0, 0, 1), modelTransform.rotateZ
        );
        
        const m = new THREE.Matrix4().fromArray(matrix);
        const l = new THREE.Matrix4()
            .makeTranslation(
                modelTransform.translateX,
                modelTransform.translateY,
                modelTransform.translateZ
            )
            .scale(new THREE.Vector3(
                modelTransform.scale,
                -modelTransform.scale,
                modelTransform.scale
            ))
            .multiply(rotationX)
            .multiply(rotationY)
            .multiply(rotationZ);
        
        this.camera.projectionMatrix = m.multiply(l);
        
        this.renderer.resetState();
        this.renderer.render(this.scene, this.camera);
        this.map.triggerRepaint();
    }
};
```

---

## Path Animations

Animate lines and points along paths.

### Animated Line Drawing

```javascript
map.on('load', () => {
    // Full route coordinates
    const route = {
        type: 'Feature',
        geometry: {
            type: 'LineString',
            coordinates: [
                [-122.4194, 37.7749],
                [-122.4180, 37.7760],
                [-122.4160, 37.7780],
                [-122.4140, 37.7790]
            ]
        }
    };
    
    // Add empty line source
    map.addSource('route', {
        type: 'geojson',
        data: {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: []
            }
        }
    });
    
    map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        paint: {
            'line-color': '#3887be',
            'line-width': 5,
            'line-opacity': 0.75
        }
    });
    
    // Animate
    let counter = 0;
    const coordinates = route.geometry.coordinates;
    
    function animateLine() {
        if (counter < coordinates.length) {
            map.getSource('route').setData({
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: coordinates.slice(0, counter + 1)
                }
            });
            counter++;
            requestAnimationFrame(animateLine);
        }
    }
    
    animateLine();
});
```

### Point Moving Along Path

```javascript
map.on('load', () => {
    const route = turf.lineString([
        [-122.4194, 37.7749],
        [-122.4180, 37.7760],
        [-122.4160, 37.7780],
        [-122.4140, 37.7790]
    ]);
    
    // Add point source
    map.addSource('point', {
        type: 'geojson',
        data: {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: route.geometry.coordinates[0]
            }
        }
    });
    
    map.addLayer({
        id: 'point',
        type: 'circle',
        source: 'point',
        paint: {
            'circle-radius': 10,
            'circle-color': '#3887be'
        }
    });
    
    // Animate along path
    const lineLength = turf.length(route, { units: 'kilometers' });
    const duration = 5000;
    const startTime = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const distance = progress * lineLength;
        const point = turf.along(route, distance, { units: 'kilometers' });
        
        map.getSource('point').setData(point);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
});
```

### Line Gradient Animation

```javascript
map.on('load', () => {
    map.addSource('line', {
        type: 'geojson',
        lineMetrics: true, // Required for line-gradient
        data: {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: [/* your coordinates */]
            }
        }
    });
    
    map.addLayer({
        id: 'line-animation',
        type: 'line',
        source: 'line',
        paint: {
            'line-color': 'red',
            'line-width': 5,
            'line-gradient': [
                'interpolate',
                ['linear'],
                ['line-progress'],
                0, 'blue',
                0.5, 'lime',
                1, 'red'
            ]
        }
    });
    
    // Animate the gradient
    let phase = 0;
    
    function animateGradient() {
        phase = (phase + 0.005) % 1;
        
        map.setPaintProperty('line-animation', 'line-gradient', [
            'interpolate',
            ['linear'],
            ['line-progress'],
            0, `hsl(${phase * 360}, 100%, 50%)`,
            0.5, `hsl(${(phase + 0.33) * 360}, 100%, 50%)`,
            1, `hsl(${(phase + 0.66) * 360}, 100%, 50%)`
        ]);
        
        requestAnimationFrame(animateGradient);
    }
    
    animateGradient();
});
```

---

## Atmosphere and Fog

Create atmospheric effects for immersive experiences.

### Setting Up Fog

```javascript
map.on('load', () => {
    map.setFog({
        range: [0.8, 8],
        color: '#dc9f9f',
        'horizon-blend': 0.5,
        'high-color': '#245cdf',
        'space-color': '#000000',
        'star-intensity': 0.15
    });
});
```

### Fog Properties Reference

| Property | Type | Description |
|----------|------|-------------|
| `range` | [number, number] | Start/end of fog effect in viewport units |
| `color` | color | Fog color near camera |
| `high-color` | color | Fog color at high altitudes |
| `space-color` | color | Background color (space) |
| `horizon-blend` | number | Horizon blending (0-1) |
| `star-intensity` | number | Star brightness (0-1) |

### Animated Day/Night Cycle

```javascript
function animateDayNightCycle(duration) {
    const startTime = performance.now();
    
    const dayFog = {
        range: [0.5, 10],
        color: 'white',
        'high-color': '#245cdf',
        'space-color': '#1d2a4d',
        'horizon-blend': 0.05,
        'star-intensity': 0
    };
    
    const nightFog = {
        range: [0.5, 10],
        color: '#242B4B',
        'high-color': '#161B36',
        'space-color': '#0B0D1C',
        'horizon-blend': 0.1,
        'star-intensity': 0.8
    };
    
    function interpolateColor(color1, color2, t) {
        // Simple hex color interpolation
        const c1 = parseInt(color1.slice(1), 16);
        const c2 = parseInt(color2.slice(1), 16);
        
        const r = Math.round(((c1 >> 16) & 255) * (1 - t) + ((c2 >> 16) & 255) * t);
        const g = Math.round(((c1 >> 8) & 255) * (1 - t) + ((c2 >> 8) & 255) * t);
        const b = Math.round((c1 & 255) * (1 - t) + (c2 & 255) * t);
        
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    }
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const t = (Math.sin(elapsed / duration * Math.PI * 2) + 1) / 2;
        
        map.setFog({
            range: [0.5, 10],
            color: t > 0.5 ? nightFog.color : dayFog.color,
            'high-color': t > 0.5 ? nightFog['high-color'] : dayFog['high-color'],
            'space-color': t > 0.5 ? nightFog['space-color'] : dayFog['space-color'],
            'horizon-blend': dayFog['horizon-blend'] + (nightFog['horizon-blend'] - dayFog['horizon-blend']) * t,
            'star-intensity': t * nightFog['star-intensity']
        });
        
        requestAnimationFrame(animate);
    }
    
    requestAnimationFrame(animate);
}
```

### Light Presets

```javascript
// Set light preset on initialization
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/standard',
    config: {
        basemap: {
            lightPreset: 'night' // 'dawn', 'day', 'dusk', 'night'
        }
    }
});

// Or change at runtime
map.setConfigProperty('basemap', 'lightPreset', 'dusk');
```

---

## Data-Driven Styling

Use expressions for dynamic, data-based visualizations.

### Interpolate Expression

```javascript
// Color by value
{
    'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'value'],
        0, '#2DC4B2',
        25, '#3BB3C3',
        50, '#669EC4',
        75, '#8B88B6',
        100, '#A2719B'
    ]
}

// Size by zoom
{
    'circle-radius': [
        'interpolate',
        ['exponential', 1.5],
        ['zoom'],
        10, 2,
        15, 10,
        22, 180
    ]
}
```

### Step Expression

```javascript
{
    'circle-color': [
        'step',
        ['get', 'count'],
        '#51bbd6',  // Default
        100, '#f1f075',
        750, '#f28cb1'
    ]
}
```

### Match Expression

```javascript
{
    'fill-color': [
        'match',
        ['get', 'category'],
        'residential', '#e55e5e',
        'commercial', '#3bb2d0',
        'industrial', '#fbb03b',
        '#ccc' // Default
    ]
}
```

### Animated Data-Driven Properties

```javascript
function animateCircles() {
    let phase = 0;
    
    function animate() {
        phase = (phase + 0.01) % 1;
        
        map.setPaintProperty('circles', 'circle-radius', [
            '+',
            5,
            ['*', 
                ['sin', ['*', phase, Math.PI * 2]], 
                3
            ]
        ]);
        
        requestAnimationFrame(animate);
    }
    
    animate();
}
```

---

## Performance Optimization

Best practices for smooth 3D animations.

### General Tips

1. **Use `requestAnimationFrame`** for all animations
2. **Batch updates** - minimize calls to `setData()` and `setPaintProperty()`
3. **Simplify geometry** - reduce coordinate precision and point count
4. **Use appropriate zoom levels** - don't load more detail than needed
5. **Enable `antialias: true`** only for custom WebGL layers

### Efficient Source Updates

```javascript
// BAD: Creating new objects every frame
function badAnimate() {
    map.getSource('points').setData({
        type: 'FeatureCollection',
        features: points.map(p => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: p }
        }))
    });
}

// GOOD: Reuse objects
const geojson = {
    type: 'FeatureCollection',
    features: []
};

function goodAnimate() {
    // Modify existing objects
    geojson.features.forEach((f, i) => {
        f.geometry.coordinates = newPositions[i];
    });
    map.getSource('points').setData(geojson);
}
```

### Debouncing Animations

```javascript
let animationFrame;

function animate() {
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }
    
    animationFrame = requestAnimationFrame(() => {
        // Animation logic
        animate();
    });
}
```

### Using Web Workers for Heavy Calculations

```javascript
// worker.js
self.onmessage = function(e) {
    const result = heavyCalculation(e.data);
    self.postMessage(result);
};

// main.js
const worker = new Worker('worker.js');

worker.onmessage = function(e) {
    map.getSource('data').setData(e.data);
};

function updateData(input) {
    worker.postMessage(input);
}
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

### Example Repositories
- [mapbox/mapbox-gl-js](https://github.com/mapbox/mapbox-gl-js)
- [mapbox/storytelling](https://github.com/mapbox/storytelling)
