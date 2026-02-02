# Performance Optimization

Best practices for smooth 3D map animations.

## Frame Rate Targets

| Device Type | Target FPS | Max Frame Time |
|-------------|------------|----------------|
| Desktop | 60 fps | 16.67 ms |
| Mobile | 30-60 fps | 16.67-33.33 ms |
| Low-end | 30 fps | 33.33 ms |

## Optimization Techniques

### 1. Use requestAnimationFrame
```javascript
// ✓ Good - syncs with display refresh
function animate() {
    updateAnimation();
    requestAnimationFrame(animate);
}

// ✗ Bad - inconsistent timing
setInterval(updateAnimation, 16);
```

### 2. Batch Updates
```javascript
// ✗ Bad - multiple redraws
points.forEach(p => updatePoint(p));

// ✓ Good - single redraw
const geojson = createFeatureCollection(points);
source.setData(geojson);
```

### 3. Throttle Heavy Operations
```javascript
function throttle(fn, wait) {
    let lastCall = 0;
    return (...args) => {
        const now = Date.now();
        if (now - lastCall >= wait) {
            lastCall = now;
            fn(...args);
        }
    };
}

const throttledUpdate = throttle(heavyUpdate, 100);
```

### 4. Use Web Workers for Calculations
```javascript
// main.js
const worker = new Worker('animation-worker.js');
worker.postMessage({ path: coordinates });
worker.onmessage = (e) => updateMap(e.data);

// animation-worker.js
self.onmessage = (e) => {
    const result = heavyPathCalculation(e.data.path);
    self.postMessage(result);
};
```

### 5. Reduce During Animation
```javascript
function startAnimation() {
    // Reduce quality during movement
    map.setTerrain({ source: 'dem', exaggeration: 0.5 });
    map.setLayoutProperty('labels', 'visibility', 'none');
    
    // Animate...
}

function endAnimation() {
    // Restore quality when stopped
    map.setTerrain({ source: 'dem', exaggeration: 1.5 });
    map.setLayoutProperty('labels', 'visibility', 'visible');
}
```
