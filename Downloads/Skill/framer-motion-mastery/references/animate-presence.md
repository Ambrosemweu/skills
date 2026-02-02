# AnimatePresence

Animate components when they're removed from the React tree.

## Basic Exit Animation

```jsx
import { AnimatePresence, motion } from "framer-motion"

function Modal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={onClose}
        >
          Modal Content
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

## `mode` Prop

Control how entering/exiting elements animate relative to each other.

| Mode | Behavior |
|------|----------|
| `"sync"` (default) | Enter and exit simultaneously. |
| `"wait"` | Wait for exit to complete before entering. |
| `"popLayout"` | Exiting elements are "popped" from layout. |

```jsx
<AnimatePresence mode="wait">
  <motion.div key={currentPage}>
    {/* Page transitions */}
  </motion.div>
</AnimatePresence>
```

## Callbacks

```jsx
<AnimatePresence
  onExitComplete={() => console.log("Exit animation finished")}
>
  {/* ... */}
</AnimatePresence>
```

## Page Transitions

```jsx
import { useLocation } from "react-router-dom"

function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.3 }}
      >
        <Routes location={location}>
          {/* Routes */}
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}
```
