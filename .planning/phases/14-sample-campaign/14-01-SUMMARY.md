---
phase: 14-sample-campaign
plan: 01
subsystem: demo-data
tags: [sample-campaign, json, typescript, phishing-examples, demo-content]

# Dependency graph
requires:
  - phase: 09-campaigns
    provides: Campaign type and useCampaigns hook for data management
  - phase: 01-08
    provides: Core types (Campaign, Phish, Annotation, ScoringData) and data files (techniques.json, persuasion.json)
provides:
  - Static sample campaign with 4 diverse phishing examples
  - Type-safe SAMPLE_CAMPAIGN export for easy importing
  - Demo content for immediate user exploration without manual setup
affects: [14-02]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Static JSON import with TypeScript type assertion
    - Lightweight demo content with 1-2 annotations per phish
    - Scheduled dates for calendar export demo

key-files:
  created:
    - src/data/sampleCampaign.json - Static sample campaign data with 4 phishes
    - src/data/sampleCampaign.ts - TypeScript wrapper for type-safe imports
  modified: []

key-decisions:
  - "4 phishes created (urgency/authority, BEC, service impersonation, reciprocity) to demonstrate technique variety"
  - "Email content kept brief (2-3 sentences) per CONTEXT.md requirements"
  - "Annotation density: 2 annotations per phish (light, not overwhelming)"
  - "Annotation tone: casual, friendly, educational (not overly technical)"
  - "All lure IDs in HTML validated to match annotation lureId fields"
  - "All technique and persuasion principle IDs validated against existing data files"
  - "Scheduled dates included for calendar export demo functionality"

patterns-established:
  - "Pattern: Static JSON data import with TypeScript type assertion for type-safe demo content"

# Metrics
duration: 15min
completed: 2026-01-23
---

# Phase 14 Plan 01: Sample Campaign Data Summary

**Static sample campaign with 4 diverse phishing examples (urgency, BEC, service impersonation, reciprocity) demonstrating technique mapping and NIST Phish Scale scoring**

## Performance

- **Duration:** 15 min
- **Started:** 2026-01-23T23:09:27Z
- **Completed:** 2026-01-23T23:24:00Z
- **Tasks:** 1
- **Files modified:** 2

## Accomplishments

- Created sample campaign JSON with 4 phishing examples demonstrating different attack patterns
- Validated all lure IDs in HTML match annotation lureId fields (no orphans)
- Verified all technique IDs and persuasion principle IDs reference valid data
- Created TypeScript wrapper for type-safe imports
- Email content is brief (2-3 sentences) with casual, educational tone
- Includes scheduled dates for calendar export demo functionality

## Task Commits

Each task was committed atomically:

1. **Task 1: Create sample campaign JSON with TypeScript wrapper** - `d430f40` (feat)

**Plan metadata:** (pending final commit)

## Files Created/Modified

- `src/data/sampleCampaign.json` - Sample campaign with 4 phishes: "Urgent Account Verification" (T1566.002 + CIAL-02), "CEO Document Request" (T1598 + CIAL-01), "Fake SharePoint Notice" (T1566.003 + CIAL-07), "Invoice Refund Available" (T1598 + CIAL-05)
- `src/data/sampleCampaign.ts` - TypeScript wrapper importing Campaign type and exporting SAMPLE_CAMPAIGN constant with type assertion

## Decisions Made

- **Phish variety:** Created 4 phishes demonstrating urgency (IT Support), BEC (CEO fraud), service impersonation (SharePoint), and reciprocity (refund scam) to show technique diversity
- **Annotation density:** Used 2 annotations per phish (light density per CONTEXT.md) to demonstrate feature without overwhelming users
- **Email brevity:** Kept email content to 2-3 sentences focused on the lure itself per CONTEXT.md requirements
- **Annotation tone:** Casual and friendly (e.g., "Creates false urgency with '24 hours' deadline") rather than overly technical language
- **Scheduled dates:** Included dates (2026-03-15 through 2026-03-18) to demonstrate calendar export functionality in future phases
- **Validation:** All lure IDs, technique IDs, and persuasion principle IDs validated against existing data files

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all verification checks passed on first attempt.

## User Setup Required

None - no external service configuration required. Sample campaign is static data that ships with the app.

## Next Phase Readiness

**Ready for next phase:**

- Sample campaign data structure is complete and validated
- TypeScript wrapper provides type-safe import for use in CampaignManager
- All technique and persuasion references are valid
- Ready for Plan 14-02: Load Sample Campaign button in CampaignManager

**No blockers or concerns.**

---
*Phase: 14-sample-campaign*
*Plan: 01*
*Completed: 2026-01-23*
