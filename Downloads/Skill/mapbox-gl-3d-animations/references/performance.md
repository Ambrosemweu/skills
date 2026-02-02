# Performance Optimization

Best practices for smooth 3D animations.

## General Tips

1. **Use `requestAnimationFrame`** for all animations
2. **Batch updates** - minimize calls to `setData()` and `setPaintProperty()`
3. **Simplify geometry** - reduce coordinate precision and point count
4. **Use appropriate zoom levels** - don't load more detail than needed
5. **Enable `antialias: true`** only for custom WebGL layers

## Efficient Source Updates

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

## Debouncing Animations

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

## Using Web Workers for Heavy Calculations

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
