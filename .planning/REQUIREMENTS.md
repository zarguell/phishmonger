# Requirements: Phish Monger

**Defined:** 2026-01-21
**Core Value:** Security trainers can create visual, annotated phishing training materials that clearly highlight deceptive techniques with educational context — without manual layout work.

## v1 Requirements

**All shipped in v1.0** — see `.planning/milestones/v1.0-REQUIREMENTS.md`

## v1.1 Requirements

Requirements for annotation flexibility. Freetext titles, optional MITRE/Persuasion tags.

### Annotations

- [ ] **ANN-09**: Annotation has freetext title field (appears bold in visualizer)
- [ ] **ANN-10**: Annotation optionally shows MITRE ATT&CK tag (e.g., "T1598 - Phishing for Information")
- [ ] **ANN-11**: Annotation optionally shows Persuasion Principle tag
- [ ] **ANN-12**: Visualizer card displays: Title on first line, tags inline on second, full description below
- [ ] **ANN-13**: Lure list shows annotation title (or first words of description if no title)

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
| ANN-09 | Phase 6 | Pending |
| ANN-10 | Phase 6 | Pending |
| ANN-11 | Phase 6 | Pending |
| ANN-12 | Phase 7 | Pending |
| ANN-13 | Phase 7 | Pending |
| EDIT-07 | Phase 8 | Deferred |
| EDIT-08 | Phase 8 | Deferred |
| VIS-07 | Phase 8 | Deferred |
| VIS-08 | Phase 8 | Deferred |
| ANN-07 | Phase 8 | Deferred |
| ANN-08 | Phase 8 | Deferred |

---

*Requirements defined: 2026-01-21 for v1.1 milestone*
*Last updated: 2026-01-21 after UX reprioritization*
