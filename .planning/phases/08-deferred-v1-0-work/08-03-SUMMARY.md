---
phase: 08-deferred-v1-0-work
plan: 03
subsystem: ui
tags: [css-modules, badge-styling, localstorage, react]

# Dependency graph
requires:
  - phase: 06
    provides: AnnotationCard component with numbered badges
provides:
  - Custom arrow badge styles (Classic Blue Circle, Classic Red Circle, Square, Diamond)
  - ArrowStyleSelector component for live style preview and selection (4 options)
  - Inline badge styling matching selected arrow style in email content
  - LocalStorage persistence for arrow style preference
  - Improved badge positioning to avoid text overlap
affects: [phase-08-04, phase-08-05, phase-08-06]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - CSS Modules for scoped component styling
    - Props drilling for style preference propagation
    - LocalStorage for user preference persistence

key-files:
  created:
    - src/styles/arrows.module.css
    - src/components/visualizer/ArrowStyleSelector.tsx
  modified:
    - src/components/annotation/AnnotationCard.tsx
    - src/components/preview/AnnotationColumn.tsx
    - src/App.tsx

key-decisions:
  - "Use CSS Modules instead of styled-components for badge styling (lighter, already in project)"
  - "Arrow style preference stored as user preference in LocalStorage, not per-project setting"
  - "Diamond style counter-rotates text with nested span to keep numbers upright"

patterns-established:
  - "Pattern 1: CSS Modules for component-scoped styles with variant classes"
  - "Pattern 2: Selector component pattern with live preview of each option"
  - "Pattern 3: Props chain for style preference (App → AnnotationColumn → AnnotationCard)"

# Metrics
duration: 5min
completed: 2026-01-21
---

# Phase 08 Plan 03: Custom Arrow Badge Styles Summary

**Arrow badge style customization system with Classic Circle, Square, and Diamond variants, persisted to LocalStorage**

## Performance

- **Duration:** 5 min (4m 43s)
- **Started:** 2026-01-21T20:37:54Z
- **Completed:** 2026-01-21T20:42:37Z
- **Tasks:** 2 (plus checkpoint)
- **Files created:** 2
- **Files modified:** 3

## Accomplishments

- **CSS Module for arrow badge styles** with four variants: Classic Blue (blue circle), Classic Red (red circle - original design), Square (green rounded), Diamond (orange rotated)
- **ArrowStyleSelector component** with live preview badges for each style option (4 styles after checkpoint)
- **LocalStorage persistence** for arrow style preference across browser sessions
- **Diamond counter-rotation** to keep badge numbers upright despite 45deg rotation
- **Inline badge styling** - Email content badges now match selected arrow style (classic/red/square/diamond)
- **Improved badge positioning** - Fixed text overlap with better spacing, alignment, and sizing

## Task Commits

Each task was committed atomically:

1. **Task 1: Create arrow styles CSS module** - `5b432c5` (feat)
2. **Task 2: Create ArrowStyleSelector component** - `2892ff7` (feat)
3. **Integration fix: Add arrow style support to AnnotationCard** - `66a6dca` (feat)
4. **Bug fix: Remove width prop from AnnotationColumn** - `10ac2fb` (fix)
5. **Bug fix: Restore arrowStyle prop to AnnotationColumn** - `6dbd5eb` (fix)
6. **Bug fix: Remove inline width style from AnnotationColumn** - `e19a78b` (fix)
7. **Checkpoint fix: Arrow badge positioning, styling, and red circle option** - `15ab1e9` (fix)

**Note:** Commits 3-6 were auto-fixes for integration issues between components modified by concurrent plan execution (08-01 undo/redo work)
**Note:** Commit 7 was checkpoint response to user feedback (see Checkpoint Resolutions below)

## Files Created/Modified

### Created

- `src/styles/arrows.module.css` - Scoped CSS for arrow badge variants (classic, red, square, diamond) with base `.arrowBadge` class and style-specific classes, plus inline badge styles for email content
- `src/components/visualizer/ArrowStyleSelector.tsx` - UI component for selecting arrow badge style with live preview of each variant (4 options after checkpoint)

### Modified

- `src/components/annotation/AnnotationCard.tsx` - Added `arrowStyle` prop, replaced `.annotation-card-number-badge` span with CSS module badges
- `src/components/preview/AnnotationColumn.tsx` - Added `arrowStyle` prop, passes style preference to AnnotationCard components
- `src/components/preview/EmailColumn.tsx` - Added `arrowStyle` prop, applies style classes to inline badges in email content
- `src/App.tsx` - Added `arrowStyle` state with LocalStorage persistence (`ARROW_STYLE_KEY`), rendered ArrowStyleSelector in preview mode header, passes arrowStyle to EmailColumn
- `src/index.css` - Updated `.lure-badge` positioning to fix text overlap (larger, better spacing, middle alignment)

## Decisions Made

1. **CSS Modules over styled-components** - Already in project, lighter weight, no runtime overhead, simpler debugging
2. **User preference (not per-project)** - Arrow style stored in LocalStorage as global user preference, not in project JSON. Simpler UX, matches common pattern for visual customization
3. **Diamond text counter-rotation** - Nested span with `-45deg` transform keeps badge numbers upright while diamond rotates 45deg (Pitfall #4 from research)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Integration conflicts with concurrent phase 08-01 work**
- **Found during:** Task 2 completion (ArrowStyleSelector integration)
- **Issue:** AnnotationColumn component had been modified by undo/redo work (08-01) - width prop removed, arrowStyle prop missing
- **Fix:** Re-added arrowStyle prop to AnnotationColumn, removed width prop reference from App.tsx, removed inline width style from AnnotationColumn JSX
- **Files modified:** src/components/annotation/AnnotationCard.tsx, src/components/preview/AnnotationColumn.tsx, src/App.tsx
- **Verification:** TypeScript build passes, arrow style selector renders in preview header
- **Committed in:** `66a6dca`, `10ac2fb`, `6dbd5eb`, `e19a78b` (all integration fixes)

### Checkpoint Resolutions (User Feedback)

**2. User-approved checkpoint with 3 issues to fix**
- **Found during:** Human verification checkpoint after initial implementation
- **Issue 1:** Arrow badges overlap with text in email content
  - **Fix:** Increased badge size (18px→20px), adjusted margin-left (4px→6px), added margin-right (2px), changed vertical-align from 'super' to 'middle', added top offset (-1px) for better positioning
  - **Files modified:** src/index.css (.lure-badge styles)
- **Issue 2:** Inline badges in email don't match selected arrow style
  - **Fix:** Added arrowStyle prop to EmailColumn component, applied style classes to inline badges (lure-badge-classic, lure-badge-red, lure-badge-square, lure-badge-diamond), updated App.tsx to pass arrowStyle to EmailColumn
  - **Files modified:** src/components/preview/EmailColumn.tsx, src/App.tsx
- **Issue 3:** Missing red circle option (original design)
  - **Fix:** Added 'red' style option to ArrowStyleSelector (Classic Red), created arrowBadge.red CSS class (red circle #FF4500 with white text), added inline badge style class lure-badge-red
  - **Files modified:** src/components/visualizer/ArrowStyleSelector.tsx, src/styles/arrows.module.css
- **Verification:** All three issues resolved, awaiting re-verification
- **Committed in:** `15ab1e9` (checkpoint resolution commit)

---

**Total deviations:** 1 auto-fixed (blocking) + 1 checkpoint resolution (user feedback)
**Impact on plan:** Auto-fixes required for concurrent execution. Checkpoint fixes improved UX based on user testing. No scope creep.

## Issues Encountered

1. **Concurrent plan execution conflict** - Phase 08-01 (undo/redo) and 08-03 (arrow styles) both modified App.tsx and AnnotationColumn.tsx simultaneously, causing prop mismatches. Resolved by carefully updating props to match both plans' requirements.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- **Arrow style system complete and functional** (4 styles: Classic Blue, Classic Red, Square, Diamond)
- **Selector component integrated into preview mode header**
- **Inline badges in email content match selected style**
- **Badge positioning fixed** - no text overlap, proper spacing
- **Awaiting user re-verification** - all checkpoint fixes implemented
- **No blockers** - all four badge styles rendering correctly, persistence working, proper positioning

## Verification Checklist

### Initial Implementation (Before Checkpoint)

- [x] Arrow styles CSS module created with all three variants
- [x] ArrowStyleSelector component created with live previews
- [x] LocalStorage persistence configured (ARROW_STYLE_KEY)
- [x] AnnotationCard uses CSS module badges instead of inline classes
- [x] Props chain complete: App → AnnotationColumn → AnnotationCard
- [x] TypeScript build succeeds
- [x] Dev server runs without errors

### Checkpoint Resolutions (After User Feedback)

- [x] Arrow badges no longer overlap text (positioning fixed)
- [x] Inline badges match selected arrow style (EmailColumn integration)
- [x] Classic Red option added (4 styles total: Classic Blue, Classic Red, Square, Diamond)
- [x] TypeScript build succeeds after fixes
- [x] All style variants render correctly

**Ready for re-verification checkpoint.**

---
*Phase: 08-deferred-v1-0-work*
*Plan: 03*
*Completed: 2026-01-21*
