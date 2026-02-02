# Camera Movements

Professional camera movements for cinematic map animations.

## Primary Movement Types

### 1. Dolly (Push In / Pull Out)
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

### 2. Pan (Horizontal Rotation)
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

### 3. Tilt (Vertical Rotation)
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

### 4. Orbit (Arc Around)
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

### 5. Truck (Lateral Movement)
Move camera left/right parallel to subject.

```
Before:          Truck Right:
┌─────────┐      ┌─────────┐
│ A  B  C │  →   │    B  C │ D
└─────────┘      └─────────┘
```

### 6. Pedestal (Vertical Movement)
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

### 7. Fly-Through / Flyover
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

## Combined Movements

| Combination | Name | Effect |
|-------------|------|--------|
| Dolly + Zoom opposite | Dolly Zoom (Vertigo) | Background distortion |
| Dolly + Pan | Tracking Shot | Follow alongside |
| Pedestal + Tilt | Crane Shot | Dramatic reveal |
| Truck + Orbit | Drive-by | Passing perspective |
