# Roadmap: Phish Monger

**Created:** 2025-01-20
**Depth:** Comprehensive
**Phases:** 5

## Overview

Phish Monger delivers a client-side tool for security trainers to annotate phishing emails with technique explanations and generate visual training materials. This roadmap builds the application in five vertical slices: Editor → Annotations → Visualizer → Scoring → Data & Persistence. Each phase delivers a complete, verifiable capability that unblocks the next phase.

---

## Phase 1 - Editor Foundation ✓

**Goal:** Users can compose and mark phishing email content with sanitized HTML paste
**Status:** COMPLETE ✓
**Completed:** 2025-01-20
**Verification:** .planning/phases/01-editor-foundation/01-editor-foundation-VERIFICATION.md

**Dependencies:** None (foundation phase)

**Requirements:**
- ✓ EDIT-01: User can compose and edit email content in Tiptap rich text editor
- ✓ EDIT-02: User can select text and wrap it in Lure Mark span with unique UUID
- ✓ EDIT-03: Lure Mark spans render with yellow highlight styling
- ✓ EDIT-04: User can paste HTML content sanitized with DOMPurify
- ✓ EDIT-05: Sanitized paste preserves layout tables and inline styles
- ✓ EDIT-06: Sanitized paste strips scripts and on-click events

**Plans:** 7 plans (all complete)

**Plan list:**
- [x] 01-01-PLAN.md — Initialize Vite + React + TypeScript and install Tiptap/DOMPurify
- [x] 01-02-PLAN.md — Create Lure Mark Tiptap extension and DOMPurify paste handler
- [x] 01-03-PLAN.md — Create Editor component integrating extensions with toolbar
- [x] 01-04-PLAN.md — Architectural decision checkpoint (Split Editor/Viewer)
- [x] 01-05-PLAN.md — Build mode toggle and HTML input mode
- [x] 01-06-PLAN.md — Build live preview pane with lure marking
- [x] 01-07-PLAN.md — Complete workflow verification

**Success Criteria:** (All met ✓)
1. ✓ User can type and format text in a rich text editor with standard formatting options (bold, italic, links)
2. ✓ User can select any text range and wrap it in a highlighted "Lure Mark" with a unique identifier
3. ✓ Lure Marks display as yellow-highlighted spans that persist across edits
4. ✓ User can paste HTML email content (tables, styling) without security risks (scripts removed)
5. ✓ User can save the editor content to LocalStorage and reload it later with all marks preserved

---

## Phase 2 - Technique Annotations ✓

**Goal:** Users can map marked lures to phishing techniques with MITRE ATT&CK references
**Status:** COMPLETE ✓
**Completed:** 2026-01-20
**Verification:** .planning/phases/02-technique-annotations/02-TECHNIQUE-ANNOTATIONS-VERIFICATION.md

**Dependencies:** Phase 1 (need marked lures before annotating them)

**Requirements:**
- ✓ ANN-01: Application displays sidebar panel listing all marked lures (from Phase 1)
- ✓ ANN-02: Each lure in sidebar shows corresponding text preview (from Phase 1)
- ✓ ANN-03: User can select technique from pre-loaded boilerplate library
- ✓ ANN-04: User can enter custom MITRE ATT&CK ID for each lure
- ✓ ANN-05: User can write explanation text for each lure
- ✓ ANN-06: Application loads static JSON of common phishing techniques

**Success Criteria:** (All met ✓)
1. ✓ When user marks text in editor, a sidebar appears listing all marks with text previews
2. ✓ User can click any lure in sidebar and select from dropdown of common phishing techniques (e.g., "Urgency", "Authority")
3. ✓ User can enter MITRE ATT&CK IDs (e.g., "T1598") for each technique
4. ✓ User can write custom explanations for each lure describing the deceptive technique
5. ✓ Technique library is pre-loaded with 10+ common phishing techniques from static JSON

**Plans:** 3 plans in 3 waves (all complete)

**Plan list:**
- [x] 02-01-PLAN.md — Create static technique library JSON and annotation type definitions
- [x] 02-02-PLAN.md — Build annotation state management and AnnotationPanel component
- [x] 02-03-PLAN.md — Integrate annotations with LureList and add LocalStorage persistence

---

## Phase 3 - Visualizer & Export ✓

**Goal:** Users can preview and export annotated emails with numbered annotations
**Status:** COMPLETE ✓
**Completed:** 2026-01-20
**Plans:** 8/8 complete
**Verification:** .planning/phases/03-visualizer-export/03-visualizer-export-VERIFICATION.md

**Dependencies:** Phase 2 (need annotations before visualizing)

**Requirements:**
- VIS-01: Application creates numbered badges on email preview
- VIS-02: Application displays annotation cards with matching numbered badges
- VIS-03: User can preview full slide with annotations (scale-to-fit mode)
- VIS-04: Preview mode has adjustable width control (400-800px slider)
- VIS-05: User can export composition as PNG
- VIS-06: Exported PNG includes burned-in annotations

**Success Criteria:**
1. User can toggle to Preview mode showing the email with numbered badges and annotation cards in a slide layout
2. Numbered badges (①, ②, ③) appear after highlighted text in email
3. Annotation cards display matching numbered badges in headers
4. Scale-to-fit mode automatically scales 1600px slide to fit viewport
5. Adjustable width slider controls annotation column width (400-800px)
6. User can export the annotated email as high-resolution PNG (2x scale)
7. Exported PNG includes all highlights, numbered badges, and explanations burned into the image

**Plans:** 8 plans in 4 waves (all complete)

**Plan list:**
- [x] 03-01-PLAN.md — Install html2canvas library for DOM-to-image export
- [x] 03-02-PLAN.md — Create slide layout components (SlideWrapper, EmailColumn, AnnotationColumn)
- [x] 03-03-PLAN.md — Create annotation cards with collision detection
- [x] 03-04-PLAN.md — Create arrow calculation hooks with resize debouncing
- [x] 03-05-PLAN.md — Create export utility and ExportButton component
- [x] 03-06-PLAN.md — Create SVG ArrowOverlay and integrate with SlideWrapper
- [x] 03-07-PLAN.md — Integrate preview mode in App.tsx with export button
- [x] 03-08-PLAN.md — Fix layout collapse by replacing absolute positioning with flexbox; implement numbered annotations

---

## Phase 4 - NIST Phish Scale Scoring

**Goal:** Users can calculate phishing difficulty scores using NIST Phish Scale methodology
**Status:** Planned
**Plans:** 2 plans in 2 waves

**Dependencies:** Phase 3 (scoring displayed on exported slides)

**Requirements:**
- SCOR-01: User can input count of visual cues (e.g., logo pixelation)
- SCOR-02: User can input count of language cues (e.g., grammar errors)
- SCOR-03: User can select premise alignment level (1-5 scale)
- SCOR-04: Application calculates difficulty: Premise Alignment - Cue Count
- SCOR-05: Application displays traffic light badge (Easy/Moderate/Hard)
- SCOR-06: Badge is appended to exported PNG

**Success Criteria:**
1. User can input number of visual cues observed in the phishing email (0+)
2. User can input number of language cues observed in the phishing email (0+)
3. User can select premise alignment on 1-5 Likert scale (1=low alignment, 5=high alignment)
4. Application automatically calculates difficulty score: Premise Alignment - (Visual Cues + Language Cues)
5. Application displays traffic light badge: Green (Easy ≥3), Yellow (Moderate 1-2), Red (Hard ≤0)
6. Badge appears on exported PNG in the corner

**Plans:**
- [ ] 04-01-PLAN.md — Create scoring types, calculation utility, and ScoringPanel component
- [ ] 04-02-PLAN.md — Integrate ScoringPanel into App, add persistence, badge on export

---

## Phase 5 - Data & Persistence

**Goal:** Users can save, load, and export complete project data
**Status:** Planned
**Plans:** 3 plans in 3 waves

**Dependencies:** Phase 4 (all features integrated before final persistence)

**Requirements:**
- DATA-01: User can input project metadata (title, author)
- DATA-02: Application auto-generates created timestamp
- DATA-03: Application saves project state to LocalStorage
- DATA-04: Application loads project from LocalStorage on return visit
- DATA-05: User can export project as JSON with full structure
- DATA-06: User can import project from JSON file
- DATA-07: User can import project from JSON file (pasted in a text box, without need for file)

**Success Criteria:**
1. User can set project title and author in project settings
2. Application automatically records creation timestamp
3. All project data (editor content, marks, annotations, scoring) persists to LocalStorage on every change
4. When user revisits application, previous project loads automatically from LocalStorage
5. User can export complete project as JSON file containing all marks, techniques, scoring, and metadata
6. User can import a project from JSON file and restore full editing state
7. User can import a project from pasted JSON text (no file required)

**Plans:**
- [ ] 05-01-PLAN.md — Create project metadata types, ProjectSettings component, and storage utilities
- [ ] 05-02-PLAN.md — Integrate metadata state in App and add JSON export/import utilities
- [ ] 05-03-PLAN.md — Create Export/Import UI components with dual import methods

---

## Progress

| Phase | Status | Completion |
|-------|--------|------------|
| Phase 1 - Editor Foundation | ✓ Complete | 100% |
| Phase 2 - Technique Annotations | ✓ Complete | 100% |
| Phase 3 - Visualizer & Export | ✓ Complete | 100% |
| Phase 4 - NIST Phish Scale Scoring | In Progress | 0% (2 plans created) |
| Phase 5 - Data & Persistence | Planned | 0% (3 plans created) |

---

**Coverage:** 27/27 v1 requirements mapped ✓
