# Phase 07: Visualizer & Lure List Updates - Research

**Researched:** 2026-01-22
**Domain:** React component updates with conditional rendering
**Confidence:** HIGH

## Summary

Phase 07 updates existing UI components to display new annotation data model fields (title, tags) that were added in Phase 6. Both changes leverage the existing conditional rendering pattern already used in the codebase. The visualizer card already supports title display, and lure list needs similar conditional rendering for title/description.

**Primary recommendation:** Follow existing conditional rendering patterns (`{condition && <element>}`), maintain current styling conventions, and leverage existing CSS classes. No architectural changes needed.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 18.x | Component rendering | Codebase uses React hooks (useState, useEffect, useMemo) |
| TypeScript | 5.x | Type safety | All components use strict typing with interfaces |
| CSS Modules | N/A | Scoped styling | Used for arrow badges (arrows.module.css) |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Lucide React | via @types/uuid | Icons | Check current icon usage in App.tsx |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Conditional rendering with `&&` | Ternary operator or early return | Ternary useful for if/else, but `&&` is cleaner for "show if present" pattern |

**Installation:**
No new packages needed. All dependencies already in place from Phase 6.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── annotation/
│   │   └── AnnotationCard.tsx      # Target for 07-01
│   └── LureList.tsx                # Target for 07-02
├── types/
│   └── annotations.ts              # Reference for Annotation interface
└── styles/
    ├── arrows.module.css           # Arrow badge styles
    └── index.css                   # Global styles (.annotation-*, .lure-list-*)
```

### Pattern 1: Conditional Rendering (show if present)
**What:** React's `{condition && <element>}` pattern for optional fields
**When to use:** Displaying optional data (title, tags) that may not exist
**Example:**
```typescript
// Source: Existing codebase (AnnotationCard.tsx lines 48-52, 55-59)
{annotation.title && (
  <div className="annotation-title">
    {annotation.title}
  </div>
)}
{annotation.techniqueId && (
  <span className="mitre-tag">
    ({getTechniqueName(annotation.techniqueId, allTechniques)})
  </span>
)}
```

**Key insight:** This pattern already exists in AnnotationCard - Phase 07-01 is already complete. The title field displays conditionally when present.

### Pattern 2: Optional Chaining for Safe Access
**What:** Use `annotation?.title || ''` for fallback values
**When to use:** Form inputs, display text that needs fallback
**Example:**
```typescript
// Source: Existing codebase (AnnotationPanel.tsx line 43)
value={annotation?.title || ''}
```

### Pattern 3: Map Over Object Values
**What:** `Object.values(annotations).map(...)` for rendering collections
**When to use:** Converting annotation Record to display elements
**Example:**
```typescript
// Source: Existing codebase (AnnotationColumn.tsx lines 24-33)
const sortedAnnotations = Object.values(annotations).sort((a, b) => {
  const aY = a.manualY ?? Infinity
  const bY = b.manualY ?? Infinity
  // ... sorting logic
})
```

### Anti-Patterns to Avoid
- **Inline style objects for static styles:** Use CSS classes instead (consistent with codebase conventions)
- **Force-unwrapping optional fields:** Always use conditional rendering or optional chaining
- **Hardcoded field checks:** Use the same pattern as existing fields (title &&, techniqueId &&, etc.)

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Title display logic | Custom ternary or switch | Existing `{annotation.title && <div>}` pattern | Consistent with codebase, handles undefined automatically |
| Text truncation for lure list | Custom substring logic | CSS `text-overflow: ellipsis` | Browser-native, responsive, handles edge cases |
| Conditional styling | Inline style objects | CSS classes with conditional rendering | Better maintainability, consistent with existing patterns |

**Key insight:** The codebase already has all needed patterns. Phase 07 is about applying existing conditional rendering to LureList, not inventing new approaches.

## Common Pitfalls

### Pitfall 1: Assuming AnnotationCard needs updates
**What goes wrong:** Developer tries to modify AnnotationCard.tsx for 07-01
**Why it happens:** Plan title says "Update visualizer card layout"
**How to avoid:** AnnotationCard already implements title display (lines 48-52). 07-01 is already complete. Verification only needed.
**Warning signs:** Opening AnnotationCard.tsx in editor for 07-01 task

### Pitfall 2: Breaking existing conditional rendering
**What goes wrong:** Changing `{annotation.title && ...}` to always show title
**Why it happens:** Misunderstanding that title is optional
**How to avoid:** Keep conditional rendering. Title field is optional (`title?: string`)
**Warning signs:** Removing `{annotation.title &&` wrapper

### Pitfall 3: Forgetting to handle undefined in LureList
**What goes wrong:** Displaying "undefined" or crashing when annotation missing
**Why it happens:** Not checking if annotation exists before accessing fields
**How to avoid:** Use `annotations[lure.id]` with optional chaining: `annotation?.title`
**Warning signs:** Direct property access without null check: `annotations[lure.id].title`

### Pitfall 4: Over-engineering the lure list update
**What goes wrong:** Creating new components or complex state management
**Why it happens:** Treating this as new feature rather than display update
**How to avoid:** This is a simple conditional render. Add title/description display inline with existing content
**Warning signs:** Creating new files for 07-02

## Code Examples

Verified patterns from official sources:

### Conditional Rendering in JSX
```typescript
// Source: Existing codebase (AnnotationCard.tsx)
// Pattern: Show element only if data exists
{annotation.title && (
  <div className="annotation-title">
    {annotation.title}
  </div>
)}

{showTags && (
  <div className="annotation-tags">
    {annotation.techniqueId && (
      <span className="mitre-tag">
        ({getTechniqueName(annotation.techniqueId, allTechniques)})
      </span>
    )}
    {annotation.persuasionPrincipleId && (
      <span className="persuasion-tag">
        (Persuasion: {getPersuasionName(annotation.persuasionPrincipleId)})
      </span>
    )}
  </div>
)}
```

### Safe Property Access with Fallback
```typescript
// Source: Existing codebase (AnnotationPanel.tsx)
// Pattern: Provide empty string fallback for form inputs
value={annotation?.title || ''}
onChange={(e) => onUpdate({ title: e.target.value || undefined })}
```

### Lure List Pattern (existing structure)
```typescript
// Source: Existing codebase (LureList.tsx lines 70-78)
// Pattern: Map over lures array with inline content
{lures.map((lure) => (
  <li key={lure.id} className="lure-list-item">
    <div className="lure-list-item-content">
      <button className="lure-list-btn" type="button">
        <span className="lure-id">{lure.id.slice(0, 8)}</span>
        <span className="lure-text">"{lure.text}"</span>
      </button>
      {/* ... action buttons ... */}
    </div>
    {expandedLureId === lure.id && (
      <AnnotationPanel ... />
    )}
  </li>
))}
```

### Expected LureList Update Pattern (for 07-02)
```typescript
// Add conditional rendering after lure-text span
<span className="lure-text">"{lure.text}"</span>

{annotations[lure.id]?.title && (
  <div className="lure-annotation-title">
    {annotations[lure.id].title}
  </div>
)}

{annotations[lure.id]?.explanation && (
  <div className="lure-annotation-description">
    {annotations[lure.id].explanation}
  </div>
)}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| N/A | Conditional rendering with `&&` | Phase 1 (initial) | Standard React pattern for optional UI |
| N/A | Optional title field | Phase 6 | Annotation.title?: string added |
| N/A | Title display in AnnotationCard | Phase 6 | Already implemented in lines 48-52 |

**Deprecated/outdated:**
- None. This is a straightforward display update using established patterns.

**Already complete:**
- 07-01 (Visualizer card layout): AnnotationCard.tsx already implements title display
- 07-02 (Lure list summary): Needs implementation

## Open Questions

None. The codebase is clear, patterns are established, and implementation is straightforward.

## Sources

### Primary (HIGH confidence)
- `/Users/zach/localcode/phishmonger/src/components/annotation/AnnotationCard.tsx` - Current implementation, lines 48-69 show conditional rendering pattern
- `/Users/zach/localcode/phishmonger/src/components/LureList.tsx` - Target for 07-02, lines 70-78 show existing structure
- `/Users/zach/localcode/phishmonger/src/types/annotations.ts` - Annotation interface with title?: string (line 14)
- `/Users/zach/localcode/phishmonger/src/components/AnnotationPanel.tsx` - Form input pattern (lines 36-46)

### Secondary (MEDIUM confidence)
- `/Users/zach/localcode/phishmonger/src/index.css` - Existing CSS classes for .annotation-title (521), .annotation-tags (528), .lure-list-* (191-246)
- `/Users/zach/localcode/phishmonger/.planning/phases/06-annotation-data-model/06-01-PLAN.md` - Phase 6 implementation details for title field
- `/Users/zach/localcode/phishmonger/.planning/ROADMAP.md` - Phase 6 complete, Phase 7 scope

### Tertiary (LOW confidence)
- None needed. All research from primary codebase sources.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Existing codebase directly examined
- Architecture: HIGH - Patterns extracted from actual source files
- Pitfalls: HIGH - Based on codebase review and common React mistakes

**Research date:** 2026-01-22
**Valid until:** 60 days (stable domain, no external dependencies)
