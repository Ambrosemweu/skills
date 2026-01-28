# Camera Angles Reference Guide

A visual reference for 3D map camera positioning and common cinematic shots.

---

## Pitch Quick Reference

| Pitch | View Type | Use Cases |
|-------|-----------|-----------|
| **0°** | Top-down/Straight down | Data visualization, choropleth maps, 2D mode |
| **15°** | Near-vertical | Overview with slight depth hint |
| **30°** | Elevated view | City overviews, regional context |
| **45°** | Classic 3D view | Balanced perspective, general purpose |
| **60°** | Immersive 3D | 3D buildings prominent, cinematic |
| **75°** | Near-horizontal | Street-level feeling, dramatic |
| **85°** | Maximum tilt | Ground-level perspective, horizon visible |

---

## Bearing Quick Reference

| Bearing | Direction | Typical Use |
|---------|-----------|-------------|
| **0°** | North-up | Standard orientation, navigation |
| **45°** | Northeast | Isometric-like view |
| **90°** | East facing | Sunrise scenes |
| **180°** | South-up | Inverted orientation |
| **270°** | West facing | Sunset scenes |
| **-45°** or **315°** | Northwest | Isometric-like view |

---

## Cinematic Shot Types

### Establishing Shot
**Purpose:** Set the scene, show location context

```
Settings:
├─ Pitch: 30-45°
├─ Zoom: Low (8-12)
├─ Duration: 2-4 seconds
└─ Transition: Slow ease-in
```

**Best for:** Opening sequences, chapter transitions

---

### Hero Shot
**Purpose:** Showcase a specific location dramatically

```
Settings:
├─ Pitch: 60-75°
├─ Zoom: High (15-17)
├─ Bearing: 45° offset from front
└─ Duration: 3-5 seconds
```

**Best for:** Destination reveals, landmarks

---

### Flyover
**Purpose:** Travel across terrain or follow a path

```
Settings:
├─ Pitch: 45-60° (constant or varying)
├─ Altitude: 500-2000m
├─ Speed: 50-200 m/s perception
└─ Bearing: Following path direction
```

**Best for:** Routes, journeys, landscape showcase

---

### Orbit Shot
**Purpose:** 360° view around a point of interest

```
Settings:
├─ Pitch: 45-60° (fixed)
├─ Radius: Depends on subject size
├─ Duration: 10-30 seconds per revolution
└─ Direction: Usually clockwise
```

**Best for:** Buildings, monuments, city centers

---

### Reveal Shot
**Purpose:** Hide then show key element

```
Sequence:
1. Start behind obstacle / pulled back
2. Slow push in or pan
3. Subject comes into view
4. Hold on subject
```

**Best for:** Dramatic discoveries, storytelling

---

### Dutch Angle (Canted Angle)
**Purpose:** Create tension, unease, or dynamic energy

```
Settings:
├─ Roll: 10-25° (subtle) or 30-45° (dramatic)
├─ Duration: Brief (1-3 seconds)
└─ Use sparingly!
```

**Best for:** Crisis scenes, action, disorientation

---

## Altitude Guidelines

| Altitude | View Type | Shows |
|----------|-----------|-------|
| **50-200m** | Street level | Individual buildings, streets |
| **200-500m** | Neighborhood | Blocks, small districts |
| **500-2000m** | District/City | City sections, landmarks |
| **2000-5000m** | Metropolitan | Full city, surrounding area |
| **5000-20000m** | Regional | Cities as points, terrain features |
| **20000m+** | Continental | Country/continent overview |

---

## Camera Movement Speeds

### Recommended Durations

| Distance | Duration | Feel |
|----------|----------|------|
| **< 1 km** | 1-2 sec | Quick, responsive |
| **1-10 km** | 2-4 sec | Standard navigation |
| **10-100 km** | 4-8 sec | Cross-city |
| **100-1000 km** | 8-15 sec | Regional travel |
| **1000+ km** | 10-20 sec | Continental/global |

### Speed Perception

```
Very Slow  ●○○○○  Contemplative, detail-focused
Slow       ●●○○○  Cinematic, dramatic
Medium     ●●●○○  Standard navigation
Fast       ●●●●○  Rapid transitions
Very Fast  ●●●●●  Jarring (use sparingly)
```

---

## Common Mistakes

### ❌ Avoid

| Mistake | Problem | Fix |
|---------|---------|-----|
| Linear easing | Mechanical, robotic | Use ease-in-out |
| Max pitch constantly | Horizon blocking view | Vary pitch 45-70° |
| Bearing 0° always | Static, boring | Add rotation |
| Too fast | Disorienting | Slow down, add pauses |
| Too slow | Boring, dragging | Speed up, add variety |
| No pauses | Overwhelming | Add holds between moves |

### ✓ Best Practices

1. **Start and end calmly** - Ease in/out of movements
2. **Vary your shots** - Mix close, medium, and wide
3. **Hold on key moments** - 2-3 second pauses
4. **Match speed to content** - Fast for energy, slow for drama
5. **Consider the arc** - In, around, or over (not zigzag)

---

## Shot Composition Templates

### Three-Point Landing
Start wide → dolly in → orbit → hold

```javascript
{
    keyframes: [
        { time: 0, zoom: 10, pitch: 30, bearing: 0 },
        { time: 3000, zoom: 15, pitch: 60, bearing: 0 },
        { time: 8000, zoom: 15, pitch: 60, bearing: 180 },
        { time: 10000, zoom: 15, pitch: 60, bearing: 180 }
    ]
}
```

### Reveal and Return
Pull back → fly to new location → come back

```javascript
{
    keyframes: [
        { time: 0, center: A, zoom: 16 },
        { time: 2000, center: A, zoom: 10 },
        { time: 5000, center: B, zoom: 16 },
        { time: 8000, center: B, zoom: 10 },
        { time: 11000, center: A, zoom: 16 }
    ]
}
```

### Journey Path
Follow route from start to end

```javascript
function journeyAnimation(path) {
    const points = path.coordinates;
    const keyframes = points.map((coord, i) => ({
        time: i * 1000,
        center: coord,
        bearing: getBearing(points[i], points[i+1] || points[i]),
        pitch: 60,
        zoom: 14
    }));
    return { keyframes };
}
```
