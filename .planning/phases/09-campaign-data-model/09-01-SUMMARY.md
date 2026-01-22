# Phase 9 Plan 01: Campaign and Phish Type Definitions Summary

**One-liner:** Foundation types for campaign management with self-contained Campaign and portable Phish entities using crypto.randomUUID() and ISO 8601 timestamps.

**Completed:** 2026-01-22

---

## Frontmatter

```yaml
phase: 09-campaign-data-model
plan: 01
completed: 2026-01-22
duration: 51 seconds

subsystem: Data Types
tags:
  - typescript
  - type-definitions
  - campaign-model
  - phish-entities
  - type-safety

tech-stack:
  added:
    - "TypeScript interface definitions"
  patterns:
    - "Self-contained entity design"
    - "Composition over references"
    - "Type-safe data modeling"

key-files:
  created:
    - src/types/phish.ts
    - src/types/campaign.ts
    - src/types/index.ts
  modified: []

dependency-graph:
  requires:
    - "Phase 8: Project types and annotations system"
  provides:
    - "Campaign and Phish type definitions for campaign features"
    - "Type foundation for useCampaigns hook (Plan 09-03)"
    - "Portable campaign data structure for import/export"
  affects:
    - "Plan 09-03: useCampaigns hook implementation"
    - "Plan 09-02: LocalStorage schema migration"
    - "Plan 10-01: Campaign manager UI components"
```

---

## What Was Built

### Core Type Definitions

**1. Phish Type (`src/types/phish.ts`)**
- Single phishing exercise entity with complete email, annotations, and scoring data
- Portable design - can be copied into campaigns independently
- Fields:
  - `id`: Unique identifier (crypto.randomUUID())
  - `metadata`: ProjectMetadata (title, author, timestamps)
  - `htmlSource`: HTML email with lure mark spans
  - `annotations`: Record<string, Annotation> keyed by lure ID
  - `scoring`: ScoringData (NIST Phish Scale)
  - `inputMode`: 'html' | 'richtext' editing mode
  - `scheduledDate?`: Optional ISO 8601 date string for campaign scheduling
- Includes `PhishInput` interface for creating new phishes (excludes id)

**2. Campaign Type (`src/types/campaign.ts`)**
- Self-contained campaign entity with embedded phish copies
- No references to library projects - fully portable
- Fields:
  - `id`: Unique identifier (crypto.randomUUID())
  - `name`: Campaign name
  - `description`: Campaign description
  - `createdAt`: ISO 8601 timestamp
  - `campaignPhishes`: Array of CampaignPhish (copied phishes)
- Includes `CampaignInput` interface for creating new campaigns

**3. CampaignPhish Type (`src/types/campaign.ts`)**
- Extends base `Phish` interface with campaign-specific scheduling
- Maintains all phish data (metadata, htmlSource, annotations, scoring, inputMode)
- Adds optional `scheduledDate` for calendar integration

**4. Centralized Exports (`src/types/index.ts`)**
- Barrel export file for convenient importing
- Exports all types: Campaign, Phish, CampaignPhish, annotations, library, project, scoring
- Enables clean imports: `import { Campaign, Phish } from '@/types'`

---

## Key Design Decisions

### 1. Self-Contained Campaign Design
**Decision:** Campaigns contain copied phish data, not references to library projects.

**Rationale:**
- Fully importable/exportable as single entity
- No referential integrity concerns when library projects are deleted
- Independent phish editing within campaigns
- Simpler CRUD operations (no relationship validation needed)

**Trade-offs:**
- Data duplication (same phish can exist in library + multiple campaigns)
- Storage quota concerns (mitigated by LocalStorage monitoring in Plan 09-02)

### 2. crypto.randomUUID() for ID Generation
**Decision:** Use native browser API instead of uuid package.

**Rationale:**
- Zero dependency (native in modern browsers)
- Secure random UUIDs guaranteed
- Documented in JSDoc comments for consistency

### 3. ISO 8601 Strings for Dates
**Decision:** Store dates as ISO 8601 strings, not Date objects.

**Rationale:**
- JSON-serializable without custom logic
- Lexicographically sortable (string comparison works)
- Easy to format for display (new Date(isoString))
- Documented in JSDoc comments for consistency

### 4. Optional scheduledDate Field
**Decision:** scheduledDate is optional on both Phish and CampaignPhish.

**Rationale:**
- Phishes can exist in library without being scheduled
- Campaign phishes can be added first, scheduled later
- Flexibility for campaign workflow (add → review → schedule)

---

## Implementation Details

### Type Structure

```
src/types/
├── phish.ts           (NEW) Phish, PhishInput, InputMode
├── campaign.ts        (NEW) Campaign, CampaignPhish, CampaignInput
├── index.ts           (NEW) Centralized exports
├── annotations.ts     (EXISTING) Annotation, Technique
├── project.ts         (EXISTING) ProjectMetadata
├── library.ts         (EXISTING) CustomTechnique, TechniqueLibrary
└── scoring.ts         (EXISTING) ScoringData, DifficultyLevel
```

### Import Relationships

- `phish.ts` imports from: `project.ts`, `annotations.ts`, `scoring.ts`
- `campaign.ts` imports from: `phish.ts`
- `index.ts` re-exports from: all type files

### Type Safety

- All fields explicitly typed (no `any`)
- Optional fields marked with `?` (scheduledDate)
- Input types provided for creation (exclude auto-generated fields)
- Extends used properly (CampaignPhish extends Phish)

---

## Deviations from Plan

**None** - Plan executed exactly as written. All type definitions match the specification in the plan document.

---

## Verification Results

✅ All verification checks passed:

1. **Type Existence:**
   - Campaign, CampaignPhish, CampaignInput exported from campaign.ts
   - Phish, PhishInput exported from phish.ts

2. **Documentation Standards:**
   - crypto.randomUUID() pattern documented in both files
   - ISO 8601 string format documented in both files
   - Comprehensive JSDoc comments for all interfaces

3. **Type Safety:**
   - TypeScript compilation successful (`tsc --noEmit` with no errors)
   - All imports resolve correctly
   - No type errors in dependent files

4. **Export Structure:**
   - index.ts exports campaign and phish types
   - Enables convenient importing from @/types

---

## Success Criteria Met

✅ **All success criteria achieved:**

- Campaign type exists with id, name, description, createdAt, campaignPhishes fields
- CampaignPhish type extends Phish with optional scheduledDate
- Phish type exists with all required fields (id, metadata, htmlSource, annotations, scoring, inputMode) and optional scheduledDate
- All types exported from index.ts for convenient importing
- Types are ready for use in useCampaigns hook (Plan 09-03)

---

## Next Phase Readiness

### Ready for Next Plan

**Plan 09-02 (LocalStorage Schema Migration):**
- Type definitions provide schema structure for campaigns array
- Can implement LocalStorage schema versioning (v1.1 → v1.2)
- Types guide storage format and migration logic

**Plan 09-03 (useCampaigns Hook):**
- Campaign and CampaignPhish types enable hook implementation
- PhishInput and CampaignInput provide creation interfaces
- Type-safe CRUD operations can reference these definitions

**Plan 10-01 (Campaign Manager UI):**
- Campaign type structure guides UI component design
- scheduledDate field enables calendar integration
- Self-contained design simplifies state management

### Considerations for Future Work

1. **Storage Quota:** Plan 09-02 should implement LocalStorage monitoring since campaigns contain copied data
2. **Migration Strategy:** No v1.1 users exist, so Plan 09-02 can implement v1.2 schema directly
3. **Type Validation:** Consider runtime validation (zod/io-ts) if validating imported campaign data

---

## Files Changed

### Created

- `src/types/phish.ts` (68 lines)
  - Phish interface with all fields
  - PhishInput interface for creation
  - InputMode type definition
  - Comprehensive JSDoc documentation

- `src/types/campaign.ts` (76 lines)
  - Campaign interface with self-contained design
  - CampaignPhish interface extending Phish
  - CampaignInput interface for creation
  - Design rationale in comments

- `src/types/index.ts` (6 lines)
  - Centralized exports for all types
  - Enables clean imports from @/types

### Modified

None - all files were new creations

---

## Performance Notes

- **Duration:** 51 seconds (3 tasks, all autonomous)
- **Type Safety:** TypeScript compilation clean with zero errors
- **Code Quality:** Comprehensive documentation, follows existing patterns

---

## Commits

1. **d93f571** - `feat(09-01): create Phish type definition with scheduledDate`
2. **ae700a0** - `feat(09-01): create Campaign and CampaignPhish type definitions`
3. **49c235e** - `feat(09-01): export Campaign and Phish types from index.ts`

All commits follow conventional commit format with atomic changes.
