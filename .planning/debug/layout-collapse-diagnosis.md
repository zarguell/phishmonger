---
status: resolved
trigger: "Layout collapse in preview mode - text is completely on top of each other. Annotation cards are invisible/displaced, EmailColumn shrunk to nothing. Flexbox/grid layout broken causing cards to fly off into void. Arrows drawing big empty rectangles to coordinates that don't visually exist."
created: 2026-01-20T22:30:00Z
updated: 2026-01-20T22:35:00Z
---

## Current Focus

Investigation complete. Root cause identified. Ready to document findings.

## Symptoms

expected: Text and annotations are properly spaced with readable layout. Email content in left column, annotation cards in right column, no text overlapping or illegible.
actual: Layout collapse - text is completely on top of each other. Annotation cards are invisible/displaced, EmailColumn shrunk to nothing. Flexbox/grid layout broken causing cards to fly off into void. Arrows drawing big empty rectangles to coordinates that don't visually exist.
errors: No error messages in console (layout failure, not runtime error)
reproduction: Open preview mode with annotations present
started: During phase 03-visualizer-export testing

## Eliminated

- hypothesis: Parent container missing grid/flex CSS causing columns to stack
  evidence: src/index.css lines 401-409 show .slide-wrapper has `display: flex; flex-direction: row;`
  timestamp: 2026-01-20T22:31:00Z

- hypothesis: EmailColumn width/height properties missing from CSS
  evidence: src/index.css lines 411-416 define .email-column with width: 960px and flex-shrink: 0
  timestamp: 2026-01-20T22:31:00Z

- hypothesis: Arrow calculation timing issue causing wrong coordinates
  evidence: useArrowCalculations uses useLayoutEffect which runs synchronously before paint
  timestamp: 2026-01-20T22:32:00Z

## Evidence

- timestamp: 2026-01-20T22:30:00Z
  checked: src/index.css lines 401-430
  found: .slide-wrapper, .email-column, and .annotation-column all properly defined with flexbox
  implication: CSS structure is correct, issue is in component rendering

- timestamp: 2026-01-20T22:30:00Z
  checked: AnnotationColumn.tsx lines 23-43
  found: **Cards positioned with `position: absolute`** but parent .annotation-column has no `position: relative` or explicit height
  implication: Parent collapses to height: 0, absolute positioning references wrong coordinate system

- timestamp: 2026-01-20T22:31:00Z
  checked: src/index.css lines 422-430
  found: `.annotation-column` has `display: flex; flex-direction: column; gap: 24px;` but cards override with `position: absolute`
  implication: Flex layout completely bypassed - cards positioned absolutely from collapsed parent

- timestamp: 2026-01-20T22:32:00Z
  checked: useCardLayout.ts
  found: Hook calculates Y positions for cards starting from 0, incrementing by estimated height + 24px gap
  implication: Card positioning logic assumes absolute positioning from top:0 of parent

- timestamp: 2026-01-20T22:33:00Z
  checked: AnnotationColumn.tsx line 36
  found: Cards have hardcoded `left: '130px'` to center in 640px column
  implication: Proper horizontal offset but vertical positioning broken by parent collapse

- timestamp: 2026-01-20T22:34:00Z
  checked: ArrowOverlay.tsx and useArrowCalculations.ts
  found: Arrows use getBoundingClientRect to find card positions. If cards invisible/displaced, coordinates are (0,0) or off-screen
  implication: Arrow failures are symptom of card positioning failure, not root cause

## Resolution

root_cause: **AnnotationColumn uses absolute positioning for cards without establishing a positioned context.**

The .annotation-column parent div has no `position: relative`, causing it to collapse to height: 0 when children are absolutely positioned. The cards then position relative to the nearest positioned ancestor (likely the slide-wrapper or viewport), placing them outside the visible column area.

**Specific issue locations:**
1. **src/index.css lines 422-430**: .annotation-column missing `position: relative`
2. **src/index.css lines 422-430**: .annotation-column missing `min-height` to contain absolutely-positioned children
3. **AnnotationColumn.tsx lines 33-38**: Cards use `position: absolute` but parent doesn't establish positioning context

**Why this causes the symptoms:**
- Parent collapses → cards position outside visible area → "invisible/displaced"
- Cards render but in wrong coordinate space → arrows calculate to wrong coordinates → "arrows drawing big empty rectangles"
- EmailColumn still renders but column layout broken → "EmailColumn shrunk to nothing"

fix: |
  1. Add `position: relative;` to .annotation-column in src/index.css
  2. Add `min-height: 900px;` or explicit height calculation to .annotation-column
  3. Alternative: Remove absolute positioning entirely, use flexbox gap instead of manual positioning

verification: |
  After fix, cards should render inside visible column area, arrows should connect to visible cards, layout should match Phase 3 specifications.

files_changed:
  - src/index.css (lines 422-430)
  - src/components/preview/AnnotationColumn.tsx (lines 33-38, potentially refactor to remove absolute positioning)
