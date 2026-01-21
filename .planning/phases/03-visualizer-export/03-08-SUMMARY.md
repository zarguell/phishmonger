---
phase: 03-visualizer-export
plan: 08
subsystem: ui
tags: [flexbox, numbered-badges, drag-drop, html2canvas, css-overflow]

# Dependency graph
requires:
  - phase: 03-visualizer-export
    provides: Slide layout components (SlideWrapper, EmailColumn, AnnotationColumn)
provides:
  - Numbered badge annotation system (replacing arrow overlays)
  - Draggable annotation cards with manualY sort order
  - Fixed email content clipping with proper overflow handling
affects: Phase 4 (NIST Phish Scale Scoring) - preview mode now fully functional

# Tech tracking
tech-stack:
  added: [HTML5 Drag and Drop API]
  patterns: [Numbered visual annotations, CSS flexbox card layout, overflow-x auto handling]

key-files:
  created: []
  modified: [src/index.css, src/components/preview/AnnotationColumn.tsx, src/components/annotation/AnnotationCard.tsx, src/components/preview/EmailColumn.tsx, src/App.tsx, src/types/annotations.ts]
  deleted: [src/components/preview/ArrowOverlay.tsx, src/hooks/useArrowCalculations.ts, src/hooks/useDebouncedResize.ts, src/hooks/useCardLayout.ts]

key-decisions:
  - "Numbered badges over arrows: Industry standard (Microsoft Attack Simulator, NIST), simpler implementation, better scalability"
  - "HTML5 drag/drop for card reordering: Native browser support without additional dependencies"
  - "Flexbox over absolute positioning: Simpler, more maintainable, responsive layout"

patterns-established:
  - "Numbered annotations: Sequential 1, 2, 3 badges connect lure highlights to annotation cards"
  - "Draggable cards: HTML5 drag/drop API with manualY field for sort order persistence"
  - "Overflow handling: overflow-x: auto on both .app-preview-mode and .email-content for wide content"

# Metrics
duration: 15 min
completed: 2026-01-20
---

# Phase 3: Plan 8 Summary

**Numbered badge annotation system with draggable cards and critical email clipping fixes**

## Performance

- **Duration:** 15 min
- **Started:** 2026-01-20T10:00:00Z (estimated)
- **Completed:** 2026-01-20T10:15:00Z (estimated)
- **Tasks:** 10 (8 original + 2 critical fixes)
- **Files modified:** 6
- **Files deleted:** 4

## Accomplishments

- **Replaced arrow system with numbered badges** - Simpler, industry-standard visual annotation pattern used by Microsoft Attack Simulator and NIST
- **Implemented draggable annotation cards** - Users can reorder cards via drag handle (⋮⋮) with manualY field for sort order persistence
- **Fixed critical email clipping bug** - Added `overflow-x: auto` to both `.app-preview-mode` and `.email-content` to handle wide phishing emails (tables, images)
- **Deleted deprecated code** - Removed ArrowOverlay, useArrowCalculations, useDebouncedResize, and useCardLayout (no longer needed with flexbox)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add position relative to annotation-column CSS** - `6061ed2` (feat)
2. **Task 2: Remove absolute positioning from AnnotationColumn** - `397ce7c` (feat)
3. **Task 3: Delete deprecated useCardLayout hook** - `9b76dcd` (refactor)
4. **Task 4: Add numbered annotation badge CSS and Annotation type updates** - `b813b0c` (feat)
5. **Task 5: Inject numbered badges into lure highlights** - `471c129` (feat)
6. **Task 6: Add numbered badge to AnnotationCard header** - `8aa4e44` (feat)
7. **Task 7: Remove all arrow code** - `659a6c2` (refactor)
8. **Task 8: Implement draggable annotation cards** - `e3f6de8` (feat)
9. **Task 9: Fix email content clipping** - `921062b` (fix) - **Critical fix post-checkpoint**
10. **Task 10: Add horizontal scroll to preview mode** - `071ef3a` (fix) - **Critical fix post-checkpoint**

**Plan metadata:** `fef69ae` (docs: complete numbered annotations implementation)

## Files Created/Modified

### Modified:
- `src/index.css` - Added `.lure-badge` CSS (orange circle, superscript), drag handle styles, `.email-content` overflow handling, `.app-preview-mode` horizontal scroll
- `src/components/preview/AnnotationColumn.tsx` - Switched to flexbox layout (removed absolute positioning), added drag/drop handlers
- `src/components/annotation/AnnotationCard.tsx` - Added numbered badge to header, drag handle (⋮⋮), draggable attributes, visual feedback
- `src/components/preview/EmailColumn.tsx` - Inject numbered badges after lure highlights via DOMParser
- `src/App.tsx` - Added manualY field to Annotation interface for sort order persistence
- `src/types/annotations.ts` - Added `manualY?: number` field to Annotation type

### Deleted:
- `src/components/preview/ArrowOverlay.tsx` - SVG arrow overlay component (replaced by numbered badges)
- `src/hooks/useArrowCalculations.ts` - Arrow coordinate calculations (no longer needed)
- `src/hooks/useDebouncedResize.ts` - Debounced resize handler for arrows (no longer needed)
- `src/hooks/useCardLayout.ts` - Card layout calculations (replaced by flexbox)

## Decisions Made

### Numbered Badges Over Arrows
**Decision:** Replace SVG arrow overlay system with numbered badge annotations
**Rationale:**
- Industry standard (Microsoft Attack Simulator, NIST training materials)
- Simpler implementation - no coordinate calculations, resize handlers, or SVG overlays
- Lower cognitive load for presenters (referencing "Annotation 3" vs "the arrow pointing to the login button")
- Better scalability - works with any number of annotations without visual clutter
**Outcome:** Deleted 150+ lines of arrow code, simpler system

### HTML5 Drag/Drop for Card Reordering
**Decision:** Use native HTML5 drag/drop API for card reordering
**Rationale:**
- No additional dependencies (react-beautiful-dnd, react-dnd)
- Native browser support, stable API
- Simple implementation with onDragStart, onDragOver, onDrop handlers
**Outcome:** Cards reorderable via drag handle (⋮⋮), sort order persisted via manualY field

### Overflow Handling for Wide Content
**Decision:** Add `overflow-x: auto` to both `.app-preview-mode` and `.email-content`
**Rationale:**
- Phishing emails often have wide tables (600-800px) or images
- 1600px slide width exceeds viewport on smaller screens
- Email column has 960px width but 80px padding → 880px content area
- Without overflow handling, content clipped off-screen (unusable)
**Outcome:** Wide content now scrolls horizontally instead of being clipped

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed email content clipping off-screen**

- **Found during:** User verification checkpoint after Task 8
- **Issue:** User reported "phishing email is off the screen. So this is unusable."
  - `.email-content` had no width or overflow rules (just comment: "Inherits styling from preview-pane")
  - `.app-preview-mode` lacked overflow-x for wide slide content (1600px)
  - Wide phishing emails (tables, images > 880px) clipped off-screen
- **Fix:**
  1. Added `width: 100%`, `max-width: 100%`, `overflow-x: auto` to `.email-content`
  2. Added `overflow-x: auto` to `.app-preview-mode`
  3. Allows horizontal scroll for wide content while staying within column bounds
- **Files modified:** `src/index.css`
- **Verification:**
  - `.email-content` now respects 880px max width (960px - 80px padding)
  - Wide content scrolls horizontally instead of clipping
  - Preview mode scrolls horizontally when slide exceeds viewport
- **Committed in:**
  - `921062b` (Task 9: fix email content clipping)
  - `071ef3a` (Task 10: add horizontal scroll to preview mode)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Critical fix - was blocking usability. Email content now fully visible for all phishing email layouts.

## Issues Encountered

**User feedback after checkpoint:** "The annotation system is much better. HOWEVER. The phishing email is off the screen. So this is unusable."

**Root cause analysis:**
- Original plan focused on arrow → numbered badge migration
- `.email-content` CSS had comment about inheriting from preview-pane but no actual rules
- `.app-preview-mode` had no overflow handling for 1600px slide width
- User testing revealed wide content (tables, images) clipped off-screen

**Resolution:**
- Applied deviation Rule 1 (auto-fix bugs)
- Added proper overflow handling to both container levels
- User can now scroll horizontally to view wide content
- Verified fix prevents clipping while maintaining slide layout

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for Phase 4 (NIST Phish Scale Scoring):**
- ✅ Preview mode fully functional with scrollable content
- ✅ Numbered badge annotation system complete
- ✅ Annotation cards draggable and reorderable
- ✅ Export PNG functionality intact (html2canvas)
- ✅ All layout issues resolved

**No blockers or concerns**

---
*Phase: 03-visualizer-export*
*Completed: 2026-01-20*
