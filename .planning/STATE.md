# State: Phish Monger

**Last Updated:** 2025-01-20
**Current Phase:** Planning

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
**Plan:** 1 of 2 in current phase
**Status:** In progress
**Last activity:** 2026-01-20 - Completed 01-01-PLAN.md

**Progress:** ████░░░░░░ 10% (1 of 10 total plans)

**Current Focus:** Creating Tiptap editor component and implementing Lure Mark extension.

**Next Step:** Execute 01-02-PLAN.md to build Tiptap editor with Lure Mark span wrapping

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
- [ ] Implement Lure Mark custom extension (01-02)
- [ ] Build technique library JSON structure (01-02)
- [ ] Create SVG overlay component for visualizer (03-01)
- [ ] Implement NIST Phish Scale calculation logic (04-01)

### Blockers

*None identified*

---

## Session Continuity

**Last Session:** 2026-01-20 (project initialization)
**Current Session:** 2026-01-20 (phase 1 execution)

**What Was Done:**
- Defined 27 v1 requirements across 5 categories
- Created 5-phase roadmap (Editor → Annotations → Visualizer → Scoring → Data)
- Validated 100% requirement coverage
- Initialized project state tracking
- Executed 01-01: Project initialization with Vite + React + TypeScript
- Installed Tiptap editor and DOMPurify dependencies

**What's Next:**
- Execute 01-02: Create Tiptap editor component with Lure Mark extension
- Implement paste sanitization with DOMPurify
- Build technique library JSON structure

**Context to Preserve:**
- Each phase builds on the previous (vertical slices, not horizontal layers)
- DOM-based positioning (not coordinate-based) for arrow annotations
- Static JSON for technique library (v1) — MITRE ATT&CK API integration deferred to v2
- Export format is high-res PNG with burned-in annotations (not editable layers)

---

*State file initialized: 2025-01-20*
