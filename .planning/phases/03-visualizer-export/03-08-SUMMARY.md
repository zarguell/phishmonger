---
phase: 03-visualizer-export
plan: 08
subsystem: ui
tags: flexbox, css, layout, positioning, preview-mode

# Dependency graph
requires:
  - phase: 03-visualizer-export
    provides: Three-column slide layout with EmailColumn and AnnotationColumn
provides:
  - Fixed annotation column layout using flexbox instead of absolute positioning
  - Eliminated manual Y-position calculation logic
  - Established proper positioned context for parent element
affects: arrow-overlay, export-png

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Flexbox-based vertical layout with gap spacing
    - Parent positioned context for child elements

key-files:
  created: []
  modified:
    - src/index.css
    - src/components/preview/AnnotationColumn.tsx
  deleted:
    - src/hooks/useCardLayout.ts

key-decisions:
  - "Flexbox over absolute positioning: Simpler, more maintainable, responsive"
  - "Deleted useCardLayout hook: No longer needed with flexbox layout"

patterns-established:
  - "Pattern 1: Flexbox gap for card spacing eliminates manual Y calculations"
  - "Pattern 2: Position relative on parent ensures proper coordinate system"

# Metrics
duration: 2 min
completed: 2026-01-20
---

# Phase 3 Plan 08: Layout Collapse Fix Summary

**Replaced absolute positioning with flexbox layout for annotation cards, eliminating parent collapse and coordinate system escape**

## Performance

- **Duration:** 2 min
- **Started:** 2026-01-20T22:38:09Z
- **Completed:** 2026-01-20T22:40:34Z
- **Tasks:** 3
- **Files modified:** 2 files changed, 48 deletions, 6 insertions

## Accomplishments

- Fixed layout collapse in preview mode by establishing positioned context on `.annotation-column`
- Replaced absolute positioning with flexbox layout for annotation cards
- Removed manual Y-position calculation logic (useCardLayout hook)
- Simplified codebase by eliminating collision detection and height estimation

## Task Commits

Each task was committed atomically:

1. **Task 1: Add position relative to annotation-column CSS** - `6061ed2` (fix)
2. **Task 2: Remove absolute positioning from AnnotationColumn** - `397ce7c` (fix)
3. **Task 3: Delete deprecated useCardLayout hook** - `9b76dcd` (refactor)

**Plan metadata:** (to be committed with SUMMARY and STATE)

## Files Created/Modified

- `src/index.css` - Added `position: relative` to `.annotation-column` rule (establishes positioning context)
- `src/components/preview/AnnotationColumn.tsx` - Removed useCardLayout hook, absolute positioning, and style props; now maps Object.values(annotations) directly for flexbox layout
- `src/hooks/useCardLayout.ts` - DELETED: No longer needed with flexbox layout

## Decisions Made

**Flexbox over absolute positioning:**
- Rationale: Simpler implementation, no manual Y calculations needed, responsive by design, more maintainable
- Outcome: Parent has natural height from content, cards render in visible column area

**Deleted useCardLayout hook:**
- Rationale: Hook provided collision detection and Y-position calculation for absolute positioning; with flexbox gap handling spacing, this logic is dead code
- Outcome: Codebase simplified, 48 lines removed, no loss of functionality

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all changes applied cleanly without compilation errors or unexpected behavior.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Layout collapse fix complete. Ready for human verification checkpoint to confirm:

1. Cards render in visible 640px annotation column (not "in the void")
2. Cards stack vertically with ~24px gap
3. No text overlap or elements outside column bounds
4. Arrows connect from highlighted text to valid card coordinates
5. Export PNG retains proper layout

After verification, Phase 3 (Visualizer & Export) will be complete and ready for Phase 4 (NIST Phish Scale Scoring).

---
*Phase: 03-visualizer-export*
*Completed: 2026-01-20*
