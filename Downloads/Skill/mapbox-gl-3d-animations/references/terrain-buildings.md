# 3D Terrain & Buildings

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
    map.addSource('dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512
    });
    
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

## 3D Buildings

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
