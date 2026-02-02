# Scroll Animations

## `whileInView` — Animate on Scroll Into View

```jsx
<motion.div
  initial={{ opacity: 0, y: 100 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{
    once: true,       // Only animate once
    margin: "-100px", // Trigger 100px before entering
    amount: 0.5       // Require 50% visibility (0-1)
  }}
  transition={{ duration: 0.6 }}
>
  Scroll to reveal
</motion.div>
```

## Viewport Options

| Option | Type | Description |
|--------|------|-------------|
| `once` | boolean | Animate only the first time element enters. |
| `margin` | string | Adjust trigger point (CSS margin syntax). |
| `amount` | number \| `"some"` \| `"all"` | Required visibility percent. |
| `root` | RefObject | Custom scroll container. |

## `useScroll` — Scroll Progress

Track scroll position with a `MotionValue`.

```jsx
import { motion, useScroll, useTransform } from "framer-motion"

function ProgressBar() {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 5,
        backgroundColor: "#3498db",
        scaleX: scrollYProgress,
        transformOrigin: "left"
      }}
    />
  )
}
```

## `useScroll` Options

```jsx
const { scrollYProgress } = useScroll({
  // Target element to track (default: window)
  target: elementRef,
  
  // Container element (default: nearest scrollable ancestor)
  container: containerRef,
  
  // Scroll offset configuration
  offset: ["start end", "end start"]
  // ^ Format: [targetStart containerEnd, targetEnd containerStart]
})
```

## Scroll Offset Reference

| Offset | Description |
|--------|-------------|
| `"start"` | Top edge of element. |
| `"center"` | Center of element. |
| `"end"` | Bottom edge of element. |
| `"0px"` | Exact pixel value. |
| `"50%"` | Percentage of element. |

```jsx
offset: [
  "start end",    // When target's start reaches container's end (enters)
  "end start"     // When target's end reaches container's start (exits)
]
```

## Parallax Effect

```jsx
function Parallax() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["-25%", "25%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1, 0.5])

  return (
    <div ref={ref} style={{ height: "100vh", overflow: "hidden" }}>
      <motion.img
        src="/image.jpg"
        style={{ y, opacity }}
      />
    </div>
  )
}
```

## Scroll-Linked Element Animation

```jsx
function ScrollText() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.25"]
  })

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1])
  const x = useTransform(scrollYProgress, [0, 1], [-100, 0])

  return (
    <motion.h1 ref={ref} style={{ scale, x }}>
      Scroll-Linked Heading
    </motion.h1>
  )
}
```
