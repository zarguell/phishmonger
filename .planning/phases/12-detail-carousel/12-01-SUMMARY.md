# Phase 12 Plan 01: Detail Carousel Components Summary

**One-liner:** Horizontal carousel with CSS scroll snap for browsing campaign phishes using native browser APIs

**Completed:** 2026-01-23
**Duration:** ~3 minutes
**Commits:** 2

---

## Frontmatter

```yaml
phase: 12-detail-carousel
plan: 01
title: Detail Carousel Components
status: complete
completed: 2026-01-23
duration_minutes: 3
```

## Dependency Graph

**Requires:**
- Phase 9: Campaign data model with CampaignPhish type
- Phase 10: Campaign management UI patterns (inline styles, modal overlay)

**Provides:**
- Horizontal carousel container with scroll snap
- Individual phish card component with thumbnail and metadata
- Component interfaces: `CampaignCarousel(campaign, onCardClick)`, `CarouselCard(phish, onClick, isSelected)`

**Affects:**
- Phase 12-03: Carousel integration (consumes CampaignCarousel)
- Phase 12-04: Campaign editor integration (add "View Carousel" button)

## Tech Stack

**Added:**
- None (uses existing React patterns and native CSS)

**Patterns:**
- CSS scroll-snap-type for native horizontal scrolling
- useRef + scrollBy for programmatic navigation
- Inline styles matching existing CampaignCard pattern
- GPU-accelerated transform for hover effects
- Lazy loading for thumbnail images

## Key Files

**Created:**
- `src/components/campaign/CarouselCard.tsx` (143 lines)
- `src/components/campaign/CampaignCarousel.tsx` (195 lines)

**Modified:**
- None

## Implementation Details

### CarouselCard Component

**Props Interface:**
```typescript
interface CarouselCardProps {
  phish: CampaignPhish
  onClick: () => void
  isSelected?: boolean
}
```

**Card Structure:**
1. **Container** (200px fixed width):
   - flex: '0 0 200px' (won't grow/shrink)
   - Border: 2px solid transparent → #007bff when selected
   - Rounded corners (8px)
   - Click handler with cursor pointer

2. **Thumbnail Area** (square 1:1 aspect ratio):
   - Displays screenshot thumbnail if available
   - Placeholder icon (🎣) when no thumbnail
   - Gray background (#f3f4f6) for placeholder
   - Lazy loading with loading="lazy"
   - onError handler for missing images

3. **Metadata Section:**
   - Title: truncated with ellipsis (max 2 lines)
   - Scheduled date: formatted as "MMM DD, YYYY" or "No date set"
   - Annotation count: displayed in gray badge (e.g., "3 annotations")
   - Font sizes: 14px title, 12px date/count

4. **Hover Effect:**
   - GPU-accelerated transform: translateY(-4px)
   - Elevation effect using box-shadow (not animated)
   - 0.2s ease transition

### CampaignCarousel Component

**Props Interface:**
```typescript
interface CampaignCarouselProps {
  campaign: Campaign
  onCardClick: (phish: CampaignPhish) => void
}
```

**Scroll Container (per RESEARCH.md Pattern 1):**
- display: 'flex'
- overflowX: 'scroll'
- scrollSnapType: 'x mandatory'
- gap: '16px'
- padding: '16px 56px' (extra for nav buttons)
- Scrollbar hidden (Firefox: scrollbarWidth, WebKit: CSS)

**Navigation Buttons (per RESEARCH.md Pattern 2):**
- Absolute positioned (left: 8px, right: 8px)
- Circular design (40px diameter)
- Scroll amount: container.clientWidth * 0.8 (80% of viewport)
- behavior: 'smooth' for smooth scrolling
- Hover state with darker background

**Card Rendering:**
- Map campaign.campaignPhishes to CarouselCard components
- Pass isSelected={phish.id === selectedPhishId}
- onClick sets selectedPhishId and calls onCardClick(phish)
- scrollIntoView() to center clicked card

**Empty Campaign Handling:**
- Centered message: "No phishes in this campaign"
- Empty state icon (📭)
- Gray text with helpful subtext

**CSS Scroll Snap Configuration:**
- scrollSnapType: 'x mandatory' on container
- scrollSnapAlign: 'start' on each card
- scrollSnapStop: 'always' (never skip cards)

### Styling Patterns

**Following CONTEXT.md decisions:**
- Card width: 200px compact
- Screenshot on top, text section below
- Square thumbnail (aspectRatio: '1/1', objectFit: 'cover')
- Selected state: Blue border (#007bff)
- Hover: Subtle shadow using GPU-accelerated transform (not box-shadow animation)
- Transition: 0.2s ease on border-color and transform

**Following inline style pattern from CampaignCard.tsx:**
- No external CSS files
- All styles via style={{}} props
- onMouseEnter/onMouseLeave for hover states

## Deviations from Plan

**None** - plan executed exactly as written.

## Verification Results

**All criteria met:**
- [x] CampaignCarousel component accepts campaign and onCardClick props
- [x] Horizontal scroll works with mouse/touch drag
- [x] Scroll snaps to each card position (no partial stops between cards)
- [x] Prev/Next buttons scroll by ~80% of viewport width
- [x] CarouselCard displays thumbnail placeholder, title, scheduled date, and annotation count
- [x] Selected card shows blue border (#007bff)
- [x] Hover state shows elevation effect
- [x] Empty campaign shows appropriate message
- [x] No external dependencies - all native React/CSS

**TypeScript:** No compilation errors

**File stats:**
- CarouselCard: 143 lines (exceeds 60-line minimum)
- CampaignCarousel: 195 lines (exceeds 80-line minimum)
- Exports: CarouselCard, CampaignCarousel
- Imports: Campaign, CampaignPhish types from campaign.ts

**Annotation count verification:**
- Uses `Object.keys(phish.annotations).length` to count annotations
- Displays pluralized text ("1 annotation" vs "3 annotations")
- Gray badge styling (#e5e7eb background, 11px font)

## Next Phase Readiness

**Ready for Phase 12-03:** Carousel integration

**Integration points:**
- Import CampaignCarousel in CampaignEditor or campaign detail view
- Pass campaign and onCardClick handler
- Handle card clicks to open ReadOnlyEditor (already created in 12-02)

**No blockers identified**

---

**Commits:**
- `f476b83`: feat(12-01): create CarouselCard component with thumbnail and metadata
- `11223df`: feat(12-01): create CampaignCarousel with horizontal scroll and snap
