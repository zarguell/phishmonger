# Requirements: Phish Monger

**Defined:** 2026-01-21
**Core Value:** Security trainers can create visual, annotated phishing training materials that clearly highlight deceptive techniques with educational context — without manual layout work.

## v1 Requirements

**All shipped in v1.0** — see `.planning/milestones/v1.0-REQUIREMENTS.md`

## v1.1 Requirements

Requirements for next release. Editor improvements, visualizer enhancements, and library persistence.

### Editor

- [ ] **EDIT-07**: Undo/redo functionality in editor
- [ ] **EDIT-08**: Keyboard shortcuts for common actions

### Visualizer

- [ ] **VIS-07**: Custom arrow styles (colors, thickness)
- [ ] **VIS-08**: Multiple layout templates (side panel, bottom panel, overlay)

### Annotations

- [ ] **ANN-07**: User can add custom techniques to boilerplate library
- [ ] **ANN-08**: Technique library persists to LocalStorage

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| User accounts/authentication | LocalStorage-only, no cloud sync required |
| Real-time collaboration | Single-user tool |
| Email sending | Creation/annotation only, no delivery |
| Mobile app | Web-first, desktop-focused |
| Backend API | Purely client-side application |
| MITRE ATT&CK live API integration | Static JSON sufficient for v1 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| EDIT-07 | Phase 6 | Pending |
| EDIT-08 | Phase 6 | Pending |
| VIS-07 | Phase 7 | Pending |
| VIS-08 | Phase 7 | Pending |
| ANN-07 | Phase 8 | Pending |
| ANN-08 | Phase 8 | Pending |

---

*Requirements defined: 2026-01-21 for v1.1 milestone*
