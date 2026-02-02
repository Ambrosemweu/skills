# Globe Projection & Atmosphere

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
