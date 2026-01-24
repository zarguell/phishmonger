# Requirements: Phish Monger v1.3 UX Redesign

**Defined:** 2026-01-24
**Core Value:** Security trainers can create visual, annotated phishing training materials that clearly highlight deceptive techniques with educational context — without manual layout work.

## v1.3 Requirements

Requirements for UX Redesign milestone. Each maps to roadmap phases.

### Terminology & Workflow

- [ ] **TERM-01**: Application renames all "project" references to "phish" in UI text (buttons, labels, headings, help text)
- [ ] **TERM-02**: Application renames all "project" references to "phish" in code variables, functions, and types
- [ ] **TERM-03**: LocalStorage keys migrate from "phishmonger-projects" to "phishmonger-phishes" with v2→v3 migration script
- [ ] **TERM-04**: Application launches with campaigns list as default landing view (not single-phish editor)

### Import/Export UX

- [ ] **IEXP-01**: Phish import uses modal dialog instead of expanding menu (no layout shift)
- [ ] **IEXP-02**: Campaign import provides text input field for JSON paste (in addition to file upload)
- [ ] **IEXP-03**: Carousel view exports clean HTML with lure mark divs stripped (email content only)
- [ ] **IEXP-04**: Clean HTML export offers both file download and clipboard copy options

### Editor Flexibility

- [ ] **EDIT-01**: Each editor column has expand (full-width) and minimize buttons in column header
- [ ] **EDIT-02**: Column state persists to localStorage (remembers expanded/minimized between sessions)
- [ ] **EDIT-03**: Keyboard shortcuts (1, 2, 3, 4) toggle full-width focus for each column
- [ ] **EDIT-04**: Minimized columns collapse to header bar with expand button visible

## Future Requirements

Deferred to future release. Tracked but not in current roadmap.

### Future Enhancements

- Visual calendar view (month/week grid for campaigns) — Deferred to v1.4
- Campaign templates (clone campaign structure) — Deferred to v1.4
- Bulk date assignment for campaign phishes — Deferred to v1.4
- Conflict detection for scheduled phishes — Deferred to v1.4

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Single-phish workflow removal | Maintain backward compatibility for existing users, campaigns is now default but standalone workflow still accessible |
| Real-time collaboration | Single-user tool per constraints |
| Cloud sync | LocalStorage-only per constraints |
| Mobile-responsive editor improvements | Desktop-focused design per constraints |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| TERM-01 | Phase 16 | Pending |
| TERM-02 | Phase 16 | Pending |
| TERM-03 | Phase 16 | Pending |
| TERM-04 | Phase 16 | Pending |
| IEXP-01 | Phase 17 | Pending |
| IEXP-02 | Phase 17 | Pending |
| IEXP-03 | Phase 18 | Pending |
| IEXP-04 | Phase 18 | Pending |
| EDIT-01 | Phase 19 | Pending |
| EDIT-02 | Phase 19 | Pending |
| EDIT-03 | Phase 19 | Pending |
| EDIT-04 | Phase 19 | Pending |

**Coverage:**
- v1.3 requirements: 12 total
- Mapped to phases: 12 (100%)
- Unmapped: 0 ✓

---
*Requirements defined: 2026-01-24*
*Last updated: 2026-01-24 after roadmap creation*
