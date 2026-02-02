# Framer Motion - Troubleshooting Guide

## Common Issues and Solutions

---

## Animation Not Playing

### Issue: Element doesn't animate

**Possible Causes:**
1. Missing motion wrapper
2. Invalid prop values
3. Conflicting styles

**Solutions:**
```jsx
// 1. Use motion component, not regular div
// ❌ Bad
<div animate={{ opacity: 1 }} />

// ✅ Good
<motion.div animate={{ opacity: 1 }} />

// 2. Check initial state differs from animate
// ❌ Bad (same values)
<motion.div initial={{ x: 0 }} animate={{ x: 0 }} />

// ✅ Good
<motion.div initial={{ x: -100 }} animate={{ x: 0 }} />

// 3. Avoid conflicting CSS
// ❌ Bad (CSS overrides transform)
<motion.div animate={{ x: 100 }} style={{ transform: "none !important" }} />
```

---

## Exit Animation Not Working

### Issue: Element disappears instantly without animating

**Cause:** Missing `AnimatePresence` wrapper or missing `key` prop.

**Solution:**
```jsx
import { AnimatePresence, motion } from "framer-motion"

// ✅ Correct pattern
<AnimatePresence>
  {isVisible && (
    <motion.div
      key="modal"  // <-- Required!
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}  // <-- Requires AnimatePresence
    />
  )}
</AnimatePresence>
```

---

## Layout Animation Glitches

### Issue: Elements jump or flash during layout animations

**Solutions:**
```jsx
// 1. Ensure all siblings have layout prop
<motion.div layout>
  <motion.div layout /> {/* All children need layout too */}
  <motion.div layout />
</motion.div>

// 2. Use LayoutGroup for coordinated animations
import { LayoutGroup } from "framer-motion"

<LayoutGroup>
  <Sidebar />
  <MainContent />
</LayoutGroup>

// 3. Add layoutScroll for scroll containers
<motion.div layout layoutScroll />

// 4. Use layout="position" if size shouldn't animate
<motion.div layout="position" />
```

---

## Shared Layout / layoutId Issues

### Issue: Elements don't morph between positions

**Solutions:**
```jsx
// 1. layoutId must be unique across entire app
// ❌ Bad
{items.map(item => <motion.div layoutId="card" />)}

// ✅ Good
{items.map(item => <motion.div layoutId={`card-${item.id}`} />)}

// 2. Elements must mount/unmount or change position
// The layoutId animation only triggers when the component
// with that layoutId changes its DOM position

// 3. Ensure AnimatePresence wraps changing elements
<AnimatePresence>
  {selectedId && (
    <motion.div layoutId={selectedId} />
  )}
</AnimatePresence>
```

---

## Spring Animation Feels Wrong

### Issue: Animation too bouncy, too stiff, or doesn't settle

**Solutions:**
```jsx
// Too bouncy → Increase damping
transition={{ type: "spring", stiffness: 300, damping: 30 }}

// Too stiff → Decrease stiffness, decrease damping
transition={{ type: "spring", stiffness: 100, damping: 15 }}

// Doesn't settle → Increase restDelta
transition={{ type: "spring", restDelta: 0.5 }}

// Use bounce + duration for easier tuning
transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
```

---

## Variants Not Propagating to Children

### Issue: Children don't receive parent variant states

**Cause:** Children must have `variants` prop with matching keys.

**Solution:**
```jsx
const parent = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

const child = {
  hidden: { y: 20 },   // Must match parent keys!
  visible: { y: 0 }
}

<motion.div variants={parent} initial="hidden" animate="visible">
  <motion.div variants={child} />  {/* Inherits "hidden"/"visible" from parent */}
</motion.div>
```

---

## Drag Not Working

### Issue: Element is not draggable

**Solutions:**
```jsx
// 1. Add drag prop
<motion.div drag />

// 2. Check for touch-action CSS
// ❌ Bad
<motion.div drag style={{ touchAction: "none" }} />

// 3. Make sure element is not inside a scrollable container
// that captures the events

// 4. Use dragListener if using dragControls
const controls = useDragControls()
<motion.div
  drag
  dragControls={controls}
  dragListener={false}  // <-- Set to false when using controls
/>
```

---

## useScroll Not Updating

### Issue: `scrollYProgress` stays at 0

**Solutions:**
```jsx
// 1. Target element must be in DOM
const ref = useRef(null)
const { scrollYProgress } = useScroll({ target: ref })

return <motion.div ref={ref} /> // <-- Must attach ref!

// 2. Container must be scrollable
// The default container is the viewport

// 3. Check offset configuration
const { scrollYProgress } = useScroll({
  target: ref,
  offset: ["start end", "end start"]
  // ^ Element start enters viewport end, element end exits viewport start
})
```

---

## SSR Hydration Mismatch

### Issue: Warning about hydration mismatch with Next.js

**Solution:**
```jsx
// Disable initial animation
<motion.div
  initial={false}  // <-- Prevents animation on mount
  animate={{ opacity: 1 }}
/>

// Or use suppressHydrationWarning for dynamic values
<motion.div
  suppressHydrationWarning
  style={{ transform: "translateX(0px)" }}
/>
```

---

## Performance Issues

### Issue: Animations are janky or cause lag

**Solutions:**
```jsx
// 1. Animate only GPU-accelerated properties
// ✅ Fast: x, y, scale, rotate, opacity
// ❌ Slow: width, height, top, left, backgroundColor

// 2. Use will-change for complex animations
<motion.div style={{ willChange: "transform" }} />

// 3. Reduce concurrent animations
// Limit the number of elements animating at once

// 4. Use LazyMotion to reduce bundle size
import { LazyMotion, domAnimation, m } from "framer-motion"

<LazyMotion features={domAnimation}>
  <m.div animate={{ x: 100 }} />
</LazyMotion>

// 5. Avoid creating new objects every render
// ❌ Bad
<motion.div animate={{ x: state ? 100 : 0 }} />

// ✅ Good
const animate = useMemo(() => ({ x: state ? 100 : 0 }), [state])
<motion.div animate={animate} />
```

---

## TypeScript Errors

### Issue: Type errors with motion components

**Solutions:**
```tsx
// 1. Custom component wrapping
import { motion, HTMLMotionProps } from "framer-motion"

interface Props extends HTMLMotionProps<"div"> {
  customProp: string
}

const MyComponent = motion.create(
  React.forwardRef<HTMLDivElement, Props>((props, ref) => (
    <div ref={ref} {...props} />
  ))
)

// 2. Variants typing
import { Variants } from "framer-motion"

const variants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

// 3. MotionValue typing
import { MotionValue } from "framer-motion"

const x: MotionValue<number> = useMotionValue(0)
```

---

## AnimatePresence mode="wait" Slow

### Issue: Transitions feel sluggish with mode="wait"

**Solution:**
```jsx
// Reduce exit duration
<AnimatePresence mode="wait">
  <motion.div
    key={page}
    exit={{ opacity: 0, transition: { duration: 0.1 } }}  // Quick exit
    initial={{ opacity: 0 }}
    animate={{ opacity: 1, transition: { duration: 0.3 } }}
  />
</AnimatePresence>
```

---

## Debug Tips

### Log MotionValue changes
```jsx
const x = useMotionValue(0)

useEffect(() => {
  return x.on("change", (latest) => {
    console.log("x:", latest)
  })
}, [x])
```

### Slow down animations for debugging
```jsx
<motion.div
  animate={{ x: 100 }}
  transition={{ duration: 5 }}  // 5 seconds
/>
```

### Check reduced motion preference
```jsx
import { useReducedMotion } from "framer-motion"

function MyComponent() {
  const shouldReduceMotion = useReducedMotion()
  console.log("Prefers reduced motion:", shouldReduceMotion)
}
```

---

## Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [GitHub Issues](https://github.com/framer/motion/issues)
- [Discord Community](https://discord.gg/framer)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/framer-motion)
