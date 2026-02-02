# Free Camera API

The Free Camera API provides low-level control for advanced camera animations.

## Accessing the Free Camera

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

## Orbit Animation Around a Point

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

## Path-Following Camera Animation

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
