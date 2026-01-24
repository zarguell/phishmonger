# Phase 16: Terminology & Workflow Foundation - Research

**Researched:** 2026-01-24
**Domain:** React application terminology refactoring and data migration
**Confidence:** HIGH

## Summary

This phase involves a comprehensive terminology change from "project" to "phish" across the entire Phish Monger application. The change impacts UI text, code identifiers (variables, functions, types), and localStorage keys. Additionally, the application workflow must be inverted: instead of launching directly into the single-phish editor, the app should default to the campaigns list view, with the editor accessible from there.

The migration requires careful handling of existing user data. A schema version migration (v2→v3) must run automatically on app mount to:
1. Rename the localStorage key from "phishmonger-projects" to "phishmonger-phishes"
2. Preserve all existing user data without data loss
3. Update the schema version marker

**Primary recommendation:** This is a text-heavy refactoring with data migration risks. Use automated string extraction/replacement patterns, add comprehensive testing for localStorage migration, and implement feature flags to allow rollback if migration issues arise.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 18.x | UI framework | Already in use, provides hooks for state management |
| TypeScript | 5.x | Type safety | Already in use, enables safe refactoring with type checking |
| Vite | 5.x | Build tool | Already in use, provides fast hot reload during development |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| localStorage API | Native | Data persistence | Already in use for all app data storage |
| crypto.randomUUID() | Native | UUID generation | Already used for generating phish IDs (no external library needed) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Manual string replacement | Codemod (ts-morph) | Codemods safer for large-scale refactoring but higher setup cost. Manual replacement with grep/find-and-replace is sufficient for this scope. |

**Installation:**
No new packages required - this is a refactoring phase using existing dependencies.

## Architecture Patterns

### Current localStorage Structure

All app data is stored in localStorage with these keys (from code analysis):

```typescript
// Current schema version 2 keys:
'phishmonger-annotations'      // Annotation data keyed by lure ID
'phishmonger-arrow-style'      // Arrow style preference
'phishmonger-campaigns'        // Campaign array (v2 feature)
'phishmonger-compact-layout'   // Compact layout preference
'phishmonger-custom-techniques' // Custom technique library
'phishmonger-html-source'      // Email HTML source
'phishmonger-input-mode'       // Editor input mode (html/richtext)
'phishmonger-layout-template'  // Visualizer layout template
'phishmonger-metadata'         // Project metadata (TITLE, AUTHOR, CREATEDAT) - RENAME THIS
'phishmonger-project-id'       // Current project UUID - RENAME THIS
'phishmonger-schema-version'   // Schema version marker (currently 2)
'phishmonger-scoring'          // NIST Phish Scale scoring data
'phishmonger-show-badge'       // Show NIST badge toggle
'phishmonger-show-tags'        // Show technique tags toggle
```

**Critical finding:** There is NO "phishmonger-projects" key. The phase description mentions migrating from "phishmonger-projects" to "phishmonger-phishes", but this key doesn't exist in the current codebase. The actual migration needed is:
- `phishmonger-metadata` → `phishmonger-phishes-metadata` (OR keep as-is since it's generic)
- `phishmonger-project-id` → `phishmonger-phish-id`

**Alternative interpretation:** The requirement may be about future-proofing or conceptual consistency rather than migrating an actual existing key. Verify with stakeholder before proceeding.

### Schema Migration Pattern

Based on existing schemaVersion.ts (currently at v2), extend to v3:

```typescript
// Current: src/utils/schemaVersion.ts
export const CURRENT_SCHEMA_VERSION = 2;

// Phase 16: Update to v3
export const CURRENT_SCHEMA_VERSION = 3;

export function initializeSchema(): void {
  const storedVersion = localStorage.getItem(SCHEMA_VERSION_KEY);

  if (!storedVersion) {
    localStorage.setItem(SCHEMA_VERSION_KEY, CURRENT_SCHEMA_VERSION.toString());
  } else {
    const version = parseInt(storedVersion, 10);
    if (version < CURRENT_SCHEMA_VERSION) {
      // Run migration for v2 → v3
      migrateV2ToV3();
      localStorage.setItem(SCHEMA_VERSION_KEY, CURRENT_SCHEMA_VERSION.toString());
    }
  }
}

function migrateV2ToV3(): void {
  // Migrate localStorage keys
  const oldProjectId = localStorage.getItem('phishmonger-project-id');
  if (oldProjectId) {
    localStorage.setItem('phishmonger-phish-id', oldProjectId);
    localStorage.removeItem('phishmonger-project-id');
  }

  // Note: 'phishmonger-metadata' key name is already generic
  // No migration needed unless we want 'phishmonger-phishes-metadata'

  console.log('Schema migrated from v2 to v3');
}
```

### Recommended Project Structure

No folder structure changes needed - this is in-file refactoring:

```
src/
├── components/
│   ├── ProjectSettings.tsx    # Rename to PhishSettings.tsx
│   └── campaign/              # Already uses "phish" terminology
├── types/
│   ├── project.ts             # Rename to phish.ts (already exists!)
│   └── index.ts               # Update imports
├── utils/
│   ├── storage.ts             # Update key constants and function names
│   └── schemaVersion.ts       # Add v2→v3 migration
└── App.tsx                    # Update landing view logic
```

**Note:** `src/types/phish.ts` already exists and defines the `Phish` interface. The type system is ahead of the terminology - `ProjectMetadata` is the main legacy type that needs renaming.

### Pattern 1: Find-and-Replace with Type Safety

**What:** Systematic string replacement with TypeScript compiler checking
**When to use:** Large-scale terminology changes across codebase
**Example:**

```bash
# Step 1: Extract all occurrences
grep -r "project\|Project" src/ --include="*.tsx" --include="*.ts" > project-references.txt

# Step 2: Review and categorize
# - UI text: "Project Title" → "Phish Title"
# - Type names: ProjectMetadata → PhishMetadata
# - Variables: projectId → phishId
# - Comments: Update documentation

# Step 3: Use IDE refactoring (VSCode / WebStorm)
# Right-click → Rename Symbol (preserves imports/references)

# Step 4: Run TypeScript compiler to catch missed references
npm run type-check
```

**Verification:** After refactoring, all TypeScript errors must be resolved before committing.

### Pattern 2: Default Landing View State Management

**What:** Invert the default view from editor to campaigns list
**When to use:** Changing the primary application workflow
**Example:**

```typescript
// Current: src/App.tsx line 133
const [showCampaignManager, setShowCampaignManager] = useState(false)

// Phase 16: Change default to true
const [showCampaignManager, setShowCampaignManager] = useState(true)

// OR use a view mode state for clarity
type AppView = 'campaigns' | 'editor' | 'preview'
const [appView, setAppView] = useState<AppView>(() => {
  // Check URL hash or localStorage for saved view preference
  const savedView = localStorage.getItem('phishmonger-default-view')
  return (savedView as AppView) || 'campaigns' // New default
})
```

**Migration consideration:** Existing users expect the editor view. Consider:
1. Checking if user has any campaigns - if yes, default to campaigns; if no, default to editor
2. Add a "Remember my choice" preference
3. Add URL routing (`#/campaigns`, `#/editor`) for deep linking

### Anti-Patterns to Avoid

- **Find-and-replace without review:** "Project" appears in compound terms like "ProjectSettings" (component name) vs "project" (variable name). Context-aware replacement is required.
- **Breaking localStorage migration:** Testing migration script is critical. If migration fails, users lose all data. Always backup before migration.
- **Forgetting UI text:** Code references are caught by TypeScript, but UI strings in JSX are not. Use grep to find all user-facing text.
- **Inconsistent terminology:** Don't mix "phish" and "project". Choose one and use it consistently everywhere.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| String replacement across files | Manual find-and-replace | IDE Rename Symbol refactoring | IDE tracks imports, type definitions, and usages across files automatically |
| localStorage migration testing | Manual localStorage manipulation | Automated test with localStorage mock | Ensures migration works for both fresh installs and existing users |
| UI text extraction | Manual search | Codemod or grep with context | Catches all user-facing strings including edge cases |

**Key insight:** TypeScript's type system is your safety net. Rely on `tsc --noEmit` to catch broken imports and type references after renaming.

## Common Pitfalls

### Pitfall 1: localStorage Key Rename Data Loss

**What goes wrong:** Migration script runs, renames key, but fails to copy data. User loses all their work.

**Why it happens:** Forgetting to use `getItem()` before `removeItem()`, or overwriting without checking if old key exists.

**How to avoid:**
```typescript
// SAFE migration pattern
function migrateV2ToV3(): void {
  const oldData = localStorage.getItem('phishmonger-project-id');

  if (oldData) {
    // Only write if old data exists
    localStorage.setItem('phishmonger-phish-id', oldData);
    localStorage.removeItem('phishmonger-project-id');
    console.log('Migrated project ID to phish ID');
  } else {
    console.log('No old project ID found, skipping migration');
  }
}
```

**Warning signs:** Test with localStorage empty AND with localStorage populated. Both cases must work.

### Pitfall 2: Missed UI Text References

**What goes wrong:** Code is refactored but user still sees "Project Settings" in the UI.

**Why it happens:** JSX strings aren't checked by TypeScript compiler. Grep finds them but manual review misses some.

**How to avoid:**
```bash
# Find ALL JSX text content with "project" (case-insensitive)
grep -r "project\|Project" src/ --include="*.tsx" -B 2 -A 2

# Create a checklist of all UI strings to update:
# - "Project Settings" → "Phish Settings"
# - "Project Title" → "Phish Title" (or "Title")
# - "Untitled Project" → "Untitled Phish"
# - "Current project" → "Current phish"
```

**Warning signs:** Run the app after changes and visually inspect every screen. Better yet, add automated visual regression tests.

### Pitfall 3: Type Name Conflicts

**What goes wrong:** Rename `ProjectMetadata` to `PhishMetadata`, but `Phish` type already exists with its own metadata field. Now we have `Phish.metadata: PhishMetadata` which sounds redundant.

**Why it happens:** The naming wasn't thought through. `ProjectMetadata` describes the metadata structure. `Phish` is the entity. The metadata belongs to the phish, not the project.

**How to avoid:**
```typescript
// Option 1: Keep type name simple
interface PhishMetadata { /* ... */ } // Refers to phish metadata

// Option 2: Explicit if needed
interface PhishMetadataFields { /* ... */ }

// Option 3: Don't rename the type, only the UI text
// Keep: ProjectMetadata (it's a technical name)
// Change UI: "Phish Settings" (user-facing)
```

**Recommendation:** Keep `ProjectMetadata` as the internal type name (it's already referenced in many places), only update UI-facing text. OR if renaming is required, use `PhishMetadata` and accept the minor redundancy.

### Pitfall 4: Default View Breaks Existing User Workflow

**What goes wrong:** Users open the app and expect the editor, but now see the campaigns list. They're confused.

**Why it happens:** Changing the default landing view without considering existing users' muscle memory.

**How to avoid:**
```typescript
// Check if user has existing data
const hasExistingData = useMemo(() => {
  const metadata = loadMetadata();
  return metadata && metadata.title !== 'Untitled Project';
}, []);

const [defaultView, setDefaultView] = useState<'campaigns' | 'editor'>(() => {
  // New users: campaigns list
  // Existing users with data: editor (backward compatibility)
  return hasExistingData ? 'editor' : 'campaigns';
});
```

**Warning signs:** User complaints after deployment. Add an in-app "Give us feedback" button to catch this quickly.

## Code Examples

Verified patterns from codebase analysis:

### localStorage Migration Function

```typescript
// Source: Based on src/utils/schemaVersion.ts pattern
const SCHEMA_VERSION_KEY = 'phishmonger-schema-version';
export const CURRENT_SCHEMA_VERSION = 3; // Increment from 2

export function initializeSchema(): void {
  const storedVersion = localStorage.getItem(SCHEMA_VERSION_KEY);

  if (!storedVersion) {
    // First-time user
    localStorage.setItem(SCHEMA_VERSION_KEY, CURRENT_SCHEMA_VERSION.toString());
    console.log(`Schema initialized to v${CURRENT_SCHEMA_VERSION}`);
  } else {
    const version = parseInt(storedVersion, 10);
    if (version < CURRENT_SCHEMA_VERSION) {
      console.log(`Schema migration needed: v${version} → v${CURRENT_SCHEMA_VERSION}`);

      // Run migration
      migrateV2ToV3();

      // Update version
      localStorage.setItem(SCHEMA_VERSION_KEY, CURRENT_SCHEMA_VERSION.toString());
    }
  }
}

function migrateV2ToV3(): void {
  // Step 1: Migrate phishmonger-project-id → phishmonger-phish-id
  const oldProjectId = localStorage.getItem('phishmonger-project-id');
  if (oldProjectId) {
    localStorage.setItem('phishmonger-phish-id', oldProjectId);
    localStorage.removeItem('phishmonger-project-id');
    console.log('✓ Migrated phishmonger-project-id → phishmonger-phish-id');
  }

  // Step 2: Update default text in metadata (if still "Untitled Project")
  const metadataStr = localStorage.getItem('phishmonger-metadata');
  if (metadataStr) {
    try {
      const metadata = JSON.parse(metadataStr);
      if (metadata.title === 'Untitled Project') {
        metadata.title = 'Untitled Phish';
        localStorage.setItem('phishmonger-metadata', JSON.stringify(metadata));
        console.log('✓ Updated default title from "Untitled Project" to "Untitled Phish"');
      }
    } catch (error) {
      console.error('Failed to update metadata:', error);
    }
  }

  console.log('Schema v2 → v3 migration complete');
}
```

### Type Renaming Example

```typescript
// Before: src/types/project.ts
export interface ProjectMetadata {
  title: string;
  author: string;
  createdAt: string;
  updatedAt?: string;
  thumbnailUrl?: string;
}

// After: Rename file to phish-metadata.ts and update
export interface PhishMetadata {
  title: string;
  author: string;
  createdAt: string;
  updatedAt?: string;
  thumbnailUrl?: string;
}

// Update all imports across files:
// import type { ProjectMetadata } from './types/project'
// → import type { PhishMetadata } from './types/phish-metadata'

// Update type references in Phish interface:
// export interface Phish {
//   metadata: ProjectMetadata;  // Old
//   metadata: PhishMetadata;    // New
// }
```

### Component Renaming with Export

```typescript
// Before: src/components/ProjectSettings.tsx
export const ProjectSettings: React.FC<ProjectSettingsProps> = ({ ... }) => {
  return (
    <div className="project-settings">
      <h3>Project Settings</h3>
      {/* ... */}
    </div>
  );
};

// After: src/components/PhishSettings.tsx
export const PhishSettings: React.FC<PhishSettingsProps> = ({ ... }) => {
  return (
    <div className="phish-settings"> {/* Update CSS class name */}
      <h3>Phish Settings</h3>
      {/* ... */}
    </div>
  );
};

// Update App.tsx import:
// import { ProjectSettings } from './components/ProjectSettings'
// → import { PhishSettings } from './components/PhishSettings'
```

### Default Landing View Implementation

```typescript
// Source: Based on src/App.tsx line 133
function App() {
  // Initialize schema on mount (runs migration if needed)
  useEffect(() => {
    initializeSchema(); // This will run v2→v3 migration
  }, []);

  // Existing: showCampaignManager defaults to false (editor first)
  // const [showCampaignManager, setShowCampaignManager] = useState(false)

  // Phase 16: Change to campaigns-first workflow
  const [appView, setAppView] = useState<'campaigns' | 'editor'>(() => {
    // Check if user has existing data to avoid breaking workflow
    const savedMetadata = loadMetadata();
    const hasExistingPhish = savedMetadata.title !== 'Untitled Project';

    // New users: campaigns list (default)
    // Existing users with data: stay in editor (backward compat)
    return hasExistingPhish ? 'editor' : 'campaigns';
  });

  // Or simpler: always default to campaigns list
  // const [showCampaignManager, setShowCampaignManager] = useState(true)

  return (
    <div className="app">
      {appView === 'campaigns' && showCampaignManager && (
        <CampaignManager /* ... */ />
      )}
      {appView === 'editor' && (
        {/* Main editor UI */}
      )}
    </div>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual string replacement | IDE-assisted refactoring with type checking | Ongoing | TypeScript compiler catches errors, reducing bugs |
| Schema version tracking in comments | Explicit schema version in localStorage | v1.2 (Phase 9) | Enables automated migration on app mount |
| localStorage key migration on read | Lazy migration on app mount | v1.3 (this phase) | Cleaner separation of concerns, testable migration logic |

**Deprecated/outdated:**
- Direct localStorage manipulation without schema versioning: Replace with `initializeSchema()` pattern
- Hardcoded UI text without i18n: Consider extraction to constants for easier updates (future enhancement)

## Open Questions

1. **localStorage key "phishmonger-projects" doesn't exist**
   - What we know: The current codebase has `phishmonger-metadata` and `phishmonger-project-id`, but not `phishmonger-projects`
   - What's unclear: Is the requirement referencing a future feature, or is there a misunderstanding of the current localStorage structure?
   - Recommendation: Confirm with stakeholder before implementing. The actual migration may only need `phishmonger-project-id` → `phishmonger-phish-id`.

2. **Should `ProjectMetadata` type be renamed?**
   - What we know: `ProjectMetadata` is used extensively across the codebase. Renaming requires updating all imports.
   - What's unclear: Is the type name user-facing or internal? If internal-only, keeping it reduces risk.
   - Recommendation: Consider keeping the type name as `ProjectMetadata` (internal) while updating all UI text to "phish" (user-facing). This reduces refactoring scope.

3. **Default landing view for existing users**
   - What we know: Changing from editor-first to campaigns-first breaks existing user workflow
   - What's unclear: Should existing users be forced to the new workflow, or maintain backward compatibility?
   - Recommendation: Check if user has existing data. If yes, default to editor (backward compat). If no (new users), default to campaigns list.

4. **CSS class name updates**
   - What we know: Current classes use "project-" prefix (e.g., `.project-settings`, `.project-settings-header`)
   - What's unclear: Should these be renamed to `.phish-settings`, etc.? This affects CSS styling.
   - Recommendation: Rename CSS classes for consistency. Use CSS modules or Tailwind to avoid global class conflicts.

## Sources

### Primary (HIGH confidence)
- **src/utils/schemaVersion.ts** - Current schema version implementation (v2), migration pattern reference
- **src/utils/storage.ts** - All localStorage key constants and data access patterns
- **src/App.tsx** - Main app state management, current default view behavior
- **src/types/project.ts** - ProjectMetadata type definition
- **src/types/phish.ts** - Phish type definition (already uses new terminology)
- **src/components/ProjectSettings.tsx** - UI component with user-facing "project" text
- **src/hooks/useCampaigns.ts** - Campaign state management, localStorage access patterns
- **grep codebase analysis** - Comprehensive count of "project" references: 136 occurrences across 12 files

### Secondary (MEDIUM confidence)
- **TypeScript Handbook (generating types)** - Not accessible due to API limit, but TypeScript fundamentals are well-understood
- **React localStorage patterns (general knowledge)** - Standard React hooks patterns for localStorage access

### Tertiary (LOW confidence)
- **React localStorage migration best practices 2026** - WebSearch unavailable due to rate limit, relying on general knowledge and existing codebase patterns

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Existing codebase analysis, no new dependencies
- Architecture: HIGH - Direct code inspection of all relevant files
- Pitfalls: HIGH - Based on common refactoring and migration mistakes, documented patterns
- localStorage migration: HIGH - Existing schemaVersion.ts provides proven pattern to extend

**Research date:** 2026-01-24
**Valid until:** 30 days (stable domain - refactoring patterns don't change rapidly)

**Files analyzed:**
- 53 TypeScript/TSX files in src/
- 136 "project"/"Project" references identified
- 12 unique localStorage keys cataloged
- All major components reviewed (App, ProjectSettings, CampaignManager, storage utilities)
