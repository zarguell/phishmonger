# Requirements: Phish Monger

**Defined:** 2025-01-20
**Core Value:** Security trainers can create visual, annotated phishing training materials that clearly highlight deceptive techniques with educational context — without manual layout work.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Editor

- [ ] **EDIT-01**: User can compose and edit email content in Tiptap rich text editor
- [ ] **EDIT-02**: User can select text and wrap it in Lure Mark span with unique UUID
- [ ] **EDIT-03**: Lure Mark spans render with yellow highlight styling
- [ ] **EDIT-04**: User can paste HTML content sanitized with DOMPurify
- [ ] **EDIT-05**: Sanitized paste preserves layout tables and inline styles
- [ ] **EDIT-06**: Sanitized paste strips scripts and on-click events

### Annotations

- [ ] **ANN-01**: Application displays sidebar panel listing all marked lures
- [ ] **ANN-02**: Each lure in sidebar shows corresponding text preview
- [ ] **ANN-03**: User can select technique from pre-loaded boilerplate library
- [ ] **ANN-04**: User can enter custom MITRE ATT&CK ID for each lure
- [ ] **ANN-05**: User can write explanation text for each lure
- [ ] **ANN-06**: Application loads static JSON of common phishing techniques

### Visualizer

- [ ] **VIS-01**: Application creates transparent SVG overlay on email preview
- [ ] **VIS-02**: Application calculates BoundingClientRect for each lure span
- [ ] **VIS-03**: Application draws Bezier curve arrows from lures to explanations
- [ ] **VIS-04**: User can preview full slide with annotations and arrows
- [ ] **VIS-05**: User can export composition as high-res PNG using html2canvas
- [ ] **VIS-06**: Exported PNG includes burned-in annotations and arrows

### Scoring

- [ ] **SCOR-01**: User can input count of visual cues (e.g., logo pixelation)
- [ ] **SCOR-02**: User can input count of language cues (e.g., grammar errors)
- [ ] **SCOR-03**: User can select premise alignment level (1-5 scale)
- [ ] **SCOR-04**: Application calculates difficulty: Premise Alignment - Cue Count
- [ ] **SCOR-05**: Application displays traffic light badge (Easy/Moderate/Hard)
- [ ] **SCOR-06**: Badge is appended to exported PNG

### Data & Persistence

- [ ] **DATA-01**: User can input project metadata (title, author)
- [ ] **DATA-02**: Application auto-generates created timestamp
- [ ] **DATA-03**: Application saves project state to LocalStorage
- [ ] **DATA-04**: Application loads project from LocalStorage on return visit
- [ ] **DATA-05**: User can export project as JSON with full structure
- [ ] **DATA-06**: User can import project from JSON file

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Editor

- **EDIT-07**: Undo/redo functionality in editor
- **EDIT-08**: Keyboard shortcuts for common actions

### Annotations

- **ANN-07**: User can add custom techniques to boilerplate library
- **ANN-08**: Technique library persists to LocalStorage

### Visualizer

- **VIS-07**: Custom arrow styles (colors, thickness)
- **VIS-08**: Multiple layout templates (side panel, bottom panel, overlay)

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

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| EDIT-01 | Phase 1 | Pending |
| EDIT-02 | Phase 1 | Pending |
| EDIT-03 | Phase 1 | Pending |
| EDIT-04 | Phase 1 | Pending |
| EDIT-05 | Phase 1 | Pending |
| EDIT-06 | Phase 1 | Pending |
| ANN-01 | Phase 2 | Pending |
| ANN-02 | Phase 2 | Pending |
| ANN-03 | Phase 2 | Pending |
| ANN-04 | Phase 2 | Pending |
| ANN-05 | Phase 2 | Pending |
| ANN-06 | Phase 2 | Pending |
| VIS-01 | Phase 3 | Pending |
| VIS-02 | Phase 3 | Pending |
| VIS-03 | Phase 3 | Pending |
| VIS-04 | Phase 3 | Pending |
| VIS-05 | Phase 3 | Pending |
| VIS-06 | Phase 3 | Pending |
| SCOR-01 | Phase 4 | Pending |
| SCOR-02 | Phase 4 | Pending |
| SCOR-03 | Phase 4 | Pending |
| SCOR-04 | Phase 4 | Pending |
| SCOR-05 | Phase 4 | Pending |
| SCOR-06 | Phase 4 | Pending |
| DATA-01 | Phase 5 | Pending |
| DATA-02 | Phase 5 | Pending |
| DATA-03 | Phase 5 | Pending |
| DATA-04 | Phase 5 | Pending |
| DATA-05 | Phase 5 | Pending |
| DATA-06 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 27 total
- Mapped to phases: 27
- Unmapped: 0 ✓

---
*Requirements defined: 2025-01-20*
*Last updated: 2025-01-20 after roadmap creation*
