# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-24)

**Core value:** Security trainers can create visual, annotated phishing training materials that clearly highlight deceptive techniques with educational context — without manual layout work.
**Current focus:** Phase 18: Clean HTML Export

## Current Position

Phase: 18 of 19 (Clean HTML Export)
Plan: 01 of 01
Status: Phase complete
Last activity: 2026-01-24 — Completed 18-01-PLAN.md (Clean HTML export utility)

Progress: [████████████░░░░░] 77.1% (54/70 plans complete)

## Performance Metrics

**Velocity:**
- Total plans completed: 50
- Average duration: TBD
- Total execution time: TBD

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1-8 | 29 | TBD | TBD |
| 9-15 | 17 | TBD | TBD |
| 16-19 | 5 | TBD | TBD |

**Recent Trend:**
- Last 5 plans: TBD
- Trend: TBD

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Phase 16: Terminology change from "project" to "phish" affects UI, code, and localStorage keys
- Phase 16: Campaigns-first workflow means campaigns list is default landing view (not standalone editor)
- Phase 16: LocalStorage migration from v2 to v3 required for key rename ("phishmonger-projects" → "phishmonger-phishes")
- Phase 16: Maintain backward compatibility for existing users (migration script runs on app mount)
- Phase 17: Modal pattern established via KeyboardShortcutHelp (escape key + backdrop click) followed for PhishImportModal and CampaignImportModal
- Phase 17: Dual input methods (file upload + text paste) provided for phish and campaign import flexibility
- Phase 17: State reset on modal close prevents stale errors and content between opens
- Phase 17: Centralized modal state management in App.tsx established for consistency
- Phase 17: Callback prop pattern (onImportClick) used for modal triggers to decouple child components from state
- Phase 18: DOMParser-based HTML sanitization used instead of regex for reliable HTML manipulation
- Phase 18: Pure function design for export utilities (no source data mutation, always work with copies)
- Phase 18: Separate filename generation function exported for reuse across export formats

[Previous v1.0-v1.2 decisions archived in PROJECT.md]

### Pending Todos

None yet.

### Blockers/Concerns

None yet.

## Session Continuity

Last session: 2026-01-24
Stopped at: Completed 18-01-PLAN.md (Clean HTML export utility)
Resume file: None
