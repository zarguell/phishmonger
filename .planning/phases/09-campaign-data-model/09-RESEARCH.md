# Phase 9: Campaign Data Model & Storage - Research

**Researched:** 2026-01-22
**Domain:** LocalStorage persistence, TypeScript type definitions, React hooks for CRUD
**Confidence:** HIGH

## Summary

This research covers the implementation of campaign data models and LocalStorage persistence for Phish Monger v1.2. The phase introduces a new Campaign entity that contains copied phish data (self-contained for portability), a global custom techniques library, and schema versioning for future migrations.

Key findings from research:
- **MDN official docs**: Web Storage (localStorage) is limited to 5MB per origin, throws `QuotaExceededError` when exceeded (verified 2026-01-05)
- **Existing patterns**: Codebase already has established `useCustomTechniques` hook pattern for LocalStorage CRUD operations
- **Schema versioning**: Community patterns favor global version field with migration functions on app load
- **Notification approach**: Existing codebase uses `window.confirm()` for deletion confirmations and inline error state for failures

**Primary recommendation:** Follow the existing `useCustomTechniques` hook pattern for `useCampaigns`, implement try-catch quota detection with inline error state, and use the established storage key naming convention (`phishmonger-*`).

## Standard Stack

### Core (already in dependencies)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 18.3.1 | State management, hooks | Already in use, stable API |
| TypeScript | ~5.9.0 | Type safety | Already in use |
| uuid | 13.0.0 | Unique ID generation | Already in use for IDs |

### Storage Keys (following existing pattern)
| Key | Purpose | Type |
|-----|---------|------|
| `phishmonger-campaigns` | Campaign entities array | `Campaign[]` |
| `phishmonger-schema-version` | Schema version for migrations | `number` |
| `phishmonger-custom-techniques` | Global custom techniques (already exists) | `Record<string, CustomTechnique>` |

**No new dependencies required.** The existing React, TypeScript, and uuid packages cover all needs.

## Architecture Patterns

### Recommended Project Structure

```
src/
├── types/
│   ├── annotations.ts      # Existing: Annotation, Technique types
│   ├── library.ts          # Existing: CustomTechnique, TechniqueLibrary
│   ├── project.ts          # Existing: ProjectMetadata
│   └── campaign.ts         # NEW: Campaign, Phish types
├── hooks/
│   ├── useCustomTechniques.ts  # Existing: CRUD pattern to follow
│   ├── useUndoRedo.ts          # Existing: useReducer pattern
│   └── useCampaigns.ts         # NEW: Campaign CRUD hook
├── utils/
│   ├── storage.ts          # Existing: storage utilities
│   └── storageQuota.ts     # NEW: quota detection utilities
└── components/
    └── campaign/           # NEW: campaign components (future phase)
```

### Pattern 1: Campaign Type Definitions

**What:** Centralized type definitions for Campaign entity and related types.

**When to use:** All campaign-related data structures.

**Example:**
```typescript
// src/types/campaign.ts

/**
 * A single phishing email (phish) within a campaign
 *
 * Contains a copy of all project data needed for this phish.
 * Phishes in campaigns are independent copies - no reference to
 * the source library project.
 */
export interface Phish {
  id: string;                      // Original UUID from library (kept stable)
  metadata: {
    title: string;
    author: string;
    scheduledDate?: string;        // ISO 8601 timestamp - when phish is scheduled
  };
  htmlSource: string;              // Email HTML with lure mark spans
  annotations: Record<string, Annotation>;  // lureId -> Annotation
  scoring: ScoringData;            // NIST Phish Scale scores
  inputMode: 'html' | 'richtext';
}

/**
 * A campaign containing multiple phishes
 *
 * Campaigns are self-contained: they embed copied phish data directly
 * rather than referencing library projects. This enables full
 * import/export of campaigns as portable JSON files.
 */
export interface Campaign {
  id: string;                      // UUID
  name: string;
  description: string;
  createdAt: string;               // ISO 8601 timestamp
  updatedAt?: string;              // ISO 8601 timestamp (optional, set on save)
  campaignPhishes: Phish[];        // Copied phishes embedded directly
}

/**
 * Campaign creation input (without generated fields)
 */
export type CampaignInput = Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>;
```

### Pattern 2: useCampaigns Hook (following useCustomTechniques pattern)

**What:** React hook providing CRUD operations for campaigns with LocalStorage persistence.

**When to use:** Any component that needs to manage campaigns.

**Example:**
```typescript
// src/hooks/useCampaigns.ts
import { useState, useEffect, useCallback } from 'react';
import { Campaign, CampaignInput, Phish } from '../types/campaign';
import type { Annotation } from '../types/annotations';
import type { ScoringData } from '../types/scoring';
import type { InputMode } from '../components/ModeToggle';

const CAMPAIGNS_KEY = 'phishmonger-campaigns';
const SCHEMA_VERSION_KEY = 'phishmonger-schema-version';
const CURRENT_SCHEMA_VERSION = 2;

/**
 * Hook for managing campaign data
 *
 * Provides:
 * - CRUD operations (create, read, update, delete)
 * - Phish management within campaigns (add, remove, update)
 * - Automatic LocalStorage persistence
 * - Schema migration on mount
 */
export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  // Load and migrate schema on mount
  useEffect(() => {
    try {
      // Check schema version and migrate if needed
      const storedVersion = localStorage.getItem(SCHEMA_VERSION_KEY);
      const currentVersion = parseInt(storedVersion || '1', 10);

      if (currentVersion < CURRENT_SCHEMA_VERSION) {
        // Run migration
        migrateSchema(currentVersion, CURRENT_SCHEMA_VERSION);
        localStorage.setItem(SCHEMA_VERSION_KEY, CURRENT_SCHEMA_VERSION.toString());
      }

      // Load campaigns
      const stored = localStorage.getItem(CAMPAIGNS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCampaigns(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load campaigns:', error);
      setStorageError('Failed to load campaigns from storage');
    } finally {
      setIsLoaded(true);
    }
  }, []);

  /**
   * Save campaigns to LocalStorage with quota handling
   */
  const saveToStorage = useCallback((data: Campaign[]) => {
    setStorageError(null);
    try {
      const json = JSON.stringify(data);
      localStorage.setItem(CAMPAIGNS_KEY, json);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        setStorageError('Storage nearly full. Delete old campaigns or export data.');
      } else {
        console.error('Failed to save campaigns:', error);
        setStorageError('Failed to save campaigns');
      }
      throw error;
    }
  }, []);

  /**
   * Create a new campaign
   */
  const createCampaign = useCallback((input: CampaignInput): string => {
    const newCampaign: Campaign = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      campaignPhishes: [],
    };

    const updated = [...campaigns, newCampaign];
    setCampaigns(updated);
    saveToStorage(updated);
    return newCampaign.id;
  }, [campaigns, saveToStorage]);

  /**
   * Update an existing campaign
   */
  const updateCampaign = useCallback((id: string, updates: Partial<CampaignInput>): void => {
    const updated = campaigns.map(c =>
      c.id === id
        ? { ...c, ...updates, updatedAt: new Date().toISOString() }
        : c
    );
    setCampaigns(updated);
    saveToStorage(updated);
  }, [campaigns, saveToStorage]);

  /**
   * Delete a campaign
   */
  const deleteCampaign = useCallback((id: string): void => {
    const updated = campaigns.filter(c => c.id !== id);
    setCampaigns(updated);
    saveToStorage(updated);
  }, [campaigns, saveToStorage]);

  /**
   * Add a phish to a campaign (copy operation)
   */
  const addPhishToCampaign = useCallback(
    (campaignId: string, phish: Phish): void => {
      const updated = campaigns.map(c =>
        c.id === campaignId
          ? {
              ...c,
              campaignPhishes: [...c.campaignPhishes, phish],
              updatedAt: new Date().toISOString(),
            }
          : c
      );
      setCampaigns(updated);
      saveToStorage(updated);
    },
    [campaigns, saveToStorage]
  );

  /**
   * Remove a phish from a campaign
   */
  const removePhishFromCampaign = useCallback(
    (campaignId: string, phishId: string): void => {
      const updated = campaigns.map(c =>
        c.id === campaignId
          ? {
              ...c,
              campaignPhishes: c.campaignPhishes.filter(p => p.id !== phishId),
              updatedAt: new Date().toISOString(),
            }
          : c
      );
      setCampaigns(updated);
      saveToStorage(updated);
    },
    [campaigns, saveToStorage]
  );

  /**
   * Update a phish within a campaign
   */
  const updatePhishInCampaign = useCallback(
    (campaignId: string, phishId: string, updates: Partial<Phish>): void => {
      const updated = campaigns.map(c =>
        c.id === campaignId
          ? {
              ...c,
              campaignPhishes: c.campaignPhishes.map(p =>
                p.id === phishId ? { ...p, ...updates } : p
              ),
              updatedAt: new Date().toISOString(),
            }
          : c
      );
      setCampaigns(updated);
      saveToStorage(updated);
    },
    [campaigns, saveToStorage]
  );

  return {
    campaigns,
    isLoaded,
    storageError,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    addPhishToCampaign,
    removePhishFromCampaign,
    updatePhishInCampaign,
    getCampaign: useCallback((id: string) => campaigns.find(c => c.id === id), [campaigns]),
  };
}

/**
 * Schema migration function
 * For v1.2: no existing users, so this is a placeholder for future migrations
 */
function migrateSchema(fromVersion: number, toVersion: number): void {
  // Future: implement migration logic here
  // Example: if (fromVersion === 1 && toVersion === 2) { ... }
  console.log(`Migrating schema from v${fromVersion} to v${toVersion}`);
}
```

### Pattern 3: Storage Quota Detection

**What:** Utilities to monitor LocalStorage usage and detect quota limits.

**When to use:** Before critical saves or to show usage warnings.

**Example:**
```typescript
// src/utils/storageQuota.ts

/**
 * LocalStorage constants for quota management
 *
 * Based on MDN Web API documentation:
 * https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria
 * Web Storage is limited to 5MB per origin (localStorage + sessionStorage)
 */
export const LOCAL_STORAGE_QUOTA_BYTES = 5 * 1024 * 1024; // 5MB
export const WARNING_THRESHOLD = 0.8;  // Warn at 80% capacity
export const ERROR_THRESHOLD = 0.95;   // Error at 95% capacity

/**
 * Calculate current LocalStorage usage in bytes
 *
 * Sums up all keys and values stored in localStorage.
 * This is an approximation since UTF-16 encoding may vary.
 *
 * @returns Current usage in bytes
 */
export function getStorageUsage(): number {
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key) || '';
      total += key.length + value.length;
    }
  }
  return total * 2; // Multiply by 2 for UTF-16 encoding (2 bytes per char)
}

/**
 * Get storage usage statistics
 *
 * @returns Object with usage details
 */
export function getStorageStats() {
  const used = getStorageUsage();
  const percentage = (used / LOCAL_STORAGE_QUOTA_BYTES) * 100;

  return {
    used,
    quota: LOCAL_STORAGE_QUOTA_BYTES,
    remaining: LOCAL_STORAGE_QUOTA_BYTES - used,
    percentage,
    isNearLimit: percentage >= WARNING_THRESHOLD * 100,
    isAtLimit: percentage >= ERROR_THRESHOLD * 100,
  };
}

/**
 * Check if saving data would exceed quota
 *
 * This is a pre-check attempt - the actual save may still fail
 * due to encoding differences or concurrent storage changes.
 *
 * @param data - Data to be stored
 * @returns true if save would likely succeed
 */
export function canSaveData(data: unknown): boolean {
  const stats = getStorageStats();
  const estimatedSize = JSON.stringify(data).length * 2; // UTF-16
  return (stats.used + estimatedSize) < LOCAL_STORAGE_QUOTA_BYTES * ERROR_THRESHOLD;
}
```

### Pattern 4: Phish Copy from Library Project

**What:** Create independent copy of library project data for campaign.

**When to use:** Adding a project to a campaign.

**Example:**
```typescript
// src/utils/campaignCopy.ts

import type { ProjectMetadata } from '../types/project';
import type { Annotation } from '../types/annotations';
import type { ScoringData } from '../types/scoring';
import type { InputMode } from '../components/ModeToggle';
import type { Phish } from '../types/campaign';

/**
 * Create a Phish copy from library project data
 *
 * Copies all project data into a self-contained Phish object.
 * The original UUID is preserved for stability across exports.
 *
 * @param params - Library project data
 * @returns Copied Phish for campaign
 */
export function createPhishFromLibrary(params: {
  id: string;                      // Original UUID
  metadata: ProjectMetadata;
  htmlSource: string;
  annotations: Record<string, Annotation>;
  scoring: ScoringData;
  inputMode: InputMode;
  scheduledDate?: string;          // Optional scheduled date
}): Phish {
  return {
    id: params.id,                 // Keep original UUID
    metadata: {
      title: params.metadata.title,
      author: params.metadata.author,
      scheduledDate: params.scheduledDate,
    },
    htmlSource: params.htmlSource,
    annotations: { ...params.annotations },  // Shallow copy is sufficient
    scoring: { ...params.scoring },
    inputMode: params.inputMode,
  };
}
```

### Anti-Patterns to Avoid

- **Centralized type imports**: Don't create a giant `types/index.ts` that exports everything. Import types from their source files directly (Reddit consensus).
- **Premature abstraction**: Don't build a generic `useStorage` hook that handles all entities. The specific hooks (`useCampaigns`, `useCustomTechniques`) are clearer and type-safe.
- **Complex migration framework**: For a small app, a simple switch statement in `migrateSchema()` is sufficient. Don't import a library for this.
- **Sync cross-tab storage events**: Don't add `storage` event listeners for campaigns - campaigns are single-user editing (unlike custom techniques which may be imported).
- **Deep cloning for immutability**: The spread operator (`...`) is sufficient for this data structure. Don't use `JSON.parse(JSON.stringify())` or libraries like Lodash.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| UUID generation | Custom timestamp-based IDs | `crypto.randomUUID()` | Built-in, guaranteed unique, simpler |
| Quota detection | Try to write and catch error | `getStorageUsage()` + pre-check | Better UX to warn before save |
| Type deep clone | Manual deep copy function | Spread operator (`...`) | Data structure is flat enough |
| Storage wrapper | Generic localStorage class | Direct `localStorage` calls | Simpler, no abstraction needed |
| State management | Redux/Zustand for campaigns | `useState` + `useCallback` | Campaign data is local-only, not shared |

**Key insight:** The existing `useCustomTechniques` pattern proves that simple useState + useCallback + localStorage is sufficient for CRUD. No external state management needed.

## Common Pitfalls

### Pitfall 1: QuotaExceededError Not Caught

**What goes wrong:** `localStorage.setItem()` fails silently or throws uncaught exception when 5MB limit is exceeded.

**Why it happens:** Developers assume quota is infinite or forget to wrap writes in try-catch.

**How to avoid:**
1. Always wrap `localStorage.setItem()` in try-catch
2. Check for `error.name === 'QuotaExceededError'` specifically
3. Provide user-friendly error message: "Storage nearly full. Delete old campaigns or export data."
4. Set `storageError` state and display to user

**Warning signs:** Tests that pass with small data but fail in production; Safari throwing "DOM Exception 22".

### Pitfall 2: Mutating State Directly

**What goes wrong:** React doesn't re-render, or LocalStorage contains stale data.

**Why it happens:** Using `array.push()` or `object.property = value` directly on state instead of creating new objects.

**How to avoid:**
1. Always use spread operator or `.map()` to create new arrays/objects
2. Never mutate `campaigns` state directly
3. Use functional updates (`setCampaigns(prev => ...)`) when derived from previous state

**Warning signs:** UI not updating after "successful" save.

### Pitfall 3: Forgotten `useCallback` Dependencies

**What goes wrong:** Stale closures in CRUD functions, saves failing silently.

**Why it happens:** Omitting dependencies from `useCallback` dependency array.

**How to avoid:**
1. Include all referenced state in dependency array
2. Use ESLint react-hooks plugin to catch missing deps
3. Or use functional updates to avoid dependency entirely

**Warning signs:** Save succeeds but data is lost; "Cannot read property of undefined" errors.

### Pitfall 4: Assuming LocalStorage is Available

**What goes wrong:** App crashes in private browsing mode or when cookies are disabled.

**Why it happens:** Some browsers disable localStorage in certain contexts.

**How to avoid:**
1. Wrap localStorage access in try-catch
2. Provide fallback or graceful degradation
3. Show error message if storage unavailable

**Warning signs:** App works in normal mode but crashes in incognito.

### Pitfall 5: Not Validating Schema on Load

**What goes wrong:** App crashes when loading malformed JSON from localStorage.

**Why it happens:** Assuming saved data is always valid.

**How to avoid:**
1. Verify parsed data structure (`Array.isArray(parsed)`)
2. Handle parse errors gracefully
3. Start with empty state on error rather than crashing

**Warning signs:** "Unexpected token in JSON" errors.

## Code Examples

### Creating a Campaign with useCampaigns Hook

```typescript
// Example component usage
import { useCampaigns } from '../hooks/useCampaigns';

function CampaignManager() {
  const { campaigns, createCampaign, storageError } = useCampaigns();

  const handleCreate = () => {
    createCampaign({
      name: 'Q1 2026 Phishing Campaign',
      description: 'Quarterly phishing awareness training',
      campaignPhishes: [],
    });
  };

  return (
    <div>
      {storageError && <div className="error">{storageError}</div>}
      <button onClick={handleCreate}>Create Campaign</button>
      {/* ... */}
    </div>
  );
}
```

### Checking Storage Quota Before Save

```typescript
import { getStorageStats } from '../utils/storageQuota';

function BeforeSave() {
  const stats = getStorageStats();

  if (stats.isNearLimit) {
    return <div className="warning">Storage at {stats.percentage.toFixed(0)}% capacity</div>;
  }

  return null;
}
```

### Safe LocalStorage Write with Quota Handling

```typescript
function saveWithQuotaCheck(key: string, data: unknown): boolean {
  try {
    const json = JSON.stringify(data);
    localStorage.setItem(key, json);
    return true;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      // Show user-friendly error
      console.error('Storage quota exceeded');
      return false;
    }
    throw error;
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual ID generation (timestamps) | `crypto.randomUUID()` | ES2021 / Chrome 92 | Simpler, guaranteed collision-free |
| Redux for local state | React hooks (useState, useReducer) | React 16.8+ | Less boilerplate, better TypeScript support |
| Implicit schema version | Explicit `schemaVersion` field | Ongoing | Enables safe migrations |
| Silent quota failures | Try-catch with user feedback | Best practice | Better UX |

**Deprecated/outdated:**
- `new Date().getTime()` for IDs: Use `crypto.randomUUID()` instead
- Manual deep cloning with `JSON.parse(JSON.stringify())`: Use spread operator or structuredClone
- Global storage wrapper classes: Direct localStorage access is simpler

## Open Questions

1. **Toast notification system**
   - What we know: Codebase currently uses `window.confirm()` and inline error state
   - What's unclear: Whether to build a toast system or stick with current pattern
   - Recommendation: Use inline error state for quota errors (matches existing ExportButton pattern), defer toast system to future phase

2. **Storage usage meter in UI**
   - What we know: `getStorageStats()` provides percentage, but CONTEXT.md says "display is Claude's discretion"
   - What's unclear: Whether to show a visual meter
   - Recommendation: Skip visual meter in Phase 9 (adds UI work), just show warning message when near limit

3. **Scheduled date format**
   - What we know: Should be ISO 8601 string
   - What's unclear: Whether to use Date object or string in type definition
   - Recommendation: Use string (ISO 8601) for storage simplicity, convert to Date in components as needed

## Sources

### Primary (HIGH confidence)
- [MDN: Storage quotas and eviction criteria](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria) - Verified 2026-01-05
  - Web Storage limited to 5MB per origin
  - QuotaExceededError thrown when limit exceeded
  - Use try-catch blocks for error handling
- Existing codebase analysis:
  - `/src/hooks/useCustomTechniques.ts` - CRUD pattern reference
  - `/src/utils/storage.ts` - Storage key naming pattern
  - `/src/components/library/TechniqueLibrary.tsx` - Modal pattern, `window.confirm()` usage

### Secondary (MEDIUM confidence)
- [Stack Overflow: Calculating localStorage usage](https://stackoverflow.com/questions/3027142/calculating-usage-of-localstorage-space) - Quota calculation method
- [Dev.to: Versioned persisted state pattern](https://dev.to/sebastianthiebaud/a-simple-pattern-for-versioned-persisted-state-in-react-native-ll6) - Schema versioning pattern
- [Medium: Managing Complex State with useReducer](https://www.aleksandrhovanisyan.com/blog/managing-complex-state-react-usereducer/) - State management patterns

### Tertiary (LOW confidence)
- Various blog posts on localStorage patterns (verified against MDN where possible)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All packages already in use, MDN docs verified
- Architecture: HIGH - Based on existing codebase patterns (useCustomTechniques)
- Pitfalls: HIGH - Based on MDN official documentation and common React issues
- Storage quota: HIGH - MDN is authoritative source, verified 2026-01-05

**Research date:** 2026-01-22
**Valid until:** 2026-06-22 (5 months - localStorage API is stable)
