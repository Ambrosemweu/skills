# Easing Functions Reference

Complete guide to easing functions for smooth 3D map animations.

---

## Visual Easing Curves

### Basic Easing Types

```
Linear          Ease-In         Ease-Out        Ease-In-Out
│      ●        │      ●        │●              │      ●
│     ╱         │     ╱         │ ╲             │    ╱  ╲
│    ╱          │   ╱           │  ╲            │  ╱    ╲
│   ╱           │  ╱            │   ╲           │ ╱      ╲
│  ╱            │╱              │    ╲          │╱        ╲
│ ╱             │               │     ●         │          ●
●──────────     ●──────────     ●──────────     ●──────────
Start   End    Slow  Fast      Fast  Slow     Slow Fast Slow
```

---

## Easing Function Library

### Linear (No easing)
```javascript
const linear = t => t;
```
Use: Technical animations, rotations, looping

---

### Quadratic

```javascript
const easeInQuad = t => t * t;
const easeOutQuad = t => t * (2 - t);
const easeInOutQuad = t => t < 0.5 
    ? 2 * t * t 
    : -1 + (4 - 2 * t) * t;
```
Use: Subtle, general-purpose easing

---

### Cubic

```javascript
const easeInCubic = t => t * t * t;
const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = t => t < 0.5 
    ? 4 * t * t * t 
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
```
Use: Standard camera movements, most common

---

### Quartic

```javascript
const easeInQuart = t => t * t * t * t;
const easeOutQuart = t => 1 - Math.pow(1 - t, 4);
const easeInOutQuart = t => t < 0.5 
    ? 8 * t * t * t * t 
    : 1 - Math.pow(-2 * t + 2, 4) / 2;
```
Use: Dramatic, weighty movements

---

### Quintic

```javascript
const easeInQuint = t => t * t * t * t * t;
const easeOutQuint = t => 1 - Math.pow(1 - t, 5);
const easeInOutQuint = t => t < 0.5 
    ? 16 * t * t * t * t * t 
    : 1 - Math.pow(-2 * t + 2, 5) / 2;
```
Use: Very dramatic, cinematic emphasis

---

### Sinusoidal

```javascript
const easeInSine = t => 1 - Math.cos((t * Math.PI) / 2);
const easeOutSine = t => Math.sin((t * Math.PI) / 2);
const easeInOutSine = t => -(Math.cos(Math.PI * t) - 1) / 2;
```
Use: Smooth, organic, natural-feeling

---

### Exponential

```javascript
const easeInExpo = t => t === 0 ? 0 : Math.pow(2, 10 * t - 10);
const easeOutExpo = t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
const easeInOutExpo = t => {
    if (t === 0 || t === 1) return t;
    return t < 0.5
        ? Math.pow(2, 20 * t - 10) / 2
        : (2 - Math.pow(2, -20 * t + 10)) / 2;
};
```
Use: Dramatic acceleration/deceleration

---

### Circular

```javascript
const easeInCirc = t => 1 - Math.sqrt(1 - Math.pow(t, 2));
const easeOutCirc = t => Math.sqrt(1 - Math.pow(t - 1, 2));
const easeInOutCirc = t => t < 0.5
    ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2
    : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2;
```
Use: Smooth arcs, natural circular motion

---

### Back (Overshoot)

```javascript
const easeInBack = t => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return c3 * t * t * t - c1 * t * t;
};

const easeOutBack = t => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

const easeInOutBack = t => {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;
    return t < 0.5
        ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
        : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
};
```
Use: Playful, bouncy UI elements (careful with camera!)

---

### Elastic

```javascript
const easeInElastic = t => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 :
        -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
};

const easeOutElastic = t => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 :
        Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};

const easeInOutElastic = t => {
    const c5 = (2 * Math.PI) / 4.5;
    return t === 0 ? 0 : t === 1 ? 1 : t < 0.5
        ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2
        : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1;
};
```
Use: Spring effects, markers, UI elements

---

### Bounce

```javascript
const easeOutBounce = t => {
    const n1 = 7.5625;
    const d1 = 2.75;
    
    if (t < 1 / d1) {
        return n1 * t * t;
    } else if (t < 2 / d1) {
        return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
        return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
        return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
};

const easeInBounce = t => 1 - easeOutBounce(1 - t);

const easeInOutBounce = t => t < 0.5
    ? (1 - easeOutBounce(1 - 2 * t)) / 2
    : (1 + easeOutBounce(2 * t - 1)) / 2;
```
Use: Markers landing, playful UI

---

## Bezier Curves

Create custom easing with cubic Bezier curves.

```javascript
function cubicBezier(x1, y1, x2, y2) {
    // Attempt to match CSS cubic-bezier()
    const cx = 3 * x1;
    const bx = 3 * (x2 - x1) - cx;
    const ax = 1 - cx - bx;
    const cy = 3 * y1;
    const by = 3 * (y2 - y1) - cy;
    const ay = 1 - cy - by;
    
    function sampleCurveX(t) {
        return ((ax * t + bx) * t + cx) * t;
    }
    
    function sampleCurveY(t) {
        return ((ay * t + by) * t + cy) * t;
    }
    
    function solveCurveX(x, epsilon = 1e-6) {
        let t = x;
        for (let i = 0; i < 8; i++) {
            const xEst = sampleCurveX(t) - x;
            if (Math.abs(xEst) < epsilon) return t;
            const dx = (3 * ax * t + 2 * bx) * t + cx;
            if (Math.abs(dx) < 1e-6) break;
            t -= xEst / dx;
        }
        return t;
    }
    
    return (x) => sampleCurveY(solveCurveX(x));
}
```

### Common Bezier Presets

```javascript
// CSS standard easings
const ease = cubicBezier(0.25, 0.1, 0.25, 1);
const easeIn = cubicBezier(0.42, 0, 1, 1);
const easeOut = cubicBezier(0, 0, 0.58, 1);
const easeInOut = cubicBezier(0.42, 0, 0.58, 1);

// Custom presets
const snappy = cubicBezier(0.2, 0.8, 0.2, 1);
const smooth = cubicBezier(0.4, 0, 0.2, 1);
const dramatic = cubicBezier(0.7, 0, 0.3, 1);
const bounce = cubicBezier(0.34, 1.56, 0.64, 1);
```

---

## When to Use Each Easing

| Animation Type | Recommended Easing |
|----------------|-------------------|
| Camera flyTo | easeInOutCubic |
| Camera orbit | linear |
| Zoom in | easeOutQuad |
| Zoom out | easeInQuad |
| Marker appear | easeOutBack |
| Marker land | easeOutBounce |
| Layer fade | easeInOutSine |
| Path drawing | linear or easeInOutCubic |
| UI transitions | easeOutCubic |
| Hover effects | easeOutQuad |
| Loading states | linear |
| Error shake | easeInOutElastic |

---

## Spring Physics

For more natural, physics-based motion:

```javascript
function spring(options = {}) {
    const {
        stiffness = 100,
        damping = 10,
        mass = 1,
        precision = 0.01
    } = options;
    
    const w0 = Math.sqrt(stiffness / mass);
    const zeta = damping / (2 * Math.sqrt(stiffness * mass));
    
    return (t) => {
        if (zeta < 1) {
            // Underdamped
            const wd = w0 * Math.sqrt(1 - zeta * zeta);
            return 1 - Math.exp(-zeta * w0 * t) * 
                (Math.cos(wd * t) + (zeta * w0 / wd) * Math.sin(wd * t));
        } else if (zeta === 1) {
            // Critically damped
            return 1 - (1 + w0 * t) * Math.exp(-w0 * t);
        } else {
            // Overdamped
            const s1 = -w0 * (zeta - Math.sqrt(zeta * zeta - 1));
            const s2 = -w0 * (zeta + Math.sqrt(zeta * zeta - 1));
            return 1 - (s2 * Math.exp(s1 * t) - s1 * Math.exp(s2 * t)) / (s2 - s1);
        }
    };
}

// Usage
const bouncy = spring({ stiffness: 100, damping: 5 });
const snappy = spring({ stiffness: 300, damping: 20 });
const smooth = spring({ stiffness: 50, damping: 15 });
```

---

## Easing Visualization Tool

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        .graph { 
            width: 200px; 
            height: 200px; 
            border: 1px solid #ccc;
            position: relative;
        }
        .point {
            position: absolute;
            width: 6px;
            height: 6px;
            background: #007bff;
            border-radius: 50%;
        }
    </style>
</head>
<body>
    <div class="graph" id="graph"></div>
    <script>
        const graph = document.getElementById('graph');
        const easing = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
        
        for (let i = 0; i <= 50; i++) {
            const t = i / 50;
            const value = easing(t);
            
            const point = document.createElement('div');
            point.className = 'point';
            point.style.left = (t * 194) + 'px';
            point.style.bottom = (value * 194) + 'px';
            graph.appendChild(point);
        }
    </script>
</body>
</html>
```
