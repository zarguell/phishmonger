# Phase 08: Deferred v1.0 Work - Research

**Researched:** 2026-01-21
**Domain:** Advanced React features - undo/redo, keyboard shortcuts, visual customization, custom libraries
**Confidence:** MEDIUM

## Summary

Phase 8 covers advanced features originally planned for v1.0 but deferred to v1.1. These features enhance user experience (undo/redo, keyboard shortcuts), visual customization (custom arrow styles, layout templates), and extensibility (custom techniques in library, library persistence). The research reveals well-established patterns in the React ecosystem for all these features, with multiple mature libraries available.

**Primary recommendation:** Implement features incrementally using established libraries (react-hotkeys-hook for shortcuts, custom useReducer wrapper for undo/redo, CSS modules for arrow styles) rather than building from scratch.

## Standard Stack

The established libraries/tools for this domain:

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-hotkeys-hook | 4.5+ | Global keyboard shortcuts | Declarative API, zero dependencies, most popular (3.5k+ GitHub stars) |
| useUndoable | Latest | Undo/redo functionality | Lightweight hook-based approach, hassle-free API |
| CSS Modules | Native | Custom arrow styling | Scoped styles, co-located with components |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Custom useReducer hook | - | Undo/redo with history | When need fine-grained control over state history |
| SVG for arrows | Native | Custom arrow graphics | When need scalable, customizable arrow markers |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-hotkeys-hook | react-keybinds | react-hotkeys-hook has better documentation and larger community |
| useUndoable | reddojs | useUndoable has React-specific API, reddojs is framework-agnostic |
| CSS Modules | CSS-in-JS (styled-components) | CSS Modules simpler, already in project, no runtime overhead |

**Installation:**

```bash
npm install react-hotkeys-hook
# For undo/redo, implement custom hook (no external library needed)
# Arrow styles: use existing CSS, no new dependencies
```

## Architecture Patterns

### Recommended Project Structure

```
src/
├── hooks/
│   ├── useUndoRedo.ts         # Undo/redo history management
│   ├── useKeyboardShortcuts.ts # Wrapper around react-hotkeys-hook
│   └── useCustomTechniques.ts  # Custom technique library management
├── components/
│   ├── shortcuts/
│   │   ├── KeyboardShortcutHelp.tsx  # Display available shortcuts
│   │   └── ShortcutKey.tsx           # Visual key cap component
│   ├── visualizer/
│   │   ├── ArrowStyleSelector.tsx    # UI for choosing arrow styles
│   │   └── LayoutTemplateSelector.tsx # UI for layout presets
│   └── library/
│       ├── CustomTechniqueEditor.tsx # Form to add/edit custom techniques
│       └── TechniqueLibrary.tsx      # View/manage all techniques
├── styles/
│   ├── arrows.module.css       # Scoped arrow style definitions
│   └── layouts.module.css      # Layout template styles
└── types/
    └── library.ts              # Type definitions for custom techniques
```

### Pattern 1: Undo/Redo with useReducer

**What:** Wrap existing state management with history tracking using useReducer's pure function pattern.

**When to use:** When you need to track and revert state changes across the application.

**Example:**

```typescript
// Source: Based on React 19 useReducer patterns (Dev.to, Aug 2025)
// https://dev.to/a1guy/react-19-useReducer-deep-dive-from-basics-to-complex-state-patterns-3fpi

interface HistoryState<T> {
  past: T[]
  present: T
  future: T[]
}

type HistoryAction<T> =
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET'; newState: T }
  | { type: 'CLEAR' }

function useUndoRedo<T>(initialState: T) {
  const [state, dispatch] = useReducer<
    Reducer<HistoryState<T>, HistoryAction<T>>
  >(
    (state, action) => {
      const { past, present, future } = state

      switch (action.type) {
        case 'UNDO':
          if (past.length === 0) return state
          const previous = past[past.length - 1]
          const newPast = past.slice(0, past.length - 1)
          return {
            past: newPast,
            present: previous,
            future: [present, ...future]
          }
        case 'REDO':
          if (future.length === 0) return state
          const next = future[0]
          const newFuture = future.slice(1)
          return {
            past: [...past, present],
            present: next,
            future: newFuture
          }
        case 'SET':
          return {
            past: [...past, present],
            present: action.newState,
            future: []
          }
        case 'CLEAR':
          return {
            past: [],
            present: initialState,
            future: []
          }
        default:
          return state
      }
    },
    { past: [], present: initialState, future: [] }
  )

  return {
    state: state.present,
    setState: (newState: T) => dispatch({ type: 'SET', newState }),
    undo: () => dispatch({ type: 'UNDO' }),
    redo: () => dispatch({ type: 'REDO' }),
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0
  }
}
```

### Pattern 2: Global Keyboard Shortcuts

**What:** Use react-hotkeys-hook for declarative keyboard shortcut definitions.

**When to use:** For global shortcuts (Ctrl+Z for undo, Ctrl+Shift+Z for redo) and component-specific shortcuts.

**Example:**

```typescript
// Source: react-hotkeys-hook official documentation
// https://react-hotkeys-hook.vercel.app/docs/api/use-hotkeys

import { useHotkeys } from 'react-hotkeys-hook'

function UndoRedoButtons() {
  const { undo, redo, canUndo, canRedo } = useUndoRedo(state)

  // Global shortcuts
  useHotkeys('ctrl+z, cmd+z', (e) => {
    e.preventDefault()
    undo()
  }, { enableOnFormTags: true }, [undo])

  useHotkeys('ctrl+shift+z, ctrl+y, cmd+shift+z, cmd+shift+y', (e) => {
    e.preventDefault()
    redo()
  }, { enableOnFormTags: true }, [redo])

  // Component shortcuts
  useHotkeys('escape', () => {
    // Cancel current action
  })

  return (
    <div>
      <button onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)">
        ↶ Undo
      </button>
      <button onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)">
        ↷ Redo
      </button>
    </div>
  )
}
```

### Pattern 3: Custom Arrow Styles with CSS Modules

**What:** Define arrow styles as CSS classes, apply conditionally based on user selection.

**When to use:** When users need customizable visual markers for annotations.

**Example:**

```typescript
// Source: CSS Modules best practices + arrow styling techniques
// https://freefrontend.com/css-arrows/

// arrows.module.css
.arrowBadge {
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* Style 1: Classic Circle */
.arrowBadge.classic {
  background: #3b82f6;
  color: white;
  border: 2px solid #2563eb;
}

/* Style 2: Square */
.arrowBadge.square {
  background: #10b981;
  color: white;
  border-radius: 4px;
  border: 2px solid #059669;
}

/* Style 3: Diamond */
.arrowBadge.diamond {
  background: #f59e0b;
  color: white;
  transform: rotate(45deg);
  border: 2px solid #d97706;
}

.arrowBadge.diamond span {
  transform: rotate(-45deg);
}

// Component usage
interface ArrowBadgeProps {
  number: number
  style: 'classic' | 'square' | 'diamond'
}

function ArrowBadge({ number, style }: ArrowBadgeProps) {
  return (
    <div className={`${styles.arrowBadge} ${styles[style]}`}>
      <span>{number}</span>
    </div>
  )
}
```

### Pattern 4: Layout Templates

**What:** Pre-defined CSS classes for common annotation layouts (balanced, wide-email, wide-annotations).

**When to use:** When users want quick layout presets instead of manual adjustment.

**Example:**

```typescript
// layouts.module.css
.slideWrapper {
  display: flex;
  gap: 40px;
  width: 1600px;
  height: 900px;
}

/* Template 1: Balanced (default) */
.slideWrapper.balanced {
  grid-template-columns: 1fr 400px;
}

/* Template 2: Wide Email */
.slideWrapper.wideEmail {
  grid-template-columns: 1.5fr 300px;
}

/* Template 3: Wide Annotations */
.slideWrapper.wideAnnotations {
  grid-template-columns: 1fr 500px;
}

/* Template 4: Stacked (mobile) */
.slideWrapper.stacked {
  flex-direction: column;
  grid-template-columns: 1fr;
}

// Component usage
function SlideWrapper({ layoutTemplate, children }: SlideWrapperProps) {
  return (
    <div className={`${styles.slideWrapper} ${styles[layoutTemplate]}`}>
      {children}
    </div>
  )
}
```

### Anti-Patterns to Avoid

- **Tight coupling undo/redo to specific state:** Instead, create a reusable hook that works with any state type
- **Hardcoding keyboard shortcuts:** Use a configuration object for easy customization
- **Inline arrow styles:** Co-locate styles in CSS modules for maintainability
- **Manual layout calculations:** Use CSS Grid/Flexbox templates instead of JS positioning

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Keyboard event handling | Custom event listeners | react-hotkeys-hook | Handles key combinations, modifiers, scoping, edge cases (e.g., input fields) |
| Undo/redo state management | Manual history arrays | Custom useReducer hook | Pure functions make history tracking trivial; avoids mutation bugs |
| Arrow styling from scratch | CSS border hacks | CSS Modules + Flexbox | Scoped, maintainable, supports animations |
| Layout templates | Manual pixel calculations | CSS Grid templates | Responsive, browser-optimized, easier to modify |

**Key insight:** All these features have well-established patterns in React. Custom solutions tend to miss edge cases (e.g., keyboard shortcuts in forms, undo/redo memory limits, responsive layouts).

## Common Pitfalls

### Pitfall 1: Memory Leaks in Undo/Redo History

**What goes wrong:** Unlimited history storage causes browser memory issues.

**Why it happens:** Every state change adds to history array without cleanup.

**How to avoid:** Implement history limits (e.g., 50 steps), use shallow copying for immutable state.

**Warning signs:** Performance degradation after extended editing sessions.

```typescript
// BAD: Unlimited history
const [history, setHistory] = useState([])

// GOOD: Limited history
const MAX_HISTORY = 50
useEffect(() => {
  if (history.length > MAX_HISTORY) {
    setHistory(prev => prev.slice(-MAX_HISTORY))
  }
}, [history])
```

### Pitfall 2: Keyboard Shortcuts Firing in Input Fields

**What goes wrong:** Ctrl+Z triggers undo while user is trying to undo text in a text field.

**Why it happens:** Global event listeners don't respect focus context.

**How to avoid:** Use `enableOnFormTags: false` in react-hotkeys-hook or check `document.activeElement`.

**Warning signs:** Users report "undo is broken" when typing.

```typescript
// BAD: Listens everywhere
useHotkeys('ctrl+z', handleUndo)

// GOOD: Respects form tags
useHotkeys('ctrl+z', handleUndo, { enableOnFormTags: false })
```

### Pitfall 3: Custom Techniques Breaking on Import

**What goes wrong:** User-defined techniques don't load after page refresh or project import.

**Why it happens:** Custom techniques stored in LocalStorage but not included in project JSON export.

**How to avoid:** Merge custom techniques into project export JSON, validate on import.

**Warning signs:** Custom techniques disappear after browser refresh.

```typescript
// BAD: Only saves built-in techniques
const project = {
  metadata,
  annotations,
  // Missing: customTechniques
}

// GOOD: Includes custom techniques
const project = {
  metadata,
  annotations,
  customTechniques, // Merge into export
  builtInTechniques: techniques // Reference only
}
```

### Pitfall 4: Arrow Style Clashes with Badge Numbers

**What goes wrong:** Custom arrow styles (e.g., diamond rotation) break number positioning.

**Why it happens:** Transform on parent affects child text rendering.

**How to avoid:** Counter-transform child elements, use flexbox centering.

**Warning signs:** Numbers appear off-center or rotated in custom badges.

```typescript
// BAD: Transform affects everything
.arrowBadge.diamond {
  transform: rotate(45deg);
}

// GOOD: Counter-transform child
.arrowBadge.diamond {
  transform: rotate(45deg);
}
.arrowBadge.diamond span {
  transform: rotate(-45deg); // Counter-rotate
}
```

## Code Examples

Verified patterns from official sources:

### Undo/Redo Hook with useReducer

```typescript
// Source: React 19 useReducer Deep Dive (Aug 2025)
// https://dev.to/a1guy/react-19-useReducer-deep-dive-from-basics-to-complex-state-patterns-3fpi

import { useReducer, useCallback } from 'react'

interface UndoRedoState<T> {
  past: T[]
  present: T
  future: T[]
}

export function useUndoRedo<T>(initialPresent: T) {
  const [state, dispatch] = useReducer(
    (state: UndoRedoState<T>, action: any) => {
      const { past, present, future } = state

      switch (action.type) {
        case 'UNDO':
          if (past.length === 0) return state
          const previous = past[past.length - 1]
          const newPast = past.slice(0, past.length - 1)
          return {
            past: newPast,
            present: previous,
            future: [present, ...future]
          }
        case 'REDO':
          if (future.length === 0) return state
          const next = future[0]
          const newFuture = future.slice(1)
          return {
            past: [...past, present],
            present: next,
            future: newFuture
          }
        case 'SET':
          return {
            past: [...past, present],
            present: action.newPresent,
            future: []
          }
        case 'CLEAR':
          return {
            past: [],
            present: action.initialPresent,
            future: []
          }
        default:
          return state
      }
    },
    { past: [], present: initialPresent, future: [] }
  )

  const undo = useCallback(() => dispatch({ type: 'UNDO' }), [])
  const redo = useCallback(() => dispatch({ type: 'REDO' }), [])
  const set = useCallback((newPresent: T) => dispatch({ type: 'SET', newPresent }), [])
  const clear = useCallback(() => dispatch({ type: 'CLEAR', initialPresent }), [])

  return {
    state: state.present,
    undo,
    redo,
    set,
    clear,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0
  }
}
```

### Keyboard Shortcuts Configuration

```typescript
// Source: react-hotkeys-hook documentation
// https://react-hotkeys-hook.vercel.app/docs/api/use-hotkeys

import { useHotkeys } from 'react-hotkeys-hook'

interface ShortcutConfig {
  key: string
  handler: () => void
  description: string
  enableOnFormTags?: boolean
}

const SHORTCUTS: ShortcutConfig[] = [
  { key: 'ctrl+z, cmd+z', handler: () => {}, description: 'Undo last action' },
  { key: 'ctrl+shift+z, ctrl+y, cmd+shift+z', handler: () => {}, description: 'Redo last action' },
  { key: 'ctrl+b, cmd+b', handler: () => {}, description: 'Bold text' },
  { key: 'ctrl+i, cmd+i', handler: () => {}, description: 'Italic text' },
  { key: 'escape', handler: () => {}, description: 'Cancel current action', enableOnFormTags: true }
]

function useKeyboardShortcuts(handlers: Record<string, () => void>) {
  SHORTCUTS.forEach(shortcut => {
    const handler = handlers[shortcut.key]
    if (handler) {
      useHotkeys(
        shortcut.key,
        (e) => {
          e.preventDefault()
          handler()
        },
        { enableOnFormTags: shortcut.enableOnFormTags ?? false },
        [handler]
      )
    }
  })
}
```

### Custom Technique Library Management

```typescript
// Pattern based on LocalStorage persistence research
// https://blog.logrocket.com/using-localstorage-react-hooks/

import { useState, useEffect } from 'react'
import type { Technique } from '../types/annotations'

const CUSTOM_TECHNIQUES_KEY = 'phishmonger-custom-techniques'

interface CustomTechnique extends Technique {
  isCustom: true
  createdAt: string
}

export function useCustomTechniques() {
  const [customTechniques, setCustomTechniques] = useState<Record<string, CustomTechnique>>({})

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_TECHNIQUES_KEY)
      if (saved) {
        setCustomTechniques(JSON.parse(saved))
      }
    } catch (error) {
      console.error('Failed to load custom techniques:', error)
    }
  }, [])

  // Save to LocalStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_TECHNIQUES_KEY, JSON.stringify(customTechniques))
    } catch (error) {
      console.error('Failed to save custom techniques:', error)
    }
  }, [customTechniques])

  const addCustomTechnique = (technique: Omit<CustomTechnique, 'id' | 'isCustom' | 'createdAt'>) => {
    const id = `CUSTOM-${Date.now()}`
    const newTechnique: CustomTechnique = {
      ...technique,
      id,
      isCustom: true,
      createdAt: new Date().toISOString()
    }
    setCustomTechniques(prev => ({ ...prev, [id]: newTechnique }))
    return id
  }

  const updateCustomTechnique = (id: string, updates: Partial<CustomTechnique>) => {
    setCustomTechniques(prev => ({
      ...prev,
      [id]: { ...prev[id], ...updates }
    }))
  }

  const deleteCustomTechnique = (id: string) => {
    setCustomTechniques(prev => {
      const { [id]: removed, ...rest } = prev
      return rest
    })
  }

  const getAllTechniques = (builtInTechniques: Technique[]): Technique[] => {
    return [
      ...builtInTechniques,
      ...Object.values(customTechniques)
    ]
  }

  return {
    customTechniques,
    addCustomTechnique,
    updateCustomTechnique,
    deleteCustomTechnique,
    getAllTechniques
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual event listeners for shortcuts | react-hotkeys-hook | 2020-2021 | Declarative, composable, handles edge cases |
| Complex undo/redo libraries | useReducer-based hooks | 2024-2025 | Simpler, type-safe, no dependencies |
| CSS-in-JS for component styles | CSS Modules | 2022-2024 | Better performance, simpler debugging |
| Hardcoded technique lists | User-customizable libraries | 2025+ | Extensibility, user ownership |

**Deprecated/outdated:**

- Redux-specific undo/redo solutions: Modern useReducer hooks are sufficient for most apps
- react-hotkeys (older library): Superseded by react-hotkeys-hook with better React 18+ support
- CSS-in-JS for static styles: Overhead not worth it for simple component styling

## Open Questions

Things that couldn't be fully resolved:

1. **Custom technique sharing between users**
   - What we know: LocalStorage is single-browser, no native sharing
   - What's unclear: Should custom techniques be exportable/importable as JSON?
   - Recommendation: Add "Export Custom Techniques" feature (JSON download/upload) for v2.0

2. **Arrow style persistence scope**
   - What we know: Can store arrow style selection in LocalStorage
   - What's unclear: Should arrow style be per-project (saved in project JSON) or global (user preference)?
   - Recommendation: Make it a user preference (LocalStorage) in v1.0, consider per-project in v2.0 if requested

3. **Undo/redo session persistence**
   - What we know: Most apps keep undo/redo history in-memory only
   - What's unclear: Should undo/redo survive page refresh?
   - Recommendation: Keep in-memory only (standard UX pattern). Persisting across refreshes is unusual and may confuse users.

## Sources

### Primary (HIGH confidence)

- **react-hotkeys-hook GitHub** - https://github.com/JohannesKlauss/react-hotkeys-hook
  - Verified: Active maintenance, 3.5k+ stars, comprehensive documentation
  - Used for: Keyboard shortcuts pattern

- **React 19 useReducer Deep Dive** - https://dev.to/a1guy/react-19-useReducer-deep-dive-from-basics-to-complex-state-patterns-3fpi
  - Verified: Published August 2025, covers undo/redo with useReducer
  - Used for: Undo/redo implementation pattern

- **Using localStorage with React Hooks** - https://blog.logrocket.com/using-localstorage-react-hooks/
  - Verified: LogRocket (authoritative React blog), March 2024
  - Used for: LocalStorage persistence patterns

### Secondary (MEDIUM confidence)

- **CSS Arrows Examples** - https://freefrontend.com/css-arrows/
  - Verified: Comprehensive CSS arrow techniques, modern examples
  - Used for: Arrow styling patterns

- **68 CSS Arrows** - https://www.sliderrevolution.com/resources/css-arrow/
  - Verified: Published February 2025, covers classic and modern techniques
  - Used for: Arrow implementation verification

- **React Layout Templates** - https://www.builder.io/blog/react-component-libraries-2026
  - Verified: Published December 2025, covers modern React layout approaches
  - Used for: Layout template patterns

- **Rethinking Undo/Redo** - https://dev.to/unadlib/rethinking-undoredo-why-we-need-travels-2lcc
  - Verified: Published October 2025, discusses modern undo/redo approaches
  - Used for: Undo/redo best practices

### Tertiary (LOW confidence)

- **useUndoable GitHub** - https://github.com/xplato/useUndoable
  - Not verified: Smaller library, less community adoption
  - Used for: Alternative undo/redo approach (consider if custom hook insufficient)

- **reddojs GitHub** - https://github.com/eihabkhan/reddojs
  - Not verified: Framework-agnostic, may not fit React patterns well
  - Used for: Comparison with React-specific solutions

## Metadata

**Confidence breakdown:**

- Standard stack: MEDIUM - Libraries verified (react-hotkeys-hook, useReducer patterns), but some features (arrow styles, layout templates) rely on well-established CSS patterns rather than specific libraries
- Architecture: MEDIUM - Patterns verified from multiple recent sources (2024-2025), but some patterns (custom techniques) are extrapolations from LocalStorage best practices
- Pitfalls: HIGH - Based on well-documented React anti-patterns and common mistakes (memory leaks, event handling, persistence edge cases)

**Research date:** 2026-01-21
**Valid until:** 2026-02-20 (30 days - React ecosystem moves fast, verify libraries before implementation)
