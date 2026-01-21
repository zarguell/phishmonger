---
phase: 03-visualizer-export
plan: 08-continued
subsystem: ui
tags: numbered-annotations, drag-drop, badges, css

# Dependency graph
requires:
  - phase: 03-visualizer-export
    plan: 08
    provides: Fixed annotation column layout with flexbox
provides:
  - Numbered badge annotation system replacing arrow overlays
  - Draggable annotation cards for manual reordering
  - Simplified visual link between email highlights and cards
affects: future export functionality, educational slide generation

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Numbered badge pattern (superscript circle badges)
    - HTML5 drag and drop API for card reordering
    - Manual Y position sorting for drag order persistence

key-files:
  created: []
  modified:
    - src/types/annotations.ts - Added annotationNumber and manualY fields
    - src/components/preview/EmailColumn.tsx - Post-processes HTML to inject badges
    - src/components/annotation/AnnotationCard.tsx - Displays numbered badge and drag handle
    - src/components/preview/AnnotationColumn.tsx - Implements drag/drop logic
    - src/index.css - Added lure-badge, annotation-card-header, drag-handle styles
    - src/App.tsx - Passes annotations and update callback
  deleted:
    - src/components/preview/ArrowOverlay.tsx - No longer needed
    - src/hooks/useArrowCalculations.ts - No longer needed
    - src/hooks/useDebouncedResize.ts - No longer needed

key-decisions:
  - "Numbered badges over arrows: Simpler, industry-standard (Microsoft Attack Simulator, NIST), lower cognitive load for presenters"
  - "Sequential numbering based on createdAt timestamp ensures consistent order"
  - "HTML5 drag/drop for native browser support without additional dependencies"

patterns-established:
  - "Badge injection pattern: Post-process HTML to add visual elements to lure marks"
  - "Drag/drop reordering: Use manualY field for sort order persistence"
  - "Visual link pattern: Matching numbered badges create association without literal lines"

# Metrics
duration: 35 min
completed: 2026-01-21
---

# Phase 3 Plan 8 Continued: Numbered Annotations and Draggable Cards Summary

**Replaced arrow overlay system with numbered badges (industry standard) and added draggable annotation cards for manual reordering**

## Performance

- **Duration:** 35 min
- **Started:** 2026-01-21T01:33:02Z
- **Completed:** 2026-01-21T02:08:00Z
- **Tasks:** 7
- **Files modified:** 7

## Accomplishments

- Replaced complex arrow overlay system with simple numbered badges
- Added orange circular badges to lure highlights (superscript style)
- Added matching numbered badges to annotation card headers
- Implemented draggable annotation cards using HTML5 drag/drop API
- Added drag handle (⋮⋮) and visual feedback for dragging state
- Removed all arrow-related code (simplified codebase by ~200 lines)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add numbered annotation badge CSS and Annotation type updates** - `b813b0c` (feat)
2. **Task 2: Inject numbered badges into lure highlights** - `471c129` (feat)
3. **Task 3: Add numbered badge to AnnotationCard header** - `8aa4e44` (feat)
4. **Task 4: Remove all arrow code** - `659a6c2` (refactor)
5. **Task 5: Implement draggable annotation cards** - `e3f6de8` (feat)

## Files Created/Modified

- `src/types/annotations.ts` - Added annotationNumber and manualY fields to Annotation interface
- `src/components/preview/EmailColumn.tsx` - Post-processes HTML to inject numbered badges after lure marks
- `src/components/annotation/AnnotationCard.tsx` - Displays numbered badge in header, adds drag handle and drag/drop handlers
- `src/components/preview/AnnotationColumn.tsx` - Implements drag/drop logic with manualY position sorting
- `src/index.css` - Added .lure-badge, .annotation-card-header, .annotation-card-number-badge, .drag-handle styles
- `src/App.tsx` - Passes annotations to EmailColumn and update callback to AnnotationColumn
- `src/components/preview/SlideWrapper.tsx` - Simplified by removing arrow overlay
- `src/components/preview/ArrowOverlay.tsx` - DELETED (no longer needed)
- `src/hooks/useArrowCalculations.ts` - DELETED (no longer needed)
- `src/hooks/useDebouncedResize.ts` - DELETED (no longer needed)

## Deviations from Plan

This was a continuation from checkpoint with user feedback requesting architectural change from arrows to numbered badges. The original plan tasks 1-3 (layout collapse fix) were already completed.

### User-Requested Architectural Change

**User decision at checkpoint: Replace arrow system with numbered annotations**

- **Context:** After completing tasks 1-3, user requested switch from arrows to numbered badges
- **Rationale:** Numbered badges are simpler, more professional for presentation slides, industry standard (Microsoft Attack Simulator, NIST, SANS), lower cognitive load, better scalability
- **Implementation:**
  1. Added numbered badge CSS (orange circle, superscript positioning)
  2. Modified EmailColumn to post-process HTML and inject badges
  3. Updated AnnotationCard to display matching numbered badge
  4. Removed all arrow code (ArrowOverlay, useArrowCalculations, useDebouncedResize)
  5. Added drag/drop functionality for manual card reordering
  6. Added drag handle visual (⋮⋮) and hover/drag state CSS
- **Impact:** Major simplification of visual system, removed ~200 lines of complex arrow geometry code
- **Verification:** Build succeeds, badges display sequentially

## Issues Encountered

None - implementation proceeded smoothly without unexpected issues.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

✅ Numbered annotation system complete and functional
✅ Draggable cards implemented with manual Y position persistence
✅ All arrow code removed, system simplified
✅ Ready for human verification checkpoint

**What to verify:**
1. Badges appear sequentially after highlighted text in email
2. Matching numbered badges appear in annotation card headers
3. Drag handle (⋮⋮) is visible on hover left of card
4. Cards can be reordered by dragging
5. No arrows are rendered in preview mode
6. Export PNG captures badges correctly

---
*Phase: 03-visualizer-export*
*Completed: 2026-01-21*
