# Gestures & Drag

## Gestures

Framer Motion detects gestures and triggers animations.

### Gesture Props

| Prop | Trigger |
|------|---------|
| `whileHover` | Mouse enters element. |
| `whileTap` | Element is pressed. |
| `whileDrag` | Element is being dragged. |
| `whileFocus` | Element has focus. |
| `whileInView` | Element enters viewport. |

### Hover & Tap

```jsx
<motion.button
  whileHover={{
    scale: 1.1,
    backgroundColor: "#3498db"
  }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
  Click Me
</motion.button>
```

### Gesture Callbacks

```jsx
<motion.div
  onHoverStart={() => console.log("Hover start")}
  onHoverEnd={() => console.log("Hover end")}
  onTap={() => console.log("Tapped")}
  onTapStart={() => console.log("Tap start")}
  onTapCancel={() => console.log("Tap cancelled")}
/>
```

### Focus

```jsx
<motion.input
  whileFocus={{
    scale: 1.02,
    boxShadow: "0 0 0 2px rgba(52, 152, 219, 0.5)"
  }}
  placeholder="Focus me"
/>
```

### Combining Gestures with Variants

```jsx
const buttonVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.1 },
  pressed: { scale: 0.95 }
}

<motion.button
  variants={buttonVariants}
  initial="rest"
  whileHover="hover"
  whileTap="pressed"
>
  Hover and Click
</motion.button>
```

---

## Drag

Make elements draggable with physics-based motion.

### Basic Drag

```jsx
<motion.div
  drag          // Enable both axes
  // drag="x"   // Horizontal only
  // drag="y"   // Vertical only
/>
```

### Drag Constraints

Limit drag area with a ref or pixel values:

```jsx
import { useRef } from "react"

function DragWithinContainer() {
  const constraintsRef = useRef(null)

  return (
    <motion.div
      ref={constraintsRef}
      style={{ width: 400, height: 400, backgroundColor: "#eee" }}
    >
      <motion.div
        drag
        dragConstraints={constraintsRef}
        style={{ width: 100, height: 100, backgroundColor: "#3498db" }}
      />
    </motion.div>
  )
}

// Or with pixel values
<motion.div
  drag
  dragConstraints={{ top: -50, left: -50, right: 50, bottom: 50 }}
/>
```

### Drag Props Reference

| Prop | Type | Description |
|------|------|-------------|
| `drag` | boolean \| `"x"` \| `"y"` | Enable dragging. |
| `dragConstraints` | Ref \| object | Limit drag area. |
| `dragElastic` | number (0-1) | How far element can be dragged outside constraints. |
| `dragMomentum` | boolean | Enable momentum after release (default: true). |
| `dragSnapToOrigin` | boolean | Snap back to start on release. |
| `dragTransition` | object | Inertia transition for momentum. |
| `dragDirectionLock` | boolean | Lock to single axis on drag. |
| `dragListener` | boolean | Enable/disable drag detection. |
| `dragControls` | DragControls | Programmatically control drag. |

### Drag Callbacks

```jsx
<motion.div
  drag
  onDrag={(event, info) => {
    console.log(info.point.x, info.point.y)  // Current position
    console.log(info.delta.x, info.delta.y)  // Change since last frame
    console.log(info.offset.x, info.offset.y) // Offset from origin
    console.log(info.velocity.x, info.velocity.y)
  }}
  onDragStart={(event, info) => console.log("Start")}
  onDragEnd={(event, info) => console.log("End")}
/>
```

### Drag with Snap Points

```jsx
<motion.div
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
  dragElastic={0.5}
  dragTransition={{
    bounceStiffness: 600,
    bounceDamping: 20,
    power: 0.2,
    timeConstant: 200,
    modifyTarget: (target) => Math.round(target / 200) * 200 // Snap to 200px grid
  }}
/>
```

### Programmatic Drag Control

```jsx
import { motion, useDragControls } from "framer-motion"

function DragFromHandle() {
  const dragControls = useDragControls()

  return (
    <>
      <div
        onPointerDown={(e) => dragControls.start(e)}
        style={{ cursor: "grab" }}
      >
        🔲 Drag Handle
      </div>
      <motion.div
        drag
        dragControls={dragControls}
        dragListener={false} // Disable default drag listener
        style={{ width: 100, height: 100, backgroundColor: "blue" }}
      />
    </>
  )
}
```
