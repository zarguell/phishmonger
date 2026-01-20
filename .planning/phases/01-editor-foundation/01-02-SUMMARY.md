---
phase: 01-editor-foundation
plan: 02
subsystem: editor
tags: [tiptap, dompurify, uuid, extension, sanitization]

# Dependency graph
requires:
  - phase: 01-editor-foundation
    plan: 01
    provides: React + Vite project with Tiptap editor dependencies
provides:
  - LureMark Tiptap extension for wrapping text in span[data-lure-id] with unique UUID
  - sanitizeHtml utility using DOMPurify for safe HTML paste handling
affects: [02-annotations, 03-visualizer]

# Tech tracking
tech-stack:
  added: [uuid@13.0.0, @types/uuid@10.0.0]
  patterns: [Tiptap Node extension, DOMPurify sanitization]

key-files:
  created: [src/extensions/LureMark.ts, src/utils/sanitizeHtml.ts]
  modified: [package.json, package-lock.json]

key-decisions:
  - "Lure Mark as Tiptap Node extension with atom: true - simplest implementation for span wrapping"
  - "UUID for unique lure IDs - enables linking annotations to specific text spans"

patterns-established:
  - "Tiptap extensions in src/extensions/ directory"
  - "Utility functions in src/utils/ directory"
  - "Span-based annotation approach with data-* attributes"

# Metrics
duration: 2 min
completed: 2026-01-20
---

# Phase 1 Plan 2: Lure Mark Extension and Sanitization Summary

**Lure Mark Tiptap extension wrapping text in UUID-tagged spans, and DOMPurify sanitization preserving email layout while stripping dangerous HTML**

## Performance

- **Duration:** 2 min
- **Started:** 2026-01-20T18:50:49Z
- **Completed:** 2026-01-20T18:53:06Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Created LureMark Tiptap extension wrapping text in span[data-lure-id] with unique UUID
- Implemented DOMPurify sanitization preserving email layout (tables, inline styles) while stripping scripts and events
- Installed uuid package for unique ID generation

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Lure Mark Tiptap extension** - `fc3f4df` (feat)
2. **Task 2: Implement DOMPurify paste handler** - `1ab6fcd` (feat)

**Plan metadata:** (to be created)

## Files Created/Modified

- `package.json` - Added uuid and @types/uuid dependencies
- `package-lock.json` - Locked uuid versions
- `src/extensions/LureMark.ts` - Tiptap Node extension for Lure Marks with UUID generation
- `src/utils/sanitizeHtml.ts` - DOMPurify wrapper preserving email layout

## Decisions Made

- **Lure Mark as atom Node extension:** Using `atom: true` makes the Lure Mark indivisible in the editor, preventing cursor issues. Simplest implementation for span wrapping.
- **UUID for lure IDs:** Using UUID v4 ensures unique identifiers across all Lure Marks, enabling precise linking between text spans and technique annotations.
- **Conservative DOMPurify config:** Allowing tables and inline styles preserves email formatting while stripping dangerous elements (scripts, forms, events).

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Lure Mark extension ready for integration into editor component
- Sanitization utility ready for paste event handling
- Both building blocks in place for annotation system (Phase 2)

---
*Phase: 01-editor-foundation*
*Completed: 2026-01-20*
