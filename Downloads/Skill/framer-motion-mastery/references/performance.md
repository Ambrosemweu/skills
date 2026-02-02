# Performance Optimization

## GPU-Accelerated Properties

Always prefer these for smooth 60fps:

| Property | Instead of |
|----------|-----------|
| `x`, `y` | `left`, `top` |
| `scale` | `width`, `height` |
| `opacity` | — |
| `rotate` | — |

## `will-change` Hint

```jsx
<motion.div
  style={{ willChange: "transform" }}
  animate={{ x: 100 }}
/>
```

## LazyMotion — Reduce Bundle Size

Only load animation features you need:

```jsx
import { LazyMotion, domAnimation, m } from "framer-motion"

// Use 'm' instead of 'motion' with LazyMotion
function App() {
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
    </LazyMotion>
  )
}
```

| Feature Bundle | Size | Includes |
|----------------|------|----------|
| `domAnimation` | ~17kb | Most features except drag and layout. |
| `domMax` | ~27kb | All features. |

## Avoiding Re-Renders

1. Use `useMotionValue` for values that change frequently.
2. Use `useTransform` to derive values without state.
3. Use `useAnimationControls` instead of state-driven animations when possible.

```jsx
// ❌ Bad: Causes re-renders
const [x, setX] = useState(0)

// ✅ Good: No re-renders
const x = useMotionValue(0)
```

## Hardware Acceleration Tips

1. Avoid animating `box-shadow`, `filter`, `backdrop-filter` (slow).
2. Use `scale` instead of `width`/`height`.
3. Use `opacity` and `transform` together for complex fades.
4. Limit the number of simultaneously animating elements.

## Server-Side Rendering

### Disable Initial Animation for SSR

```jsx
<motion.div
  initial={false}  // Skip initial animation (hydration safe)
  animate={{ opacity: 1 }}
/>
```

### `useReducedMotion`

Respect user's "prefers-reduced-motion" setting:

```jsx
import { useReducedMotion } from "framer-motion"

function AccessibleComponent() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      animate={{ x: shouldReduceMotion ? 0 : 100 }}
    />
  )
}
```
