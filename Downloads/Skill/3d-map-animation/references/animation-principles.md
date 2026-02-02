# Animation Principles

Apply Disney's 12 principles of animation to map animations.

## 1. Squash and Stretch
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

## 2. Anticipation
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

## 3. Staging
**Map Application:** Clear framing, uncluttered views, proper lighting for focus.

**Checklist:**
- [ ] Is the subject clearly visible?
- [ ] Are distracting elements hidden?
- [ ] Does lighting support the mood?
- [ ] Is there proper contrast?

## 4. Straight Ahead vs Pose to Pose
**Map Application:** 
- Straight ahead: Organic, unpredictable paths
- Pose to pose: Keyframe-defined camera positions

## 5. Follow Through and Overlapping Action
**Map Application:** Labels settle after camera stops; clouds continue after pan stops.

```javascript
// Camera stops but elements follow through
camera.onMoveEnd(() => {
    // Labels ease to final position
    labels.animate({ offset: 0 }, 300, 'easeOutBack');
});
```

## 6. Slow In and Slow Out (Ease)
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

## 7. Arc
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

## 8. Secondary Action
**Map Application:** Subtle cloud movement, water animation, ambient effects.

## 9. Timing
**Map Application:** Duration affects perceived weight and importance.

| Animation Type | Fast (0.3s) | Medium (1-2s) | Slow (3-5s) |
|----------------|-------------|---------------|-------------|
| UI Response | ✓ Snappy | × Sluggish | × Broken |
| City Hop | × Jarring | ✓ Natural | × Boring |
| Continent Fly | × Too fast | ✓ Dramatic | ✓ Epic |

## 10. Exaggeration
**Map Application:** Terrain exaggeration, emphasized heights, dramatic lighting.

## 11. Solid Drawing
**Map Application:** Consistent 3D perspective, proper depth cues, realistic lighting.

## 12. Appeal
**Map Application:** Aesthetic color choices, smooth animations, satisfying interactions.
