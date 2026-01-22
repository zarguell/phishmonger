# Phase 10: Campaign Manager UI - Context

**Gathered:** 2026-01-22
**Updated:** 2026-01-22 (aligned with research findings on single-project architecture)
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can create, edit, and manage campaigns through intuitive interface. Users view campaign lists, create new campaigns, assign the current project to campaigns, schedule dates, and export/import campaigns as JSON. Detail carousel and iCal export are separate phases.

**Important:** Phish Monger is a single-project editor. Users work on one project at a time (stored in `phishmonger-*` LocalStorage keys). When adding projects to campaigns, users copy the current working project into campaigns via "Add Current Project" button.

</domain>

<decisions>
## Implementation Decisions

### Campaign list presentation
- Card grid layout (not table or simple list)
- Cards display minimal info initially: name, description, project count
- Date range only shows when campaign has scheduled phishes
- Grid responsive: 3 columns desktop, 2 tablet, 1 mobile
- Empty state is educational: explains campaigns, shows Create button, links to docs

### Campaign creation/editing workflow
- Minimal create, edit later approach for speed
- Quick create: modal with name + description only (name required, description optional)
- Edit button on card opens full modal with all settings (metadata, projects, scheduling)
- Campaign deletion uses type-to-confirm (user must type campaign name)
- JSON export/import supported: paste JSON or upload file to import campaigns
- Export button in campaign list and detail view
- Import includes duplicate detection (unique IDs prevent conflicts)

### Project assignment interface
- **"Add Current Project" button** (not multi-select dropdown)
- Phish Monger is a single-project editor - users work on one project at a time
- Current project title displayed above button
- Button copies current working project into campaign via copyPhishForCampaign utility
- Duplicate detection prevents adding same project twice to same campaign
- Assigned projects displayed as compact badges in campaign detail
- Badges show project name, X to remove, click to view project

**Note:** Original specification mentioned "tag-style picker for multi-select" but research confirmed Phish Monger's single-project architecture makes this inappropriate. Users add projects by loading them one at a time and clicking "Add to campaign."

### Claude's Discretion
- Card visual design (shadows, border radius, spacing)
- Modal animation and placement
- JSON import error handling and validation messaging
- Export filename format and default location

</decisions>

<specifics>
## Specific Ideas

- JSON import/export critical for campaign portability and backup
- Type-to-confirm deletion prevents accidental campaign loss
- Educational empty state helps users understand campaign value
- Single-project model means "Add Current Project" button is the right UX (not multi-select picker)
- Users can add the same project to multiple campaigns by loading it and adding to each campaign separately

</specifics>

<deferred>
## Deferred Ideas

- Date scheduling experience — user chose to let Claude decide this, can be refined during planning
- Campaign detail view depth — can be determined during implementation based on space
- Bulk operations on campaigns (delete multiple, export multiple) — future enhancement
- Project library browser — would enable true multi-select, but is a separate feature beyond phase scope

---

*Phase: 10-campaign-manager-ui*
*Context gathered: 2026-01-22*
*Updated: 2026-01-22 to align with single-project architecture findings*
