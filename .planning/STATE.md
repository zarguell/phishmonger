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

**Phase:** 1 - Editor Foundation
**Status:** Not Started
**Progress Bar:** ████░░░░░░ 0%

**Current Focus:** Setting up the editor foundation with Tiptap integration, Lure Mark span wrapping, and sanitized HTML paste functionality.

**Next Step:** Begin Phase 1 planning with `/gsd-plan-phase 1`

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

- [ ] Set up React + Vite project structure
- [ ] Install Tiptap and dependencies
- [ ] Implement Lure Mark custom extension
- [ ] Build technique library JSON structure
- [ ] Create SVG overlay component for visualizer
- [ ] Implement NIST Phish Scale calculation logic

### Blockers

*None identified*

---

## Session Continuity

**Last Session:** 2025-01-20 (initial planning)
**Current Session:** 2025-01-20 (roadmap creation)

**What Was Done:**
- Defined 27 v1 requirements across 5 categories
- Created 5-phase roadmap (Editor → Annotations → Visualizer → Scoring → Data)
- Validated 100% requirement coverage
- Initialized project state tracking

**What's Next:**
- Begin Phase 1 planning with `/gsd-plan-phase 1`
- Set up development environment
- Implement Tiptap editor with Lure Mark extension

**Context to Preserve:**
- Each phase builds on the previous (vertical slices, not horizontal layers)
- DOM-based positioning (not coordinate-based) for arrow annotations
- Static JSON for technique library (v1) — MITRE ATT&CK API integration deferred to v2
- Export format is high-res PNG with burned-in annotations (not editable layers)

---

*State file initialized: 2025-01-20*
