# Roadmap: Phish Monger

## Overview

Phish Monger delivers campaign management capabilities through a progressive build: establishing data model foundations, building campaign management UI, integrating scheduling and calendar features, implementing visual browsing with detail carousel, handling export/import functionality, and completing dependency upgrades. Each phase delivers verifiable capabilities that build toward the complete campaign management experience.

## Milestones

- ✅ **v1.0 MVP** - Phases 1-5 (shipped 2026-01-21)
- ✅ **v1.1 Enhanced** - Phases 6-8 (shipped 2026-01-22)
- 🚧 **v1.2 Campaign Management** - Phases 9-15 (in progress)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-5) - SHIPPED 2026-01-21</summary>

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
<summary>✅ v1.1 Enhanced (Phases 6-8) - SHIPPED 2026-01-22</summary>

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

### 🚧 v1.2 Campaign Management (In Progress)

**Milestone Goal:** Enable security teams to organize multiple phishing exercises into campaigns, schedule them, and export to external calendars.

#### Phase 9: Campaign Data Model & Storage
**Goal**: Campaign and scheduling data structures persist reliably with referential integrity
**Depends on**: Phase 8
**Requirements**: CMP-01, CMP-02, CMP-03, CMP-04, CMP-05, CMP-06, CMP-07, DAT-04, DAT-05
**Success Criteria** (what must be TRUE):
  1. User can create campaign entity with name, description, and project ID array in LocalStorage
  2. System maintains many-to-many relationships (projects belong to multiple campaigns, campaigns contain multiple projects)
  3. System enforces referential integrity (deleting project updates all campaigns, deleting campaign doesn't delete projects)
  4. System migrates existing v1.1 projects to v1.2 schema without data loss
  5. System monitors LocalStorage quota and warns before hitting ~5MB limit
**Plans**: TBD

Plans:
- [ ] 09-01: Campaign and Project type definitions with scheduledDate field
- [ ] 09-02: LocalStorage schema extension and migration logic (v1.1 → v1.2)
- [ ] 09-03: useCampaigns hook with CRUD operations and referential integrity
- [ ] 09-04: Storage quota monitoring and warning system

#### Phase 10: Campaign Manager UI
**Goal**: Users can create, edit, and manage campaigns through intuitive interface
**Depends on**: Phase 9
**Requirements**: SCH-01, SCH-02, DAT-01, DAT-02, DAT-03
**Success Criteria** (what must be TRUE):
  1. User can view list of all campaigns with metadata (name, description, project count, date range)
  2. User can create new campaign with name and description
  3. User can edit campaign name and description
  4. User can delete campaign (with confirmation)
  5. User can add existing phishing projects to campaign via multi-select interface
  6. User can remove phishing projects from campaign
  7. User can assign scheduled date to each phish in campaign via date picker
  8. System auto-calculates and displays campaign duration (earliest to latest phish dates)
**Plans**: TBD

Plans:
- [ ] 10-01: Campaign list view component with campaign cards
- [ ] 10-02: Campaign settings modal (metadata, project assignment, scheduling)
- [ ] 10-03: App navigation between project mode and campaign mode
- [ ] 10-04: Campaign JSON export/import with duplicate detection

#### Phase 11: iCal Export & Integration
**Goal**: Users can export campaign schedules to external calendar applications
**Depends on**: Phase 10
**Requirements**: SCH-03, SCH-04
**Success Criteria** (what must be TRUE):
  1. User can export campaign to .ics file via export button
  2. iCal file contains one event per scheduled phish with campaign name, phish title, date/time
  3. iCal file imports correctly into Google Calendar, Outlook, and Apple Calendar
  4. System handles timezone conversion correctly (UTC storage, local display)
  5. Export button appears in campaign detail view and campaign settings
**Plans**: TBD

Plans:
- [ ] 11-01: Install and integrate ics library for iCal generation
- [ ] 11-02: Implement iCal export with VTIMEZONE components and UTC handling
- [ ] 11-03: Add export button to campaign detail view
- [ ] 11-04: Test iCal import against Google Calendar, Outlook, Apple Calendar

#### Phase 12: Detail Carousel
**Goal**: Users can browse campaign phishes horizontally without leaving campaign context
**Depends on**: Phase 10
**Requirements**: VIS-01
**Success Criteria** (what must be TRUE):
  1. User can view campaign phishes in horizontal scrollable carousel
  2. User can navigate between phishes via prev/next buttons
  3. User can click carousel card to open phish in read-only editor mode
  4. Carousel shows phish metadata (title, scheduled date, annotation count)
  5. Carousel maintains scroll position and selected card state
  6. Carousel handles 20+ phishes without performance degradation
**Plans**: TBD

Plans:
- [ ] 12-01: DetailCarousel component with horizontal scroll and snap points
- [ ] 12-02: Carousel card design with metadata display
- [ ] 12-03: Prev/next navigation with keyboard support (arrow keys)
- [ ] 12-04: Editor component readOnly mode for viewing phishes from carousel

#### Phase 13: Compact Annotation Layout
**Goal**: Users can toggle denser annotation display for carousel browsing
**Depends on**: Phase 12
**Requirements**: VIS-02
**Success Criteria** (what must be TRUE):
  1. User can toggle compact layout via button in carousel view
  2. Compact layout displays annotations with smaller font (12px vs 14px)
  3. Compact layout uses tighter spacing (reduced padding and margins)
  4. Compact layout maintains readability and badge visibility
  5. Toggle preference persists across sessions via LocalStorage
**Plans**: TBD

Plans:
- [ ] 13-01: Compact layout CSS variant (smaller font, tighter spacing)
- [ ] 13-02: Layout toggle button with state persistence
- [ ] 13-03: Apply compact layout to carousel view and read-only editor

#### Phase 14: Sample Campaign & Demo Data
**Goal**: Users can load sample campaign to explore features without manual setup
**Depends on**: Phase 10
**Requirements**: VIS-03, VIS-04
**Success Criteria** (what must be TRUE):
  1. System includes sample campaign JSON with 3-4 well-annotated demo phishes
  2. Sample phishes demonstrate variety (credential harvest, attachment malware, business email compromise)
  3. User can load sample campaign via "Load Sample Campaign" option
  4. Sample campaign imports without duplicate conflicts (unique IDs)
  5. Sample campaign appears in campaign list after loading
**Plans**: TBD

Plans:
- [ ] 14-01: Create sample campaign JSON with 3-4 diverse, well-annotated phishes
- [ ] 14-02: Add "Load Sample Campaign" button to campaign list view
- [ ] 14-03: Implement sample campaign import logic with duplicate detection

#### Phase 15: Dependency Upgrades & Polish
**Goal**: All major dependencies upgraded and verified working
**Depends on**: Phase 14
**Requirements**: DEP-01, DEP-02, DEP-03, DEP-04, DEP-05, DEP-06, DEP-07
**Success Criteria** (what must be TRUE):
  1. Tiptap monorepo upgraded to v3 with LureMark extension working
  2. React monorepo upgraded to latest (19.x) with all components rendering correctly
  3. @types/uuid upgraded to v11 without breaking changes
  4. @vitejs/plugin-react upgraded to v5 with build pipeline working
  5. @types/html2canvas upgraded to v1 with export functionality intact
  6. All existing features pass manual testing (annotations, visualizer, export, undo/redo)
  7. No console errors or warnings in development or production builds
**Plans**: TBD

Plans:
- [ ] 15-01: Upgrade Tiptap to v3 and verify LureMark extension compatibility
- [ ] 15-02: Upgrade React to 19.x and verify all components work
- [ ] 15-03: Upgrade @types/uuid to v11, @vitejs/plugin-react to v5, @types/html2canvas to v1
- [ ] 15-04: Manual regression testing of all v1.0-v1.2 features
- [ ] 15-05: Fix any breaking changes or deprecation warnings

## Progress

**Execution Order:**
Phases execute in numeric order: 9 → 10 → 11 → 12 → 13 → 14 → 15

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
| 9. Campaign Data Model & Storage | v1.2 | 0/4 | Not started | - |
| 10. Campaign Manager UI | v1.2 | 0/4 | Not started | - |
| 11. iCal Export & Integration | v1.2 | 0/4 | Not started | - |
| 12. Detail Carousel | v1.2 | 0/4 | Not started | - |
| 13. Compact Annotation Layout | v1.2 | 0/3 | Not started | - |
| 14. Sample Campaign & Demo Data | v1.2 | 0/3 | Not started | - |
| 15. Dependency Upgrades & Polish | v1.2 | 0/5 | Not started | - |
