# Phase 10: Campaign Manager UI - Context

**Gathered:** 2026-01-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can create, edit, and manage campaigns through intuitive interface. Users view campaign lists, create new campaigns, assign projects, schedule dates, and export/import campaigns as JSON. Detail carousel and iCal export are separate phases.

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
- Tag-style picker for multi-select (dropdown with search, badges for selected)
- Projects show visual badge if already in other campaigns
- Clicking badge shows which campaigns include that project
- Assigned projects displayed as compact badges in campaign detail
- Badges show project name, X to remove, click to view project

### Claude's Discretion
- Card visual design (shadows, border radius, spacing)
- Modal animation and placement
- Tag picker search algorithm and sorting
- JSON import error handling and validation messaging
- Export filename format and default location

</decisions>

<specifics>
## Specific Ideas

- JSON import/export critical for campaign portability and backup
- Type-to-confirm deletion prevents accidental campaign loss
- Educational empty state helps users understand campaign value
- Tag-style picker feels modern and works well for multi-select
- Visual badges for multi-campaign projects prevent confusion

</specifics>

<deferred>
## Deferred Ideas

- Date scheduling experience — user chose to let Claude decide this, can be refined during planning
- Campaign detail view depth — can be determined during implementation based on space
- Bulk operations on campaigns (delete multiple, export multiple) — future enhancement

---

*Phase: 10-campaign-manager-ui*
*Context gathered: 2026-01-22*
