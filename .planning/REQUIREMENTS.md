# Requirements: Phish Monger v1.2 Campaign Management

**Defined:** 2026-01-22
**Core Value:** Security trainers can create visual, annotated phishing training materials that clearly highlight deceptive techniques with educational context — without manual layout work.

## v1.2 Requirements

Requirements for Campaign Management milestone. Each maps to roadmap phases.

### Campaign Management

- [ ] **CMP-01**: User can create campaign with name and description
- [ ] **CMP-02**: User can view list of all campaigns
- [ ] **CMP-03**: User can view campaign detail (all phishes in campaign)
- [ ] **CMP-04**: User can edit campaign name and description
- [ ] **CMP-05**: User can delete campaign
- [ ] **CMP-06**: User can add existing phishing projects to campaign
- [ ] **CMP-07**: User can remove phishing projects from campaign

### Scheduling

- [ ] **SCH-01**: User can assign scheduled date to each phish in campaign
- [ ] **SCH-02**: System auto-calculates campaign duration from min/max phish dates
- [ ] **SCH-03**: User can export campaign to iCal/ics file for external calendar integration
- [ ] **SCH-04**: iCal file contains one event per scheduled phish with campaign name and phish title

### Visual & Browsing

- [ ] **VIS-01**: User can browse campaign phishes via detail carousel (horizontal scroll, prev/next)
- [ ] **VIS-02**: User can toggle compact annotation layout (smaller font, tighter spacing, reduced padding)
- [ ] **VIS-03**: System includes sample campaign JSON (3-4 well-annotated demo phishes)
- [ ] **VIS-04**: User can load sample campaign via "Load Sample Campaign" option

### Data & Export

- [ ] **DAT-01**: User can export campaign as JSON (array of phishes + campaign metadata)
- [ ] **DAT-02**: User can import campaign from JSON file
- [ ] **DAT-03**: System handles duplicate detection on import (by project ID)
- [ ] **DAT-04**: System maintains many-to-many relationships (phish can be in multiple campaigns)
- [ ] **DAT-05**: System enforces referential integrity (cascade delete or warnings)

### Dependencies

- [ ] **DEP-01**: Upgrade Tiptap monorepo to v3 (major version)
- [ ] **DEP-02**: Upgrade React monorepo to latest (major version)
- [ ] **DEP-03**: Upgrade @types/uuid to v11
- [ ] **DEP-04**: Upgrade @vitejs/plugin-react to v5
- [ ] **DEP-05**: Upgrade @types/html2canvas to v1
- [ ] **DEP-06**: Verify LureMark extension compatibility after Tiptap v3 upgrade
- [ ] **DEP-07**: Verify all components work after React 19 upgrade

## Out of Scope

| Feature | Reason |
|---------|--------|
| Campaign templates/cloning | Not needed for MVP; users can duplicate campaigns via JSON export/import |
| Bulk date assignment | Manual assignment acceptable for initial campaigns |
| Conflict detection (same-day warnings) | Helper feature, not blocker for MVP |
| Multi-select bulk actions | Individual operations acceptable initially |
| Visual calendar view (month/week grid) | Carousel provides browse value; calendar UI deferred to post-v1.2 |
| Quick-edit from carousel | Users can open full editor from carousel cards |
| Folders + tags organization | Keep it simple: campaigns as flat collections only |
| Campaign analytics/dashboard | Focus on authoring, not delivery analytics |
| Email scheduling integration | Phish Monger is annotation tool, not email sender |
| Real-time collaboration | Local storage + JSON import/export sufficient |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| CMP-01 | Phase 9 | Pending |
| CMP-02 | Phase 9 | Pending |
| CMP-03 | Phase 9 | Pending |
| CMP-04 | Phase 9 | Pending |
| CMP-05 | Phase 9 | Pending |
| CMP-06 | Phase 9 | Pending |
| CMP-07 | Phase 9 | Pending |
| SCH-01 | Phase 10 | Pending |
| SCH-02 | Phase 10 | Pending |
| SCH-03 | Phase 11 | Pending |
| SCH-04 | Phase 11 | Pending |
| VIS-01 | Phase 12 | Pending |
| VIS-02 | Phase 13 | Pending |
| VIS-03 | Phase 14 | Pending |
| VIS-04 | Phase 14 | Pending |
| DAT-01 | Phase 11 | Pending |
| DAT-02 | Phase 11 | Pending |
| DAT-03 | Phase 11 | Pending |
| DAT-04 | Phase 10 | Pending |
| DAT-05 | Phase 10 | Pending |
| DEP-01 | Phase 15 | Pending |
| DEP-02 | Phase 15 | Pending |
| DEP-03 | Phase 15 | Pending |
| DEP-04 | Phase 15 | Pending |
| DEP-05 | Phase 15 | Pending |
| DEP-06 | Phase 15 | Pending |
| DEP-07 | Phase 15 | Pending |

**Coverage:**
- v1.2 requirements: 28 total
- Mapped to phases: 28
- Unmapped: 0 ✓

---
*Requirements defined: 2026-01-22*
*Last updated: 2026-01-22 after initial definition*
