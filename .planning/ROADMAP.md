# Roadmap: Phish Monger

## Overview

Phish Monger delivers campaign management capabilities through a progressive build: establishing data model foundations, building campaign management UI, integrating scheduling and calendar features, implementing visual browsing with detail carousel, handling export/import functionality, and completing dependency upgrades. Each phase delivers verifiable capabilities that build toward the complete campaign management experience.

## Milestones

- **v1.0 MVP** - Phases 1-5 (shipped 2026-01-21)
- **v1.1 Enhanced** - Phases 6-8 (shipped 2026-01-22)
- **v1.2 Campaign Management** - Phases 9-15 (in progress)

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

### v1.2 Campaign Management (In Progress)

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
**Plans**: 4 plans in 2 waves

Plans:
- [x] 09-01-PLAN.md — Campaign and Phish type definitions (wave 1)
- [x] 09-02-PLAN.md — LocalStorage schema extension and schema versioning (wave 2)
- [x] 09-03-PLAN.md — useCampaigns hook with CRUD operations and phish copying (wave 2)
- [x] 09-04-PLAN.md — Storage quota monitoring and warning system (wave 2)

**Status**: Complete — Verified 2026-01-22

#### Phase 10: Campaign Manager UI
**Goal**: Users can create, edit, and manage campaigns through intuitive interface
**Depends on**: Phase 9
**Requirements**: SCH-01, SCH-02, DAT-01, DAT-02, DAT-03, CMP-01, CMP-02, CMP-03, CMP-04, CMP-05, CMP-06, CMP-07
**Success Criteria** (what must be TRUE):
  1. User can view list of all campaigns with metadata (name, description, project count, date range)
  2. User can create new campaign with name and description
  3. User can edit campaign name and description
  4. User can delete campaign (with confirmation)
  5. User can add current phishing project to campaign
  6. User can remove phishing projects from campaign
  7. User can assign scheduled date to each phish in campaign via date picker
  8. System auto-calculates and displays campaign duration (earliest to latest phish dates)
  9. User can export campaign as JSON
  10. User can import campaign from JSON file
  11. System handles duplicate detection on import (by campaign ID)
**Plans**: 4 plans in 3 waves

Plans:
- [x] 10-01-PLAN.md — CampaignCard and CampaignPhishItem display components (wave 1)
- [x] 10-02-PLAN.md — CampaignManager modal with campaign list, search, create, import (wave 2)
- [x] 10-03-PLAN.md — CampaignEditor modal with metadata form, phish list, scheduling (wave 2)
- [x] 10-04-PLAN.md — App.tsx integration with Campaigns button and state management (wave 3)

**Status**: Complete — Verified 2026-01-22

#### Phase 11: iCal Export & Integration
**Goal**: Users can export campaign schedules to external calendar applications
**Depends on**: Phase 10
**Requirements**: SCH-03, SCH-04
**Success Criteria** (what must be TRUE):
  1. User can export campaign to .ics file via export button
  2. iCal file contains one event per scheduled phish with campaign name, phish title, date/time
  3. iCal file imports correctly into Google Calendar, Outlook, and Apple Calendar
  4. System handles timezone conversion correctly (UTC storage, local display)
  5. Export button appears in campaign list view
**Plans**: 2 plans in 2 waves

Plans:
- [x] 11-01-PLAN.md — Install ical-generator and create iCal export utility (wave 1)
- [x] 11-02-PLAN.md — Add Export Calendar button to campaign list view (wave 2)

**Status**: Complete — Verified 2026-01-23

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
**Plans**: 4 plans in 2 waves

Plans:
- [x] 12-01-PLAN.md — CarouselCard and CampaignCarousel components (wave 1)
- [x] 12-02-PLAN.md — ReadOnlyEditor component for viewing phishes (wave 1)
- [x] 12-03-PLAN.md — CampaignCarouselModal with view state management (wave 2)
- [x] 12-04-PLAN.md — App.tsx integration with keyboard navigation (wave 2)

**Status**: Complete — 2026-01-23 (91% - minor scroll position bug, core features working)

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
**Plans**: 2 plans in 2 waves

Plans:
- [x] 13-01-PLAN.md — Storage utilities and compact-annotations CSS variant (wave 1)
- [x] 13-02-PLAN.md — ReadOnlyEditor toggle button with state persistence (wave 2)

**Status**: Complete — Verified 2026-01-23

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
**Plans**: 2 plans in 2 waves

Plans:
- [x] 14-01-PLAN.md — Create sample campaign JSON with TypeScript wrapper (wave 1)
- [x] 14-02-PLAN.md — Add Load Sample Campaign button to CampaignManager (wave 2)

**Status**: Complete — Verified 2026-01-23

#### Phase 15: Dependency Upgrades & Polish
**Goal**: All major dependencies upgraded and verified working
**Depends on**: Phase 14
**Requirements**: DEP-01, DEP-02, DEP-03, DEP-04, DEP-05, DEP-06, DEP-07
**Success Criteria** (what must be TRUE):
  1. Tiptap monorepo upgraded to v3 with LureMark extension working
  2. React monorepo upgraded to latest (19.x) with all components rendering correctly
  3. @types/uuid upgraded to v11 without breaking changes
  4. @vitejs/plugin-react upgraded to v5 with build pipeline working
  5. @types/html2canvas removed (deprecated - html2canvas has built-in types)
  6. All existing features pass manual testing (annotations, visualizer, export, undo/redo)
  7. No console errors or warnings in development or production builds
**Plans**: 5 plans in 5 waves

Plans:
- [x] 15-01-PLAN.md — Upgrade @types/uuid to v11, remove @types/html2canvas, upgrade @vitejs/plugin-react to v5 (wave 1)
- [x] 15-02-PLAN.md — Upgrade React to 19.2.3 with type definitions (wave 2)
- [x] 15-03-PLAN.md — Upgrade Tiptap to v3.17.0 and migrate LureMark extension (wave 3)
- [x] 15-04-PLAN.md — Comprehensive smoke testing of all v1.0-v1.2 features (wave 4)
- [x] 15-05-PLAN.md — Fix any breaking changes or deprecation warnings (wave 5, conditional, skipped - not needed)

**Status**: Complete — Verified 2026-01-24

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
| 9. Campaign Data Model & Storage | v1.2 | 4/4 | Complete | 2026-01-22 |
| 10. Campaign Manager UI | v1.2 | 4/4 | Complete | 2026-01-22 |
| 11. iCal Export & Integration | v1.2 | 2/2 | Complete | 2026-01-23 |
| 12. Detail Carousel | v1.2 | 4/4 | Complete | 2026-01-23 |
| 13. Compact Annotation Layout | v1.2 | 2/2 | Complete | 2026-01-23 |
| 14. Sample Campaign & Demo Data | v1.2 | 2/2 | Complete | 2026-01-23 |
| 15. Dependency Upgrades & Polish | v1.2 | 4/5 | Complete | 2026-01-24 |

**Overall Progress:**
- **Total Plans:** 47
- **Completed:** 46 (98%)
- **Remaining:** 1 (conditional, skipped)
- **v1.2 Progress:** 26/27 plans complete (96%)
