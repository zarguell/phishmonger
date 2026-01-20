# Phase 3: Visualizer & Export - Research

**Researched:** 2026-01-20
**Domain:** React DOM manipulation, SVG overlays, Canvas export
**Confidence:** MEDIUM

## Summary

This phase requires building a preview mode that displays email content with dynamic annotation cards connected by elbow-connector arrows through a shared vertical bus line. The system must track DOM element positions using `getBoundingClientRect()`, recalculate on resize events, and export the composition as a high-resolution PNG using html2canvas.

**Key technical challenges identified:**
1. SVG overlay coordinate systems - the SVG must match the slide wrapper's coordinate space for arrow alignment
2. Layout measurement timing - need `useLayoutEffect` for synchronous measurements vs `useEffect` for resize handlers
3. Collision detection for overlapping cards - requires sequential layout calculation with gap adjustment
4. html2canvas limitations - several CSS properties are unsupported (box-shadow, filter, mix-blend-mode)
5. High-resolution export - 2x scale rendering affects both dimensions and coordinate calculations

**Primary recommendation:** Use a container-relative coordinate system with refs for DOM measurements, debounce resize handlers, and avoid unsupported CSS properties in the exported composition.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 18.3.1 | UI framework | Already in project, provides refs and effects |
| html2canvas | ~1.4.1 | DOM-to-canvas rendering | Widely-used, supports scale option for high-res export |
| DOMRect API | Built-in | Element position/size | Standard browser API, returns viewport-relative coordinates |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| None | - | - | Pure browser APIs and React suffice |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| html2canvas | dom-to-image-more | Less mature, fewer examples |
| getBoundingClientRect() | element.offsetLeft/Top | Doesn't account for scroll, requires manual parent traversal |
| SVG overlay | Canvas overlay | Canvas harder to style dynamically with CSS, SVG is DOM-like |

**Installation:**
```bash
npm install html2canvas
npm install --save-dev @types/html2canvas  # For TypeScript support
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── preview/
│   │   ├── SlideWrapper.tsx      # Fixed-width 1600px container
│   │   ├── EmailColumn.tsx        # Left column (960px) with lures
│   │   ├── AnnotationColumn.tsx   # Right column (640px) with cards
│   │   └── ArrowOverlay.tsx      # SVG with pointer-events: none
│   ├── annotation/
│   │   └── AnnotationCard.tsx    # Floating card component
│   └── export/
│       └── ExportButton.tsx       # Export trigger with html2canvas
├── hooks/
│   ├── useArrowCalculations.ts      # Calculates elbow paths
│   ├── useCardLayout.ts           # Collision detection and positioning
│   └── useDebouncedResize.ts      # Debounced resize handler
└── utils/
    ├── coordinate.ts               # DOM coordinate conversions
    └── export.ts                  # html2canvas wrapper
```

### Pattern 1: Container-Relative Coordinate System
**What:** All calculations relative to a fixed container (SlideWrapper at 1600px width)
**When to use:** When overlay elements must track with scrollable content
**Example:**
```typescript
// Source: MDN getBoundingClientRect + React docs
const containerRef = useRef<HTMLDivElement>(null);
const [arrowPaths, setArrowPaths] = useState<ArrowPath[]>([]);

useLayoutEffect(() => {
  if (!containerRef.current) return;

  const containerRect = containerRef.current.getBoundingClientRect();

  const paths = annotations.map((annotation) => {
    const lureElement = document.querySelector(`[data-lure-id="${annotation.lureId}"]`);
    const cardElement = document.getElementById(`card-${annotation.lureId}`);

    if (!lureElement || !cardElement) return null;

    // Get viewport-relative coordinates
    const lureRect = lureElement.getBoundingClientRect();
    const cardRect = cardElement.getBoundingClientRect();

    // Convert to container-relative coordinates
    const start = {
      x: lureRect.right - containerRect.left,
      y: lureRect.top + lureRect.height / 2 - containerRect.top
    };

    const busX = 1000; // Fixed bus line position
    const end = {
      x: cardRect.left - containerRect.left,
      y: cardRect.top + cardRect.height / 2 - containerRect.top
    };

    return { start, mid1: { x: busX, y: start.y }, mid2: { x: busX, y: end.y }, end };
  }).filter(Boolean);

  setArrowPaths(paths);
}, [annotations, lures]);
```

### Pattern 2: useLayoutEffect for Synchronous Measurements
**What:** Use `useLayoutEffect` instead of `useEffect` when reading DOM layout to prevent visual flicker
**When to use:** When measurements must complete before browser repaint
**Example:**
```typescript
// Source: React docs - useLayoutEffect
import { useLayoutEffect, useState } from 'react';

function ArrowOverlay({ lures }: { lures: Lure[] }) {
  const [arrowPaths, setArrowPaths] = useState<ArrowPath[]>([]);

  useLayoutEffect(() => {
    // This runs synchronously after DOM updates but before paint
    // Prevents user from seeing arrows jump on initial render
    const paths = calculateArrowPaths(lures);
    setArrowPaths(paths);
  }, [lures]);

  return <svg>{/* render arrows */}</svg>;
}
```

### Pattern 3: Debounced Resize Handler
**What:** Throttle layout recalculations during resize events
**When to use:** When resize triggers expensive DOM measurements
**Example:**
```typescript
// Source: Standard debounce pattern
function useDebouncedResize(callback: () => void, delay: number) {
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handler = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        callback();
      }, delay);
    };

    window.addEventListener('resize', handler);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handler);
    };
  }, [callback, delay]);
}
```

### Anti-Patterns to Avoid
- **Using useEffect for layout measurements:** Causes visual flicker as arrows jump on first paint
- **Storing DOM elements in state:** Creates memory leaks and violates React purity
- **Measuring during render:** Not allowed - causes "cannot update during render" errors
- **Direct DOM manipulation in React:** Use refs instead of `document.querySelector` where possible

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| High-res screenshot | Manual canvas drawing | html2canvas | Handles CSS rendering, text wrapping, complex DOM |
| Collision detection | Custom overlap algorithm | Sequential positioning with cumulative offset | Simple and predictable for this use case |
| Elbow connector paths | Manual SVG path strings | SVG polyline/path with calculated points | Standard SVG, browser-optimized |
| Resize throttling | setTimeout in handler | Debounce pattern | Prevents layout thrashing, standard practice |

**Key insight:** Custom coordinate tracking is error-prone - always use `getBoundingClientRect()` relative to a stable container rather than manual offset calculations that break with scroll/layout changes.

## Common Pitfalls

### Pitfall 1: Coordinate System Mismatch
**What goes wrong:** Arrows don't align with elements after scroll or resize
**Why it happens:** Using viewport-relative coordinates (`getBoundingClientRect()` returns values relative to viewport) without adjusting for container position
**How to avoid:** Always subtract container's `getBoundingClientRect().left` and `top` from element coordinates
**Warning signs:** Arrows drift off target when scrolling or window resizes

### Pitfall 2: Layout Measurement Timing
**What goes wrong:** User sees arrows jump or flash on load
**Why it happens:** Using `useEffect` for DOM measurements - browser paints before measurements complete
**How to avoid:** Use `useLayoutEffect` for synchronous measurements that block paint
**Warning signs:** Brief flash of incorrectly positioned arrows on initial render

### Pitfall 3: html2canvas Unsupported CSS
**What goes wrong:** Exported image missing shadows, filters, or other effects
**Why it happens:** html2canvas doesn't support all CSS properties (box-shadow, filter, mix-blend-mode, etc.)
**How to avoid:** Check supported features list, avoid unsupported properties on exported elements
**Warning signs:** Export looks different from screen preview

### Pitfall 4: Resize Performance
**What goes wrong:** Application freezes during window resize
**Why it happens:** Recalculating layout on every `resize` event fires rapidly
**How to avoid:** Debounce resize handler with 100-200ms delay
**Warning signs:** Laggy UI when resizing browser window

### Pitfall 5: SVG Overlay Blocking Interactions
**What goes wrong:** User can't select text or click elements in preview
**Why it happens:** SVG overlay doesn't have `pointer-events: none`
**How to avoid:** Always set `pointer-events: none` on overlay SVG
**Warning signs:** Clicks pass through incorrectly, text selection disabled in preview area

### Pitfall 6: Scale Affects Coordinates
**What goes wrong:** Exported arrows misaligned when using 2x scale
**Why it happens:** html2canvas `scale: 2` doubles pixel dimensions but coordinates need to match original scale
**How to avoid:** Calculate arrow paths at original scale, let html2canvas handle scaling
**Warning signs:** Exported PNG has arrows offset by 2x

## Code Examples

Verified patterns from official sources:

### SVG Overlay with pointer-events: none
```typescript
// Source: MDN SVG docs + React patterns
function ArrowOverlay({ paths }: { paths: ArrowPath[] }) {
  return (
    <svg
      width="1600"
      height="auto"
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="10"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#FF4500" />
        </marker>
      </defs>
      {paths.map((path, index) => (
        <path
          key={index}
          d={`M ${path.start.x} ${path.start.y} L ${path.mid1.x} ${path.mid1.y} L ${path.mid2.x} ${path.mid2.y} L ${path.end.x} ${path.end.y}`}
          stroke="#FF4500"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrowhead)"
        />
      ))}
    </svg>
  );
}
```

### html2canvas High-Res Export
```typescript
// Source: html2canvas official docs
import html2canvas from 'html2canvas';

async function exportSlide(slideWrapper: HTMLElement, filename: string) {
  try {
    const canvas = await html2canvas(slideWrapper, {
      scale: 2,           // 2x for retina sharpness
      useCORS: true,      // Handle cross-origin images
      logging: false,        // Disable console spam
      backgroundColor: '#FFFFFF' // White background
    });

    // Download the canvas as PNG
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Export failed:', error);
    // Show toast notification to user
  }
}
```

### Collision Detection for Cards
```typescript
// Source: Custom algorithm based on requirements
function calculateCardPositions(
  annotations: Annotation[],
  baseY: number = 0,
  gap: number = 24
): Map<string, number> {
  const positions: Map<string, number> = [];
  let currentY = baseY;

  annotations.forEach((annotation) => {
    const cardHeight = estimateCardHeight(annotation.explanation);
    positions.set(annotation.lureId, currentY);
    currentY += cardHeight + gap;
  });

  return positions;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Canvas drawing | html2canvas | Library matured | Declarative, handles complex DOM |
| Coordinate tracking | getBoundingClientRect | Always available | Browser-native, reliable |
| useEffect for measurements | useLayoutEffect | React 16.8+ | No visual flicker, synchronous |
| Manual resize throttling | Debounce pattern | Best practice | Better performance, standard approach |

**Deprecated/outdated:**
- CSSOM API for measurements: Use `getBoundingClientRect()` instead
- Inline SVG without pointer-events: Must set `pointer-events: none` for overlays
- setTimeout for resize: Use debounce pattern instead

## Open Questions

Things that couldn't be fully resolved:

1. **html2canvas TypeScript types**
   - What we know: @types/html2canvas package exists
   - What's unclear: Current version compatibility with html2canvas 1.4.1
   - Recommendation: Install and verify types, create local type definitions if needed

2. **Arrowhead marker scaling**
   - What we know: SVG markers can be defined with refX/refY
   - What's unclear: Whether markers scale correctly when html2canvas uses `scale: 2`
   - Recommendation: Test export with markers, adjust marker size if needed

3. **Performance with many annotations**
   - What we know: Each annotation requires DOM query and measurement
   - What's unclear: How many annotations before performance degrades
   - Recommendation: Implement, test with 10+ annotations, consider virtualization if slow

4. **Tiptap editor content in export**
   - What we know: Tiptap renders semantic HTML
   - What's unclear: Whether all Tiptap styles are supported by html2canvas
   - Recommendation: Test export with rich formatting, verify rendering matches

## Sources

### Primary (HIGH confidence)
- MDN SVG Element - SVG syntax and attributes
- MDN getBoundingClientRect() - DOM measurement API
- React useLayoutEffect - Synchronous layout measurements
- html2canvas official docs - Usage, options, limitations
- html2canvas features list - Supported/unsupported CSS

### Secondary (MEDIUM confidence)
- html2canvas GitHub repo - Current version (1.4.1), release notes
- React Synchronizing with Effects - Effect patterns and best practices

### Tertiary (LOW confidence)
- None (all sources verified with official documentation)

## Metadata

**Confidence breakdown:**
- Standard stack: MEDIUM - html2canvas verified, alternatives not thoroughly tested
- Architecture: HIGH - Based on React official patterns and MDN docs
- Pitfalls: HIGH - html2canvas limitations documented, coordinate systems well-understood

**Research date:** 2026-01-20
**Valid until:** 30 days (React and html2canvas are stable, but verify before planning)
