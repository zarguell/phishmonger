# State: Phish Monger

**Last Updated:** 2026-01-20
**Current Phase:** 1 of 5 (Editor Foundation)

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

**Phase:** 1 of 5 (Editor Foundation)
**Plan:** 6 of 6 in current phase
**Status:** Phase complete
**Last activity:** 2026-01-20 - Completed 01-06-PLAN.md (Live Preview Pane and Lure Marking)

**Progress:** █████████░░ 50% (5 of 10 total plans)

**Current Focus:** Phase 1 (Editor Foundation) complete. Ready to begin Phase 2 (Technique Annotations).

**Next Step:** Begin Phase 2 planning or execute 02-01: Build technique library JSON structure

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

### Requirements Coverage

**v1 Total:** 27 requirements
**Mapped to Phases:** 27 ✓

**Category Breakdown:**
- Editor: 6 requirements → Phase 1
- Annotations: 6 requirements → Phase 2
- Visualizer: 6 requirements → Phase 3
- Scoring: 6 requirements → Phase 4
- Data & Persistence: 6 requirements → Phase 5

### Technical Notes

- **Lure Mark Implementation:** Custom Tiptap extension wrapping text in spans with UUID attributes
- **Annotation Positioning:** BoundingClientRect API for arrow calculations
- **Export Pipeline:** html2canvas for PNG generation with burned-in overlays
- **Security:** DOMPurify for HTML sanitization on paste
- **Persistence:** LocalStorage with auto-save on every state change

### Active Todos

- [x] Set up React + Vite project structure (01-01)
- [x] Install Tiptap and dependencies (01-01)
- [x] Implement Lure Mark custom extension (01-02)
- [x] Implement DOMPurify paste sanitization (01-02)
- [x] Create Editor component with toolbar (01-03)
- [x] Implement LocalStorage persistence (01-03)
- [x] Create mode toggle with HTML input and Rich Text switching (01-05)
- [ ] Implement live preview pane with lure marking (01-06)
- [ ] Build technique library JSON structure (02-01)
- [ ] Create annotation panel UI (02-02)
- [ ] Link Lure Marks to technique annotations (02-03)
- [ ] Create SVG overlay component for visualizer (03-01)
- [ ] Implement NIST Phish Scale calculation logic (04-01)

### Blockers

*None identified*

---

## Session Continuity

**Last Session:** 2026-01-20 (phase 1 execution)
**Current Session:** 2026-01-20 (phase 1 plan 05 execution)

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

**What's Next:**
- Execute 02-01: Build technique library JSON structure
- Execute 02-02: Create annotation panel UI
- Execute 02-03: Link Lure Marks to technique annotations

**Context to Preserve:**
- Each phase builds on the previous (vertical slices, not horizontal layers)
- DOM-based positioning (not coordinate-based) for arrow annotations
- Static JSON for technique library (v1) — MITRE ATT&CK API integration deferred to v2
- Export format is high-res PNG with burned-in annotations (not editable layers)
- **NEW ARCHITECTURE (01-04):** Split Editor/Viewer with toggle
  - Lure marks created by selecting text in Preview pane (not editor)
  - Lure storage as `<span data-lure-id="UUID">` in HTML source
  - Mode toggle: HTML input mode (textarea) OR rich text mode (Tiptap)
  - Live Preview pane always visible, shows rendered email with highlights
  - Tiptap simplified (no LureMark extension needed)

---

*State file initialized: 2025-01-20*
