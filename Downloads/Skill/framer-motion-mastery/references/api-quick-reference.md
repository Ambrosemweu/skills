# Framer Motion - API Quick Reference

## Imports

```jsx
import {
  motion,
  AnimatePresence,
  LayoutGroup,
  LazyMotion,
  domAnimation,
  domMax,
  m,
  useMotionValue,
  useTransform,
  useSpring,
  useVelocity,
  useScroll,
  useAnimationControls,
  useReducedMotion,
  useDragControls,
  useInView
} from "framer-motion"
```

---

## Motion Component

```jsx
<motion.div
  // State props
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  
  // Transition
  transition={{ duration: 0.5 }}
  
  // Variants
  variants={myVariants}
  custom={index}
  
  // Gestures
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.9 }}
  whileFocus={{ borderColor: "blue" }}
  whileDrag={{ scale: 1.05 }}
  whileInView={{ opacity: 1 }}
  
  // Layout
  layout
  layoutId="unique-id"
  
  // Style (accepts MotionValues)
  style={{ x, opacity }}
/>
```

---

## Transition Types

### Tween (Duration-based)
```jsx
transition={{
  type: "tween",
  duration: 0.5,
  delay: 0.2,
  ease: "easeInOut",
  repeat: 2,
  repeatType: "reverse",
  repeatDelay: 0.5
}}
```

### Spring (Physics-based)
```jsx
transition={{
  type: "spring",
  stiffness: 100,   // default: 100
  damping: 10,      // default: 10
  mass: 1,          // default: 1
  velocity: 0,
  restDelta: 0.01,
  restSpeed: 0.01,
  // Alternative:
  bounce: 0.5,      // 0-1
  duration: 0.8
}}
```

### Inertia (Momentum)
```jsx
dragTransition={{
  power: 0.8,
  timeConstant: 700,
  modifyTarget: (v) => Math.round(v / 100) * 100
}}
```

---

## Easing Values

| Easing | Description |
|--------|-------------|
| `"linear"` | Constant speed |
| `"easeIn"` | Slow start |
| `"easeOut"` | Slow end |
| `"easeInOut"` | Slow start and end |
| `"circIn"` / `"circOut"` / `"circInOut"` | Circular curve |
| `"backIn"` / `"backOut"` / `"backInOut"` | Overshoot |
| `"anticipate"` | Anticipation before motion |
| `[0.42, 0, 0.58, 1]` | Custom cubic bezier |

---

## Variants

```jsx
const variants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

<motion.div variants={variants} initial="hidden" animate="visible" />
```

---

## Orchestration

```jsx
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,      // Delay between children
      staggerDirection: 1,       // 1 or -1
      delayChildren: 0.3,        // Delay before first child
      when: "beforeChildren"     // or "afterChildren"
    }
  }
}
```

---

## Gesture Callbacks

```jsx
<motion.div
  // Hover
  onHoverStart={(event, info) => {}}
  onHoverEnd={(event, info) => {}}
  
  // Tap
  onTap={(event, info) => {}}
  onTapStart={(event, info) => {}}
  onTapCancel={(event, info) => {}}
  
  // Drag
  onDrag={(event, info) => {}}
  onDragStart={(event, info) => {}}
  onDragEnd={(event, info) => {}}
  onDirectionLock={(axis) => {}}
  
  // Pan
  onPan={(event, info) => {}}
  onPanStart={(event, info) => {}}
  onPanEnd={(event, info) => {}}
/>

// PanInfo shape:
// { point: {x, y}, delta: {x, y}, offset: {x, y}, velocity: {x, y} }
```

---

## Drag Props

```jsx
<motion.div
  drag                    // true | "x" | "y"
  dragConstraints={ref}   // Ref or { top, left, right, bottom }
  dragElastic={0.2}       // 0-1
  dragMomentum={true}     // Enable momentum
  dragSnapToOrigin        // Return to start
  dragDirectionLock       // Lock to single axis
  dragListener={true}     // Enable drag detection
  dragControls={controls} // Programmatic control
  dragPropagation         // Allow parent to drag
/>
```

---

## Scroll Hooks

### useScroll
```jsx
const { scrollX, scrollY, scrollXProgress, scrollYProgress } = useScroll()

// With element target
const { scrollYProgress } = useScroll({
  target: ref,
  container: containerRef,
  offset: ["start end", "end start"]
})
```

### Offset syntax
`[targetStart containerEnd, targetEnd containerStart]`

Values: `"start"`, `"center"`, `"end"`, `"0px"`, `"50%"`

---

## Layout Props

```jsx
<motion.div
  layout                  // true | "position" | "size" | "preserve-aspect"
  layoutId="unique-id"    // Shared element id
  layoutDependency={dep}  // Value that triggers layout animation
  layoutScroll            // Work in scroll containers
/>
```

---

## AnimatePresence

```jsx
<AnimatePresence
  mode="sync"            // "sync" | "wait" | "popLayout"
  initial={true}         // Animate on first render
  onExitComplete={() => {}}
  custom={direction}     // Pass to exit variants
>
  {isVisible && (
    <motion.div key="modal" exit={{ opacity: 0 }} />
  )}
</AnimatePresence>
```

---

## Hooks

### useMotionValue
```jsx
const x = useMotionValue(0)
x.get()       // Get current value
x.set(100)    // Set value
x.on("change", callback)
```

### useTransform
```jsx
const y = useTransform(x, [0, 100], [0, 50])
const color = useTransform(x, [0, 100], ["#f00", "#0f0"])

// With function
const custom = useTransform(x, (value) => value * 2)
```

### useSpring
```jsx
const springValue = useSpring(motionValue, {
  stiffness: 300,
  damping: 30,
  mass: 1
})
```

### useVelocity
```jsx
const velocity = useVelocity(motionValue)
```

### useAnimationControls
```jsx
const controls = useAnimationControls()

await controls.start({ x: 100 })
await controls.start("variantName")
controls.stop()
controls.set({ x: 0 })
```

### useReducedMotion
```jsx
const prefersReducedMotion = useReducedMotion()
```

### useInView
```jsx
const isInView = useInView(ref, {
  once: true,
  margin: "-100px",
  amount: "some"  // "some" | "all" | number
})
```

---

## SVG Animation

```jsx
<motion.path
  d="M 0 0 L 100 100"
  initial={{ pathLength: 0 }}
  animate={{ pathLength: 1 }}
/>

// Special properties
pathLength   // 0-1
pathSpacing  // Gap between dashes
pathOffset   // Offset of start
```

---

## LazyMotion

```jsx
import { LazyMotion, domAnimation, m } from "framer-motion"

// domAnimation (~17kb) - Most features
// domMax (~27kb) - All features including drag/layout

<LazyMotion features={domAnimation}>
  <m.div animate={{ opacity: 1 }} />
</LazyMotion>
```

---

## Animatable Properties

**GPU-Accelerated (Fast):**
- `x`, `y`, `z`
- `scale`, `scaleX`, `scaleY`
- `rotate`, `rotateX`, `rotateY`, `rotateZ`
- `skew`, `skewX`, `skewY`
- `opacity`

**Non-GPU (Slower):**
- `width`, `height`
- `top`, `left`, `right`, `bottom`
- `backgroundColor`, `color`, `borderColor`
- `borderRadius`, `boxShadow`
