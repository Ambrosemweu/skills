---
name: framer-motion-mastery
description: Comprehensive skill for creating production-ready animations in React with Framer Motion. Covers fundamentals through advanced 3D transforms, scroll-linked animations, layout morphing, and performance optimization. Use when building React UIs that need gesture animations, drag-and-drop, scroll effects, layout morphing, shared element transitions, or exit animations.
---

# Framer Motion Mastery Skill

This skill provides comprehensive guidance for creating stunning, production-ready animations using Framer Motion in React.

## Table of Contents

1. [Getting Started](#getting-started)
2. [The Motion Component](#the-motion-component)
3. [Animation Props](#animation-props)
4. [Transitions](references/transitions.md) — Tween, spring, inertia, easing
5. [Keyframes](#keyframes)
6. [Variants & Orchestration](references/variants-orchestration.md) — Named states, staggering, parent-child coordination
7. [Gestures & Drag](references/gestures-drag.md) — Hover, tap, focus, drag constraints
8. [Scroll Animations](references/scroll-animations.md) — whileInView, useScroll, parallax
9. [Layout Animations](references/layout-animations.md) — layout prop, layoutId, shared elements
10. [AnimatePresence](references/animate-presence.md) — Exit animations, page transitions
11. [Hooks](references/hooks.md) — useMotionValue, useTransform, useSpring, useAnimationControls
12. [3D & SVG Animations](references/3d-svg-animations.md) — 3D transforms, path drawing
13. [Performance](references/performance.md) — GPU acceleration, LazyMotion, SSR
14. [Common Patterns](references/common-patterns.md) — Recipes for common UI animations
15. [API Quick Reference](references/api-quick-reference.md)
16. [Troubleshooting](references/troubleshooting.md)

---

## Getting Started

### Installation

```bash
npm install framer-motion
# or
yarn add framer-motion
# or
pnpm add framer-motion
```

### Basic Import

```jsx
import { motion } from "framer-motion"
```

### First Animation

```jsx
export function FadeIn() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      Hello World
    </motion.div>
  )
}
```

---

## The Motion Component

The `motion` component is the foundation of Framer Motion. It extends every HTML and SVG element with animation capabilities.

### Available Motion Elements

```jsx
// HTML elements
<motion.div />
<motion.span />
<motion.button />
<motion.ul />
<motion.li />
<motion.img />

// SVG elements
<motion.svg />
<motion.path />
<motion.circle />
```

### Custom Components

```jsx
const MyButton = React.forwardRef(({ children, style, ...props }, ref) => (
  <button ref={ref} style={style} {...props}>
    {children}
  </button>
))

const MotionButton = motion(MyButton)
```

---

## Animation Props

| Prop | Type | Description |
|------|------|-------------|
| `initial` | TargetAndTransition \| boolean | Initial state before animation. Set `false` to skip. |
| `animate` | TargetAndTransition | Target animation state. |
| `exit` | TargetAndTransition | State when removed (requires `AnimatePresence`). |
| `transition` | Transition | How to animate (duration, easing, etc.). |
| `style` | MotionStyle | Inline styles, can include `MotionValue`. |

### GPU-Accelerated Properties (Prefer These)

| Property | Example |
|----------|---------|
| `x`, `y`, `z` | `{ x: 100 }` — translateX/Y/Z |
| `rotate`, `rotateX`, `rotateY`, `rotateZ` | `{ rotate: 90 }` |
| `scale`, `scaleX`, `scaleY` | `{ scale: 1.5 }` |
| `opacity` | `{ opacity: 0.5 }` |

### Example: Multi-Property Animation

```jsx
<motion.div
  initial={{
    opacity: 0,
    x: -100,
    scale: 0.5
  }}
  animate={{
    opacity: 1,
    x: 0,
    scale: 1
  }}
/>
```

---

## Keyframes

Animate through multiple values using arrays.

```jsx
<motion.div
  animate={{
    x: [0, 100, 50, 100],
    rotate: [0, 90, 180, 270, 360]
  }}
  transition={{ duration: 2 }}
/>
```

### Keyframe Offsets with `times`

```jsx
<motion.div
  animate={{
    x: [0, 100, 100, 0],
    y: [0, 0, 100, 100]
  }}
  transition={{
    duration: 4,
    times: [0, 0.25, 0.75, 1],
    ease: "easeInOut"
  }}
/>
```

---

## Quick Reference

### Animation Lifecycle

```
initial → animate → (whileHover/whileTap/whileDrag/whileInView) → exit
```

### Import Cheatsheet

```jsx
import {
  // Core
  motion,
  AnimatePresence,
  LayoutGroup,
  
  // Hooks
  useMotionValue,
  useTransform,
  useSpring,
  useVelocity,
  useScroll,
  useAnimationControls,
  useReducedMotion,
  useDragControls,
  
  // Lazy loading
  LazyMotion,
  domAnimation,
  domMax,
  m
} from "framer-motion"
```

### Debugging Tips

1. Add `transition={{ duration: 2 }}` to slow down animations.
2. Use browser DevTools "Animations" panel.
3. Check for missing `key` props in lists with `AnimatePresence`.
4. Ensure `layoutId` values are unique across the entire app.

---

## Interactive Examples

Located in the `assets/` folder:
- [Staggered List Animation](assets/staggered-list-animation.html)
- [Drag Gesture Demo](assets/drag-gesture-demo.html)
- [Scroll Progress Animation](assets/scroll-progress-animation.html)
- [Shared Layout Animation](assets/shared-layout-animation.html)
- [AnimatePresence Modal](assets/animate-presence-modal.html)
