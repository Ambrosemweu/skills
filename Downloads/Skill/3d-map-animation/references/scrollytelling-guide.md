# Scrollytelling Implementation Guide

Complete guide to creating scroll-driven map narratives.

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│                    Viewport (100vh)                       │
│  ┌───────────────────────────────────────────────────┐   │
│  │                                                   │   │
│  │              Fixed Map Container                  │   │
│  │              (position: sticky or fixed)          │   │
│  │                                                   │   │
│  │  ┌─────────────────────────────────────────────┐ │   │
│  │  │           Interactive 3D Map                │ │   │
│  │  │                                             │ │   │
│  │  └─────────────────────────────────────────────┘ │   │
│  │                                                   │   │
│  └───────────────────────────────────────────────────┘   │
│                                                          │
│  ┌───────────────────────────────────────────────────┐   │
│  │            Scrollable Content Overlay             │   │
│  │  ┌─────────────────────────────────────────────┐ │   │
│  │  │  Chapter 1: Introduction                    │ │   │
│  │  │  [Text content, images, etc.]               │ │   │
│  │  └─────────────────────────────────────────────┘ │   │
│  │  ┌─────────────────────────────────────────────┐ │   │
│  │  │  Chapter 2: The Journey                     │ │◄──┼── Triggers map animation
│  │  │  [Text content]                             │ │   │
│  │  └─────────────────────────────────────────────┘ │   │
│  │  ┌─────────────────────────────────────────────┐ │   │
│  │  │  Chapter 3: Discovery                       │ │   │
│  │  │  [Text content]                             │ │   │
│  │  └─────────────────────────────────────────────┘ │   │
│  └───────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

---

## Basic HTML Structure

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Map Scrollytelling</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: -apple-system, system-ui, sans-serif;
        }
        
        /* Map container - stays fixed */
        #map {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            z-index: 0;
        }
        
        /* Story container - scrolls over map */
        #story {
            position: relative;
            z-index: 1;
            pointer-events: none;
        }
        
        /* Individual chapter */
        .chapter {
            min-height: 100vh;
            display: flex;
            align-items: center;
            padding: 2rem;
        }
        
        /* Chapter content card */
        .chapter-content {
            background: rgba(255, 255, 255, 0.95);
            padding: 2rem;
            max-width: 400px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            pointer-events: all;
        }
        
        /* Position chapters on left or right */
        .chapter.left { justify-content: flex-start; }
        .chapter.right { justify-content: flex-end; }
        .chapter.center { justify-content: center; }
        
        /* Active state styling */
        .chapter.active .chapter-content {
            opacity: 1;
            transform: translateX(0);
        }
        
        .chapter:not(.active) .chapter-content {
            opacity: 0.3;
        }
    </style>
</head>
<body>
    <div id="map"></div>
    
    <div id="story">
        <div class="chapter left" data-chapter="intro">
            <div class="chapter-content">
                <h2>The Journey Begins</h2>
                <p>Our story starts in San Francisco...</p>
            </div>
        </div>
        
        <div class="chapter right" data-chapter="destination">
            <div class="chapter-content">
                <h2>Heading East</h2>
                <p>We travel across the country...</p>
            </div>
        </div>
        
        <div class="chapter center" data-chapter="arrival">
            <div class="chapter-content">
                <h2>New York City</h2>
                <p>Our final destination awaits...</p>
            </div>
        </div>
    </div>
    
    <script src="scrollytelling.js"></script>
</body>
</html>
```

---

## JavaScript Controller

```javascript
// scrollytelling.js

// Chapter configuration
const chapters = [
    {
        id: 'intro',
        camera: {
            center: [-122.4194, 37.7749],
            zoom: 12,
            pitch: 60,
            bearing: 0
        },
        layers: {
            show: ['start-marker'],
            hide: ['route-line']
        },
        onEnter: () => console.log('Entered intro')
    },
    {
        id: 'destination',
        camera: {
            center: [-98.5795, 39.8283],
            zoom: 4,
            pitch: 30,
            bearing: 0
        },
        layers: {
            show: ['route-line'],
            hide: []
        },
        onEnter: () => animateRouteLine()
    },
    {
        id: 'arrival',
        camera: {
            center: [-74.006, 40.7128],
            zoom: 13,
            pitch: 65,
            bearing: -45
        },
        layers: {
            show: ['end-marker', 'route-line'],
            hide: []
        },
        onEnter: () => showFinalMarker()
    }
];

// ScrollyController class
class ScrollyController {
    constructor(map, chapters) {
        this.map = map;
        this.chapters = chapters;
        this.currentChapter = null;
        this.isAnimating = false;
        
        this.setupObserver();
    }
    
    setupObserver() {
        const options = {
            root: null,
            // Trigger when chapter is in middle 20% of viewport
            rootMargin: '-40% 0px -40% 0px',
            threshold: 0
        };
        
        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            options
        );
        
        // Observe all chapter elements
        document.querySelectorAll('[data-chapter]').forEach(el => {
            this.observer.observe(el);
        });
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const chapterId = entry.target.dataset.chapter;
                this.activateChapter(chapterId);
            }
        });
    }
    
    activateChapter(chapterId) {
        // Skip if already on this chapter or animating
        if (chapterId === this.currentChapter || this.isAnimating) return;
        
        const chapter = this.chapters.find(c => c.id === chapterId);
        if (!chapter) return;
        
        this.currentChapter = chapterId;
        this.isAnimating = true;
        
        // Update DOM classes
        document.querySelectorAll('.chapter').forEach(el => {
            el.classList.toggle('active', el.dataset.chapter === chapterId);
        });
        
        // Animate camera
        this.map.flyTo({
            ...chapter.camera,
            duration: 2500,
            essential: true
        });
        
        // Handle layers
        this.updateLayers(chapter.layers);
        
        // Custom callback
        if (chapter.onEnter) chapter.onEnter();
        
        // Reset animating flag after duration
        setTimeout(() => {
            this.isAnimating = false;
        }, 2500);
    }
    
    updateLayers(layers) {
        if (!layers) return;
        
        if (layers.show) {
            layers.show.forEach(id => {
                if (this.map.getLayer(id)) {
                    this.map.setLayoutProperty(id, 'visibility', 'visible');
                }
            });
        }
        
        if (layers.hide) {
            layers.hide.forEach(id => {
                if (this.map.getLayer(id)) {
                    this.map.setLayoutProperty(id, 'visibility', 'none');
                }
            });
        }
    }
    
    destroy() {
        this.observer.disconnect();
    }
}

// Initialize
mapboxgl.accessToken = 'YOUR_TOKEN';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/standard',
    center: chapters[0].camera.center,
    zoom: chapters[0].camera.zoom,
    pitch: chapters[0].camera.pitch,
    bearing: chapters[0].camera.bearing,
    interactive: false  // Disable user interaction
});

map.on('load', () => {
    // Add your sources and layers here
    
    // Initialize scrolly controller
    const scrolly = new ScrollyController(map, chapters);
});
```

---

## Advanced Features

### Scroll Progress (Continuous Animation)

```javascript
class ScrollProgressController {
    constructor(map, keyframes) {
        this.map = map;
        this.keyframes = keyframes;
        this.scrollContainer = document.getElementById('story');
        
        this.setupScrollListener();
    }
    
    setupScrollListener() {
        window.addEventListener('scroll', () => {
            this.updateMapForScroll();
        }, { passive: true });
    }
    
    updateMapForScroll() {
        const scrollTop = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const progress = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
        
        const camera = this.getCameraAtProgress(progress);
        
        // Use jumpTo for instant updates (no animation)
        this.map.jumpTo({
            center: camera.center,
            zoom: camera.zoom,
            pitch: camera.pitch,
            bearing: camera.bearing
        });
    }
    
    getCameraAtProgress(progress) {
        // Find surrounding keyframes
        const totalKeyframes = this.keyframes.length;
        const scaled = progress * (totalKeyframes - 1);
        const index = Math.floor(scaled);
        const t = scaled - index;
        
        const kf1 = this.keyframes[Math.min(index, totalKeyframes - 1)];
        const kf2 = this.keyframes[Math.min(index + 1, totalKeyframes - 1)];
        
        return {
            center: [
                this.lerp(kf1.center[0], kf2.center[0], t),
                this.lerp(kf1.center[1], kf2.center[1], t)
            ],
            zoom: this.lerp(kf1.zoom, kf2.zoom, t),
            pitch: this.lerp(kf1.pitch, kf2.pitch, t),
            bearing: this.lerpAngle(kf1.bearing, kf2.bearing, t)
        };
    }
    
    lerp(a, b, t) {
        return a + (b - a) * t;
    }
    
    lerpAngle(a, b, t) {
        // Handle angle wrapping
        const diff = ((b - a + 540) % 360) - 180;
        return a + diff * t;
    }
}
```

### Bi-Directional Scrolling

```javascript
class BiDirectionalScrolly extends ScrollyController {
    activateChapter(chapterId, direction) {
        const chapter = this.chapters.find(c => c.id === chapterId);
        const prevIndex = this.chapters.findIndex(c => c.id === this.currentChapter);
        const nextIndex = this.chapters.findIndex(c => c.id === chapterId);
        
        // Detect scroll direction
        const scrollingDown = nextIndex > prevIndex;
        
        // Use different animations based on direction
        const duration = scrollingDown ? 2500 : 1500;
        const curve = scrollingDown ? 1.42 : 1.2;
        
        this.map.flyTo({
            ...chapter.camera,
            duration,
            curve,
            essential: true
        });
    }
}
```

### Mobile-Responsive Scrollytelling

```css
/* Mobile-first breakpoints */
@media (max-width: 768px) {
    .chapter-content {
        max-width: 100%;
        margin: 0 1rem;
        padding: 1.5rem;
    }
    
    .chapter.left,
    .chapter.right {
        justify-content: center;
    }
    
    /* Reduce chapter height on mobile */
    .chapter {
        min-height: 70vh;
    }
}

@media (max-width: 480px) {
    .chapter {
        min-height: 50vh;
    }
    
    .chapter-content {
        padding: 1rem;
        font-size: 14px;
    }
}
```

```javascript
// Responsive adjustments
function getResponsiveCamera(chapter) {
    const isMobile = window.innerWidth < 768;
    
    return {
        ...chapter.camera,
        zoom: isMobile ? chapter.camera.zoom - 1 : chapter.camera.zoom,
        pitch: isMobile ? Math.min(chapter.camera.pitch, 45) : chapter.camera.pitch
    };
}
```

---

## Content Reveal Patterns

### Fade In On Scroll

```css
.chapter-content {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
}

.chapter.active .chapter-content {
    opacity: 1;
    transform: translateY(0);
}
```

### Slide From Side

```css
.chapter.left .chapter-content {
    transform: translateX(-50px);
}

.chapter.right .chapter-content {
    transform: translateX(50px);
}

.chapter.active .chapter-content {
    transform: translateX(0);
}
```

### Staggered Animation

```css
.chapter.active .chapter-content h2 {
    animation: fadeInUp 0.6s ease forwards;
}

.chapter.active .chapter-content p {
    animation: fadeInUp 0.6s ease 0.2s forwards;
    opacity: 0;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

---

## Performance Tips

### 1. Debounce/Throttle Scroll Events

```javascript
function throttle(fn, wait) {
    let lastTime = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastTime >= wait) {
            lastTime = now;
            fn.apply(this, args);
        }
    };
}

window.addEventListener('scroll', throttle(handleScroll, 50));
```

### 2. Use Passive Event Listeners

```javascript
window.addEventListener('scroll', handleScroll, { passive: true });
```

### 3. Prefer IntersectionObserver Over Scroll Events

```javascript
// ✓ Good - uses IntersectionObserver
const observer = new IntersectionObserver(callback, options);

// ✗ Avoid - constant scroll event processing
window.addEventListener('scroll', checkVisibility);
```

### 4. Reduce Map Interactions During Scroll

```javascript
// Disable user interactions during story
const map = new mapboxgl.Map({
    container: 'map',
    interactive: false  // Disable all interactions
});

// Or selectively disable
map.scrollZoom.disable();
map.dragPan.disable();
map.doubleClickZoom.disable();
```

---

## Testing Checklist

- [ ] Story works with keyboard navigation (Tab, Enter)
- [ ] Works with screen readers
- [ ] Chapters trigger correctly on scroll up AND down
- [ ] Map animations complete before next trigger
- [ ] Mobile-responsive (360px, 768px, 1024px+)
- [ ] Touch scrolling is smooth
- [ ] No layout shifts during transitions
- [ ] Performance: maintains 30+ FPS while scrolling
