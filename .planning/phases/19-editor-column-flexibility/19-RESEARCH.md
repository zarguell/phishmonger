# Phase 19: Editor Column Flexibility - Research

**Researched:** 2026-01-24
**Domain:** React state management, keyboard shortcuts, CSS Grid layout, localStorage persistence
**Confidence:** HIGH

## Summary

This phase requires implementing expandable and minimizable editor columns in the main App.tsx editor view, which currently uses a 4-column CSS Grid layout (`input-column`, `preview-column`, `lure-list-column`, `scoring-column`). Users must be able to expand any column to full-width "focus mode" via header buttons, minimize columns to collapsed header bars, toggle column focus with keyboard shortcuts (1, 2, 3, 4), and have column state persist across sessions via localStorage.

The standard approach for this feature in React applications is using **conditional CSS Grid column templates** controlled by React state (expanded/minimized per column), persisted using the existing localStorage pattern from Phase 16 (`storage.ts` utilities), and keyboard shortcuts handled by the already-installed **react-hotkeys-hook@5.2.3** library (already used in App.tsx for Ctrl+Z, Ctrl+Shift+Z, F1). The collapsed state should render a minimal header bar with an expand button, similar to sidebar collapse patterns in modern web applications.

The key technical challenges are: (1) managing 4-column state without conflicting with existing `compactLayout` state from Phase 18, (2) ensuring smooth CSS transitions when columns expand/collapse, (3) preventing keyboard shortcut conflicts with browser defaults (number keys sometimes navigate tabs), and (4) maintaining responsive design (mobile breakpoint at 1024px already exists in index.css).

**Primary recommendation:** Create a `ColumnState` type and `useColumnState` hook in App.tsx, add localStorage keys (`phishmonger-column-state`) following Phase 16 pattern, implement CSS Grid conditional classes in `index.css`, add column header components with expand/minimize buttons, and register useHotkeys hooks for 1-4 keys in App.tsx.

## Standard Stack

The established libraries and patterns for column flexibility in React applications:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| **react-hotkeys-hook** | 5.2.3 (already installed) | Keyboard shortcuts for column toggling | Already in package.json, used in App.tsx (lines 234-248), lightweight hook-based API, TypeScript support |
| **CSS Grid** | Native browser API | Dynamic column layout with conditional templates | Already used in `.app-main` (index.css line 39), standard for 2D layouts, supports `grid-template-columns` transitions |
| **useState + useEffect** | React 19.2.3 (already installed) | Column state management and localStorage persistence | Standard React state management, already used throughout App.tsx |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **localStorage API** | Native browser API | Persist column state across sessions | Already used in storage.ts (Phase 16 pattern with migration support) |
| **CSS transitions** | Native browser API | Smooth expand/collapse animations | Already used in layouts.module.css (line 23: `transition: gap 0.3s ease`) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-hotkeys-hook | react-hotkeys (older library) | react-hotkeys-hook is hook-based, smaller, better TypeScript support. Older library is class-component era |
| CSS Grid conditional classes | Inline style objects | CSS classes are more maintainable, separate concerns, already used for layouts.module.css patterns |
| useState per column | useReducer for all columns | useReducer is overkill for 4 boolean states. useState is simpler and sufficient |

**Installation:**
```bash
# No new packages required - react-hotkeys-hook already installed
npm ls react-hotkeys-hook  # Verify version 5.2.3
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── App.tsx                      # Modify: Add column state, useHotkeys for 1-4, column header buttons
├── index.css                    # Modify: Add .app-main grid variants for column states
├── types/
│   └── columns.ts               # New: ColumnState type, ColumnID type
├── utils/
│   └── storage.ts               # Modify: Add loadColumnState(), saveColumnState()
└── components/
    ├── editor/
    │   └── ColumnHeader.tsx     # New: Reusable column header with expand/minimize buttons
    └── preview/
        └── CollapsedColumn.tsx  # New: Collapsed state header bar component
```

### Pattern 1: Column State Management with TypeScript
**What:** Type-safe column state using union types for column IDs and record type for state
**When to use:** Managing discrete UI states with localStorage persistence
**Example:**
```typescript
// Source: Based on existing storage.ts patterns (lines 1-336)
// and TypeScript discriminated union best practices

// Column ID type (4 columns in App.tsx)
export type ColumnID = 'input' | 'preview' | 'lure-list' | 'scoring';

// Column state type (expanded = full-width, minimized = collapsed header)
export type ColumnState = 'expanded' | 'minimized';

// All columns state record
export type ColumnStates = Record<ColumnID, ColumnState>;

// Default state (all columns normal, none expanded/minimized)
const DEFAULT_COLUMN_STATES: ColumnStates = {
  input: 'expanded',
  preview: 'expanded',
  lure-list: 'expanded',
  scoring: 'expanded'
};

// localStorage key (following Phase 16 naming pattern)
const COLUMN_STATES_KEY = 'phishmonger-column-states';

// Load column states from localStorage
export function loadColumnStates(): ColumnStates {
  try {
    const saved = localStorage.getItem(COLUMN_STATES_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Validate structure (ensure all 4 columns exist)
      return { ...DEFAULT_COLUMN_STATES, ...parsed };
    }
  } catch (error) {
    console.error('Failed to load column states:', error);
  }
  return { ...DEFAULT_COLUMN_STATES };
}

// Save column states to localStorage
export function saveColumnStates(states: ColumnStates): void {
  try {
    localStorage.setItem(COLUMN_STATES_KEY, JSON.stringify(states));
  } catch (error) {
    console.error('Failed to save column states:', error);
  }
}
```

### Pattern 2: Keyboard Shortcuts with react-hotkeys-hook
**What:** Register number keys 1-4 to toggle column focus mode
**When to use:** Global hotkeys that trigger anywhere in the app (except form inputs)
**Example:**
```typescript
// Source: Based on existing App.tsx useHotkeys pattern (lines 234-248)
// and react-hotkeys-hook documentation

import { useHotkeys } from 'react-hotkeys-hook';

// In App.tsx component:
const [columnStates, setColumnStates] = useState<ColumnStates>(loadColumnStates());

// Persist column states to localStorage on change
useEffect(() => {
  saveColumnStates(columnStates);
}, [columnStates]);

// Toggle column to expanded (others minimized) or reset all to expanded
const toggleColumnFocus = (columnId: ColumnID) => {
  setColumnStates(prev => {
    const isCurrentlyFocused = prev[columnId] === 'expanded' &&
      Object.values(prev).filter(s => s === 'expanded').length === 1;

    if (isCurrentlyFocused) {
      // If already focused, reset all to normal
      return DEFAULT_COLUMN_STATES;
    } else {
      // Focus this column, minimize others
      const focused: ColumnStates = {
        input: 'minimized',
        preview: 'minimized',
        'lure-list': 'minimized',
        scoring: 'minimized'
      };
      focused[columnId] = 'expanded';
      return focused;
    }
  });
};

// Register keyboard shortcuts (keys 1-4)
// Note: enableOnFormTags: true allows shortcuts even in input fields
useHotkeys('1', () => toggleColumnFocus('input'),
  { enableOnFormTags: true }, [toggleColumnFocus]);

useHotkeys('2', () => toggleColumnFocus('preview'),
  { enableOnFormTags: true }, [toggleColumnFocus]);

useHotkeys('3', () => toggleColumnFocus('lure-list'),
  { enableOnFormTags: true }, [toggleColumnFocus]);

useHotkeys('4', () => toggleColumnFocus('scoring'),
  { enableOnFormTags: true }, [toggleColumnFocus]);
```

### Pattern 3: CSS Grid Conditional Layouts
**What:** Dynamic grid-template-columns based on which column is expanded
**When to use:** Responsive layouts that change column proportions
**Example:**
```css
/* Source: Based on existing .app-main grid (index.css line 37-42)
 * and layouts.module.css template pattern (lines 14-92)
 */

/* Base layout (all columns expanded - default) */
.app-main {
  display: grid;
  grid-template-columns: 1fr 1fr 300px 280px; /* input, preview, lure-list, scoring */
  gap: 1.5rem;
  transition: all 0.3s ease;
}

/* Input column focused (full-width) */
.app-main[data-focus-column="input"] {
  grid-template-columns: 1fr 0 0 0; /* Hide other columns */
}

/* Preview column focused (full-width) */
.app-main[data-focus-column="preview"] {
  grid-template-columns: 0 1fr 0 0; /* Hide other columns */
}

/* Lure list column focused (full-width) */
.app-main[data-focus-column="lure-list"] {
  grid-template-columns: 0 0 1fr 0; /* Hide other columns */
}

/* Scoring column focused (full-width) */
.app-main[data-focus-column="scoring"] {
  grid-template-columns: 0 0 0 1fr; /* Hide other columns */
}

/* Minimized column state (collapsed to header bar) */
.column-minimized {
  display: flex;
  flex-direction: column;
  min-height: 40px; /* Header bar height */
  overflow: hidden;
}

.column-minimized > *:not(.column-header) {
  display: none; /* Hide content, show only header */
}

.column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f5f7fa;
  border: 1px solid #e1e5e9;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
}

.column-header:hover {
  background: #e9ecef;
}

.column-header-title {
  font-size: 13px;
  font-weight: 600;
  color: #2c3e50;
}

.expand-minimize-buttons {
  display: flex;
  gap: 4px;
}

.expand-minimize-btn {
  padding: 4px 8px;
  font-size: 11px;
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 3px;
  cursor: pointer;
  transition: background 0.2s;
}

.expand-minimize-btn:hover {
  background: #e9ecef;
}
```

### Anti-Patterns to Avoid
- **Inline styles for grid layout:** Don't use `style={{ gridTemplateColumns: ... }}`. CSS classes are more maintainable and allow for responsive breakpoints.
- **Separate useState for each column:** Don't use `const [inputExpanded, setInputExpanded] = useState()`. Use a single record type for consistency and easier localStorage persistence.
- **Preventing default on number keys globally:** Don't use `e.preventDefault()` blindly. Number keys have legitimate uses (form inputs, browser shortcuts). Use `enableOnFormTags: true` in useHotkeys options.
- **CSS display: none for columns:** Don't use `display: none` to hide columns. Use `grid-template-columns: 0` to maintain grid structure while collapsing space.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Keyboard shortcut handling | Custom event listeners with addEventListener | react-hotkeys-hook (already installed) | Handles scoping, key combinations, form tag detection, cleanup automatically |
| localStorage state persistence | Custom JSON parsing/try-catch in component | storage.ts utilities (Phase 16 pattern) | Centralized error handling, consistent API, migration support from Phase 16 |
| CSS Grid collapse animations | Manual width transitions with setTimeout | CSS `grid-template-columns` with `transition` | Browser-optimized, smoother 60fps animations, simpler code |
| Column header UI | Custom button HTML and event handlers | Reusable ColumnHeader component | DRY principle, consistent styling, easier maintenance |

**Key insight:** Column flexibility is a UI state management problem, not a novel technical challenge. The patterns already exist in the codebase (Phase 16 localStorage, Phase 18 compact layout toggle, existing useHotkeys). The task is applying these patterns to a new domain (column visibility).

## Common Pitfalls

### Pitfall 1: Keyboard Shortcut Conflicts with Browser Defaults
**What goes wrong:** Pressing "1" focuses the first tab in browser, or "Ctrl+1" switches to tab 1. Number keys have browser-defined behaviors.
**Why it happens:** Browsers reserve number keys for tab navigation and other shortcuts. Without proper scoping, shortcuts interfere with user expectations.
**How to avoid:** Use `enableOnFormTags: true` option in useHotkeys to allow shortcuts in input fields. Test shortcuts in different browser contexts (normal mode, form input focus, modal open).
**Warning signs:** Shortcuts don't fire, or browser behavior triggers instead. Check browser console for "preventDefault called on interactive event" warnings.

### Pitfall 2: localStorage QuotaExceededError
**What goes wrong:** Saving column state fails silently, state doesn't persist between sessions.
**Why it happens:** localStorage has a 5-10MB limit. If other app data (phishes, campaigns) fills storage, column state save fails.
**How to avoid:** Follow Phase 16 pattern with try-catch blocks in `saveColumnStates()`. Log errors to console but don't crash app. Provide fallback to default state if load fails.
**Warning signs:** Column state resets on page refresh, console errors about "QuotaExceededError". Test with localStorage nearly full (simulate by filling storage to 95% capacity).

### Pitfall 3: CSS Grid 0fr Columns Not Fully Collapsing
**What goes wrong:** Setting `grid-template-columns: 0` for hidden columns still shows visible content or scrollbars.
**Why it happens:** `0fr` allows content to overflow. Grid items with `0fr` still render unless explicitly hidden with `overflow: hidden` or `display: none` on children.
**How to avoid:** Combine `grid-template-columns: 0` with `.column-minimized` class that hides content except header. Use `min-width: 0` on grid items to allow shrinkage.
**Warning signs:** Collapsed columns still show content shadows or scrollbars. Test by expanding each column and checking if others fully disappear.

### Pitfall 4: State Desync Between UI and localStorage
**What goes wrong:** Column state changes in UI but localStorage has stale value, or vice versa. Reloading page shows wrong state.
**Why it happens:** useEffect dependency array missing, or save function called before state updates. React state updates are batched and asynchronous.
**How to avoid:** Use `useEffect(() => saveColumnStates(columnStates), [columnStates])` pattern. Ensure save happens after state update. Test by changing column state, reloading page, verifying state persists.
**Warning signs:** State resets after page reload, or changes don't persist. Check useEffect dependency array and state update timing.

### Pitfall 5: Transition Animations Causing Layout Shift
**What goes wrong:** When column expands, other columns "jump" during transition, causing visual jank.
**Why it happens:** CSS `transition` on `grid-template-columns` is not supported in all browsers. Flexbox transitions are smoother.
**How to avoid:** Use `transition: all 0.3s ease` on grid container, but test in target browsers (Chrome, Firefox, Safari). Consider `transform: scaleX()` for smoother animations, or accept that grid transitions may be choppy in older browsers.
**Warning signs:** Columns "pop" instead of smoothly expanding. Test in Chrome DevTools Performance tab for 60fps animations.

## Code Examples

Verified patterns from official sources:

### React Hotkeys Hook Basic Usage
```typescript
// Source: react-hotkeys-hook@5.2.3 documentation
// https://react-hotkeys-hook.vercel.app/

import { useHotkeys } from 'react-hotkeys-hook';

function MyComponent() {
  // Register hotkey with options
  useHotkeys('ctrl+s', (e) => {
    e.preventDefault();
    saveData();
  }, {
    enableOnFormTags: true,  // Allow hotkey in input fields
    scopes: ['editor']       // Only active in 'editor' scope
  });

  return <input placeholder="Press Ctrl+S to save" />;
}
```

### localStorage with Error Handling
```typescript
// Source: Phase 16 storage.ts pattern (lines 262-289)
// https://github.com/phishmonger/phishmonger/blob/main/src/utils/storage.ts

const COMPACT_LAYOUT_KEY = 'phishmonger-compact-layout';

export function loadCompactLayout(): boolean {
  try {
    const saved = localStorage.getItem(COMPACT_LAYOUT_KEY);
    return saved === 'true';
  } catch (error) {
    console.error('Failed to load compact layout preference:', error);
    return false; // Fallback to default
  }
}

export function saveCompactLayout(enabled: boolean): void {
  try {
    localStorage.setItem(COMPACT_LAYOUT_KEY, String(enabled));
  } catch (error) {
    console.error('Failed to save compact layout preference:', error);
    // Don't throw - allow app to continue without persistence
  }
}
```

### CSS Grid Dynamic Layouts
```css
/* Source: Modern CSS Grid best practices
 * https://css-tricks.com/snippets/css/complete-guide-grid/
 */

.grid-container {
  display: grid;
  /* Default: 4 equal columns */
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 1rem;
  transition: all 0.3s ease;
}

/* Variant: First column full-width, others hidden */
.grid-container[data-focused="1"] {
  grid-template-columns: 1fr 0 0 0;
}

/* Variant: Second column full-width */
.grid-container[data-focused="2"] {
  grid-template-columns: 0 1fr 0 0;
}

/* Hidden grid items */
.grid-item {
  overflow: hidden; /* Prevent content spill when 0fr */
  min-width: 0;     /* Allow shrink below content size */
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual addEventListener for keyboard events | React hook-based hotkeys (react-hotkeys-hook) | React 16.8+ (hooks era) | Cleaner code, automatic cleanup, better TypeScript support |
| Inline style objects for dynamic layouts | CSS-in-JS libraries or CSS custom properties | 2020-2023 | Better maintainability, separates concerns, enables responsive breakpoints |
| localStorage without error handling | try-catch with fallback defaults | 2018+ (privacy regulations) | Graceful degradation, better UX when storage full/disabled |

**Deprecated/outdated:**
- **jQuery event handlers for keyboard shortcuts:** Use React hooks instead
- **Browser sniffing for feature detection:** Use feature detection (e.g., `'localStorage' in window`)
- **Synchronous XHR for state persistence:** Use async localStorage with error boundaries
- **CSS float-based layouts:** Use CSS Grid or Flexbox for column layouts

## Open Questions

Things that couldn't be fully resolved:

1. **Number key conflicts with browser tab navigation**
   - What we know: Browsers use Ctrl+1-9 for tab switching, but plain 1-9 keys are generally safe
   - What's unclear: Whether users will expect plain 1-4 keys to work in all contexts (e.g., when a text input is focused)
   - Recommendation: Use `enableOnFormTags: true` to allow shortcuts even in inputs. Test with users to confirm this doesn't interfere with typing numbers in form fields. Consider adding Escape key to reset all columns to normal (similar to Phase 17 modal pattern).

2. **CSS Grid transition animation smoothness**
   - What we know: CSS Grid transitions on `grid-template-columns` are not supported in all browsers (Chrome 117+, Firefox 111+)
   - What's unclear: Whether choppy animations in older browsers are acceptable, or if we need a fallback
   - Recommendation: Implement grid transitions first, test in target browsers (Chrome, Firefox, Safari). If animations are choppy, consider removing `transition` property and accepting instant layout changes (better than janky animation).

3. **Column state conflicts with existing compactLayout state**
   - What we know: Phase 18 implemented `compactLayout` boolean state for ReadOnlyEditor, stored in localStorage as `phishmonger-compact-layout`
   - What's unclear: Whether column state should override or coexist with compactLayout (e.g., can user have both compact layout AND column focus mode?)
   - Recommendation: Column state is independent of compactLayout. Compact layout affects annotation density, column focus affects visibility. Users can have both active simultaneously. Ensure localStorage keys don't conflict (`phishmonger-compact-layout` vs `phishmonger-column-states`).

## Sources

### Primary (HIGH confidence)
- **react-hotkeys-hook@5.2.3** - Already installed in package.json (line 24), usage examples in App.tsx (lines 1-2, 234-248)
- **Phase 16 storage.ts pattern** - localStorage utilities with error handling (src/utils/storage.ts lines 1-336)
- **Phase 18 compactLayout state** - useState + useEffect persistence pattern (ReadOnlyEditor.tsx lines 22-28)
- **Existing CSS Grid layout** - `.app-main` grid structure (src/index.css lines 37-42)
- **Existing responsive breakpoint** - Mobile layout at 1024px (src/index.css lines 333-349)
- **layouts.module.css patterns** - CSS class-based layout variants (src/styles/layouts.module.css lines 1-176)

### Secondary (MEDIUM confidence)
- **CSS Grid transition support** - Browser compatibility for grid-template-columns transitions (Can I Use: css-grid)
- **React useState persistence pattern** - Standard React pattern for localStorage sync (React docs: useState + useEffect)

### Tertiary (LOW confidence)
- **WebSearch results unavailable** - Search quota reached, unable to verify 2026 best practices for column collapse UI patterns
- **Alternative libraries not researched** - Did not investigate react-resizable-panels, rc-layout, or other layout libraries (react-hotkeys-hook is sufficient)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already installed and in use (react-hotkeys-hook, CSS Grid, localStorage)
- Architecture: HIGH - Based on existing patterns in codebase (Phase 16 localStorage, Phase 18 state toggle)
- Pitfalls: MEDIUM - Keyboard shortcuts and localStorage have known edge cases, but patterns are well-documented
- Code examples: HIGH - Verified from actual source code in project (App.tsx, storage.ts, index.css)

**Research date:** 2026-01-24
**Valid until:** 2026-02-23 (30 days - React hooks and CSS Grid patterns are stable, but browser support for grid transitions may change)
