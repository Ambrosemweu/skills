---
name: 3d-map-animation
description: Comprehensive guide to 3D map animation including camera angles, movement types, cinematography principles, keyframe animation, and visual storytelling techniques. Use when creating cinematic map experiences, scrollytelling maps, drone flight visualizations, or any map with camera transitions and visual storytelling.
---

# 3D Map Animation Skill

A comprehensive guide to creating professional 3D map animations. This skill covers camera systems, animation principles, visual composition, and practical techniques applicable across mapping platforms.

## Table of Contents

1. [Camera Fundamentals](#camera-fundamentals)
2. [Camera Movements](references/camera-movements.md) — Dolly, pan, tilt, orbit, and combined techniques
3. [Animation Principles](references/animation-principles.md) — Disney's 12 principles applied to maps
4. [Keyframe Animation](references/keyframe-animation.md) — Timeline systems and interpolation
5. [Visual Composition](references/visual-composition.md) — Rule of thirds, hierarchy, depth cues
6. [Scrollytelling](references/scrollytelling-guide.md) — Scroll-driven map narratives
7. [Coordinate Systems](references/coordinate-systems.md) — Geographic, Mercator, world space
8. [Animation Patterns](references/animation-patterns.md) — Location reveal, route, compare, time-lapse
9. [Performance Optimization](references/performance-optimization.md) — Frame rate targets and techniques
10. [Camera Angles Reference](references/camera-angles-reference.md)
11. [Easing Functions](references/easing-functions.md)

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

## Quick Reference

### Camera Movement Types

| Movement | Description | Use Case |
|----------|-------------|----------|
| **Dolly** | Forward/backward | Approach/retreat |
| **Pan** | Horizontal rotation | Reveal panorama |
| **Tilt** | Vertical rotation | Show height |
| **Orbit** | Circle around target | 360° showcase |
| **Truck** | Lateral movement | Parallel tracking |
| **Pedestal** | Vertical movement | Crane effect |
| **Flyover** | Sweeping aerial | Journey visualization |

See [Camera Movements](references/camera-movements.md) for detailed implementations.

### Animation Timing Guidelines

| Animation Type | Fast (0.3s) | Medium (1-2s) | Slow (3-5s) |
|----------------|-------------|---------------|-------------|
| UI Response | ✓ Snappy | × Sluggish | × Broken |
| City Hop | × Jarring | ✓ Natural | × Boring |
| Continent Fly | × Too fast | ✓ Dramatic | ✓ Epic |

See [Animation Principles](references/animation-principles.md) for Disney's 12 principles.

### Common Easing Functions

```javascript
const easings = {
    easeInQuad: t => t * t,
    easeOutQuad: t => t * (2 - t),
    easeInOutQuad: t => t < 0.5 ? 2*t*t : -1+(4-2*t)*t,
    easeOutCubic: t => 1 - Math.pow(1 - t, 3),
    easeInOutCubic: t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3) / 2
};
```

See [Easing Functions](references/easing-functions.md) for comprehensive reference.

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
