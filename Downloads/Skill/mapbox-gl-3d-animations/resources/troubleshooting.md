# Mapbox GL JS 3D Animations - Troubleshooting Guide

## Common Issues and Solutions

---

## Map Not Loading

### Issue: Blank or white screen

**Possible Causes:**
1. Invalid access token
2. Missing CSS
3. Container element not found

**Solutions:**
```javascript
// 1. Check access token
mapboxgl.accessToken = 'pk.your_valid_token';

// 2. Verify CSS is loaded
// <link href="mapbox-gl.css" rel="stylesheet">

// 3. Ensure container exists and has dimensions
<div id="map" style="width: 100%; height: 400px;"></div>
```

---

## 3D Terrain Not Visible

### Issue: Map appears flat despite terrain settings

**Solutions:**
```javascript
// 1. Ensure terrain source is added BEFORE setTerrain
map.on('load', () => {
    map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512
    });
    
    // Then set terrain
    map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
});

// 2. Increase exaggeration to see effect
map.setTerrain({ source: 'mapbox-dem', exaggeration: 3 });

// 3. Set pitch to see 3D perspective
map.setPitch(60);
```

---

## Globe Projection Issues

### Issue: Globe not rendering properly

**Solutions:**
```javascript
// 1. Check Mapbox GL JS version (needs v2.9.0+)
console.log(mapboxgl.version);

// 2. Set projection correctly
map.setProjection('globe');

// 3. Zoom out to see globe effect
map.setZoom(1.5);
```

---

## Custom Layer (Three.js) Not Rendering

### Issue: 3D models not visible

**Checklist:**
```javascript
// 1. Enable antialias
const map = new mapboxgl.Map({
    container: 'map',
    antialias: true  // Required!
});

// 2. Set renderingMode to '3d'
const customLayer = {
    type: 'custom',
    renderingMode: '3d',  // Required for 3D!
    // ...
};

// 3. Don't clear the canvas
this.renderer.autoClear = false;

// 4. Reset state before rendering
render(gl, matrix) {
    this.renderer.resetState();  // Required!
    this.renderer.render(this.scene, this.camera);
}

// 5. Request continuous repaint
this.map.triggerRepaint();
```

---

## Animation Stuttering

### Issue: Jerky or choppy animations

**Solutions:**

```javascript
// 1. Use requestAnimationFrame (not setInterval)
function animate() {
    // Update logic
    requestAnimationFrame(animate);
}

// 2. Use time-based animation
const startTime = performance.now();
function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = elapsed / duration;
    // ...
}

// 3. Minimize source updates
// BAD: Create new objects each frame
map.getSource('points').setData({
    type: 'FeatureCollection',
    features: createFeatures() // Creates new objects
});

// GOOD: Reuse objects
const geojson = { type: 'FeatureCollection', features: [] };
function animate() {
    updateCoordinates(geojson.features);
    map.getSource('points').setData(geojson);
}
```

---

## High Memory Usage

### Issue: Memory keeps increasing during animation

**Solutions:**
```javascript
// 1. Cancel animations when component unmounts
let animationFrame;

function startAnimation() {
    function animate() {
        // ...
        animationFrame = requestAnimationFrame(animate);
    }
    animate();
}

function cleanup() {
    cancelAnimationFrame(animationFrame);
}

// 2. Remove event listeners
map.off('click', handler);

// 3. Remove unused sources and layers
map.removeLayer('layer-id');
map.removeSource('source-id');
```

---

## Fill Extrusion Not Working

### Issue: Buildings appear flat

**Checklist:**
```javascript
// 1. Check filter matches data
filter: ['==', 'extrude', 'true'],

// 2. Verify height data exists
paint: {
    'fill-extrusion-height': ['get', 'height'],  // Property must exist
    'fill-extrusion-base': ['get', 'min_height']
}

// 3. Set minimum zoom level
minzoom: 15,

// 4. Increase pitch to see extrusions
map.setPitch(60);
```

---

## Line Gradient Not Working

### Issue: `line-gradient` has no effect

**Solution:**
```javascript
// lineMetrics MUST be true for line-gradient
map.addSource('route', {
    type: 'geojson',
    lineMetrics: true,  // Required!
    data: lineGeojson
});

map.addLayer({
    id: 'route',
    type: 'line',
    source: 'route',
    paint: {
        'line-gradient': [
            'interpolate',
            ['linear'],
            ['line-progress'],
            0, 'blue',
            1, 'red'
        ]
    }
});
```

---

## Fog Not Appearing

### Issue: Atmosphere/fog settings not visible

**Solutions:**
```javascript
// 1. Set fog after style loads
map.on('load', () => {
    map.setFog({
        color: '#dc9f9f',
        'horizon-blend': 0.1,
        'star-intensity': 0.5
    });
});

// 2. Zoom out and increase pitch
map.setZoom(2);
map.setPitch(45);

// 3. Check projection (works best with globe)
map.setProjection('globe');
```

---

## Camera Animation Interrupted

### Issue: flyTo/easeTo stops abruptly

**Solutions:**
```javascript
// 1. Set essential: true for user-triggered animations
map.flyTo({
    center: [lng, lat],
    essential: true  // Won't be interrupted
});

// 2. Check for conflicting handlers
map.scrollZoom.disable();  // If needed

// 3. Wait for previous animation
map.once('moveend', () => {
    map.flyTo({ /* next animation */ });
});
```

---

## Poor Performance on Mobile

### Issue: Low FPS on mobile devices

**Optimizations:**
```javascript
// 1. Reduce terrain exaggeration
map.setTerrain({ source: 'dem', exaggeration: 0.5 });

// 2. Lower maxzoom for DEM
map.addSource('dem', {
    type: 'raster-dem',
    maxzoom: 10  // Instead of 14
});

// 3. Disable antialias if not using custom layers
const map = new mapboxgl.Map({
    antialias: false
});

// 4. Use simpler styles
style: 'mapbox://styles/mapbox/streets-v12'  // Instead of standard

// 5. Reduce animation complexity
const fps30Interval = 1000 / 30;
let lastFrame = 0;

function animate(time) {
    if (time - lastFrame >= fps30Interval) {
        // Update logic
        lastFrame = time;
    }
    requestAnimationFrame(animate);
}
```

---

## Debug Tips

### Enable Debug Mode
```javascript
// Show tile boundaries
map.showTileBoundaries = true;

// Show collision boxes
map.showCollisionBoxes = true;

// Log repaint regions
map.repaint = true;

// Get current map state
console.log({
    center: map.getCenter(),
    zoom: map.getZoom(),
    pitch: map.getPitch(),
    bearing: map.getBearing()
});
```

### Check WebGL Support
```javascript
if (!mapboxgl.supported()) {
    alert('Your browser does not support Mapbox GL');
}
```

---

## Resources

- [Mapbox GL JS Docs](https://docs.mapbox.com/mapbox-gl-js/)
- [GitHub Issues](https://github.com/mapbox/mapbox-gl-js/issues)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/mapbox-gl-js)
