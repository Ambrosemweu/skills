---
name: 3D Map Animation
description: Comprehensive guide to 3D map animation including camera angles, movement types, cinematography principles, keyframe animation, and visual storytelling techniques
---

# 3D Map Animation Skill

A comprehensive guide to creating professional 3D map animations. This skill covers camera systems, animation principles, visual composition, and practical techniques applicable across mapping platforms.

## Table of Contents

1. [Camera Fundamentals](#camera-fundamentals)
2. [Camera Movements](#camera-movements)
3. [Animation Principles](#animation-principles)
4. [Keyframe Animation](#keyframe-animation)
5. [Visual Composition](#visual-composition)
6. [Scrollytelling](#scrollytelling)
7. [Coordinate Systems](#coordinate-systems)
8. [Animation Patterns](#animation-patterns)
9. [Performance Optimization](#performance-optimization)

---

## Camera Fundamentals

Understanding camera orientation and positioning is essential for 3D map animations.

### Camera Orientation (Euler Angles)

The camera's orientation in 3D space is defined by three rotational angles:

```
        Y (Up)
        │
        │    Z (Forward/Bearing)
        │   /
        │  /
        │ /
        └─────── X (Right)
```

| Angle | Axis | Description | Range | Visual Effect |
|-------|------|-------------|-------|---------------|
| **Pitch** | X-axis | Vertical tilt (up/down) | 0°-85° | Bird's eye → Ground level |
| **Bearing** (Yaw) | Y-axis | Horizontal rotation (left/right) | 0°-360° | Compass direction |
| **Roll** | Z-axis | Barrel rotation (tilt sideways) | -180°-180° | Dutch angle effect |

### Pitch Reference

```
Pitch 0°    Pitch 30°   Pitch 60°   Pitch 85°
┌───────┐   ┌───────┐   ┌───────┐   ┌───────┐
│▀▀▀▀▀▀▀│   │ ▄▄▄▄▄ │   │       │   │       │
│▓▓▓▓▓▓▓│   │▓▓▓▓▓▓▓│   │ ▄▄▄   │   │       │
│▓▓▓▓▓▓▓│   │▓▓▓▓▓▓▓│   │▓▓▓▓▓▓▓│   │  ▄    │
│▓▓▓▓▓▓▓│   │▓▓▓▓▓▓▓│   │▓▓▓▓▓▓▓│   │▓▓▓▓▓▓▓│
└───────┘   └───────┘   └───────┘   └───────┘
Top-down    Elevated    Standard    Street-level
```

### Bearing Reference

```
       N (0°/360°)
          │
    NW    │    NE
  (315°)  │  (45°)
          │
W ────────┼──────── E
(270°)    │      (90°)
          │
    SW    │    SE
  (225°)  │  (135°)
          │
       S (180°)
```

### Zoom and Altitude

| Parameter | Description | Use Case |
|-----------|-------------|----------|
| **Zoom Level** | Logarithmic scale (0-22) | Control detail level |
| **Altitude** | Height in meters | Free camera positioning |
| **Distance** | Range from target | Orbit animations |

```javascript
// Relationship: Lower zoom = higher altitude
// Zoom 0  = ~78,000 km (whole Earth)
// Zoom 10 = ~1.2 km
// Zoom 20 = ~1.2 m
```

---

## Camera Movements

Professional camera movements for cinematic map animations.

### Primary Movement Types

#### 1. Dolly (Push In / Pull Out)
Move camera forward/backward through space.

```
Before:          After Dolly In:
┌─────────┐      ┌─────────┐
│  [▣]    │  →   │ [████]  │
│ subject │      │ subject │
└─────────┘      └─────────┘
```

**Use Cases:**
- Reveal details as approaching
- Create intimacy or tension
- Establish then explore

```javascript
// Conceptual implementation
function dollyIn(camera, target, distance, duration) {
    animate({
        from: camera.position,
        to: moveTowards(camera.position, target, distance),
        duration,
        easing: 'easeInOutCubic'
    });
}
```

#### 2. Pan (Horizontal Rotation)
Rotate camera left/right from fixed position.

```
Pan Left:                Pan Right:
    ←──[📷]                [📷]──→
       /  \                /  \
      A    B              A    B
```

**Use Cases:**
- Reveal surrounding context
- Follow horizontal movement
- Connect two locations

#### 3. Tilt (Vertical Rotation)
Rotate camera up/down from fixed position.

```
Tilt Up:     Neutral:     Tilt Down:
    ▲           ─            ▼
   /           /            /
[📷]        [📷]         [📷]
```

**Use Cases:**
- Reveal tall structures
- Emphasize height or depth
- Create sense of scale

#### 4. Orbit (Arc Around)
Move camera in circular path around target.

```
        ┌───→───┐
        │       │
        ↑  [▣]  ↓
        │       │
        └───←───┘
```

**Use Cases:**
- 360° view of location
- Product showcase effect
- Dramatic reveal

```javascript
// Orbit animation pattern
function orbit(center, radius, duration) {
    const startAngle = 0;
    
    animate((progress) => {
        const angle = startAngle + progress * Math.PI * 2;
        const x = center[0] + radius * Math.cos(angle);
        const y = center[1] + radius * Math.sin(angle);
        
        camera.position = [x, y, altitude];
        camera.lookAt(center);
    }, duration);
}
```

#### 5. Truck (Lateral Movement)
Move camera left/right parallel to subject.

```
Before:          Truck Right:
┌─────────┐      ┌─────────┐
│ A  B  C │  →   │    B  C │ D
└─────────┘      └─────────┘
```

#### 6. Pedestal (Vertical Movement)
Move camera up/down while maintaining angle.

```
Pedestal Up:        Pedestal Down:
    [📷]↑               
      \                   \
       \                   \
        ▣                   ▣
                              \
                            [📷]↓
```

#### 7. Fly-Through / Flyover
Sweeping aerial movement over terrain.

```
Start ──────────────────→ End
  ↘                        ↗
    ╲  terrain terrain  ╱
     ╲________________╱
```

**Use Cases:**
- Tour along a route
- Reveal landscape
- Journey visualization

### Combined Movements

| Combination | Name | Effect |
|-------------|------|--------|
| Dolly + Zoom opposite | Dolly Zoom (Vertigo) | Background distortion |
| Dolly + Pan | Tracking Shot | Follow alongside |
| Pedestal + Tilt | Crane Shot | Dramatic reveal |
| Truck + Orbit | Drive-by | Passing perspective |

---

## Animation Principles

Apply Disney's 12 principles of animation to map animations.

### 1. Squash and Stretch
**Map Application:** Subtle bounce on markers when landing; elastic feel on zoom transitions.

```javascript
// Marker landing animation
function markerLand(marker) {
    animate({
        scale: [1.2, 0.9, 1.05, 0.98, 1],
        duration: 400,
        easing: 'spring'
    });
}
```

### 2. Anticipation
**Map Application:** Brief pause or slight movement opposite to main action before camera flies.

```javascript
// Anticipation before flyTo
async function flyWithAnticipation(target) {
    // Slight zoom out first
    await camera.zoom(currentZoom - 0.5, 200);
    // Then fly to target
    await camera.flyTo(target, 3000);
}
```

### 3. Staging
**Map Application:** Clear framing, uncluttered views, proper lighting for focus.

**Checklist:**
- [ ] Is the subject clearly visible?
- [ ] Are distracting elements hidden?
- [ ] Does lighting support the mood?
- [ ] Is there proper contrast?

### 4. Straight Ahead vs Pose to Pose
**Map Application:** 
- Straight ahead: Organic, unpredictable paths
- Pose to pose: Keyframe-defined camera positions

### 5. Follow Through and Overlapping Action
**Map Application:** Labels settle after camera stops; clouds continue after pan stops.

```javascript
// Camera stops but elements follow through
camera.onMoveEnd(() => {
    // Labels ease to final position
    labels.animate({ offset: 0 }, 300, 'easeOutBack');
});
```

### 6. Slow In and Slow Out (Ease)
**Map Application:** Essential for all camera movements—never linear!

```javascript
// Easing functions
const easings = {
    easeInQuad: t => t * t,
    easeOutQuad: t => t * (2 - t),
    easeInOutQuad: t => t < 0.5 ? 2*t*t : -1+(4-2*t)*t,
    easeOutCubic: t => 1 - Math.pow(1 - t, 3),
    easeInOutCubic: t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3) / 2
};
```

### 7. Arc
**Map Application:** Camera paths should curve, not move in straight lines.

```javascript
// Use bezier curves for natural camera paths
function curvedPath(start, end, controlPoints) {
    return (t) => {
        // Cubic bezier interpolation
        return bezier(start, control1, control2, end, t);
    };
}
```

### 8. Secondary Action
**Map Application:** Subtle cloud movement, water animation, ambient effects.

### 9. Timing
**Map Application:** Duration affects perceived weight and importance.

| Animation Type | Fast (0.3s) | Medium (1-2s) | Slow (3-5s) |
|----------------|-------------|---------------|-------------|
| UI Response | ✓ Snappy | × Sluggish | × Broken |
| City Hop | × Jarring | ✓ Natural | × Boring |
| Continent Fly | × Too fast | ✓ Dramatic | ✓ Epic |

### 10. Exaggeration
**Map Application:** Terrain exaggeration, emphasized heights, dramatic lighting.

### 11. Solid Drawing
**Map Application:** Consistent 3D perspective, proper depth cues, realistic lighting.

### 12. Appeal
**Map Application:** Aesthetic color choices, smooth animations, satisfying interactions.

---

## Keyframe Animation

Define camera states at specific times and interpolate between them.

### Keyframe Structure

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

### Timeline System

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

### Interpolation Types

#### Linear Interpolation (LERP)
```javascript
function lerp(a, b, t) {
    return a + (b - a) * t;
}
```

#### Spherical Linear Interpolation (SLERP)
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

#### Great Circle Interpolation
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

---

## Visual Composition

Apply cinematographic principles to map animations.

### Rule of Thirds

Divide frame into 9 equal sections. Place important elements along lines or at intersections.

```
┌───────┬───────┬───────┐
│       │       │       │
│   ○   │       │   ○   │  ← Power points
│       │       │       │
├───────┼───────┼───────┤
│       │       │       │
│       │       │       │
│       │       │       │
├───────┼───────┼───────┤
│       │       │       │
│   ○   │       │   ○   │  ← Power points
│       │       │       │
└───────┴───────┴───────┘
```

**Map Applications:**
- Place destination markers at power points
- Align horizon with horizontal thirds
- Position journey endpoints at opposing thirds

### Visual Hierarchy

Guide viewer attention through visual weight.

| Element | High Priority | Low Priority |
|---------|---------------|--------------|
| **Size** | Large | Small |
| **Color** | Bright, saturated | Muted, desaturated |
| **Contrast** | High against background | Low, blends in |
| **Position** | Center, foreground | Periphery, background |
| **Motion** | Animated | Static |

### Depth Cues

Create sense of 3D space:

1. **Atmospheric Perspective** - Distant objects appear hazier
2. **Size Gradient** - Objects shrink with distance
3. **Overlap** - Closer objects cover farther ones
4. **Shadows** - Ground shapes, directional lighting
5. **Parallax** - Layers move at different speeds

### Color and Mood

| Mood | Color Palette | Lighting |
|------|---------------|----------|
| Energetic | Warm, high saturation | Bright, midday |
| Calm | Cool blues, low saturation | Soft, diffused |
| Dramatic | High contrast, deep shadows | Dawn/dusk, directional |
| Mysterious | Dark, purple/blue tones | Night, point lights |

---

## Scrollytelling

Create scroll-driven map narratives.

### Architecture

```
┌─────────────────────────────────────┐
│          Fixed Map Container        │
│  ┌─────────────────────────────┐    │
│  │                             │    │
│  │     [Interactive Map]       │    │
│  │                             │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │   Scrolling Content         │    │
│  │   • Chapter 1               │◄── Scroll triggers
│  │   • Chapter 2               │    map changes
│  │   • Chapter 3               │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

### Chapter Configuration

```javascript
const chapters = [
    {
        id: 'intro',
        title: 'The Journey Begins',
        description: 'Our story starts in...',
        camera: {
            center: [-74.006, 40.7128],
            zoom: 12,
            pitch: 60,
            bearing: 0
        },
        layers: {
            show: ['route-line', 'start-marker'],
            hide: ['heatmap']
        },
        onEnter: () => {
            // Custom actions when entering chapter
        }
    },
    // More chapters...
];
```

### Scroll Detection

```javascript
class ScrollyController {
    constructor(chapters, map) {
        this.chapters = chapters;
        this.map = map;
        this.currentChapter = null;
        
        this.setupObserver();
    }
    
    setupObserver() {
        const options = {
            root: null,
            rootMargin: '-40% 0px -40% 0px', // Trigger in middle of viewport
            threshold: 0
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const chapterId = entry.target.dataset.chapter;
                    this.activateChapter(chapterId);
                }
            });
        }, options);
        
        // Observe all chapter elements
        document.querySelectorAll('[data-chapter]').forEach(el => {
            observer.observe(el);
        });
    }
    
    activateChapter(chapterId) {
        if (chapterId === this.currentChapter) return;
        
        const chapter = this.chapters.find(c => c.id === chapterId);
        if (!chapter) return;
        
        this.currentChapter = chapterId;
        
        // Animate camera
        this.map.flyTo({
            ...chapter.camera,
            duration: 2000,
            essential: true
        });
        
        // Update layers
        if (chapter.layers?.show) {
            chapter.layers.show.forEach(id => {
                this.map.setLayoutProperty(id, 'visibility', 'visible');
            });
        }
        if (chapter.layers?.hide) {
            chapter.layers.hide.forEach(id => {
                this.map.setLayoutProperty(id, 'visibility', 'none');
            });
        }
        
        // Custom callback
        if (chapter.onEnter) chapter.onEnter();
    }
}
```

### Scroll Progress Animation

```javascript
// CSS Scroll-Driven Animation (modern browsers)
.map-element {
    animation: revealMap linear;
    animation-timeline: scroll();
    animation-range: 0% 100%;
}

@keyframes revealMap {
    0% { opacity: 0; transform: translateY(50px); }
    100% { opacity: 1; transform: translateY(0); }
}

// JavaScript alternative
function setupScrollProgress() {
    const scrollContainer = document.querySelector('.scroll-content');
    
    scrollContainer.addEventListener('scroll', () => {
        const scrollTop = scrollContainer.scrollTop;
        const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
        const progress = scrollTop / scrollHeight;
        
        updateMapForProgress(progress);
    });
}
```

---

## Coordinate Systems

Understanding spatial reference systems for 3D maps.

### Coordinate System Hierarchy

```
Geographic (LngLat)  →  Mercator  →  World  →  View  →  Clip  →  Screen
     [lng, lat]         [x, y]      [x,y,z]   [x,y,z]  [x,y,z,w]  [px,py]
```

### Geographic Coordinates

```javascript
// Longitude: -180 to 180 (East-West)
// Latitude: -90 to 90 (North-South)
const position = {
    lng: -122.4194,  // San Francisco longitude
    lat: 37.7749     // San Francisco latitude
};
```

### Web Mercator Projection

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

### 3D World Space

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

### Transformations

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

---

## Animation Patterns

Common animation sequences for 3D maps.

### 1. Location Reveal

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

### 2. Route Animation

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

### 3. Compare View

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

### 4. Time-Lapse Effect

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

---

## Performance Optimization

Best practices for smooth 3D map animations.

### Frame Rate Targets

| Device Type | Target FPS | Max Frame Time |
|-------------|------------|----------------|
| Desktop | 60 fps | 16.67 ms |
| Mobile | 30-60 fps | 16.67-33.33 ms |
| Low-end | 30 fps | 33.33 ms |

### Optimization Techniques

#### 1. Use requestAnimationFrame
```javascript
// ✓ Good - syncs with display refresh
function animate() {
    updateAnimation();
    requestAnimationFrame(animate);
}

// ✗ Bad - inconsistent timing
setInterval(updateAnimation, 16);
```

#### 2. Batch Updates
```javascript
// ✗ Bad - multiple redraws
points.forEach(p => updatePoint(p));

// ✓ Good - single redraw
const geojson = createFeatureCollection(points);
source.setData(geojson);
```

#### 3. Throttle Heavy Operations
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

#### 4. Use Web Workers for Calculations
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

#### 5. Reduce During Animation
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

---

## Resources

### Tools
- **Google Earth Studio** - Keyframe-based Earth animation
- **Mapbox Studio** - Style and animation design
- **Blender** - Complex 3D camera paths
- **After Effects** - Post-processing and compositing

### Libraries
- **Turf.js** - Geospatial calculations
- **Three.js** - 3D rendering
- **GSAP** - Professional animation
- **Anime.js** - Lightweight animation
- **Lottie** - Vector animations

### References
- 12 Principles of Animation (Disney)
- Cinematography techniques
- Web Animation API (WAAPI)
