# Roadmap: Phish Monger

**Created:** 2026-01-21
**Depth:** Comprehensive
**Milestone:** v1.1 (next)

## Overview

Post-v1.0 roadmap for Phish Monger. v1.1 focuses on annotation flexibility (freetext titles, optional tags) based on UX testing feedback.

## Milestones

- ✅ **v1.0 MVP** — Phases 1-5 (shipped 2026-01-21)
- 📋 **v1.1 Annotation Flexibility** — Phases 6-7 (planned)
- 🔮 **v2.0** — Future major release (TBD)

## Phases

### 📋 Phase 6: Annotation Data Model

**Goal:** Freetext title and optional MITRE/Persuasion tags
**Status:** Not started
**Plans:**
- `06-01`: Extend Annotation type with optional title field
- `06-02`: Add optional MITRE ATT&CK tag to annotation
- `06-03`: Add optional Persuasion Principle tag to annotation

**Requirements:**
- ANN-09: Freetext title field
- ANN-10: Optional MITRE ATT&CK tag
- ANN-11: Optional Persuasion Principle tag

**Dependencies:** Phase 5

---

### 📋 Phase 7: Visualizer & Lure List Updates

**Goal:** Updated card display and list summary
**Status:** Not started
**Plans:**
- `07-01`: Update visualizer card layout (title, tags, description)
- `07-02`: Update lure list to show title/description

**Requirements:**
- ANN-12: Visualizer card layout
- ANN-13: Lure list summary

**Dependencies:** Phase 6

---

### 📋 Phase 8: Deferred v1.0 Work

**Goal:** Original v1.1 features deferred
**Status:** Not started
**Plans:** TBD

**Requirements:**
- EDIT-07: Undo/redo functionality
- EDIT-08: Keyboard shortcuts
- VIS-07: Custom arrow styles
- VIS-08: Layout templates
- ANN-07: Custom techniques in library
- ANN-08: Library persistence

**Dependencies:** Phase 7

---

## Progress

| Phase | Milestone | Status |
|-------|-----------|--------|
| 1-5 | v1.0 | ✅ Complete |
| 6 | v1.1 | Not started |
| 7 | v1.1 | Not started |
| 8 | v1.1 | Not started |

---

**Coverage:** v1.0 shipped. v1.1 (annotation flexibility) in planning.
