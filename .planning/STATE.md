# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-22)

**Core value:** Security trainers can create visual, annotated phishing training materials that clearly highlight deceptive techniques with educational context — without manual layout work.
**Current focus:** Phase 14: Sample Campaign & Demo Data

## Current Position

Phase: 15 of 15 (Dependency Upgrades & Polish)
Plan: 2 of 3 in current phase
Status: In progress
Last activity: 2026-01-24 — Completed 15-02: React 19.2.3 upgrade with UI verification

Progress: [████████████████░░░] 96% (59/61 plans complete)

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
- Phase 12: Carousel uses CSS scroll-snap-type for native horizontal scrolling (no external libraries)
- Phase 12: CarouselCard displays thumbnail, title, date, and annotation count in 200px compact card
- Phase 12: Selected card indicator: Blue border (#007bff) matching existing UI patterns
- Phase 12: Hover effect uses GPU-accelerated transform (not box-shadow animation) for performance
- Phase 12: Prev/Next buttons scroll 80% of viewport width with smooth behavior
- Phase 12: CarouselCard placeholder icon (🎣) when no screenshot available
- Phase 12: ReadOnlyEditor uses full-screen overlay (z-index: 50) with fixed positioning
- Phase 12: Reuse existing preview components (EmailColumn, AnnotationColumn, SlideWrapper) for consistency
- Phase 12: Read-only mode displays phish content without editing controls (no lure creation, no annotation editing, no scoring changes)
- Phase 12: CampaignCarouselModal uses conditional rendering to prevent component remounting during view switches
- Phase 12: Scroll position preserved via ref and state when switching between carousel and editor views
- Phase 12: Modal backdrop click-to-close pattern follows CampaignManager implementation
- Phase 12: Keyboard navigation uses react-hotkeys-hook for arrow key carousel scrolling (216px = card + gap)
- Phase 12: View Carousel button (purple #8b5cf6) provides campaign list access to carousel modal
- Phase 12: Create New Phish button (green #28a745) enables rapid phish creation for improved testing workflow
- Phase 13: Direct localStorage access for compact layout preference (simpler than useLocalStorage library for boolean flag)
- Phase 13: Minimum 12px font size maintained in compact-annotations variant for readability per ROADMAP criteria
- Phase 13: CSS :global() selectors used for annotation component classes (layouts.module.css is CSS Module but annotations use global classes)
- Phase 13: Separate .compact-annotations variant from existing .compact layout (focused on annotations only, doesn't modify existing behavior)
- Phase 13: Separate compactAnnotations prop on SlideWrapper (not part of LayoutTemplate type) - keeps annotation density independent from layout templates
- Phase 13: useState lazy initialization pattern useState(() => loadCompactLayout()) - loads preference once on mount, not every render
- Phase 13: Toggle button color scheme: purple (#8b5cf6) when expanded, gray (#6c757d) when compact - matches existing UI patterns
- Phase 13: Toggle button placement between annotation toggle and copy button - logical grouping of display controls
- Phase 14: Sample campaign created with 4 phishes demonstrating urgency (IT Support), BEC (CEO fraud), service impersonation (SharePoint), and reciprocity (refund scam)
- Phase 14: Annotation density in sample campaign is 2 per phish (light, not overwhelming) per CONTEXT.md requirements
- Phase 14: Email content in sample campaign kept brief (2-3 sentences) focused on the lure itself
- Phase 14: Annotation tone in sample campaign is casual, friendly, and educational (not overly technical)
- Phase 14: Sample campaign includes scheduled dates (2026-03-15 through 2026-03-18) for calendar export demo
- Phase 14: All lure IDs in sample campaign HTML validated to match annotation lureId fields
- Phase 14: All technique and persuasion principle IDs in sample campaign validated against existing data files
- Phase 14: Load Sample Campaign button added to CampaignManager with purple color (#8b5cf6) for visual distinction
- Phase 14: Duplicate detection checks for exact name match OR 'Sample Campaign' OR 'Demo' to prevent multiple loads
- Phase 14: Direct button action (no modal) for simplicity and faster access to demo content
- Phase 14: User-friendly alert message explains next steps when sample already exists
- Phase 15: Keep @types/uuid despite deprecation warning - per plan specification (uuid provides native types but @types adds explicit version control)
- Phase 15: Removed @types/html2canvas - using native html2canvas@1.4.1 types instead
- Phase 15: Upgraded @vitejs/plugin-react from v4.3.3 to v5.1.2 (Vite v7.0.0 satisfies v6.x peer dependency)
- Phase 15: Added optional thumbnailUrl field to ProjectMetadata for campaign carousel support
- Phase 15: Fixed ical-generator v10 API usage (changed uid to id parameter)
- Phase 15: React 19.2.3 upgrade verified working - low-risk for hook-based codebase with no API changes needed
- Phase 15: Stricter ref null checking in React 19 types - existing code already compliant

### Pending Todos

None yet.

### Blockers/Concerns

None yet.

## Session Continuity

Last session: 2026-01-24 (plan 15-02 execution)
Stopped at: Completed 15-02-PLAN.md - React 19.2.3 upgrade with user verification approved
Resume file: None
