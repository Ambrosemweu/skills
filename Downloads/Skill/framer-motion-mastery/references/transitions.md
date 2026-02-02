# Transitions

The `transition` prop defines **how** animations occur (timing, easing, spring physics).

## Transition Types

| Type | Description | Best For |
|------|-------------|----------|
| `tween` | Duration-based (like CSS). | Precise timing, color changes. |
| `spring` | Physics-based (default). | Natural, lively motion. |
| `inertia` | Momentum-based. | Drag end behavior, flick gestures. |

## Tween Transitions

```jsx
<motion.div
  animate={{ x: 100 }}
  transition={{
    type: "tween",
    duration: 0.5,        // seconds
    delay: 0.2,           // seconds
    ease: "easeInOut"     // easing
  }}
/>
```

### Common Easing Values

| Easing | Description |
|--------|-------------|
| `"linear"` | Constant speed. |
| `"easeIn"` | Slow start. |
| `"easeOut"` | Slow end. |
| `"easeInOut"` | Slow start and end. |
| `"circIn"`, `"circOut"`, `"circInOut"` | Circular curve. |
| `"backIn"`, `"backOut"`, `"backInOut"` | Overshoot effect. |
| `"anticipate"` | Anticipation before motion. |
| `[0.17, 0.67, 0.83, 0.67]` | Custom cubic bezier. |

## Spring Transitions

Springs are the default and create natural, organic motion.

```jsx
<motion.div
  animate={{ x: 100 }}
  transition={{
    type: "spring",
    stiffness: 100,    // Spring "tightness" (default: 100)
    damping: 10,       // Friction (default: 10)
    mass: 1,           // Virtual mass (default: 1)
    velocity: 0,       // Initial velocity
    restDelta: 0.01,   // End threshold
    restSpeed: 0.01    // Speed threshold
  }}
/>
```

### Presets: `bounce` and `duration`

```jsx
// Control spring feel with bounce (0-1, higher = bouncier)
transition={{ type: "spring", bounce: 0.5 }}

// Or set duration (spring will still feel natural)
transition={{ type: "spring", duration: 0.8, bounce: 0.25 }}
```

### Spring Parameter Guide

| Effect | Stiffness | Damping |
|--------|-----------|---------|
| Snappy | 300-500 | 20-30 |
| Smooth | 100-200 | 15-25 |
| Bouncy | 200-400 | 5-15 |
| Gentle | 50-100 | 10-15 |

## Inertia Transitions

Used for momentum after gestures (drag, scroll).

```jsx
<motion.div
  drag
  dragTransition={{
    power: 0.8,           // Multiplier for velocity
    timeConstant: 700,    // Duration of deceleration
    modifyTarget: (v) => Math.round(v / 100) * 100 // Snap to grid
  }}
/>
```

## Per-Property Transitions

Animate different properties with different transitions:

```jsx
<motion.div
  animate={{ x: 100, opacity: 0.5, scale: 1.2 }}
  transition={{
    // Default for all
    duration: 0.5,
    // Override for specific properties
    x: { type: "spring", stiffness: 300 },
    opacity: { duration: 0.2 },
    scale: { type: "spring", bounce: 0.6 }
  }}
/>
```

## Repeating Animations

```jsx
<motion.div
  animate={{ rotate: 360 }}
  transition={{
    repeat: Infinity,       // Number of repeats (or Infinity)
    repeatType: "loop",     // "loop" | "reverse" | "mirror"
    repeatDelay: 0.5,       // Delay between repeats
    duration: 2
  }}
/>
```

| `repeatType` | Behavior |
|--------------|----------|
| `"loop"` | Restart from initial. |
| `"reverse"` | Alternate direction. |
| `"mirror"` | Mirror the animation (same as reverse). |
