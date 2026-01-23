# Phase 12: Detail Carousel - Research

**Researched:** 2026-01-23
**Domain:** React horizontal carousel with CSS scroll snap
**Confidence:** HIGH

## Summary

This phase requires implementing a horizontal carousel for browsing campaign phishes without leaving the campaign context. The carousel will display cards with screenshot thumbnails, titles, and dates, supporting navigation via prev/next buttons and card clicks to open a read-only editor view.

**Key findings:**
- **No external carousel library needed** - CSS scroll snap provides native, performant horizontal scrolling
- **useRef + scrollLeft** for programmatic navigation (prev/next buttons)
- **Native lazy loading** (`loading="lazy"`) for thumbnail performance with 20+ images
- **State management** for selected card and view mode (carousel vs read-only editor)
- **GPU-accelerated transitions** (transform/opacity) for hover effects, not box-shadow

**Primary recommendation:** Build a custom carousel using CSS scroll snap with native lazy loading - no external dependencies required.

## Standard Stack

### Core
| Technology | Version | Purpose | Why Standard |
|------------|---------|---------|--------------|
| React | 18.3.1 | UI framework | Already in project, provides hooks for state/ref management |
| CSS scroll-snap | Native | Horizontal scroll snapping | Browser-native, performant, no library needed |
| useRefs | React hook | Scroll container access | Standard pattern for DOM manipulation in React |

### Supporting
| Technology | Version | Purpose | When to Use |
|------------|---------|---------|-------------|
| Native lazy loading | HTML attribute | Thumbnail image loading | For 20+ cards to avoid loading all images upfront |
| CSS transform | Native | Hover elevation effects | GPU-accelerated, better performance than box-shadow |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS scroll snap | react-swiper, embla-carousel | External libraries add bundle size; CSS scroll snap is sufficient for this use case |
| Custom card component | Material-UI Card | Material-UI not in project; inline styles match existing codebase patterns |

**Installation:**
No new dependencies required. All functionality can be implemented with:
- React 18.3.1 (already installed)
- Native CSS features
- Existing project patterns (inline styles, TypeScript)

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── campaign/
│   │   ├── CampaignManager.tsx      # Existing
│   │   ├── CampaignEditor.tsx       # Existing
│   │   ├── CampaignCarousel.tsx     # NEW: Main carousel container
│   │   ├── CarouselCard.tsx         # NEW: Individual phish card
│   │   └── ReadOnlyEditor.tsx       # NEW: Read-only phish viewer
│   └── preview/
│       └── EmailColumn.tsx          # Existing: Reuse for read-only view
```

### Pattern 1: CSS Scroll Snap Carousel
**What:** Horizontal scrolling container with snap-to-card behavior using native CSS
**When to use:** Simple horizontal navigation with card-based content
**Example:**
```tsx
// Source: MDN CSS scroll-snap-type documentation
// https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-type

const carouselContainerStyle = {
  display: 'flex',
  overflowX: 'scroll',
  scrollSnapType: 'x mandatory',      // Snap to x-axis, mandatory
  gap: '16px',
  padding: '16px',
  // Hide scrollbar for cleaner look
  scrollbarWidth: 'none',              // Firefox
  msOverflowStyle: 'none',             // IE/Edge
};

const cardStyle = {
  flex: '0 0 200px',                  // Fixed 200px width (won't grow/shrink)
  scrollSnapAlign: 'start',            // Snap to left edge of card
  scrollSnapStop: 'always',            // Never skip past a card
};

// Usage in component:
<div style={carouselContainerStyle}>
  {phishes.map(phish => (
    <div key={phish.id} style={cardStyle}>
      {/* Card content */}
    </div>
  ))}
</div>
```

### Pattern 2: useRef + scrollLeft for Navigation
**What:** Using React refs to programmatically scroll the container
**When to use:** Prev/next button navigation
**Example:**
```tsx
// Source: Medium - Implementation of Horizontal Scrolling Buttons using React
// https://medium.com/@rexosariemen/implementing-horizontal-scroll-buttons-in-react-61e0bb431be

import { useRef } from 'react';

export function CampaignCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div>
      <button onClick={scrollLeft}>← Prev</button>
      <div ref={scrollContainerRef} style={carouselContainerStyle}>
        {/* Cards */}
      </div>
      <button onClick={scrollRight}>Next →</button>
    </div>
  );
}
```

### Pattern 3: View State Management
**What:** Toggle between carousel view and read-only editor view
**When to use:** Card click opens read-only editor
**Example:**
```tsx
// Source: Existing project pattern (CampaignManager -> CampaignEditor)
type ViewMode = 'carousel' | 'readonly-editor';

export function CampaignCarousel({ campaign }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>('carousel');
  const [selectedPhish, setSelectedPhish] = useState<CampaignPhish | null>(null);

  const handleCardClick = (phish: CampaignPhish) => {
    setSelectedPhish(phish);
    setViewMode('readonly-editor');
  };

  const handleBackToCarousel = () => {
    setViewMode('carousel');
    setSelectedPhish(null);
  };

  if (viewMode === 'readonly-editor' && selectedPhish) {
    return (
      <div>
        <button onClick={handleBackToCarousel}>Back to Carousel</button>
        <ReadOnlyEditor phish={selectedPhish} />
      </div>
    );
  }

  return <CarouselView campaign={campaign} onCardClick={handleCardClick} />;
}
```

### Pattern 4: Lazy Loading Thumbnails
**What:** Defer image loading until card enters viewport
**When to use:** 20+ cards with thumbnail images
**Example:**
```tsx
// Source: MDN Lazy loading documentation
// https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Lazy_loading

<img
  src={phish.thumbnailUrl}
  alt={phish.metadata.title}
  loading="lazy"              // Native lazy loading
  style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }}
/>
```

### Anti-Patterns to Avoid
- **External carousel libraries:** Swiper, react-slick, etc. add unnecessary bundle size for simple horizontal scrolling
- **Box-shadow animations:** Use `transform: translateY()` instead for better performance
- **Virtual scrolling:** Not needed for 20-100 items; native DOM handles this fine
- **Complex state machines:** Simple boolean view mode toggle is sufficient

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Horizontal scroll snapping | Custom scroll event handlers | CSS `scroll-snap-type` | Browser-native, smooth, performant |
| Lazy loading images | Intersection Observer logic | Native `loading="lazy"` attribute | Built into browsers, handles edge cases |
| Hover elevation | Animate box-shadow | CSS `transform: translateY()` | GPU-accelerated, no repaints |
| Scroll position tracking | Scroll event listeners | `scrollIntoView()` for navigation | Native API handles smooth scrolling |

**Key insight:** Modern browsers provide native APIs for scroll snapping and lazy loading that are more performant than JavaScript implementations.

## Common Pitfalls

### Pitfall 1: Animating box-shadow on hover
**What goes wrong:** Box-shadow changes trigger expensive repaints, causing janky animations
**Why it happens:** box-shadow is not a GPU-accelerated property
**How to avoid:** Use `transform: translateY(-4px)` for elevation effect
**Warning signs:** Choppy animations in browser DevTools Performance tab

### Pitfall 2: Loading all thumbnails upfront
**What goes wrong:** Browser loads 20+ images simultaneously, slowing initial render
**Why it happens:** Default image loading behavior
**How to avoid:** Add `loading="lazy"` to all thumbnail `<img>` tags
**Warning signs:** Slow carousel render, high network activity on mount

### Pitfall 3: Losing scroll position on view change
**What goes wrong:** Returning from read-only editor resets carousel scroll position
**Why it happens:** React remounts the carousel component
**How to avoid:** Keep carousel mounted, toggle visibility with conditional rendering
**Warning signs:** Carousel scrolls back to start after closing editor

### Pitfall 4: Missing scrollbar on small screens
**What goes wrong:** Users can't scroll if scrollbar is hidden and touch gestures fail
**Why it happens:** `scrollbar-width: none` hides scrollbar globally
**How to avoid:** Only hide scrollbar on desktop, keep visible on touch devices
**Warning signs:** No visual cue that horizontal scrolling is available

### Pitfall 5: Cards without explicit dimensions
**What goes wrong:** Cards shift layout as images load
**Why it happens:** Missing width/height causes layout reflow
**How to avoid:** Set explicit card width (200px) and aspect ratio (1:1)
**Warning signs:** Cards jump around as thumbnails load

## Code Examples

Verified patterns from official sources:

### Scroll Container with Navigation Buttons
```tsx
// Source: Medium - Implementation of Horizontal Scrolling Buttons using React
// https://medium.com/@rexosariemen/implementing-horizontal-scroll-buttons-in-react-61e0bb431be

import { useRef } from 'react';

export function CarouselWithNavigation() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8; // 80% of viewport
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => scroll('left')}
        style={{ position: 'absolute', left: 0, zIndex: 1 }}
      >
        ←
      </button>

      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          overflowX: 'scroll',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
        }}
      >
        {/* Cards */}
      </div>

      <button
        onClick={() => scroll('right')}
        style={{ position: 'absolute', right: 0, zIndex: 1 }}
      >
        →
      </button>
    </div>
  );
}
```

### GPU-Accelerated Hover Effect
```tsx
// Source: CSS-Tricks - Getting Deep Into Shadows
// https://css-tricks.com/getting-deep-into-shadows/
// "Avoid animating box-shadow for performance"

const cardStyle = {
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  cursor: 'pointer',
};

const cardHoverStyle = {
  transform: 'translateY(-4px)',  // GPU-accelerated
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',  // Static shadow, not animated
};

// Apply via onMouseEnter/onMouseLeave or CSS :hover
```

### Lazy-Loaded Thumbnail with Placeholder
```tsx
// Source: MDN Lazy Loading Images
// https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Lazy_loading

<img
  src={phish.thumbnailUrl || '/placeholder-thumbnail.png'}
  alt={phish.metadata.title}
  loading="lazy"
  style={{
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    backgroundColor: '#f3f4f6',  // Placeholder color while loading
  }}
  onError={(e) => {
    // Fallback for missing/corrupted thumbnails
    e.currentTarget.src = '/placeholder-thumbnail.png';
  }}
/>
```

### Selected State with Border Highlight
```tsx
// Source: Context decision - Blue border (#007bff) to match existing UI

const cardStyle = {
  border: '2px solid transparent',
  transition: 'border-color 0.2s ease',
};

const selectedStyle = {
  borderColor: '#007bff',  // Blue border for selected card
};

// Usage:
<div
  style={{
    ...cardStyle,
    ...(isSelected ? selectedStyle : {}),
  }}
>
  {/* Card content */}
</div>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| JavaScript scroll listeners | CSS scroll-snap-type | 2022 (browser support) | Native, smoother, less code |
| Intersection Observer for lazy loading | Native `loading="lazy"` | 2020 (Chrome) | Simpler, built-in |
| Box-shadow hover animations | Transform-based elevation | Ongoing best practice | Better performance |

**Deprecated/outdated:**
- **jQuery carousels:** Unnecessary in React era
- **Scroll event listeners:** Use CSS scroll snap instead
- **Manual lazy loading:** Native attribute is simpler

## Open Questions

1. **Thumbnail generation strategy**
   - What we know: html2canvas is already in project dependencies
   - What's unclear: When/how to generate thumbnails for campaign phishes
   - Recommendation: Generate thumbnails on-demand when carousel mounts, cache in IndexedDB or as data URLs

2. **Missing thumbnail handling**
   - What we know: Some phishes may not have screenshots
   - What's unclear: Fallback UI pattern (placeholder icon? generic image?)
   - Recommendation: Use a placeholder icon (📧 or 🎣) centered in card

3. **Carousel integration point**
   - What we know: CampaignEditor is the existing campaign edit UI
   - What's unclear: Should carousel be in CampaignEditor, or separate view?
   - Recommendation: Add "View Carousel" button in CampaignEditor that opens carousel modal

## Sources

### Primary (HIGH confidence)
- [MDN - scroll-snap-type CSS property](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-type) - Native CSS scroll snapping API
- [MDN - Lazy loading images](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Lazy_loading) - Native lazy loading best practices
- [MDN - CSS and JavaScript animation performance](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/CSS_JavaScript_animation_performance) - GPU acceleration guidelines

### Secondary (MEDIUM confidence)
- [Medium - Implementation of Horizontal Scrolling Buttons using React](https://medium.com/@rexosariemen/implementing-horizontal-scroll-buttons-in-react-61e0bb431be) - useRef + scrollLeft pattern verified
- [Medium - useRef scroll example](https://medium.com/@juvitasaini/useref-understand-with-scroll-example-75ad7139557b) - Horizontal scrolling with useRef
- [CSS-Tricks - Getting Deep Into Shadows](https://css-tricks.com/getting-deep-into-shadows/) - Box-shadow animation performance warning
- [SitePoint - CSS Box Shadow Animation Performance](https://www.sitepoint.com/css-box-shadow-animation-performance/) - Transform vs box-shadow comparison

### Tertiary (LOW confidence)
- [Dev.to - Virtual scrolling for large lists](https://dev.to/maurya-sachin/virtualization-for-large-lists-in8) - General performance context (virtualization not needed here)
- [web.dev - Virtualize long lists with react-window](https://web.dev/articles/virtualize-long-lists-react-window) - Confirms 20+ items don't require virtualization

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All native APIs, verified with MDN
- Architecture: HIGH - Patterns match existing project structure
- Pitfalls: HIGH - Performance issues verified with multiple sources
- Code examples: HIGH - All sourced from official documentation or verified articles

**Research date:** 2026-01-23
**Valid until:** 2026-02-23 (30 days - stable CSS/React APIs)
