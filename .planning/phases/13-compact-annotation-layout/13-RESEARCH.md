# Phase 13: Compact Annotation Layout - Research

**Researched:** 2026-01-23
**Domain:** React state management, CSS custom properties, LocalStorage persistence
**Confidence:** HIGH

## Summary

Phase 13 requires implementing a toggleable compact annotation layout in the ReadOnlyEditor component. The implementation leverages existing layout template infrastructure from Phase 7, extends it with a new "compact-annotations" variant, and persists user preference via LocalStorage. This is a straightforward UI enhancement with well-established patterns in the codebase.

**Primary recommendation:** Add a `useCompactLayout` custom hook following the existing storage utility pattern, extend the existing CSS Modules layout system with a compact variant for annotations, and add a toggle button to ReadOnlyEditor's header controls.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React useState | Native | Component state for toggle | Built-in, no dependencies |
| CSS Modules | Native | Scoped layout styles | Already used in layouts.module.css |
| localStorage API | Native | Preference persistence | Already used via storage.ts utilities |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Custom useLocalStorage hook | - | Sync state with localStorage | When need automatic persistence (optional, can use direct calls) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Direct localStorage calls | useLocalStorage library | Direct calls simpler for boolean flag, library overkill |
| CSS classes | CSS custom properties | CSS classes sufficient, custom properties not needed for this case |
| Global state (Context) | Component state | Component state sufficient, no need for global state |

**Installation:**
```bash
# No new dependencies required
# Uses existing: React 19, CSS Modules, localStorage
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── hooks/
│   └── useCompactLayout.ts        # Custom hook for compact layout state (optional)
├── components/
│   ├── campaign/
│   │   ├── ReadOnlyEditor.tsx     # Add toggle button and compact layout state
│   │   └── CampaignCarouselModal.tsx # No changes needed
│   └── preview/
│       ├── AnnotationColumn.tsx   # Accept compact prop
│       └── SlideWrapper.tsx       # Pass compact layout class
├── styles/
│   └── layouts.module.css         # Add compact-annotations variant
└── utils/
    └── storage.ts                 # Add load/saveCompactLayout functions
```

### Pattern 1: LocalStorage Persistence (Following Existing Pattern)

**What:** Store user preference in localStorage using the same pattern as scoring, annotations, and campaigns.

**When to use:** When persisting simple user preferences across sessions.

**Example:**
```typescript
// Source: Based on existing storage.ts utilities
// src/utils/storage.ts

const COMPACT_LAYOUT_KEY = 'phishmonger-compact-layout'

/**
 * Load compact layout preference from LocalStorage
 * Returns false by default (disabled)
 */
export function loadCompactLayout(): boolean {
  try {
    const saved = localStorage.getItem(COMPACT_LAYOUT_KEY)
    return saved === 'true'
  } catch (error) {
    console.error('Failed to load compact layout preference:', error)
    return false
  }
}

/**
 * Save compact layout preference to LocalStorage
 */
export function saveCompactLayout(enabled: boolean): void {
  try {
    localStorage.setItem(COMPACT_LAYOUT_KEY, String(enabled))
  } catch (error) {
    console.error('Failed to save compact layout preference:', error)
  }
}
```

### Pattern 2: Component State with LocalStorage Sync

**What:** Initialize state from localStorage, save to localStorage on change.

**When to use:** When component state needs to persist across sessions.

**Example:**
```typescript
// Source: Based on ReadOnlyEditor showAnnotations pattern
// src/components/campaign/ReadOnlyEditor.tsx

import { useState, useEffect } from 'react'
import { loadCompactLayout, saveCompactLayout } from '../../utils/storage'

export function ReadOnlyEditor({ phish, onBack }: ReadOnlyEditorProps) {
  // Initialize from localStorage
  const [showAnnotations, setShowAnnotations] = useState(true)
  const [compactLayout, setCompactLayout] = useState(() => loadCompactLayout())

  // Save to localStorage when changed
  useEffect(() => {
    saveCompactLayout(compactLayout)
  }, [compactLayout])

  const toggleCompactLayout = () => {
    setCompactLayout(!compactLayout)
  }

  return (
    // ... JSX with compactLayout prop
  )
}
```

### Pattern 3: CSS Module Extension for Compact Layout

**What:** Extend existing layouts.module.css with compact-annotations variant for tighter spacing.

**When to use:** When adding layout variants that reuse existing structure.

**Example:**
```css
/* Source: Based on existing compact layout in layouts.module.css */
/* src/styles/layouts.module.css */

/*
 * Compact Annotations Layout
 * Annotation cards with smaller font (12px vs 14px)
 * Tighter spacing (reduced padding and margins)
 * Use case: Carousel browsing, quick review of many annotations
 */
.compact-annotations :global(.annotation-column) {
  gap: 16px; /* Reduced from 24px */
  padding: 24px; /* Reduced from 40px */
}

.compact-annotations :global(.annotation-card) {
  padding: 8px; /* Reduced from 12px */
}

.compact-annotations :global(.annotation-title) {
  font-size: 14px; /* Reduced from 1.1em (~15px) */
  margin-bottom: 6px; /* Reduced from 8px */
  padding-left: 24px; /* Reduced from 30px */
}

.compact-annotations :global(.annotation-tags) {
  margin-bottom: 6px; /* Reduced from 8px */
}

.compact-annotations :global(.mitre-tag),
.compact-annotations :global(.persuasion-tag) {
  font-size: 11px; /* Reduced from 0.85em (~13px) */
  padding: 1px 5px; /* Reduced from 2px 6px */
}

.compact-annotations :global(.annotation-description) {
  font-size: 12px; /* Reduced from default ~16px */
  line-height: 1.4; /* Reduced from 1.6 */
}

.compact-annotations :global(.arrow-badge) {
  width: 18px; /* Reduced from 20px */
  height: 18px; /* Reduced from 20px */
  font-size: 10px; /* Reduced from 11px */
}
```

### Anti-Patterns to Avoid

- **Storing in URL params:** Preferences are user-specific, not shareable, so localStorage is more appropriate than URL state
- **Using Context API:** Over-engineering for a single component preference - component state is sufficient
- **Creating separate component files:** Don't create CompactAnnotationColumn.tsx - use props and CSS classes instead
- **Hardcoding layout values:** Always use CSS classes or variables, don't inline compact spacing values in JSX

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| localStorage hook | Custom sync logic | Existing storage.ts utilities | Already handles errors, provides consistent API |
| CSS architecture | New CSS file | Extend layouts.module.css | Keeps layout styles centralized, leverages existing patterns |
| Toggle button UI | Custom button design | Follow ReadOnlyEditor header button pattern | Consistent UI, already tested |

**Key insight:** The codebase already has all the patterns needed - storage utilities, CSS Modules for layouts, and toggle button patterns. This phase is about applying existing patterns to a new feature, not inventing new approaches.

## Common Pitfalls

### Pitfall 1: Forgetting to Initialize State from localStorage

**What goes wrong:** Component always starts in default (non-compact) mode, ignoring user's saved preference.

**Why it happens:** Using `useState(false)` instead of `useState(() => loadCompactLayout())`.

**How to avoid:** Use lazy initialization in useState:
```typescript
// WRONG
const [compact, setCompact] = useState(false)

// RIGHT
const [compact, setCompact] = useState(() => loadCompactLayout())
```

**Warning signs:** Preference doesn't persist after page refresh.

### Pitfall 2: CSS Class Not Applied to Correct Element

**What goes wrong:** Compact styles don't appear even though toggle is active.

**Why it happens:** Applying `compact-annotations` class to wrong element or not at all.

**How to avoid:** Apply the class to the wrapper element that contains the annotation column:
```typescript
// SlideWrapper or outer div in ReadOnlyEditor
<div className={`slide-wrapper ${compactLayout ? 'compact-annotations' : ''}`}>
  {/* EmailColumn and AnnotationColumn */}
</div>
```

**Warning signs:** Toggle state changes but visuals remain identical.

### Pitfall 3: Layout Breaks on Small Screens

**What goes wrong:** Compact mode causes overflow or text becomes unreadable on mobile.

**Why it happens:** Not testing with smaller viewports or long annotation content.

**How to avoid:** Keep minimum font size of 12px for readability, test with 320px width, ensure word-wrap works.

**Warning signs:** Horizontal scrollbars appear, text gets clipped.

### Pitfall 4: localStorage Quota Exceeded Error

**What goes wrong:** App crashes when trying to save preference.

**Why it happens:** localStorage is full (5-10MB limit), unlikely but possible.

**How to avoid:** Already handled by storage.ts try-catch blocks, but ensure errors are logged not thrown.

**Warning signs:** Check browser console for localStorage errors.

## Code Examples

Verified patterns from official sources:

### Reading Initial State from localStorage

```typescript
// Source: Based on LogRocket localStorage pattern (Mar 2024)
// https://blog.logrocket.com/using-localstorage-react-hooks/

function useCompactLayout() {
  const [isCompact, setIsCompact] = useState(() => {
    const saved = localStorage.getItem('phishmonger-compact-layout')
    return saved === 'true'
  })

  useEffect(() => {
    localStorage.setItem('phishmonger-compact-layout', String(isCompact))
  }, [isCompact])

  return [isCompact, setIsCompact] as const
}
```

### Toggle Button Pattern (Following ReadOnlyEditor Style)

```typescript
// Source: Based on existing ReadOnlyEditor header button pattern
// src/components/campaign/ReadOnlyEditor.tsx

<button
  onClick={() => setCompactLayout(!compactLayout)}
  type="button"
  style={{
    backgroundColor: compactLayout ? '#6c757d' : '#28a745',
    color: '#ffffff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  }}
  title={compactLayout ? 'Expand annotations' : 'Compact annotations'}
>
  {compactLayout ? 'Expanded View' : 'Compact View'}
</button>
```

### Applying CSS Classes Conditionally

```typescript
// Source: Based on existing LayoutTemplateSelector pattern
// src/components/preview/SlideWrapper.tsx

export const SlideWrapper = forwardRef<HTMLDivElement, SlideWrapperProps>(
  ({ children, compactLayout = false }, ref) => {
    const getSlideWrapperClasses = (): string => {
      const baseClass = styles.slideWrapper
      const compactClass = compactLayout ? 'compact-annotations' : ''
      return `${baseClass} ${compactClass}`.trim()
    }

    return (
      <div ref={ref} className={getSlideWrapperClasses()}>
        {children}
      </div>
    )
  }
)
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Inline styles in components | CSS Modules with scoped classes | Phase 7 | Consistent styling, better maintainability |
| No preference persistence | localStorage for user preferences | Phase 5 | Better UX across sessions |
| Fixed layout only | Template-based layout system | Phase 7 | Flexibility for different use cases |

**Deprecated/outdated:**
- Inline style objects for layout properties (use CSS Modules instead)
- URL params for UI preferences (use localStorage for user-specific settings)

## Open Questions

None - all requirements are clear and follow established patterns in the codebase.

## Sources

### Primary (HIGH confidence)
- **Existing codebase analysis** - Reviewed storage.ts, layouts.module.css, ReadOnlyEditor.tsx, LayoutTemplateSelector.tsx
- **Existing Phase 7 implementation** - Layout template system with compact variant

### Secondary (MEDIUM confidence)
- [Managing Local Storage in React with useLocalStorage hook](https://dev.to/saiful7778/managing-local-storage-in-react-with-uselocalstorage-hook-hee) (January 2025)
- [Easy Dark Theme Toggle in React using local storage](https://coderdinesh.hashnode.dev/easy-dark-theme-toggle-in-react-using-local-storage) - Toggle persistence pattern
- [React Hooks: The Complete Guide in 2026 (React 19)](https://inhaq.com/blog/mastering-react-hooks-the-ultimate-guide-for-building-modern-uis) (November 2025)
- [When (and Why) to Use CSS Custom Properties](https://www.designsystemscollective.com/when-and-why-to-use-css-custom-properties-797c75fcaae5) (September 2025)

### Tertiary (LOW confidence)
- [Using localStorage with React Hooks (LogRocket)](https://blog.logrocket.com/using-localstorage-react-hooks/) (March 2024)
- [Mastering Custom CSS Properties](https://medium.com/devmap/mastering-custom-css-properties-9c3d0c0775a0) - Responsive theme example

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Uses existing React, CSS Modules, localStorage patterns from codebase
- Architecture: HIGH - Follows established storage.ts and layouts.module.css patterns
- Pitfalls: HIGH - Based on common React localStorage mistakes documented in community resources

**Research date:** 2026-01-23
**Valid until:** 2026-02-23 (30 days - stable React patterns, unlikely to change)
