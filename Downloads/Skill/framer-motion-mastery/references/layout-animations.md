# Layout Animations

Animate layout changes (position, size) with hardware-accelerated transforms.

## Basic Layout Animation

```jsx
function ExpandingCard({ isExpanded }) {
  return (
    <motion.div
      layout  // ← Magic prop!
      style={{
        width: isExpanded ? 400 : 200,
        height: isExpanded ? 300 : 100
      }}
    />
  )
}
```

## `layout` Prop Options

| Value | Behavior |
|-------|----------|
| `true` | Animate both position and size. |
| `"position"` | Animate only position changes. |
| `"size"` | Animate only size changes. |
| `"preserve-aspect"` | Maintain aspect ratio during animation. |

## `layoutId` — Shared Element Transitions

Animate elements between different components/positions:

```jsx
function Tabs() {
  const [selected, setSelected] = useState(0)

  return (
    <div style={{ display: "flex" }}>
      {["Tab 1", "Tab 2", "Tab 3"].map((tab, i) => (
        <button key={i} onClick={() => setSelected(i)}>
          {tab}
          {selected === i && (
            <motion.div
              layoutId="underline"  // Same ID = shared element
              style={{
                height: 3,
                backgroundColor: "#3498db",
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0
              }}
            />
          )}
        </button>
      ))}
    </div>
  )
}
```

## Card Expand Transition

```jsx
function CardList() {
  const [selectedId, setSelectedId] = useState(null)

  return (
    <>
      {items.map((item) => (
        <motion.div
          key={item.id}
          layoutId={item.id}
          onClick={() => setSelectedId(item.id)}
        >
          <motion.h2 layoutId={`title-${item.id}`}>{item.title}</motion.h2>
        </motion.div>
      ))}

      <AnimatePresence>
        {selectedId && (
          <motion.div layoutId={selectedId} className="expanded-card">
            <motion.h2 layoutId={`title-${selectedId}`}>
              {items.find((i) => i.id === selectedId).title}
            </motion.h2>
            <motion.p>{/* Full content */}</motion.p>
            <button onClick={() => setSelectedId(null)}>Close</button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
```

## Layout Transition Customization

```jsx
<motion.div
  layout
  transition={{
    layout: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }}
/>
```

## LayoutGroup — Coordinate Multiple Layouts

```jsx
import { LayoutGroup } from "framer-motion"

function App() {
  return (
    <LayoutGroup>
      <Sidebar />
      <MainContent />
    </LayoutGroup>
  )
}
```
