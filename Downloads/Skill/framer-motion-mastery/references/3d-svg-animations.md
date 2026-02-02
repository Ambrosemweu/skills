# 3D & SVG Animations

## 3D Transforms

Framer Motion supports 3D CSS transforms.

### 3D Rotation

```jsx
<motion.div
  animate={{
    rotateX: 45,
    rotateY: 45,
    rotateZ: 15
  }}
  style={{ perspective: 1000 }}
/>
```

**Important**: Set `perspective` on the parent for 3D effects to be visible.

### `z` and `translateZ`

```jsx
<motion.div
  whileHover={{ z: 50 }}
  style={{ perspective: 1000 }}
/>
```

### Card Flip

```jsx
function FlipCard({ isFlipped }) {
  return (
    <div style={{ perspective: 1000 }}>
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div style={{ backfaceVisibility: "hidden" }}>
          Front
        </div>
        <div style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          position: "absolute"
        }}>
          Back
        </div>
      </motion.div>
    </div>
  )
}
```

### `transformPerspective`

Apply perspective to a single element:

```jsx
<motion.div
  animate={{ rotateY: 45 }}
  style={{ transformPerspective: 1000 }}
/>
```

---

## SVG Animations

Framer Motion provides special SVG animation capabilities.

### Path Drawing (`pathLength`)

```jsx
<motion.svg width="200" height="200" viewBox="0 0 200 200">
  <motion.path
    d="M 10 80 Q 95 10 180 80"
    fill="transparent"
    stroke="#3498db"
    strokeWidth="4"
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{ duration: 2, ease: "easeInOut" }}
  />
</motion.svg>
```

### SVG Morphing

```jsx
<motion.path
  animate={{
    d: isToggled
      ? "M 0 100 L 50 0 L 100 100 Z"   // Triangle
      : "M 0 0 L 100 0 L 100 100 L 0 100 Z" // Square
  }}
/>
```

### SVG Path Properties

| Property | Description |
|----------|-------------|
| `pathLength` | Animatable 0-1 path drawing progress. |
| `pathSpacing` | Gap between dashes. |
| `pathOffset` | Offset of path start. |
