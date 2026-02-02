# Keyframe Animation

Define camera states at specific times and interpolate between them.

## Keyframe Structure

```javascript
const keyframe = {
    time: 0,           // Time in ms or percentage
    camera: {
        center: [lng, lat],
        zoom: 14,
        pitch: 60,
        bearing: 45,
        altitude: 500   // For free camera
    },
    easing: 'easeInOutCubic',  // Easing to NEXT keyframe
    duration: 2000     // Duration to NEXT keyframe
};
```

## Timeline System

```javascript
class AnimationTimeline {
    constructor() {
        this.keyframes = [];
        this.currentTime = 0;
        this.duration = 0;
    }
    
    addKeyframe(time, cameraState, options = {}) {
        this.keyframes.push({
            time,
            camera: cameraState,
            easing: options.easing || 'linear',
            ...options
        });
        this.keyframes.sort((a, b) => a.time - b.time);
        this.duration = Math.max(this.duration, time);
    }
    
    getCameraAtTime(t) {
        // Find surrounding keyframes
        let prev = this.keyframes[0];
        let next = this.keyframes[1];
        
        for (let i = 0; i < this.keyframes.length - 1; i++) {
            if (t >= this.keyframes[i].time && t <= this.keyframes[i+1].time) {
                prev = this.keyframes[i];
                next = this.keyframes[i + 1];
                break;
            }
        }
        
        // Calculate progress between keyframes
        const segmentDuration = next.time - prev.time;
        const segmentProgress = (t - prev.time) / segmentDuration;
        const easedProgress = applyEasing(segmentProgress, next.easing);
        
        // Interpolate camera properties
        return interpolateCamera(prev.camera, next.camera, easedProgress);
    }
    
    play(onUpdate) {
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.duration, 1);
            
            const camera = this.getCameraAtTime(progress * this.duration);
            onUpdate(camera, progress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
}
```

## Interpolation Types

### Linear Interpolation (LERP)
```javascript
function lerp(a, b, t) {
    return a + (b - a) * t;
}
```

### Spherical Linear Interpolation (SLERP)
For geographic coordinates and rotations.

```javascript
function slerp(start, end, t) {
    // For quaternion rotation interpolation
    const dot = quaternionDot(start, end);
    const theta = Math.acos(Math.abs(dot));
    const sinTheta = Math.sin(theta);
    
    if (sinTheta < 0.001) return lerp(start, end, t);
    
    const a = Math.sin((1 - t) * theta) / sinTheta;
    const b = Math.sin(t * theta) / sinTheta;
    
    return quaternionAdd(
        quaternionScale(start, a),
        quaternionScale(end, b)
    );
}
```

### Great Circle Interpolation
For long-distance geographic paths.

```javascript
function greatCircleInterpolate(start, end, t) {
    const [lng1, lat1] = toRadians(start);
    const [lng2, lat2] = toRadians(end);
    
    const d = angularDistance(start, end);
    
    const a = Math.sin((1 - t) * d) / Math.sin(d);
    const b = Math.sin(t * d) / Math.sin(d);
    
    const x = a * Math.cos(lat1) * Math.cos(lng1) + b * Math.cos(lat2) * Math.cos(lng2);
    const y = a * Math.cos(lat1) * Math.sin(lng1) + b * Math.cos(lat2) * Math.sin(lng2);
    const z = a * Math.sin(lat1) + b * Math.sin(lat2);
    
    return toDegrees([Math.atan2(y, x), Math.atan2(z, Math.sqrt(x*x + y*y))]);
}
```
