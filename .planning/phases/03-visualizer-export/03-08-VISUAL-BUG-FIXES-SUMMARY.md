---
phase: 03-visualizer-export
plan: 08
subsystem: ui
tags: [react, typescript, svg, visualization, bug-fix, bus-line-geometry]

# Dependency graph
requires:
  - phase: 03-visualizer-export
    plan: 07
    provides: preview mode integration and slide layout
provides:
  - Bus Line arrow geometry with 3-segment path routing
  - Fixed arrow rendering that avoids crossing email text
  - Proper email column padding for full-width text rendering
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns: [3-segment bus line routing, fixed X-coordinate vertical movement]

key-files:
  modified: [src/hooks/useArrowCalculations.ts, src/components/preview/ArrowOverlay.tsx, src/components/preview/EmailColumn.tsx]

key-decisions:
  - "Bus Line at fixed X=980px ensures all vertical movement happens in gutter between columns"
  - "5px buffer zones at start/end prevent arrows from touching highlight borders or card edges"

patterns-established:
  - "3-segment arrow path: horizontal from lure → vertical on bus line → horizontal to card"
  - "Container-relative coordinate system for arrow calculations"

# Metrics
duration: 3min
completed: 2026-01-20
---

# Phase 3 Plan 8: Visual Bug Fixes Summary

**Bus Line geometry implementation with 3-segment arrow routing and proper email column padding**

## Performance

- **Duration:** 3 min
- **Started:** 2026-01-20T22:45:33Z
- **Completed:** 2026-01-20T22:49:09Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Implemented strict 3-segment Bus Line geometry for arrow routing
- Fixed arrow rendering to avoid crossing email text content
- Verified email column padding is correct (40px on all sides)
- Arrow SVG overlay has proper z-index and pointer-events

## Task Commits

Each task was committed atomically:

1. **Task 1: Implement Bus Line geometry for arrows** - `59d50e5` (fix)
2. **Task 2: Add comment clarifying EmailColumn padding** - `8f2c1f6` (fix)

**Plan metadata:** (to be committed after summary)

## Files Created/Modified

- `src/hooks/useArrowCalculations.ts` - Updated to implement 3-segment Bus Line path with fixed X=980px vertical routing
- `src/components/preview/ArrowOverlay.tsx` - Updated to render 4-point (3-segment) SVG paths
- `src/components/preview/EmailColumn.tsx` - Added clarifying comment (padding already correct in CSS)

## Decisions Made

- Bus Line X-coordinate fixed at 980px (960px column split + 20px gutter)
- All vertical arrow movement happens ONLY on bus line to avoid crossing text
- 5px buffer zones at lure.right and card.left prevent visual overlap
- ArrowPath interface renamed for clarity: midHorizontal, midVertical (was mid1, mid2)

## Deviations from Plan

None - implemented exactly as specified in user feedback.

## Issues Encountered

**TypeScript interface mismatch during refactoring:**
- Changed ArrowPath from 4-point to 3-point interface mid-implementation
- First attempt used mid1/mid2/mid3, then simplified to midHorizontal/midVertical
- Resolved by updating both interface and all references in ArrowOverlay component

**Verification:**
- TypeScript compilation succeeds with no errors
- Arrow paths use correct 3-segment geometry

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Bus Line arrow geometry is complete and follows visual specification
- Arrows naturally avoid crossing email text by routing immediately right to bus line
- Email column padding correct for full-width text rendering
- Ready for Phase 4 (NIST Phish Scale Scoring)

---
*Phase: 03-visualizer-export*
*Completed: 2026-01-20*
