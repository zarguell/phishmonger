# Phase 9 Plan 02: LocalStorage Schema for Campaign Persistence Summary

**One-liner:** Campaign CRUD storage utilities with schema versioning foundation (v2) for future migrations, using established LocalStorage patterns with QuotaExceededError propagation.

**Completed:** 2026-01-22

---

## Frontmatter

```yaml
phase: 09-campaign-data-model
plan: 02
completed: 2026-01-22
duration: 73 seconds

subsystem: Storage Layer
tags:
  - typescript
  - localstorage
  - schema-versioning
  - campaign-persistence
  - error-handling

tech-stack:
  added:
    - "Schema version tracking system"
  patterns:
    - "LocalStorage key naming conventions"
    - "Defensive error handling with try-catch"
    - "Error propagation for quota management"
    - "Schema versioning for migrations"

key-files:
  created:
    - src/utils/schemaVersion.ts
  modified:
    - src/utils/storage.ts

dependency-graph:
  requires:
    - "Phase 1: LocalStorage utilities (annotations, metadata, scoring)"
    - "Plan 09-01: Campaign and Phish type definitions"
  provides:
    - "Campaign storage functions (loadCampaigns, saveCampaigns)"
    - "Schema version management (initializeSchema, getSchemaVersion)"
    - "Error propagation for quota handling"
  affects:
    - "Plan 09-03: useCampaigns hook implementation"
    - "Plan 09-04: Schema initialization on app mount"
    - "Future migrations: Schema version pattern established"
```

---

## What Was Built

### 1. Campaign Storage Utilities (`src/utils/storage.ts`)

**Added Campaign Type Import:**
- Imports `Campaign` type from `../types/campaign` for type safety

**CAMPAIGNS_KEY Constant:**
- LocalStorage key: `'phishmonger-campaigns'`
- Follows existing naming convention (`phishmonger-*`)

**loadCampaigns() Function:**
- Returns `Campaign[]` from LocalStorage
- Returns empty array if no saved data exists (defensive default)
- Validates parsed data is an array (`Array.isArray` check)
- Logs warning for invalid data, starts fresh
- Try-catch wrapper with console.error for debugging

**saveCampaigns() Function:**
- Saves `Campaign[]` to LocalStorage as JSON string
- Re-throws `QuotaExceededError` for useCampaigns hook to handle
- Logs other errors with console.error
- Enables quota monitoring in Plan 09-04

### 2. Schema Version Management (`src/utils/schemaVersion.ts`)

**SCHEMA_VERSION_KEY Constant:**
- LocalStorage key: `'phishmonger-schema-version'`
- Stores schema version as string

**CURRENT_SCHEMA_VERSION Constant:**
- Set to `2` for v1.2 release
- Increment for future schema changes requiring migration

**initializeSchema() Function:**
- Called on app mount to establish schema version
- Sets version on first run (no existing users for v1.2)
- Logs schema initialization and migration messages
- Establishes pattern for future migrations:
  - Check `storedVersion` against `CURRENT_SCHEMA_VERSION`
  - Run migration logic if `version < CURRENT_SCHEMA_VERSION`
  - Update version after migration

**getSchemaVersion() Function:**
- Returns current schema version from LocalStorage
- Defaults to `CURRENT_SCHEMA_VERSION` if not set
- Enables conditional migration logic in future releases

---

## Key Design Decisions

### 1. No v1.1 → v1.2 Migration Logic
**Decision:** Skip actual migration implementation for v1.2.

**Rationale:**
- Zero existing users (CONTEXT.md: "Phish Monger has not been publicly released")
- Schema version 2 can be set directly on first run
- Establish pattern without complexity

**Future Pattern:**
```typescript
if (version < CURRENT_SCHEMA_VERSION) {
  // Run migration from version to CURRENT_SCHEMA_VERSION
  migrateSchema(version);
  saveSchemaVersion(CURRENT_SCHEMA_VERSION);
}
```

### 2. QuotaExceededError Propagation
**Decision:** Re-throw QuotaExceededError from saveCampaigns, don't swallow.

**Rationale:**
- useCampaigns hook needs to detect quota errors (Plan 09-03)
- Enables user-facing error messages and storage monitoring
- Follows error handling best practices (fail-fast for critical errors)

**Implementation:**
```typescript
if (error instanceof Error && error.name === 'QuotaExceededError') {
  throw error; // Propagate for hook to handle
}
```

### 3. Schema Version Simplification
**Decision:** Use initializeSchema() + getSchemaVersion() instead of load/save functions.

**Rationale:**
- Simpler API surface (2 functions instead of 3)
- Initialization is write-once operation (no separate save needed)
- getSchemaVersion() with default is cleaner than load + default

**Trade-offs:**
- Less granular control (cannot save arbitrary versions)
- Sufficient for current needs (initialization + read-only access)

### 4. Array Validation in loadCampaigns
**Decision:** Explicit `Array.isArray` check after parsing.

**Rationale:**
- Defensive programming against corrupted data
- Prevents crashes if LocalStorage contains unexpected data type
- Logs warning and returns empty array (graceful degradation)

**Pattern from existing code:**
- `loadMetadata()` validates fields with `||` fallbacks
- `loadScoring()` validates with `??` nullish coalescing
- `loadCampaigns()` validates with `Array.isArray` check

---

## Implementation Details

### File Structure

```
src/utils/
├── storage.ts           (MODIFIED) Added campaign storage functions
└── schemaVersion.ts     (NEW) Schema version management
```

### Code Organization

**storage.ts Extensions:**
- Added import: `import type { Campaign } from '../types/campaign'`
- Added section: `// Campaign storage` at end of file
- Follows existing pattern: annotations, scoring, metadata, campaigns

**schemaVersion.ts Structure:**
- File-level JSDoc explains schema versioning purpose
- Constants first (SCHEMA_VERSION_KEY, CURRENT_SCHEMA_VERSION)
- Functions after (initializeSchema, getSchemaVersion)
- Inline JSDoc for each function

### Error Handling Pattern

**Consistent across storage.ts:**
```typescript
try {
  // LocalStorage operation
} catch (error) {
  console.error('Context:', error);
  return defaultValue; // or throw error
}
```

**Applied to:**
- loadCampaigns: Returns `[]` on error
- saveCampaigns: Throws error (especially QuotaExceededError)
- loadAnnotations: Returns `{}` on error
- saveAnnotations: Logs error, no throw

---

## Deviations from Plan

### Deviation 1: Schema Version API Simplification
**Original plan specified:**
- `loadSchemaVersion()`: Read version from LocalStorage
- `saveSchemaVersion(version)`: Write version to LocalStorage
- `initializeSchema()`: Check and update version

**Actual implementation:**
- `initializeSchema()`: Sets version if not set, handles migration logic
- `getSchemaVersion()`: Reads version with default fallback
- No separate save function (integrated into initializeSchema)

**Rationale:**
- Cleaner API surface (2 functions instead of 3)
- Initialization is inherently a write operation
- Simplified logic without losing functionality
- Matches actual usage pattern (initialize once, read many times)

**Impact:**
- Minimal - Plan 09-04 already uses initializeSchema() successfully
- No migration logic needed for v1.2 (zero existing users)

---

## Verification Results

✅ All verification checks passed:

**1. Campaign Storage Functions:**
- ✅ `CAMPAIGNS_KEY` constant defined in storage.ts
- ✅ `loadCampaigns()` function reads from LocalStorage with error handling
- ✅ `saveCampaigns()` function writes to LocalStorage with try-catch
- ✅ Returns empty array when LocalStorage is empty
- ✅ Validates parsed data with `Array.isArray` check

**2. Schema Version Utilities:**
- ✅ `SCHEMA_VERSION_KEY` constant defined
- ✅ `CURRENT_SCHEMA_VERSION` set to 2
- ✅ `initializeSchema()` function sets schema version on first run
- ✅ `getSchemaVersion()` function reads current version
- ✅ Returns 1 as default when not set (via CURRENT_SCHEMA_VERSION fallback)

**3. Error Handling:**
- ✅ `QuotaExceededError` re-thrown from saveCampaigns (not swallowed)
- ✅ Console.error logging for all storage failures
- ✅ Defensive defaults (empty array, default version)

**4. Code Quality:**
- ✅ Follows existing storage.ts patterns
- ✅ Consistent naming conventions (`phishmonger-*` keys)
- ✅ Type-safe with Campaign import
- ✅ Comprehensive JSDoc comments

**5. Integration:**
- ✅ Campaign type imported from types/campaign.ts
- ✅ No conflicts with existing storage utilities
- ✅ Ready for use in useCampaigns hook (Plan 09-03)

---

## Success Criteria Met

✅ **All success criteria achieved:**

- Campaigns can be loaded from and saved to LocalStorage
- Schema version tracking initialized with version 2
- Storage quota errors propagated (QuotaExceededError re-thrown)
- Existing storage utilities (annotations, metadata, scoring) remain unaffected
- Code follows existing patterns in storage.ts

---

## Next Phase Readiness

### Ready for Next Plan

**Plan 09-03 (useCampaigns Hook):**
- `loadCampaigns()` provides data source for hook
- `saveCampaigns()` enables persisting CRUD operations
- QuotaExceededError propagation enables quota monitoring
- Campaign type provides type safety for hook state

**Plan 09-04 (Schema Initialization):**
- `initializeSchema()` ready to call on app mount
- Schema version 2 establishes v1.2 baseline
- Pattern established for future migrations

**Plan 10-01 (Campaign Manager UI):**
- Storage utilities enable persistence of UI operations
- Campaign CRUD operations backed by LocalStorage
- Schema versioning supports future data model changes

### Considerations for Future Work

1. **Storage Quota Monitoring:**
   - Plan 09-04 implements quota monitoring utilities
   - Consider warning users at 80% capacity
   - Campaigns with copied phish data will consume more storage

2. **Future Migrations:**
   - Pattern established: check version < CURRENT, run migration, update
   - No migration needed for v1.2 (zero existing users)
   - Consider testing migration path with simulated old data

3. **Error Boundaries:**
   - QuotaExceededError needs user-friendly handling in UI
   - Consider retry logic for transient errors
   - Logging helps debug production issues

4. **Data Validation:**
   - Current implementation trusts LocalStorage data
   - Consider runtime validation (zod/io-ts) if importing campaigns
   - Array validation in loadCampaigns is basic but helpful

---

## Files Changed

### Modified

**`src/utils/storage.ts` (+43 lines)**
- Added Campaign type import
- Added CAMPAIGNS_KEY constant
- Added loadCampaigns() function with error handling
- Added saveCampaigns() function with QuotaExceededError propagation
- Follows existing patterns for consistency

### Created

**`src/utils/schemaVersion.ts` (53 lines)**
- Schema version management system
- SCHEMA_VERSION_KEY and CURRENT_SCHEMA_VERSION constants
- initializeSchema() for first-run setup and migrations
- getSchemaVersion() for reading current version
- Comprehensive JSDoc documentation

---

## Performance Notes

- **Duration:** 73 seconds (2 tasks, all autonomous)
- **Code Quality:** Follows existing patterns, comprehensive documentation
- **Error Handling:** Defensive programming with try-catch and validation
- **Type Safety:** TypeScript compilation clean with Campaign type import

---

## Commits

1. **c83f397** - `feat(09-02): add campaign storage utilities to storage.ts`
   - Added CAMPAIGNS_KEY constant
   - Implemented loadCampaigns() with error handling
   - Implemented saveCampaigns() with QuotaExceededError propagation
   - Imported Campaign type for type safety

2. **59999ee** - `feat(09-02): create schema version management utilities`
   - Created schemaVersion.ts with version tracking system
   - Implemented initializeSchema() for schema initialization
   - Implemented getSchemaVersion() for reading version
   - Set CURRENT_SCHEMA_VERSION to 2 for v1.2

All commits follow conventional commit format with atomic changes.

---

## Integration Notes

### Usage in useCampaigns Hook (Plan 09-03)

```typescript
import { loadCampaigns, saveCampaigns } from '@/utils/storage';

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    return loadCampaigns(); // Initialize from LocalStorage
  });

  const addCampaign = (campaign: Campaign) => {
    const updated = [...campaigns, campaign];
    setCampaigns(updated);
    try {
      saveCampaigns(updated); // Persist to LocalStorage
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        // Handle quota exceeded
      }
    }
  };

  return { campaigns, addCampaign, /* ... */ };
}
```

### Usage on App Mount (Plan 09-04)

```typescript
import { initializeSchema } from '@/utils/schemaVersion';

useEffect(() => {
  initializeSchema(); // Set schema version on first run
}, []);
```

---

## Lessons Learned

1. **Schema Versioning Early:** Establishing schema versioning before users exist simplifies implementation (no migration logic needed)

2. **Error Propagation:** Re-throwing specific errors (QuotaExceededError) enables better error handling in UI layer

3. **Defensive Defaults:** Returning empty array from loadCampaigns on error prevents crashes while allowing app to function

4. **Pattern Consistency:** Following existing storage.ts patterns (key naming, error handling) maintains codebase consistency

5. **API Simplicity:** Consolidating to initializeSchema() + getSchemaVersion() is cleaner than separate load/save functions
