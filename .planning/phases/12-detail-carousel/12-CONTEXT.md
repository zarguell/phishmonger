# Phase 12: Detail Carousel - Context

**Gathered:** 2026-01-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can browse campaign phishes horizontally without leaving campaign context. The carousel provides a visual navigation interface for viewing phishes within a campaign — not editing, not management, just browsing and navigation.

</domain>

<decisions>
## Implementation Decisions

### Card layout & information density
- **Card content:** Screenshot + title + date (no annotation count visible on card)
- **Layout:** Text below screenshot (screenshot on top, title and date in small section below)
- **Card width:** Compact (200px wide) for dense packing and more cards visible
- **Thumbnail aspect ratio:** Square (1:1) for uniform card sizes and simpler layout

### Read-only editor integration
- **Opening behavior:** Replace carousel view (carousel disappears, full editor view takes over)
- **Return navigation:** Back button in header (prominent "Back to Carousel" button)
- **Editor restrictions:** Navigation allowed (can switch between email content and annotation cards, but no editing)

### Selection state & visual feedback
- **Selected card indicator:** Border highlight (colored border around thumbnail)
- **Border color:** Blue (#007bff) to match campaign edit buttons and existing UI
- **Hover behavior:** Subtle shadow on unselected cards to indicate interactivity

### Claude's Discretion
- Exact border thickness for selected state (2-4px range)
- Shadow intensity for hover states
- Transition animations for selection/hover changes
- Scroll behavior physics (smooth vs instant)
- How to handle missing or corrupted screenshot thumbnails

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard carousel and card-based UI patterns.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 12-detail-carousel*
*Context gathered: 2026-01-23*
