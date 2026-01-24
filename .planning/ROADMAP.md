# Roadmap: Phish Monger

## Overview

Phish Monger delivers visual phishing training materials through annotation, technique mapping, and export capabilities. This roadmap spans from v1.0 MVP through v1.3 UX Redesign, progressing from core annotation features to campaign management and finally to workflow improvements that reorient the application around campaigns-first usage with consistent terminology and enhanced editor flexibility.

## Milestones

- ✅ **v1.0 MVP** - Phases 1-5 (shipped 2026-01-21)
- ✅ **v1.1 Enhanced** - Phases 6-8 (shipped 2026-01-22)
- ✅ **v1.2 Campaign Management** - Phases 9-15 (shipped 2026-01-24)
- 🚧 **v1.3 UX Redesign** - Phases 16-19 (in progress)

## Phases

<details>
<summary>v1.0 MVP (Phases 1-5) - SHIPPED 2026-01-21</summary>

### Phase 1: Foundation
**Goal**: Project scaffolding, build pipeline, and core infrastructure
**Plans**: 3 plans

Plans:
- [x] 01-01: Initialize Vite + React + TypeScript project
- [x] 01-02: Set up Tiptap editor with custom LureMark extension
- [x] 01-03: Implement core utilities (UUID generator, storage abstraction)

### Phase 2: Annotation System
**Goal**: Users can annotate phishing emails with technique explanations
**Plans**: 3 plans

Plans:
- [x] 02-01: Implement technique library with MITRE ATT&CK mapping
- [x] 02-02: Build annotation CRUD operations (create, read, update, delete)
- [x] 02-03: Implement NIST Phish Scale scoring interface

### Phase 3: Visualizer
**Goal**: Users can see visual annotations overlaid on phishing emails
**Plans**: 3 plans

Plans:
- [x] 03-01: Create numbered badge overlay system
- [x] 03-02: Implement technique explanation cards
- [x] 03-03: Add responsive layout (flexbox-based)

### Phase 4: Export & Persistence
**Goal**: Users can save work and export training materials
**Plans**: 3 plans

Plans:
- [x] 04-01: Implement LocalStorage persistence
- [x] 04-02: Add PNG export via html2canvas
- [x] 04-03: Implement JSON export/import with project metadata

### Phase 5: Polish & Testing
**Goal**: Production-ready v1.0 with edge cases covered
**Plans**: 3 plans

Plans:
- [x] 05-01: Implement DOMPurify sanitization for paste
- [x] 05-02: Add preview mode before export
- [x] 05-03: Cross-browser testing and bug fixes

</details>

<details>
<summary>v1.1 Enhanced (Phases 6-8) - SHIPPED 2026-01-22</summary>

### Phase 6: Flexible Annotations
**Goal**: Users can create freetext annotations with optional technique tags
**Plans**: 4 plans

Plans:
- [x] 06-01: Extend annotation data model for optional techniqueId
- [x] 06-02: Update Visualizer card layout (title, inline tags, description)
- [x] 06-03: Update lure list to display annotation titles
- [x] 06-04: Add freetext annotations without technique mapping

### Phase 7: Undo/Redo & Visual Enhancements
**Goal**: Users can undo mistakes and customize visual styles
**Plans**: 5 plans

Plans:
- [x] 07-01: Implement useReducer-based undo/redo with 50-step history
- [x] 07-02: Add keyboard shortcuts (Ctrl+Z/Cmd+Z for undo/redo)
- [x] 07-03: Implement custom arrow badge styles (Classic, Square, Diamond)
- [x] 07-04: Add layout templates (Balanced, Compact, Wide)
- [x] 07-05: Build keyboard shortcuts help modal

### Phase 8: Custom Technique Library
**Goal**: Users can manage their own technique library
**Plans**: 3 plans

Plans:
- [x] 08-01: Create useCustomTechniques hook with LocalStorage persistence
- [x] 08-02: Build technique library management interface (CRUD)
- [x] 08-03: Handle orphaned technique references with warnings

</details>

<details>
<summary>v1.2 Campaign Management (Phases 9-15) - SHIPPED 2026-01-24</summary>

### Phase 9: Campaign Data Model & Storage
**Goal**: Many-to-many phish↔campaign relationships with schema versioning
**Plans**: 4 plans

Plans:
- [x] 09-01: Campaign and Phish type definitions
- [x] 09-02: LocalStorage schema extension and schema versioning
- [x] 09-03: useCampaigns hook with CRUD operations and phish copying
- [x] 09-04: Storage quota monitoring and warning system

### Phase 10: Campaign Manager UI
**Goal**: Campaign list, create, edit, delete interface
**Plans**: 4 plans

Plans:
- [x] 10-01: CampaignCard and CampaignPhishItem display components
- [x] 10-02: CampaignManager modal with campaign list, search, create, import
- [x] 10-03: CampaignEditor modal with metadata form, phish list, scheduling
- [x] 10-04: App.tsx integration with Campaigns button and state management

### Phase 11: iCal Export & Integration
**Goal**: Calendar export for campaign scheduling
**Plans**: 2 plans

Plans:
- [x] 11-01: Install ical-generator and create iCal export utility
- [x] 11-02: Add Export Calendar button to campaign list view

### Phase 12: Detail Carousel
**Goal**: Horizontal browsing with prev/next navigation and keyboard shortcuts
**Plans**: 4 plans

Plans:
- [x] 12-01: CarouselCard and CampaignCarousel components
- [x] 12-02: ReadOnlyEditor component for viewing phishes
- [x] 12-03: CampaignCarouselModal with view state management
- [x] 12-04: App.tsx integration with keyboard navigation

### Phase 13: Compact Annotation Layout
**Goal**: Denser display for carousel browsing
**Plans**: 2 plans

Plans:
- [x] 13-01: Storage utilities and compact-annotations CSS variant
- [x] 13-02: ReadOnlyEditor toggle button with state persistence

### Phase 14: Sample Campaign & Demo Data
**Goal**: Demo campaign with diverse phishing examples
**Plans**: 2 plans

Plans:
- [x] 14-01: Create sample campaign JSON with TypeScript wrapper
- [x] 14-02: Add Load Sample Campaign button to CampaignManager

### Phase 15: Dependency Upgrades & Polish
**Goal**: React 19, Tiptap v3, dependency updates, smoke testing
**Plans**: 5 plans

Plans:
- [x] 15-01: Upgrade @types/uuid to v11, remove @types/html2canvas, upgrade @vitejs/plugin-react to v5
- [x] 15-02: Upgrade React to 19.2.3 with type definitions
- [x] 15-03: Upgrade Tiptap to v3.17.0 and migrate LureMark extension
- [x] 15-04: Comprehensive smoke testing of all v1.0-v1.2 features
- [x] 15-05: Fix any breaking changes or deprecation warnings (skipped - not needed)

</details>

### 🚧 v1.3 UX Redesign (In Progress)

**Milestone Goal:** Reorient application around campaigns-first workflow, eliminate confusing "project" terminology, improve editor flexibility, and enhance import/export options.

#### Phase 16: Terminology & Workflow Foundation
**Goal**: Rename all "project" references to "phish" and make campaigns the default landing view
**Depends on**: Phase 15
**Requirements**: TERM-01, TERM-02, TERM-03, TERM-04
**Success Criteria** (what must be TRUE):
  1. User sees campaigns list as first screen when launching application (not standalone editor)
  2. All UI text refers to "phishes" instead of "projects" (buttons, labels, headings, help text)
  3. Existing user data migrates automatically from old "key to "phishmonger-phish-id"" key
  4. Application code uses "phish" terminology consistently (variables, functions, comments)
**Plans**: 4 plans in 3 waves

Plans:
- [x] 16-01: UI text terminology update (user-facing strings, CSS classes)
- [x] 16-02: Code terminology update (variables, functions, comments)
- [x] 16-03: LocalStorage migration script (v2 → v3)
- [x] 16-04: Campaigns-first routing (default landing view)

#### Phase 17: Import UX Improvements
**Goal**: Modal-based phish import and text input for campaign import
**Depends on**: Phase 16
**Requirements**: IEXP-01, IEXP-02
**Success Criteria** (what must be TRUE):
  1. User imports phishes via modal dialog (no layout shift from expanding menus)
  2. User imports campaigns via file upload OR text paste (JSON input field)
  3. Modal dialogs close cleanly with escape key or cancel button
  4. Text paste input validates JSON format before import
**Plans**: 3 plans in 2 waves

Plans:
- [ ] 17-01: Phish import modal UI
- [ ] 17-02: Campaign import modal UI
- [ ] 17-03: Integrate modals into App, ProjectSettings, and CampaignManager

#### Phase 18: Clean HTML Export
**Goal**: Export clean email HTML from carousel view (strip lure mark divs)
**Depends on**: Phase 17
**Requirements**: IEXP-03, IEXP-04
**Success Criteria** (what must be TRUE):
  1. User exports clean HTML from carousel view (no lure mark divs, no annotation UI)
  2. Clean HTML export offers both file download and clipboard copy options
  3. Exported HTML renders correctly when opened in email clients or browsers
  4. Original phish data remains unchanged (export is derivative, not mutation)
**Plans**: 4 plans in 3 waves

Plans:
- [ ] 18-01: HTML sanitization for export (strip lure mark divs)
- [ ] 18-02: Export options UI (file download vs clipboard copy)
- [ ] 18-03: HTML export validation (test in email clients)

#### Phase 19: Editor Column Flexibility
**Goal**: Expandable and minimizable editor columns with keyboard shortcuts
**Depends on**: Phase 18
**Requirements**: EDIT-01, EDIT-02, EDIT-03, EDIT-04
**Success Criteria** (what must be TRUE):
  1. User expands any editor column to full-width focus mode via header button
  2. User minimizes any column to collapsed header bar via header button
  3. Column state persists across sessions (localStorage remembers expanded/minimized)
  4. User toggles column focus with keyboard shortcuts (1, 2, 3, 4)
**Plans**: 4 plans in 3 waves

Plans:
- [ ] 19-01: Column expand/minimize UI buttons
- [ ] 19-02: Column collapse behavior (minimized to header bar)
- [ ] 19-03: LocalStorage persistence for column states
- [ ] 19-04: Keyboard shortcuts (1, 2, 3, 4) for column focus

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 13 → 14 → 15 → 16 → 17 → 18 → 19

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation | v1.0 | 3/3 | Complete | 2026-01-21 |
| 2. Annotation System | v1.0 | 3/3 | Complete | 2026-01-21 |
| 3. Visualizer | v1.0 | 3/3 | Complete | 2026-01-21 |
| 4. Export & Persistence | v1.0 | 3/3 | Complete | 2026-01-21 |
| 5. Polish & Testing | v1.0 | 3/3 | Complete | 2026-01-21 |
| 6. Flexible Annotations | v1.1 | 4/4 | Complete | 2026-01-22 |
| 7. Undo/Redo & Visual Enhancements | v1.1 | 5/5 | Complete | 2026-01-22 |
| 8. Custom Technique Library | v1.1 | 3/3 | Complete | 2026-01-22 |
| 9. Campaign Data Model & Storage | v1.2 | 4/4 | Complete | 2026-01-22 |
| 10. Campaign Manager UI | v1.2 | 4/4 | Complete | 2026-01-22 |
| 11. iCal Export & Integration | v1.2 | 2/2 | Complete | 2026-01-23 |
| 12. Detail Carousel | v1.2 | 4/4 | Complete | 2026-01-23 |
| 13. Compact Annotation Layout | v1.2 | 2/2 | Complete | 2026-01-23 |
| 14. Sample Campaign & Demo Data | v1.2 | 2/2 | Complete | 2026-01-23 |
| 15. Dependency Upgrades & Polish | v1.2 | 4/5 | Complete | 2026-01-24 |
| 16. Terminology & Workflow Foundation | v1.3 | 4/4 | Complete | 2026-01-24 |
| 17. Import UX Improvements | v1.3 | 0/3 | Not started | - |
| 18. Clean HTML Export | v1.3 | 0/3 | Not started | - |
| 19. Editor Column Flexibility | v1.3 | 0/4 | Not started | - |

**Overall Progress:**
- **Total Plans:** 70 (v1.0-v1.3)
- **Completed:** 50 (71%)
- **Remaining:** 20 (29%)
- **v1.3 Progress:** 4/14 plans complete (29%)
