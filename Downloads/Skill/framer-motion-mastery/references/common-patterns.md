# Common Patterns & Recipes

## Staggered List Appear

```jsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

function List({ items }) {
  return (
    <motion.ul variants={container} initial="hidden" animate="show">
      {items.map((i) => (
        <motion.li key={i} variants={item}>{i}</motion.li>
      ))}
    </motion.ul>
  )
}
```

## Reveal on Scroll

```jsx
<motion.section
  initial={{ opacity: 0, y: 75 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.5, delay: 0.25 }}
>
  Content reveals on scroll
</motion.section>
```

## Notification Toast

```jsx
<AnimatePresence>
  {showToast && (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
    >
      Toast Message
    </motion.div>
  )}
</AnimatePresence>
```

## Button Hover Effect

```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
  Click Me
</motion.button>
```

## Accordion

```jsx
function Accordion({ isOpen, children }) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{ overflow: "hidden" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

## Skeleton Loading Pulse

```jsx
<motion.div
  animate={{ opacity: [0.5, 1, 0.5] }}
  transition={{
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut"
  }}
  style={{
    backgroundColor: "#e0e0e0",
    borderRadius: 4
  }}
/>
```

## Confetti Explosion

```jsx
function Confetti() {
  return (
    <>
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 1,
            x: 0,
            y: 0,
            scale: 0
          }}
          animate={{
            opacity: 0,
            x: (Math.random() - 0.5) * 500,
            y: (Math.random() - 0.5) * 500,
            scale: Math.random() * 2
          }}
          transition={{
            duration: 1,
            ease: "easeOut"
          }}
          style={{
            position: "absolute",
            width: 10,
            height: 10,
            backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
            borderRadius: "50%"
          }}
        />
      ))}
    </>
  )
}
```
