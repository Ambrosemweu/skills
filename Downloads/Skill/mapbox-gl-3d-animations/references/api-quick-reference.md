# Mapbox GL JS 3D Animations - API Quick Reference

## Map Initialization

```javascript
const map = new mapboxgl.Map({
    container: 'map',           // Container ID
    style: 'mapbox://styles/mapbox/standard', // Style URL
    center: [lng, lat],         // Starting position
    zoom: 12,                   // Starting zoom
    pitch: 60,                  // Camera tilt (0-85)
    bearing: 0,                 // Map rotation (0-360)
    projection: 'globe',        // 'globe' or 'mercator'
    antialias: true,            // For custom WebGL layers
    config: {
        basemap: { lightPreset: 'dusk' }
    }
});
```

---

## Camera Methods

### flyTo(options)
```javascript
map.flyTo({
    center: [lng, lat],
    zoom: 14,
    pitch: 60,
    bearing: 30,
    duration: 5000,
    curve: 1.42,
    speed: 1.2,
    essential: true,
    easing: (t) => t
});
```

### easeTo(options)
```javascript
map.easeTo({
    center: [lng, lat],
    zoom: 14,
    pitch: 45,
    bearing: 0,
    duration: 2000,
    easing: (t) => t * (2 - t)
});
```

### rotateTo(bearing, options)
```javascript
map.rotateTo(180, { duration: 3000 });
```

### jumpTo(options)
```javascript
map.jumpTo({ center: [lng, lat], zoom: 14, pitch: 60 });
```

---

## Free Camera API

```javascript
// Get camera options
const camera = map.getFreeCameraOptions();

// Set position
camera.position = mapboxgl.MercatorCoordinate.fromLngLat(
    [lng, lat], 
    altitude
);

// Point at location
camera.lookAtPoint([lng, lat]);

// Set pitch and bearing
camera.setPitchBearing(pitch, bearing);

// Apply changes
map.setFreeCameraOptions(camera);
```

---

## 3D Terrain

```javascript
// Add terrain source
map.addSource('mapbox-dem', {
    type: 'raster-dem',
    url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
    tileSize: 512,
    maxzoom: 14
});

// Enable terrain
map.setTerrain({
    source: 'mapbox-dem',
    exaggeration: 1.5
});

// Add hillshade
map.addLayer({
    id: 'hillshading',
    source: 'mapbox-dem',
    type: 'hillshade',
    paint: {
        'hillshade-exaggeration': 0.5,
        'hillshade-illumination-direction': 335
    }
});
```

---

## Globe Projection

```javascript
// Enable globe
map.setProjection('globe');

// Check projection
map.getProjection(); // Returns {name: 'globe'}
```

---

## Fog and Atmosphere

```javascript
map.setFog({
    range: [0.8, 8],              // Fog start/end
    color: '#dc9f9f',             // Lower atmosphere
    'high-color': '#245cdf',      // Upper atmosphere
    'space-color': '#000000',     // Background (space)
    'horizon-blend': 0.5,         // Horizon blend (0-1)
    'star-intensity': 0.15        // Star brightness (0-1)
});

// Remove fog
map.setFog(null);
```

---

## Light Presets

```javascript
// Set on initialization
config: { basemap: { lightPreset: 'dusk' } }

// Set at runtime
map.setConfigProperty('basemap', 'lightPreset', 'night');
// Options: 'dawn', 'day', 'dusk', 'night'
```

---

## 3D Buildings (Fill Extrusion)

```javascript
map.addLayer({
    id: '3d-buildings',
    source: 'composite',
    'source-layer': 'building',
    filter: ['==', 'extrude', 'true'],
    type: 'fill-extrusion',
    minzoom: 15,
    paint: {
        'fill-extrusion-color': '#aaa',
        'fill-extrusion-height': ['get', 'height'],
        'fill-extrusion-base': ['get', 'min_height'],
        'fill-extrusion-opacity': 0.85
    }
});
```

---

## Custom Layer (WebGL/Three.js)

```javascript
const customLayer = {
    id: 'custom-layer',
    type: 'custom',
    renderingMode: '3d',
    
    onAdd(map, gl) {
        // Initialize Three.js scene, camera, renderer
        this.camera = new THREE.Camera();
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({
            canvas: map.getCanvas(),
            context: gl,
            antialias: true
        });
        this.renderer.autoClear = false;
    },
    
    render(gl, matrix) {
        // Update camera from Mapbox matrix
        this.camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix);
        
        this.renderer.resetState();
        this.renderer.render(this.scene, this.camera);
        this.map.triggerRepaint();
    }
};

map.addLayer(customLayer);
```

---

## GeoJSON Source Updates

```javascript
// Add source
map.addSource('route', {
    type: 'geojson',
    data: geojsonData,
    lineMetrics: true  // For line-gradient
});

// Update data
map.getSource('route').setData(newGeojsonData);
```

---

## Paint Property Updates

```javascript
// Set paint property
map.setPaintProperty('layer-id', 'fill-opacity', 0.5);

// Get paint property
map.getPaintProperty('layer-id', 'fill-opacity');
```

---

## Animation Pattern

```javascript
function animate(startTime, duration, onUpdate, onComplete) {
    function frame(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        onUpdate(progress);
        
        if (progress < 1) {
            requestAnimationFrame(frame);
        } else if (onComplete) {
            onComplete();
        }
    }
    
    requestAnimationFrame(frame);
}

// Usage
animate(
    performance.now(),
    3000,
    (progress) => { /* update map */ },
    () => { /* done */ }
);
```

---

## Common Easing Functions

```javascript
const easings = {
    linear: t => t,
    easeInQuad: t => t * t,
    easeOutQuad: t => t * (2 - t),
    easeInOutQuad: t => t < 0.5 ? 2*t*t : -1+(4-2*t)*t,
    easeOutCubic: t => 1 - Math.pow(1 - t, 3),
    easeInOutCubic: t => t < 0.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2
};
```

---

## Mercator Coordinate Conversion

```javascript
// LngLat to Mercator
const mercator = mapboxgl.MercatorCoordinate.fromLngLat(
    [lng, lat],
    altitude
);

// Get meter scale at location
const scale = mercator.meterInMercatorCoordinateUnits();
```

---

## Event Listeners

```javascript
map.on('load', () => { /* Map loaded */ });
map.on('moveend', () => { /* Movement complete */ });
map.on('click', 'layer-id', (e) => { /* Layer clicked */ });

map.once('idle', () => { /* Map idle once */ });
map.off('click', handler); // Remove listener
```

---

## Useful Libraries

- **Turf.js** - `npm install @turf/turf`
  - `turf.along(line, distance)` - Point at distance
  - `turf.length(line)` - Line length
  - `turf.bearing(point1, point2)` - Bearing between points
  
- **Three.js** - `npm install three`
- **Threebox** - Three.js + Mapbox integration
