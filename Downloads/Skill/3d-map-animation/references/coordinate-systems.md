# Coordinate Systems

Understanding spatial reference systems for 3D maps.

## Coordinate System Hierarchy

```
Geographic (LngLat)  →  Mercator  →  World  →  View  →  Clip  →  Screen
     [lng, lat]         [x, y]      [x,y,z]   [x,y,z]  [x,y,z,w]  [px,py]
```

## Geographic Coordinates

```javascript
// Longitude: -180 to 180 (East-West)
// Latitude: -90 to 90 (North-South)
const position = {
    lng: -122.4194,  // San Francisco longitude
    lat: 37.7749     // San Francisco latitude
};
```

## Web Mercator Projection

Standard for web maps (EPSG:3857).

```javascript
// Geographic to Mercator
function lngLatToMercator(lng, lat) {
    const x = lng * 20037508.34 / 180;
    let y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
    y = y * 20037508.34 / 180;
    return { x, y };
}

// Mercator to Geographic
function mercatorToLngLat(x, y) {
    const lng = x * 180 / 20037508.34;
    const lat = Math.atan(Math.exp(y * Math.PI / 20037508.34)) * 360 / Math.PI - 90;
    return { lng, lat };
}
```

## 3D World Space

```javascript
// In mapping libraries, world coordinates often use:
// X: East (+) / West (-)
// Y: North (+) / South (-)  
// Z: Up (+) / Down (-)

// Converting to world units
const metersPerUnit = mercatorCoordinate.meterInMercatorCoordinateUnits();
const worldPosition = {
    x: mercator.x,
    y: mercator.y,
    z: altitudeInMeters * metersPerUnit
};
```

## Transformations

```javascript
// Model Matrix: Local → World
const modelMatrix = mat4.create();
mat4.translate(modelMatrix, modelMatrix, worldPosition);
mat4.rotateZ(modelMatrix, modelMatrix, rotation);
mat4.scale(modelMatrix, modelMatrix, scale);

// View Matrix: World → Camera
const viewMatrix = mat4.create();
mat4.lookAt(viewMatrix, cameraPosition, targetPosition, upVector);

// Projection Matrix: Camera → Clip
const projectionMatrix = mat4.create();
mat4.perspective(projectionMatrix, fov, aspect, near, far);

// Combined: MVP Matrix
const mvpMatrix = mat4.create();
mat4.multiply(mvpMatrix, projectionMatrix, viewMatrix);
mat4.multiply(mvpMatrix, mvpMatrix, modelMatrix);
```
