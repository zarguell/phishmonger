# Roadmap: Phish Monger

**Created:** 2025-01-20
**Depth:** Comprehensive
**Phases:** 5

## Overview

Phish Monger delivers a client-side tool for security trainers to annotate phishing emails with technique explanations and generate visual training materials. This roadmap builds the application in five vertical slices: Editor → Annotations → Visualizer → Scoring → Data & Persistence. Each phase delivers a complete, verifiable capability that unblocks the next phase.

---

## Phase 1 - Editor Foundation

**Goal:** Users can compose and mark phishing email content with sanitized HTML paste

**Dependencies:** None (foundation phase)

**Requirements:**
- EDIT-01: User can compose and edit email content in Tiptap rich text editor
- EDIT-02: User can select text and wrap it in Lure Mark span with unique UUID
- EDIT-03: Lure Mark spans render with yellow highlight styling
- EDIT-04: User can paste HTML content sanitized with DOMPurify
- EDIT-05: Sanitized paste preserves layout tables and inline styles
- EDIT-06: Sanitized paste strips scripts and on-click events

**Plans:** 6 plans

**Plan list:**
- [x] 01-01-PLAN.md — Initialize Vite + React + TypeScript and install Tiptap/DOMPurify
- [x] 01-02-PLAN.md — Create Lure Mark Tiptap extension and DOMPurify paste handler
- [x] 01-03-PLAN.md — Create Editor component integrating extensions with toolbar
- [x] 01-04-ARCHITECTURAL-DECISION.md — Split Editor/Viewer architecture decision
- [ ] 01-05-PLAN.md — Build mode toggle and HTML input mode
- [ ] 01-06-PLAN.md — Build live preview pane with lure marking

**Success Criteria:**
1. User can type and format text in a rich text editor with standard formatting options (bold, italic, links)
2. User can select any text range and wrap it in a highlighted "Lure Mark" with a unique identifier
3. Lure Marks display as yellow-highlighted spans that persist across edits
4. User can paste HTML email content (tables, styling) without security risks (scripts removed)
5. User can save the editor content to LocalStorage and reload it later with all marks preserved

---

## Phase 2 - Technique Annotations

**Goal:** Users can map marked lures to phishing techniques with MITRE ATT&CK references

**Dependencies:** Phase 1 (need marked lures before annotating them)

**Requirements:**
- ANN-01: Application displays sidebar panel listing all marked lures
- ANN-02: Each lure in sidebar shows corresponding text preview
- ANN-03: User can select technique from pre-loaded boilerplate library
- ANN-04: User can enter custom MITRE ATT&CK ID for each lure
- ANN-05: User can write explanation text for each lure
- ANN-06: Application loads static JSON of common phishing techniques

**Success Criteria:**
1. When user marks text in editor, a sidebar appears listing all marks with text previews
2. User can click any lure in sidebar and select from dropdown of common phishing techniques (e.g., "Urgency", "Authority")
3. User can enter MITRE ATT&CK IDs (e.g., "T1598") for each technique
4. User can write custom explanations for each lure describing the deceptive technique
5. Technique library is pre-loaded with 10+ common phishing techniques from static JSON

---

## Phase 3 - Visualizer & Export

**Goal:** Users can preview and export annotated emails with arrow annotations

**Dependencies:** Phase 2 (need annotations before visualizing)

**Requirements:**
- VIS-01: Application creates transparent SVG overlay on email preview
- VIS-02: Application calculates BoundingClientRect for each lure span
- VIS-03: Application draws Bezier curve arrows from lures to explanations
- VIS-04: User can preview full slide with annotations and arrows
- VIS-05: User can export composition as high-res PNG using html2canvas
- VIS-06: Exported PNG includes burned-in annotations and arrows

**Success Criteria:**
1. User can toggle to Preview mode showing the email with annotations and arrows in a slide layout
2. Arrows connect each highlighted lure to its explanation using smooth Bezier curves
3. Arrows track with text position when browser window resizes (re-calculated from DOM)
4. User can export the annotated email as high-resolution PNG (1920x1080 minimum)
5. Exported PNG includes all highlights, arrows, technique labels, and explanations burned into the image

---

## Phase 4 - NIST Phish Scale Scoring

**Goal:** Users can calculate phishing difficulty scores using NIST Phish Scale methodology

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

---

## Phase 5 - Data & Persistence

**Goal:** Users can save, load, and export complete project data

**Dependencies:** Phase 4 (all features integrated before final persistence)

**Requirements:**
- DATA-01: User can input project metadata (title, author)
- DATA-02: Application auto-generates created timestamp
- DATA-03: Application saves project state to LocalStorage
- DATA-04: Application loads project from LocalStorage on return visit
- DATA-05: User can export project as JSON with full structure
- DATA-06: User can import project from JSON file

**Success Criteria:**
1. User can set project title and author in project settings
2. Application automatically records creation timestamp
3. All project data (editor content, marks, annotations, scoring) persists to LocalStorage on every change
4. When user revisits application, previous project loads automatically from LocalStorage
5. User can export complete project as JSON file containing all marks, techniques, scoring, and metadata
6. User can import a project from JSON file and restore full editing state

---

## Progress

| Phase | Status | Completion |
|-------|--------|------------|
| Phase 1 - Editor Foundation | In Progress | 66% |
| Phase 2 - Technique Annotations | Not Started | 0% |
| Phase 3 - Visualizer & Export | Not Started | 0% |
| Phase 4 - NIST Phish Scale Scoring | Not Started | 0% |
| Phase 5 - Data & Persistence | Not Started | 0% |

---

**Coverage:** 27/27 v1 requirements mapped ✓
