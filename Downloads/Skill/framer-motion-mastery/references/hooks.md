# Hooks

## `useMotionValue`

Create an animatable value that doesn't trigger re-renders.

```jsx
import { motion, useMotionValue } from "framer-motion"

function Slider() {
  const x = useMotionValue(0)

  return (
    <motion.div
      drag="x"
      style={{ x }}
      dragConstraints={{ left: 0, right: 200 }}
    />
  )
}
```

## `useTransform`

Derive new values from motion values.

```jsx
import { motion, useMotionValue, useTransform } from "framer-motion"

function ColorfulDrag() {
  const x = useMotionValue(0)

  // Map x to opacity (0→1 as x goes -200→200)
  const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0])

  // Map x to color
  const backgroundColor = useTransform(
    x,
    [-200, 0, 200],
    ["#ff0000", "#00ff00", "#0000ff"]
  )

  return (
    <motion.div
      drag="x"
      style={{ x, opacity, backgroundColor }}
    />
  )
}
```

## `useSpring`

Create a spring-animated motion value that follows another.

```jsx
import { motion, useMotionValue, useSpring } from "framer-motion"

function SmoothFollower() {
  const x = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 30 })

  return (
    <>
      <motion.div drag="x" style={{ x }} />
      {/* This follows smoothly */}
      <motion.div style={{ x: springX }} />
    </>
  )
}
```

## `useVelocity`

Get the velocity of a motion value.

```jsx
import { useMotionValue, useVelocity, useTransform } from "framer-motion"

function VelocityScale() {
  const x = useMotionValue(0)
  const xVelocity = useVelocity(x)
  const scale = useTransform(xVelocity, [-1000, 0, 1000], [0.5, 1, 0.5])

  return <motion.div drag="x" style={{ x, scale }} />
}
```

## `useAnimationControls`

Programmatically control animations.

```jsx
import { motion, useAnimationControls } from "framer-motion"

function ControlledAnimation() {
  const controls = useAnimationControls()

  const handleClick = async () => {
    await controls.start({ x: 100 })
    await controls.start({ y: 100 })
    controls.start({ x: 0, y: 0 })
  }

  return (
    <>
      <motion.div animate={controls} />
      <button onClick={handleClick}>Animate Sequence</button>
    </>
  )
}
```

## Controls API

```jsx
// Start animation
controls.start({ x: 100 })
controls.start("variantName")

// Stop all animations
controls.stop()

// Set value immediately (no animation)
controls.set({ x: 0 })
```
