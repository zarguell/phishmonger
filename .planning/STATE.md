# State: Phish Monger

**Last Updated:** 2026-01-20
**Current Phase:** 3 of 5 (Visualizer & Export)

---

## Project Reference

**Core Value:** Security trainers can create visual, annotated phishing training materials that clearly highlight deceptive techniques with educational context — without manual layout work.

**What We're Building:** A client-side Single Page Application that enables security trainers to annotate phishing emails with technique explanations, generate visual slides with arrow annotations, and calculate phishing difficulty using the NIST Phish Scale.

**Tech Stack:** React + Vite, Tiptap editor, html2canvas, DOMPurify

**Key Constraints:**
- Static hosting only (Netlify/GitHub Pages)
- LocalStorage only (no cloud sync, no user accounts)
- Single-user tool
- Modern browsers (ES2020+)

---

## Current Position

**Phase:** 3 of 5 (Visualizer & Export)
**Plan:** 2 of ? in current phase
**Status:** In progress
**Last activity:** 2026-01-20 - Completed 03-02-PLAN.md

**Progress:** ███████████ 40% (2 of 5 phases complete)

**Current Focus:** Phase 3 (Visualizer & Export) progressing. Three-column slide layout established for annotation visualization.

**Next Step:** Continue Phase 3 with SVG overlay component for arrows

---

## Performance Metrics

*No metrics yet — project in planning phase*

---

## Accumulated Context

### Key Decisions Made

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Tiptap over other editors | Mark API makes span wrapping trivial; headless allows custom UI | Editor foundation (Phase 1) |
| DOM-based annotation over coordinate-based | Arrows track with text layout changes; more robust | Visualizer (Phase 3) |
| Client-side only with LocalStorage | Privacy (no data leaves browser), no infra complexity | Data & Persistence (Phase 5) |
| NIST Phish Scale methodology | Industry-standard for phishing difficulty assessment | Scoring (Phase 4) |
| Manual project setup vs create-vite | Non-empty directory blocked create-vite; manual files match template exactly | 01-01: Project initialized |
| Latest Tiptap 2.27.2 over ^2.8.0 | Latest stable version with all bug fixes and features | 01-01: Tiptap installed |
| Lure Mark as atom Node extension | Prevents cursor issues, simplest implementation for span wrapping | 01-02: Lure Mark extension |
| UUID for lure IDs | Ensures unique identifiers across all Lure Marks for annotation linking | 01-02: UUID integration |
| crypto.randomUUID() for Mark Lure button | Native browser API, no additional dependency needed | 01-03: Editor component |
| Two-column layout (editor + preview) | Shows rendered output and HTML source side-by-side for debugging | 01-03: App layout |
| Yellow highlight for Lure Marks | Matches warning/alert visual language, high contrast | 01-03: Lure Mark styling |
| Split Editor/Viewer with Toggle | Phishing emails come as HTML; users paste HTML, see victim view, mark lures in preview (not editor) | 01-04: Architectural pivot |
| Preview-first architecture | Live Preview pane is central; users select text in preview to mark lures; HTML source shows <span data-lure-id> tags | 01-04: New architecture |
| Lure marks as HTML spans (not Tiptap extension) | Simpler: manipulate HTML strings directly with DOM Range API; no complex Tiptap extension needed | 01-04: Lure storage model |
| Mode toggle (HTML input ↔ Rich Text) | Supports pasting raw phishing emails OR typing formatted content; flexibility for different workflows | 01-04: Input modes |
| Radio button toggle for mode switching | Simple, familiar UI pattern; clear indication of current mode | 01-05: Mode toggle UI |
| Content state shared across modes | Single content state ensures no data loss when switching between HTML and Rich Text modes | 01-05: Content preservation |
| localStorage for mode preference | Remembers user's preferred input mode across sessions | 01-05: Mode persistence |
| Selection-based Lure marking | User selects text in Preview pane (not editor) using DOM Range API; wraps selection in span with UUID | 01-06: Preview marking workflow |
| Three-column layout (Input, Preview, Lure List) | Shows HTML input, live preview, and lure list side by side; Preview column centered as primary focus | 01-06: Layout architecture |
| LureList with scroll-to functionality | Parses HTML source to extract data-lure-id attributes; displays lures with UUID preview; scrolls to lure with flash animation | 01-06: Lure list sidebar |
| Cross-element text marking | Use TreeWalker to find all text nodes within selection range; split partial nodes with splitText(); wrap each with data-lure-id span | 01-07: Lure marking across elements |
| LureList groups by UUID | Multiple spans with same UUID show as single lure entry with combined text | 01-07: Lure list grouping |
| Remove lure button | Users can delete lures from LureList; unwraps spans while preserving text content | 01-07: Lure removal UX |
| Static JSON libraries for v1 | Pre-loaded technique and persuasion libraries; MITRE ATT&CK API deferred to v2 | 02-01: Data foundation |
| 12 techniques from MITRE ATT&CK | Focus on observable email artifacts (T1566, T1598, T1036, T1078, T1586, T1027, T1001, T1204) | 02-01: Technique selection |
| 7 persuasion principles from Cialdini | Authority, Urgency, Social Proof, Liking, Reciprocity, Consistency, Fear/Curiosity | 02-01: Psychological analysis |
| Record<lureId, Annotation> pattern | Maps lure IDs to annotation objects for efficient lookup and updates | 02-02: Annotation state |
| LocalStorage initialization for annotations | Lazy evaluation in useState with empty object fallback | 02-02: Persistence pattern |
| LocalStorage utility functions | Centralized persistence logic with error handling for reusability | 02-03: Storage utilities |
| Expandable annotation panels | Toggle button (▶/▼) expands/collapses AnnotationPanel for each lure | 02-03: LureList integration |
| Orphaned annotation cleanup | Remove annotation when lure is deleted to prevent memory leaks | 02-03: Cleanup logic |

### Requirements Coverage

**v1 Total:** 27 requirements
**Mapped to Phases:** 27 ✓

**Category Breakdown:**
- Editor: 6 requirements → Phase 1 ✓ COMPLETE
- Annotations: 6 requirements → Phase 2 ✓ COMPLETE
- Visualizer: 6 requirements → Phase 3
- Scoring: 6 requirements → Phase 4
- Data & Persistence: 6 requirements → Phase 5

### Technical Notes

- **Lure Mark Implementation:** Selection-based marking in Preview pane using DOM Range API and TreeWalker; wraps text in `<span data-lure-id="UUID">` elements across element boundaries
- **Cross-element Marking:** Uses TreeWalker to find all text nodes intersecting with selection; splitText() for partial nodes; cloned spans for multiple wraps
- **Preview Rendering:** dangerouslySetInnerHTML with DOMPurify sanitization for secure HTML rendering
- **Lure List Parsing:** DOMParser to extract data-lure-id attributes from HTML source string
- **Annotation Positioning:** BoundingClientRect API for arrow calculations (Phase 3)
- **Export Pipeline:** html2canvas for PNG generation with burned-in overlays (Phase 3)
- **Security:** DOMPurify for HTML sanitization on paste and render
- **Persistence:** LocalStorage with auto-save on every state change; separate keys for HTML source and input mode

### Active Todos

- [x] Set up React + Vite project structure (01-01)
- [x] Install Tiptap and dependencies (01-01)
- [x] Implement Lure Mark custom extension (01-02)
- [x] Implement DOMPurify paste sanitization (01-02)
- [x] Create Editor component with toolbar (01-03)
- [x] Implement LocalStorage persistence (01-03)
- [x] Create mode toggle with HTML input and Rich Text switching (01-05)
- [x] Implement live preview pane with lure marking (01-06)
- [x] Fix cross-element text marking for lures (01-07)
- [x] Build technique library JSON structure (02-01)
- [x] Create annotation panel UI (02-02)
- [x] Link Lure Marks to technique annotations (02-03)
- [x] Install html2canvas and TypeScript types (03-01)
- [ ] Create SVG overlay component for visualizer (03-02)
- [ ] Implement NIST Phish Scale calculation logic (04-01)

### Blockers

*None identified*

---

## Session Continuity

**Last Session:** 2026-01-20 (Completed 03-02-PLAN.md)
**Current Session:** 2026-01-20 (Phase 3 plan 02 execution complete)

**What Was Done:**
- Defined 27 v1 requirements across 5 categories
- Created 5-phase roadmap (Editor → Annotations → Visualizer → Scoring → Data)
- Validated 100% requirement coverage
- Initialized project state tracking
- Executed 01-01: Project initialization with Vite + React + TypeScript
- Installed Tiptap editor and DOMPurify dependencies
- Executed 01-02: Lure Mark Tiptap extension with UUID generation
- Executed 01-02: DOMPurify sanitization preserving email layout
- Executed 01-03: Editor component with toolbar and LocalStorage persistence
- Executed 01-04: Architectural decision checkpoint (split Editor/Viewer)
- Executed 01-05: Mode toggle with HTML input and Rich Text editor
- Executed 01-06: Live Preview pane with selection-based Lure marking and LureList sidebar
- Executed 01-07: Cross-element text marking fix using TreeWalker and splitText()
- **Phase 1 complete:** All 6 requirements verified (6/6 passed)
- **Verification report:** .planning/phases/01-editor-foundation/01-editor-foundation-VERIFICATION.md
- **Phase 2 (02-01) complete:** Static technique and persuasion libraries with TypeScript types
- **Phase 2 (02-02) complete:** Annotation state management and AnnotationPanel component
- **Phase 2 (02-03) complete:** Annotation integration with LureList, LocalStorage persistence, and cleanup
- **Phase 2 complete:** All 6 requirements verified (11/11 must-haves passed)
- **Verification report:** .planning/phases/02-technique-annotations/02-TECHNIQUE-ANNOTATIONS-VERIFICATION.md
 - **Executed 03-01:** Installed html2canvas@^1.4.1 and @types/html2canvas for DOM-to-image export functionality
 - **Executed 03-02:** Three-column slide layout components (SlideWrapper, EmailColumn, AnnotationColumn) with fixed 1600px width and ghost card empty state

**What's Next:**
- Phase 3 (Visualizer & Export): Continue with SVG overlay component for arrow annotations

**Context to Preserve:**
- Each phase builds on the previous (vertical slices, not horizontal layers)
- DOM-based positioning (not coordinate-based) for arrow annotations
- Static JSON for technique library (v1) — MITRE ATT&CK API integration deferred to v2
- Export format is high-res PNG with burned-in annotations (not editable layers)
- **Split Editor/Viewer architecture (01-04):**
  - Lure marks created by selecting text in Preview pane (not editor)
  - Lure storage as `<span data-lure-id="UUID">` in HTML source
  - Mode toggle: HTML input mode (textarea) OR rich text mode (Tiptap)
  - Live Preview pane always visible, shows rendered email with highlights
  - Tiptap simplified (no LureMark extension needed)

---

*State file initialized: 2025-01-20*
*Phase 1 complete: 2026-01-20*
*Phase 2 complete: 2026-01-20*
