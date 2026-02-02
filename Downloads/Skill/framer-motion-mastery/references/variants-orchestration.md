# Variants & Orchestration

## Variants

Variants are named animation states. They enable:
1. Cleaner code (reusable animation definitions).
2. Parent-child orchestration (propagation).
3. State-driven animations.

### Basic Variants

```jsx
const boxVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1 }
}

function Box() {
  return (
    <motion.div
      variants={boxVariants}
      initial="hidden"
      animate="visible"
    />
  )
}
```

### Variants with Transitions

```jsx
const variants = {
  hidden: {
    opacity: 0,
    y: 50,
    transition: { duration: 0.3 }
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
}
```

### Dynamic Variants with Functions

Pass data via the `custom` prop:

```jsx
const variants = {
  hidden: { opacity: 0, y: 50 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.1 }
  })
}

function List({ items }) {
  return (
    <ul>
      {items.map((item, index) => (
        <motion.li
          key={item.id}
          custom={index}
          variants={variants}
          initial="hidden"
          animate="visible"
        >
          {item.text}
        </motion.li>
      ))}
    </ul>
  )
}
```

---

## Orchestration

Orchestration controls **when** child animations occur relative to their parent.

### Staggering Children

```jsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,     // Delay between each child
      delayChildren: 0.3        // Delay before first child
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

function List() {
  return (
    <motion.ul
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.li variants={itemVariants}>Item 1</motion.li>
      <motion.li variants={itemVariants}>Item 2</motion.li>
      <motion.li variants={itemVariants}>Item 3</motion.li>
    </motion.ul>
  )
}
```

### Reverse Stagger

```jsx
const containerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.1,
      staggerDirection: -1  // Reverse order (last child first)
    }
  }
}
```

### `when` — Control Animation Order

```jsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",  // Parent animates first
      staggerChildren: 0.1
    }
  }
}

// Or animate parent after children
const exitVariants = {
  exit: {
    opacity: 0,
    transition: {
      when: "afterChildren"
    }
  }
}
```

| `when` Value | Behavior |
|--------------|----------|
| `"beforeChildren"` | Parent animates first, then children. |
| `"afterChildren"` | Children animate first, then parent. |
| (default) | All animate simultaneously. |

### Orchestration Options Reference

| Option | Type | Description |
|--------|------|-------------|
| `staggerChildren` | number | Delay between children (seconds). |
| `staggerDirection` | 1 \| -1 | Direction of stagger. |
| `delayChildren` | number | Delay before first child starts. |
| `when` | `"beforeChildren"` \| `"afterChildren"` | Order of parent vs children. |
