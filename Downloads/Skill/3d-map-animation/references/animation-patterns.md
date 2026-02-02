# Animation Patterns

Common animation sequences for 3D maps.

## 1. Location Reveal

```javascript
async function revealLocation(location, name) {
    // Start pulled back
    await flyTo({
        center: location,
        zoom: 8,
        pitch: 0,
        bearing: 0,
        duration: 0
    });
    
    // Pause
    await delay(500);
    
    // Fly in with rotation
    await flyTo({
        center: location,
        zoom: 16,
        pitch: 60,
        bearing: 45,
        duration: 4000
    });
    
    // Show marker with bounce
    showMarker(location, { animation: 'bounce' });
}
```

## 2. Route Animation

```javascript
async function animateRoute(coordinates, options = {}) {
    const {
        drawSpeed = 50,     // meters per frame
        cameraFollow = true,
        showVehicle = true
    } = options;
    
    const line = turf.lineString(coordinates);
    const totalLength = turf.length(line);
    
    let currentDistance = 0;
    
    function frame() {
        currentDistance += drawSpeed / 1000;
        
        if (currentDistance >= totalLength) {
            return; // Animation complete
        }
        
        // Draw line segment
        const drawnLine = turf.lineSliceAlong(line, 0, currentDistance);
        updateLineSource(drawnLine);
        
        // Move vehicle
        if (showVehicle) {
            const point = turf.along(line, currentDistance);
            const bearing = turf.bearing(
                turf.along(line, Math.max(0, currentDistance - 0.01)),
                point
            );
            updateVehicle(point.geometry.coordinates, bearing);
        }
        
        // Follow with camera
        if (cameraFollow) {
            map.easeTo({
                center: point.geometry.coordinates,
                bearing: bearing,
                duration: 0
            });
        }
        
        requestAnimationFrame(frame);
    }
    
    frame();
}
```

## 3. Compare View

```javascript
async function compareLocations(locationA, locationB) {
    // Show A
    await flyTo(locationA, { duration: 2000 });
    await delay(2000);
    
    // Quick transition to B
    await flyTo(locationB, { duration: 3000 });
    await delay(2000);
    
    // Pull back to show both
    const bounds = getBounds([locationA, locationB]);
    await fitBounds(bounds, {
        padding: 100,
        pitch: 45,
        duration: 2500
    });
}
```

## 4. Time-Lapse Effect

```javascript
function timeLapse(options = {}) {
    const {
        startTime = 6,   // 6 AM
        endTime = 22,    // 10 PM
        duration = 10000 // 10 seconds
    } = options;
    
    const startMs = performance.now();
    
    function frame(currentMs) {
        const elapsed = currentMs - startMs;
        const progress = Math.min(elapsed / duration, 1);
        
        // Calculate simulated time
        const hours = startTime + (endTime - startTime) * progress;
        
        // Update lighting/atmosphere
        const lightPreset = getLightPreset(hours);
        map.setConfigProperty('basemap', 'lightPreset', lightPreset);
        
        // Update fog/sky for atmosphere
        updateAtmosphere(hours);
        
        if (progress < 1) {
            requestAnimationFrame(frame);
        }
    }
    
    requestAnimationFrame(frame);
}
```
