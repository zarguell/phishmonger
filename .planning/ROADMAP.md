# Roadmap: Phish Monger

**Created:** 2026-01-21
**Depth:** Comprehensive
**Milestone:** v1.1 (next)

## Overview

Post-v1.0 roadmap for Phish Monger. v1.1 focuses on annotation flexibility (freetext titles, optional tags) and deferred v1.0 features (undo/redo, keyboard shortcuts, visual customization, custom techniques).

## Milestones

- ✅ **v1.0 MVP** — Phases 1-5 (shipped 2026-01-21)
- 🔄 **v1.1 Enhanced** — Phases 6-8 (planning complete, execution ready)
- 🔮 **v2.0** — Future major release (TBD)

## Phases

### ✅ Phase 6: Annotation Data Model

**Goal:** Freetext title and optional MITRE/Persuasion tags
**Status:** ✅ Complete
**Plans:**
- [x] `06-01-PLAN.md`: Extend Annotation type with optional title field
- [x] `06-02-PLAN.md`: Add optional MITRE ATT&CK tag to annotation
- [x] `06-03-PLAN.md`: Add optional Persuasion Principle tag to annotation
- [x] `06-04-PLAN.md`: Add title input field to AnnotationPanel (gap closure)
- [x] `06-05-PLAN.md`: Restore numbered annotation badges (gap closure)

**Requirements:**
- ANN-09: Freetext title field
- ANN-10: Optional MITRE ATT&CK tag
- ANN-11: Optional Persuasion Principle tag

**Dependencies:** Phase 5

---

### ✅ Phase 7: Visualizer & Lure List Updates

**Goal:** Updated card display and list summary
**Status:** ✅ Complete
**Plans:**
- [x] `07-01-PLAN.md`: Verify visualizer card layout (title, tags, description) — verification only, ANN-12 already implemented
- [x] `07-02-PLAN.md`: Update lure list to show title/description instead of UUID

**Requirements:**
- ANN-12: Visualizer card layout
- ANN-13: Lure list summary

**Dependencies:** Phase 6

**Verification:** `07-VERIFICATION.md` (passed: 11/11 must-haves)

---

### ✅ Phase 8: Deferred v1.0 Work

**Goal:** Advanced UX features and extensibility
**Status:** ✅ Complete
**Plans:**
- [x] `08-01-PLAN.md`: Undo/redo with keyboard shortcuts (Ctrl+Z/Cmd+Z)
- [x] `08-02-PLAN.md`: Keyboard shortcuts help modal
- [x] `08-03-PLAN.md`: Custom arrow badge styles (Classic, Square, Diamond)
- [x] `08-04-PLAN.md`: Layout templates (Balanced, Wide Email, Wide Annotations)
- [x] `08-05-PLAN.md`: Custom technique library data model
- [x] `08-06-PLAN.md`: Custom technique editor
- [x] `08-07-PLAN.md`: Project export includes custom techniques
- [x] `08-08-PLAN.md`: Technique library view with management

**Requirements:**
- EDIT-07: Undo/redo functionality
- EDIT-08: Keyboard shortcuts
- VIS-07: Custom arrow styles
- VIS-08: Layout templates
- ANN-07: Custom techniques in library
- ANN-08: Library persistence
- VIS-09: Tags visibility toggle
- VIS-10: NIST badge toggle

**Dependencies:** Phase 7

**Research:** `08-DEFERRED-V1-0-WORK-RESEARCH.md` (complete)
**Verification:** `08-VERIFICATION.md` (passed: 8/8 must-haves)

---

## Progress

| Phase | Milestone | Status |
|-------|-----------|--------|
| 1-5 | v1.0 | ✅ Complete |
| 6 | v1.1 | ✅ Complete |
| 7 | v1.1 | ✅ Complete |
| 8 | v1.1 | ✅ Complete |

---

**Coverage:** v1.0 shipped, v1.1 complete (annotation flexibility + advanced UX features + visualizer updates).
