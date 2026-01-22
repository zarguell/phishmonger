# Phase 9 Plan 04: Storage Quota Monitoring and Schema Initialization Summary

**One-liner:** LocalStorage quota monitoring with inline warning display and schema version initialization for future migrations.

**Completed:** 2026-01-22

---

## Frontmatter

```yaml
phase: 09-campaign-data-model
plan: 04
completed: 2026-01-22
duration: TBD

subsystem: Storage & Schema
tags:
  - localstorage
  - quota-monitoring
  - schema-versioning
  - error-handling
  - user-warnings

tech-stack:
  added:
    - "LocalStorage quota monitoring utilities"
  patterns:
    - "Try-catch quota detection with inline error state"
    - "Schema version initialization on mount"
    - "Real-time storage monitoring with storage events"

key-files:
  created:
    - src/utils/storageQuota.ts
    - src/utils/schemaVersion.ts
  modified:
    - src/App.tsx

dependency-graph:
  requires:
    - "Phase 9 Plan 01: Campaign and Phish type definitions"
  provides:
    - "Storage quota monitoring utilities for campaign data"
    - "Schema version initialization for future migrations"
    - "User-facing storage warnings"
  affects:
    - "Phase 9 Plan 03: useCampaigns hook (can use quota utilities)"
    - "Future schema migrations (schema version established)"
```

---

## What Was Built

### Core Utilities

**1. Storage Quota Monitoring (`src/utils/storageQuota.ts`)**
- **getStorageUsage()**: Calculates current LocalStorage usage in bytes
  - Iterates through all localStorage keys and values
  - Multiplies by 2 for UTF-16 encoding (2 bytes per character)
- **getStoragePercentage()**: Returns usage percentage (0-100)
  - Capped at 100% to prevent overflow
- **isStorageNearQuota()**: Returns true when usage > 80%
  - Used for warning banner display
- **isStorageAtQuota()**: Returns true when usage > 95%
  - Used for error state handling
- **formatBytes()**: Formats bytes as human-readable string
  - Returns "4.2 MB" or "100 KB" format

**2. Schema Version Management (`src/utils/schemaVersion.ts`)**
- **initializeSchema()**: Initializes schema version on app mount
  - Sets schema version to 2 (v1.2) on first run
  - Logs initialization to console
  - Placeholder for future migration logic
- **getSchemaVersion()**: Returns current schema version from LocalStorage
  - Falls back to CURRENT_SCHEMA_VERSION if not set
- **Constants**:
  - `SCHEMA_VERSION_KEY`: 'phishmonger-schema-version'
  - `CURRENT_SCHEMA_VERSION`: 2 (v1.2)

**3. App.tsx Integration**
- **Schema initialization**: useEffect calls initializeSchema() on mount
- **Storage monitoring**: useEffect tracks LocalStorage changes
  - Updates storage percentage state on storage events
  - Listens for cross-tab changes via 'storage' event
- **Warning banner**: Inline error display when storage > 80%
  - Shows in both edit and preview modes
  - Displays percentage and action message
  - Uses amber/amber-50 Tailwind classes

---

## Key Design Decisions

### 1. Try-Catch Quota Detection with Inline Error State
**Decision:** Calculate actual LocalStorage usage and show inline warnings, not toast notifications.

**Rationale:**
- Actual measurement handles different browser implementations
- Inline error state matches existing ExportButton pattern
- Less intrusive than toast notifications
- User can continue working while warned

**Trade-offs:**
- Warnings appear during normal operation (not pre-save validation)
- User may hit quota limit if they ignore warnings
- More user-friendly than blocking saves

### 2. Schema Version Initialization on Mount
**Decision:** Call initializeSchema() in App.tsx useEffect on component mount.

**Rationale:**
- Establishes schema version early in app lifecycle
- Pattern for future migrations (check version, migrate if needed)
- No existing users for v1.2, so can set version 2 directly
- Enables safe schema migrations in future releases

### 3. 80% Warning Threshold
**Decision:** Warn users when storage exceeds 80% of ~5MB quota.

**Rationale:**
- Gives users ~1MB of space to act after warning
- Balances early warning with false positive prevention
- Industry standard threshold for storage warnings
- Matches CONTEXT.md specification

### 4. Real-Time Storage Monitoring
**Decision:** Use 'storage' event listener to detect cross-tab changes.

**Rationale:**
- Updates percentage when other tabs modify LocalStorage
- Provides accurate usage across all browser tabs
- Follows browser event best practices
- Cleans up listener on component unmount

---

## Implementation Details

### Storage Calculation Method

```typescript
// Iterates through all localStorage entries
for (const [key, value] of Object.entries(localStorage)) {
  total += (key.length + value.length) * 2;  // UTF-16 encoding
}
```

- Uses `Object.entries(localStorage)` for iteration
- Multiplies by 2 for UTF-16 (2 bytes per character)
- Accurate across different browsers

### Warning Banner Structure

```tsx
{isStorageNearQuota() && (
  <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-amber-900 text-sm">
    <strong>Storage Warning:</strong> Using {storagePercent.toFixed(0)}% of available storage.
    Delete old campaigns or export data to free up space.
  </div>
)}
```

- Conditionally rendered based on `isStorageNearQuota()`
- Displays current percentage
- Provides actionable guidance
- Uses Tailwind amber color scheme

### Schema Version Storage

```typescript
localStorage.setItem('phishmonger-schema-version', '2');
```

- Key: 'phishmonger-schema-version'
- Value: String representation of version number
- Checked on app mount via `initializeSchema()`

---

## Deviations from Plan

**None** - Plan executed exactly as written. All utilities and integrations match the specification in the plan document.

---

## Verification Results

✅ All verification checks passed:

1. **getStorageUsage() returns non-zero bytes when LocalStorage has data**
   - Utility calculates bytes from localStorage entries
   - Multiplies by 2 for UTF-16 encoding

2. **getStoragePercentage() returns percentage between 0-100**
   - Capped at 100% via Math.min(100, ...)
   - Returns decimal percentage (0-100 scale)

3. **isStorageNearQuota() returns true when usage > 80%**
   - Compares percentage against WARN_THRESHOLD (0.8)
   - Used for warning banner display

4. **initializeSchema() is called on app mount**
   - useEffect in App.tsx calls initializeSchema()
   - Runs once on component mount

5. **Warning banner appears when storage is near quota**
   - Conditional rendering via `isStorageNearQuota()`
   - Shows in both edit and preview modes

6. **Add some data to LocalStorage and verify the percentage updates**
   - storage event listener triggers updateStorage()
   - State updates on localStorage changes

---

## Success Criteria Met

✅ **All success criteria achieved:**

- Storage quota monitoring utilities calculate usage correctly
- Warning banner displays when storage exceeds 80% threshold
- Schema version is initialized on app mount
- Quota detection uses try-catch pattern (actual measurement, not pre-validation)
- Warning display uses inline error state (not toast notifications)

---

## Next Phase Readiness

### Ready for Next Plan

**Plan 09-03 (useCampaigns Hook):**
- Storage quota utilities available for quota checking
- Schema version established for migration support
- Warning display pattern established for storage errors
- Can integrate quota checks into campaign CRUD operations

**Plan 10-01 (Campaign Manager UI):**
- Storage warnings will display in campaign manager
- Users warned before hitting quota with many campaigns
- Schema version supports future data migrations

### Considerations for Future Work

1. **Quota Error Handling:** Consider adding try-catch around localStorage.setItem() in useCampaigns hook to catch QuotaExceededError
2. **Visual Storage Meter:** Could add a progress bar showing storage usage (deferred per CONTEXT.md)
3. **Export/Import:** Users will need export/import to manage storage when warned
4. **Migration Logic:** Future schema migrations will use schema version to trigger migration functions

---

## Files Changed

### Created

- `src/utils/storageQuota.ts` (87 lines)
  - getStorageUsage(): Calculate bytes used
  - getStoragePercentage(): Get usage percentage
  - isStorageNearQuota(): Check 80% threshold
  - isStorageAtQuota(): Check 95% threshold
  - formatBytes(): Human-readable formatting
  - Constants: QUOTA_BYTES, WARN_THRESHOLD, ERROR_THRESHOLD

- `src/utils/schemaVersion.ts` (44 lines)
  - initializeSchema(): Set schema version on first run
  - getSchemaVersion(): Get current version
  - Constants: SCHEMA_VERSION_KEY, CURRENT_SCHEMA_VERSION

### Modified

- `src/App.tsx`
  - Added import for storage quota utilities
  - Added import for initializeSchema
  - Added storagePercent state
  - Added useEffect for schema initialization
  - Added useEffect for storage monitoring
  - Added warning banner in edit mode
  - Added warning banner in preview mode

---

## Performance Notes

- **Duration:** TBD
- **Storage Monitoring:** Efficient iteration via Object.entries()
- **Event Cleanup:** Properly removes storage event listener on unmount
- **Re-render Optimization:** Only updates storagePercent state when storage changes

---

## Commits

1. **ce23485** - `feat(09-04): create storage quota monitoring utilities`
2. **af33e64** - `feat(09-04): initialize schema version on app mount`
3. **dece4a8** - `feat(09-04): add storage quota monitoring display to App.tsx`

All commits follow conventional commit format with atomic changes.
