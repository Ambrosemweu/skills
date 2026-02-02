# Camera Animations

Mapbox GL JS provides several methods for animating the camera.

## flyTo() - Smooth Flight Animation

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

### flyTo Options Reference

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

## easeTo() - Direct Linear Animation

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

## rotateTo() - Bearing Animation

Animate only the bearing (rotation) of the map.

```javascript
map.rotateTo(180, {
    duration: 3000,
    easing: (t) => t
});
```

## jumpTo() - Instant Camera Change

Instantly move camera without animation.

```javascript
map.jumpTo({
    center: [-74.5, 40],
    zoom: 14,
    pitch: 60,
    bearing: 30
});
```

## Continuous Rotation Animation

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

## Easing Functions

```javascript
const easings = {
    // Linear
    linear: (t) => t,
    
    // Ease in (slow start)
    easeInQuad: (t) => t * t,
    easeInCubic: (t) => t * t * t,
    
    // Ease out (slow end)
    easeOutQuad: (t) => t * (2 - t),
    easeOutCubic: (t) => (--t) * t * t + 1,
    
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
```
