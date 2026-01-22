# Phase 9 Plan 03: useCampaigns Hook with CRUD Operations Summary

**One-liner:** Campaign management hook with full CRUD API, phish copy utilities, and LocalStorage persistence following useCustomTechniques pattern with quota error handling.

**Completed:** 2026-01-22

---

## Frontmatter

```yaml
phase: 09-campaign-data-model
plan: 03
completed: 2026-01-22
duration: 46 seconds

subsystem: State Management
tags:
  - react-hooks
  - campaign-crud
  - local-storage
  - error-handling
  - phish-copying

tech-stack:
  added:
    - "useCampaigns React hook"
    - "copyPhishForCampaign utility"
  patterns:
    - "useCustomTechniques pattern (useState, useEffect, useCallback)"
    - "Deep copy for data independence"
    - "LocalStorage quota error handling"
    - "Self-contained entity management"

key-files:
  created:
    - src/hooks/useCampaigns.ts
    - src/utils/campaignCopy.ts
  modified:
    - src/utils/storage.ts (loadCampaigns, saveCampaigns already present)

dependency-graph:
  requires:
    - "Plan 09-01: Campaign and Phish type definitions"
    - "Plan 09-02: LocalStorage schema with campaigns array"
  provides:
    - "Campaign CRUD operations for UI components"
    - "Phish copying utilities for campaign workflow"
    - "Storage error state management"
  affects:
    - "Plan 10-01: Campaign manager UI components"
    - "Plan 11-01: Campaign scheduling features"
```

---

## What Was Built

### 1. Phish Copying Utilities (src/utils/campaignCopy.ts)

**copyPhishForCampaign function:**
- Creates deep copies of phish objects for campaign use
- Keeps original UUIDs (no new IDs generated per CONTEXT.md)
- No back-reference to origin project - copies are truly independent
- Deep copies nested objects:
  - `annotations`: Record<string, Annotation> copied by spreading each entry
  - `scoring`: ScoringData copied by spreading
  - `metadata`: ProjectMetadata copied with all fields
- Immutable strings (htmlSource) assigned directly

**createPhish helper:**
- Generates new UUID using crypto.randomUUID()
- Creates Phish from PhishInput (excludes id field)
- For creating new phishes from scratch

**Key design decisions:**
- Per CONTEXT.md: Campaigns contain copied data, not references
- Enables full portability - campaigns can be exported/imported as single entity
- Independent editing - changes in campaign don't affect library project

### 2. useCampaigns Hook (src/hooks/useCampaigns.ts)

**State management:**
- `campaigns`: Campaign[] array for campaign list
- `isLoaded`: boolean flag for initial load completion
- `storageError`: string | null for QuotaExceededError display

**Campaign CRUD operations:**
- `addCampaign(input: CampaignInput): Campaign`
  - Generates id with crypto.randomUUID()
  - Adds createdAt timestamp (ISO 8601)
  - Returns created campaign for reference
  - Persists to LocalStorage

- `updateCampaign(id, updates): void`
  - Merges partial updates with existing campaign
  - Console warn if campaign not found
  - Prevents updating id/createdAt (immutable fields)
  - Persists to LocalStorage

- `deleteCampaign(id): void`
  - Removes campaign from state array
  - Console warn if campaign not found
  - Persists to LocalStorage

- `getCampaign(id): Campaign | undefined`
  - Retrieves single campaign by ID
  - Returns undefined if not found

**Phish management within campaigns:**
- `addPhishToCampaign(campaignId, phish): void`
  - Adds phish to campaign's campaignPhishes array
  - Should use copyPhishForCampaign() to create independent copy
  - Console warn if campaign not found
  - Persists to LocalStorage

- `removePhishFromCampaign(campaignId, phishId): void`
  - Filters phish out of campaign's campaignPhishes array
  - Console warn if campaign not found
  - Persists to LocalStorage

- `updatePhishInCampaign(campaignId, phishId, updates): void`
  - Merges partial updates with specific phish
  - Console warn if campaign not found
  - Persists to LocalStorage

**LocalStorage persistence:**
- Loads campaigns on mount via useEffect
- Saves after every mutation via saveToStorage callback
- QuotaExceededError handling:
  - Catches QuotaExceededError, sets storageError state
  - Displays user-friendly message: "Storage nearly full. Delete old campaigns or export data."
  - Other errors logged to console, set generic error message
- storageError state cleared on successful save

**Pattern consistency:**
- Follows useCustomTechniques hook structure:
  - useState for state (campaigns, isLoaded, storageError)
  - useEffect for initial load
  - useCallback for all operations with proper dependencies
  - Console warnings for invalid operations
  - Try-catch error handling in storage operations

---

## Key Design Decisions

### 1. Deep Copy for Campaign Phishes
**Decision:** Campaigns contain copied phish data, not references to library projects.

**Rationale:**
- Fully importable/exportable as single entity
- No referential integrity concerns when library projects deleted
- Independent phish editing within campaigns
- Simpler CRUD operations (no relationship validation needed)

**Trade-offs:**
- Data duplication (same phish can exist in library + multiple campaigns)
- Storage quota concerns (mitigated by LocalStorage monitoring in Plan 09-02)

### 2. Keep Original UUIDs When Copying
**Decision:** Per CONTEXT.md, copied phishes maintain their original UUIDs.

**Rationale:**
- Stable identifiers when exporting/importing campaigns
- Simplifies debugging (can trace phish back to original library project)
- Aligns with "self-contained" design - no need for new IDs

### 3. QuotaExceededError State Management
**Decision:** Catch QuotaExceededError in saveToStorage, set storageError state for inline display.

**Rationale:**
- User-friendly error messaging (not generic "Failed to save")
- Allows UI to display error inline (toast notification)
- No pre-save validation - let browser fail, then handle gracefully
- Matches CONTEXT.md specification exactly

### 4. No Relationship Validation
**Decision:** Campaigns don't validate references to library projects.

**Rationale:**
- Campaigns are self-contained (no references to validate)
- Simpler CRUD operations
- Consistent with CONTEXT.md design

---

## Implementation Details

### Type Safety

All functions properly typed:
- Campaign, CampaignInput, CampaignPhish types from campaign.ts
- Phish type from phish.ts
- Proper use of Omit<> for immutable fields (id, createdAt)
- Return types explicit (Campaign, void, undefined)

### Error Handling

- Console warnings for non-existent IDs (update/delete operations)
- QuotaExceededError caught and displayed to user
- Generic error logging for other storage failures
- Graceful degradation (empty array on load failure)

### Import Dependencies

useCampaigns.ts imports from:
- `../types/campaign`: Campaign, CampaignInput, CampaignPhish
- `../types/phish`: Phish type (for type references)
- `../utils/storage`: loadCampaigns, saveCampaigns
- `react`: useState, useEffect, useCallback

campaignCopy.ts imports from:
- `../types/phish`: Phish, PhishInput
- `../types/annotations`: Annotation
- `../types/scoring`: ScoringData
- `../types/project`: ProjectMetadata

---

## Deviations from Plan

**None** - Plan executed exactly as written. Both files match the specification in the plan document.

---

## Verification Results

✅ All verification checks passed:

1. **useCampaigns structure:**
   - Hook created with useState for campaigns, isLoaded, storageError
   - useEffect loads campaigns on mount
   - useCallback for all operations with proper dependencies

2. **Campaign CRUD:**
   - addCampaign generates unique IDs with crypto.randomUUID()
   - updateCampaign modifies only target campaign
   - deleteCampaign removes campaign from state
   - getCampaign retrieves single campaign by ID

3. **Phish management:**
   - addPhishToCampaign adds phish to campaign.campaignPhishes array
   - removePhishFromCampaign removes phish from campaign.campaignPhishes array
   - updatePhishInCampaign modifies specific phish within campaign

4. **LocalStorage persistence:**
   - All CRUD operations persist to LocalStorage via saveCampaigns
   - QuotaExceededError sets storageError state for inline display

5. **Phish copying:**
   - copyPhishForCampaign creates deep copy of phish
   - Keeps original UUIDs (no new IDs generated)
   - No back-reference to origin project
   - Deep copies annotations, scoring, metadata

6. **File requirements:**
   - useCampaigns.ts: 224 lines (exceeds 100 minimum)
   - campaignCopy.ts: 69 lines (exceeds 30 minimum)

---

## Success Criteria Met

✅ **All success criteria achieved:**

- useCampaigns hook provides complete CRUD operations for campaigns
- Phishes can be added/removed/updated within campaigns
- Storage quota errors set storageError for inline display
- Hook follows useCustomTechniques pattern for consistency
- All operations persist to LocalStorage

---

## Next Phase Readiness

### Ready for Next Plan

**Plan 09-04 (Campaign Export/Import):**
- Campaign CRUD operations provide foundation for export/import
- Campaign structure (self-contained with copied phishes) enables JSON serialization
- Storage error handling informs user feedback during export

**Plan 10-01 (Campaign Manager UI):**
- useCampaigns hook provides state management for UI components
- CRUD operations enable campaign list, create, edit, delete workflows
- isLoaded flag enables loading states
- storageError enables inline error display

**Plan 11-01 (Campaign Scheduling):**
- CampaignPhish.scheduledDate field enables calendar integration
- updatePhishInCampaign allows scheduling individual phishes
- getCampaign enables retrieving campaign for scheduling UI

### Considerations for Future Work

1. **Storage Quota:** UI should display storage usage warning before hitting quota (Plan 10-01)
2. **Export/Import:** Campaign export/import format should leverage self-contained design (Plan 09-04)
3. **Testing:** Consider unit tests for CRUD operations if project adds test framework

---

## Files Changed

### Created

- `src/utils/campaignCopy.ts` (69 lines)
  - copyPhishForCampaign function with deep copy logic
  - createPhish helper for new phish creation
  - Comprehensive JSDoc documentation
  - No originProjectId or back-references (independent copies)

- `src/hooks/useCampaigns.ts` (224 lines)
  - useCampaigns hook with full CRUD API
  - Campaign operations: addCampaign, updateCampaign, deleteCampaign, getCampaign
  - Phish operations: addPhishToCampaign, removePhishFromCampaign, updatePhishInCampaign
  - LocalStorage persistence with quota error handling
  - Follows useCustomTechniques pattern

### Modified

None - all files were new creations

Note: loadCampaigns and saveCampaigns were already present in storage.ts from previous work.

---

## Performance Notes

- **Duration:** 46 seconds (2 tasks, all autonomous)
- **Code Quality:** Comprehensive documentation, follows existing patterns
- **Type Safety:** All functions properly typed, no any types used

---

## Commits

1. **336e3a3** - `feat(09-03): create phish copying utility for campaigns`
2. **f6ab5d6** - `feat(09-03): create useCampaigns hook with CRUD operations`

All commits follow conventional commit format with atomic changes.
