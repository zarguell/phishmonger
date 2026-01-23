# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-22)

**Core value:** Security trainers can create visual, annotated phishing training materials that clearly highlight deceptive techniques with educational context — without manual layout work.
**Current focus:** Phase 12: Detail Carousel

## Current Position

Phase: 12 of 15 (Detail Carousel)
Plan: 2 of 3 in current phase
Status: In progress
Last activity: 2026-01-23 — Completed 12-02: ReadOnlyEditor component for campaign phish viewing

Progress: [█████████████░░░░░] 73% (35/48 plans complete)

## Performance Metrics

**Velocity:**
- Total plans completed: 34
- Average duration: TBD
- Total execution time: TBD

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1-8 | 24 | TBD | TBD |
| 9-11 | 10 | - | - |

**Recent Trend:**
- Last 5 plans: TBD
- Trend: TBD

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Phase 9: Campaign data model extends LocalStorage schema with campaigns array and scheduledDate field on projects
- Phase 9: Many-to-many relationships implemented via ID arrays in campaign entities
- Phase 9: v1.1→v1.2 migration script preserves existing single-project workflow
- Phase 9: Campaigns are self-contained entities with copied phish data (not references) for portability
- Phase 9: Use crypto.randomUUID() for ID generation (native browser API, not uuid package)
- Phase 9: Use ISO 8601 strings for dates (JSON-serializable, lexicographically sortable)
- Phase 9: Storage quota monitoring uses inline error state (not toast notifications) per RESEARCH.md
- Phase 9: Schema version 2 initialized on app mount for future migration support
- Phase 9: Warn users at 80% LocalStorage usage (~4MB of 5MB quota)
- Phase 10: Campaign manager UI follows existing modal overlay pattern from technique library
- Phase 10: Mutually exclusive modal state for CampaignManager and CampaignEditor (only one visible at a time)
- Phase 10: currentProject Phish constructed from App state using useMemo for performance
- Phase 10: Project ID persisted to localStorage as 'phishmonger-project-id' for consistent identity
- Phase 10: CampaignManager calls useCampaigns hook internally (App.tsx doesn't need campaigns state)
- Phase 10: Use native Date API for date calculations (no external date libraries)
- Phase 10: Native HTML5 date input for date picker (no component libraries)
- Phase 10: Inline styles for UI components follow TechniqueLibrary pattern
- Phase 10: Controlled form components with useState (no external form libraries)
- Phase 10: Immutable state updates for array operations
- Phase 10: Use window.confirm() for delete confirmation in list view (simpler UX than type-to-confirm)
- Phase 10: File import uses FileReader API with hidden input trigger pattern
- Phase 10: Export uses URL.createObjectURL pattern for JSON downloads
- Phase 10: Duplicate imports get new ID + " (copy)" suffix
- Phase 10: Nested modals use higher z-index (60 vs 50 for parent)
- Phase 15: Dependency upgrades deferred to final phase to reduce risk
- Phase 11: Use 9:00 AM UTC for all iCal events (arbitrary time - only date matters for training campaigns)
- Phase 11: Use UTC times instead of VTIMEZONE components to avoid timezone complexity
- Phase 11: iCal export uses ical-generator library for RFC 5545 compliance
- Phase 11: Client-side file generation with Blob and URL.createObjectURL pattern
- Phase 11: Show alert message instead of disabling button - maintains button visibility for discoverability
- Phase 11: Filter campaign.campaignPhishes for scheduledDate truthy values to validate export eligibility
- Phase 11: Green button color (#28a745) distinguishes export from Edit (blue) and Delete (red)
- Phase 12: ReadOnlyEditor uses full-screen overlay (z-index: 50) with fixed positioning
- Phase 12: Reuse existing preview components (EmailColumn, AnnotationColumn, SlideWrapper) for consistency
- Phase 12: Read-only mode displays phish content without editing controls (no lure creation, no annotation editing, no scoring changes)

### Pending Todos

None yet.

### Blockers/Concerns

None yet.

## Session Continuity

Last session: 2026-01-23 (plan 12-02 execution)
Stopped at: Completed 12-02-PLAN.md - ReadOnlyEditor component created
Resume file: None
