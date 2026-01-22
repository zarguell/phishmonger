# Phase 10: Campaign Manager UI - Research

**Researched:** 2026-01-22
**Domain:** React component architecture, modal patterns, multi-select UI, JSON import/export
**Confidence:** HIGH

## Summary

This research covers the UI implementation for campaign management in Phish Monger v1.2. The phase delivers a campaign manager interface that enables users to create, edit, and manage campaigns through intuitive modals, following existing patterns from the technique library implementation.

Key findings from research:
- **Existing modal pattern**: Codebase has established modal overlay pattern in `TechniqueLibrary.tsx` with backdrop click-to-close
- **Form validation pattern**: `CustomTechniqueEditor.tsx` demonstrates controlled form inputs with error state
- **Storage integration**: Phase 9's `useCampaigns` hook provides all CRUD operations needed
- **Project context**: App is single-project editor - campaigns copy current project state (not a library of projects)
- **Multi-select approach**: No external dependencies needed - native HTML with custom tag-based UI

**Primary recommendation:** Follow the existing `TechniqueLibrary` + `CustomTechniqueEditor` modal pattern for campaign list and edit modals, implement native `<input type="date">` for scheduling, use browser's File API for JSON import/export, and build a custom tag-based multi-select for adding projects (which is actually just the current project being copied into campaigns).

## Standard Stack

### Core (already in dependencies)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 18.3.1 | Component architecture | Already in use, established patterns |
| TypeScript | ~5.9.0 | Type safety for component props | Already in use |
| Native browser APIs | - | File import/export, date picking | No additional dependencies needed |

### Storage Layer (from Phase 9)
| Module | Purpose |
|--------|---------|
| `useCampaigns` hook | Campaign CRUD operations, phish management |
| `copyPhishForCampaign()` | Utility to copy current project into campaign |
| `Campaign`, `CampaignPhish` types | Type definitions for campaign entities |

**No new dependencies required.** All UI can be built with existing React patterns and native browser APIs.

## Architecture Patterns

### Recommended Component Structure

```
src/
├── components/
│   └── campaign/
│       ├── CampaignManager.tsx         # NEW: Main campaign list view
│       ├── CampaignCard.tsx            # NEW: Individual campaign card
│       ├── CampaignEditor.tsx          # NEW: Campaign create/edit modal
│       ├── CampaignDetail.tsx          # NEW: Campaign detail view
│       ├── PhishScheduleEditor.tsx     # NEW: Date picker for scheduling
│       ├── CampaignExport.tsx          # NEW: Export/import functionality
│       └── ProjectAssigner.tsx         # NEW: Add current project to campaign
├── hooks/
│   └── useCampaigns.ts                 # EXISTING: From Phase 9
├── utils/
│   ├── storage.ts                      # EXISTING: Export/import helpers
│   └── campaignCopy.ts                 # EXISTING: Copy utilities
└── types/
    └── campaign.ts                     # EXISTING: Type definitions
```

### Pattern 1: Modal Overlay (from TechniqueLibrary)

**What:** Fixed-position overlay with centered modal content, backdrop click-to-close.

**When to use:** Campaign list, campaign editor, campaign detail views.

**Example:**
```typescript
// Source: /src/components/library/TechniqueLibrary.tsx (lines 188-210)
export function CampaignManager({ onClose }: { onClose: () => void }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '1200px',
        height: '90%',
        maxHeight: '800px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }}>
        {/* Header with close button */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e1e5e9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>
            Campaigns
          </h2>
          <button onClick={onClose}>×</button>
        </div>

        {/* Content */}
      </div>
    </div>
  );
}
```

**Backdrop click handler:**
```typescript
const handleBackdropClick = (e: React.MouseEvent) => {
  if (e.target === e.currentTarget) {
    onClose();
  }
};
```

### Pattern 2: Controlled Form with Validation (from CustomTechniqueEditor)

**What:** Form inputs with controlled state, error validation, submit/cancel actions.

**When to use:** Campaign name/description editing, JSON import text area.

**Example:**
```typescript
// Source: /src/components/library/CustomTechniqueEditor.tsx (lines 19-52, 99-112)
export function CampaignEditor({
  campaign,
  onSave,
  onClose
}: {
  campaign?: Campaign;
  onSave: (data: CampaignInput) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: campaign?.name || '',
    description: campaign?.description || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Campaign name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        name: formData.name.trim(),
        description: formData.description.trim(),
        campaignPhishes: campaign?.campaignPhishes || [],
      });
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Name field */}
      <div>
        <label>Campaign Name <span style={{ color: 'red' }}>*</span></label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          style={{
            width: '100%',
            padding: '8px',
            border: `1px solid ${errors.name ? 'red' : '#ccc'}`,
            borderRadius: '4px',
          }}
        />
        {errors.name && (
          <div style={{ color: 'red', fontSize: '12px' }}>{errors.name}</div>
        )}
      </div>

      {/* Description field */}
      <div>
        <label>Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        <button type="button" onClick={onClose}>Cancel</button>
        <button type="submit">Save Campaign</button>
      </div>
    </form>
  );
}
```

### Pattern 3: Card Grid Layout for Campaign List

**What:** Responsive grid of campaign cards with hover effects.

**When to use:** Campaign list view.

**Example:**
```typescript
export function CampaignList({ campaigns, onSelect, onEdit, onDelete }: Props) {
  if (campaigns.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        color: '#666',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
        <div style={{ fontSize: '18px', marginBottom: '8px' }}>
          No campaigns yet
        </div>
        <div style={{ fontSize: '14px' }}>
          Create campaigns to organize your phishing exercises
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px',
      padding: '24px',
    }}>
      {campaigns.map(campaign => (
        <CampaignCard
          key={campaign.id}
          campaign={campaign}
          onSelect={() => onSelect(campaign.id)}
          onEdit={() => onEdit(campaign)}
          onDelete={() => onDelete(campaign.id)}
        />
      ))}
    </div>
  );
}
```

### Pattern 4: Native Date Input for Scheduling

**What:** Browser-native date picker using `<input type="date">`.

**When to use:** Assigning scheduled dates to campaign phishes.

**Example:**
```typescript
// Source: MDN <input type="date"> - verified 2026-01-05
export function PhishScheduleEditor({
  campaignPhishes,
  onUpdatePhish
}: {
  campaignPhishes: CampaignPhish[];
  onUpdatePhish: (phishId: string, scheduledDate: string | undefined) => void;
}) {
  return (
    <div>
      {campaignPhishes.map(phish => (
        <div key={phish.id} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px',
          borderBottom: '1px solid #e1e5e9',
        }}>
          <div style={{ flex: 1 }}>
            {phish.metadata.title}
          </div>
          <input
            type="date"
            value={phish.scheduledDate || ''}
            onChange={(e) => {
              const date = e.target.value || undefined;
              onUpdatePhish(phish.id, date);
            }}
            style={{
              padding: '6px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          />
        </div>
      ))}
    </div>
  );
}
```

**Date format handling:**
```typescript
// Convert ISO string to date input format (YYYY-MM-DD)
function isoToDateInput(isoString: string): string {
  return isoString.split('T')[0];
}

// Convert date input to ISO string
function dateInputToIso(dateInput: string): string {
  return `${dateInput}T00:00:00.000Z`;
}
```

### Pattern 5: JSON Export/Import (from ProjectSettings)

**What:** File download for export, file reader + text area for import.

**When to use:** Campaign export/import functionality.

**Example:**
```typescript
// Source: /src/components/ProjectSettings.tsx (lines 54-86, 294-298)
export function CampaignExportImport({
  campaigns,
  onImportCampaign
}: {
  campaigns: Campaign[];
  onImportCampaign: (campaign: Campaign) => void;
}) {
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  // Export single campaign as JSON
  const handleExport = (campaign: Campaign) => {
    const jsonString = JSON.stringify(campaign, null, 2);
    const filename = `${campaign.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}`;
    downloadJSON(jsonString, filename);
  };

  // Export all campaigns
  const handleExportAll = () => {
    const jsonString = JSON.stringify(campaigns, null, 2);
    const filename = `phishmonger-campaigns-${new Date().toISOString().split('T')[0]}`;
    downloadJSON(jsonString, filename);
  };

  // Download helper (from storage.ts)
  const downloadJSON = (jsonString: string, filename: string) => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // File import
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const campaign = JSON.parse(reader.result as string);
          onImportCampaign(campaign);
          setImportError(null);
        } catch (error) {
          setImportError('Invalid JSON format');
        }
      };
      reader.readAsText(file);
    }
    e.target.value = ''; // Reset input
  };

  // Text area import
  const handleTextImport = () => {
    if (importText.trim()) {
      try {
        const campaign = JSON.parse(importText);
        onImportCampaign(campaign);
        setImportText('');
        setImportError(null);
      } catch (error) {
        setImportError('Invalid JSON format');
      }
    }
  };

  return (
    <div>
      {/* Export buttons */}
      <button onClick={handleExportAll}>Export All Campaigns</button>

      {/* File import */}
      <div>
        <label>Import from File</label>
        <input
          type="file"
          accept=".json"
          onChange={handleFileImport}
        />
      </div>

      {/* Text area import */}
      <div>
        <label>Import from Pasted JSON</label>
        <textarea
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          placeholder="Paste campaign JSON here..."
          rows={6}
          style={{ width: '100%', padding: '8px', fontFamily: 'monospace' }}
        />
        <button onClick={handleTextImport}>Import</button>
        {importError && <div style={{ color: 'red' }}>{importError}</div>}
      </div>
    </div>
  );
}
```

### Pattern 6: Duplicate Detection on Import

**What:** Check for existing campaign IDs before importing, generate new ID if duplicate found.

**When to use:** Importing campaigns from JSON.

**Example:**
```typescript
export function importCampaignWithDuplicateCheck(
  importedCampaign: Campaign,
  existingCampaigns: Campaign[]
): { campaign: Campaign; wasDuplicate: boolean } {
  const isDuplicate = existingCampaigns.some(c => c.id === importedCampaign.id);

  if (isDuplicate) {
    // Generate new ID for duplicate
    return {
      campaign: {
        ...importedCampaign,
        id: crypto.randomUUID(),
        name: `${importedCampaign.name} (copy)`,
      },
      wasDuplicate: true,
    };
  }

  return {
    campaign: importedCampaign,
    wasDuplicate: false,
  };
}
```

### Pattern 7: Project Assignment (Current Project to Campaign)

**What:** Copy current project state into campaign using `copyPhishForCampaign()`.

**When to use:** Adding phish to campaign.

**Important:** This app is a single-project editor. Users work on one project at a time (stored in `phishmonger-*` LocalStorage keys). When they "add a project to campaign," they're actually copying the current working project into that campaign.

**Example:**
```typescript
// Source: /src/utils/campaignCopy.ts
import { copyPhishForCampaign } from '../utils/campaignCopy';
import type { CampaignPhish } from '../types/campaign';

export function ProjectAssigner({
  campaign,
  currentProject,
  onAddToCampaign
}: {
  campaign: Campaign;
  currentProject: Phish; // Current project from editor
  onAddToCampaign: (campaignId: string, phish: CampaignPhish) => void;
}) {
  const handleAddProject = () => {
    // Check if project already in campaign
    const alreadyInCampaign = campaign.campaignPhishes.some(
      p => p.id === currentProject.id
    );

    if (alreadyInCampaign) {
      alert('This project is already in the campaign');
      return;
    }

    // Copy current project into campaign
    const copiedPhish = copyPhishForCampaign(currentProject);
    onAddToCampaign(campaign.id, copiedPhish);
  };

  return (
    <div>
      <h3>Add Current Project</h3>
      <p>{currentProject.metadata.title}</p>
      <button onClick={handleAddProject}>
        Add to Campaign
      </button>
    </div>
  );
}
```

### Anti-Patterns to Avoid

- **External multi-select libraries**: Don't install react-select or similar. Build custom tag-based UI - simpler and follows existing patterns.
- **Date picker libraries**: Don't install react-datepicker. Native `<input type="date">` is sufficient and accessible.
- **Complex modal libraries**: Don't install react-modal. Follow the existing inline modal pattern from TechniqueLibrary.
- **Form libraries**: Don't install react-hook-form. Controlled components with useState are sufficient for this scale.
- **Toast libraries**: Don't install react-toastify for this phase. Use inline error state (matches existing ExportButton pattern).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Modal overlay | Custom positioning CSS | Fixed container with flex center | Established pattern in TechniqueLibrary |
| Form validation | Complex validation library | Manual checks with useState | Sufficient for 2-field form |
| Date picker | Custom calendar widget | `<input type="date">` | Native browser support, accessible |
| File download | Complex blob handling | `URL.createObjectURL()` + `<a>` tag | Standard browser API |
| JSON parsing | Custom validation | `JSON.parse()` + try-catch | Built-in, sufficient |
| Multi-select | Dropdown with checkboxes | Simple list with "Add" buttons | Current project is single-item |

**Key insight:** The app's single-project model means "multi-select" is misleading. Users copy the current project into campaigns. No project library exists to select from.

## Common Pitfalls

### Pitfall 1: Mutating Campaign State Directly

**What goes wrong:** React doesn't re-render, UI shows stale data.

**Why it happens:** Using `campaign.phishes.push()` or directly modifying nested objects.

**How to avoid:**
1. Always use `useCampaigns` hook methods (addPhishToCampaign, updatePhishInCampaign)
2. Never mutate campaign objects directly
3. Hook handles immutable updates and LocalStorage sync

**Warning signs:** UI not updating after "successful" operation.

### Pitfall 2: Forgetting backdrop click-to-close

**What goes wrong:** Users can't close modal by clicking outside, feels broken.

**Why it happens:** Not implementing backdrop click handler from existing pattern.

**How to avoid:**
1. Add `onClick={handleBackdropClick}` to backdrop div
2. Check `e.target === e.currentTarget` to avoid triggering on content clicks
3. Follow TechniqueLibrary pattern exactly

**Warning signs:** Modal feels "stuck" or requires explicit close button.

### Pitfall 3: Date format mismatch

**What goes wrong:** Scheduled dates display incorrectly or fail validation.

**Why it happens:** Mixing Date objects with ISO strings, or timezone issues.

**How to avoid:**
1. Store dates as ISO 8601 strings in LocalStorage
2. Convert to `YYYY-MM-DD` for `<input type="date">`
3. Always work in UTC to avoid timezone shifts

**Warning signs:** Dates showing "NaN" or wrong day.

### Pitfall 4: Import validation too strict

**What goes wrong:** Valid imports fail validation, users frustrated.

**Why it happens:** Over-validating JSON structure (e.g., requiring all fields).

**How to avoid:**
1. Only validate required fields (id, name, description, campaignPhishes)
2. Allow optional fields to be missing
3. Use TypeScript type guards, not complex schemas

**Warning signs:** Import fails with "invalid JSON" error but JSON looks correct.

### Pitfall 5: Not handling duplicate IDs on import

**What goes wrong:** Importing campaign with same ID overwrites existing campaign.

**Why it happens:** Assuming imported IDs are unique.

**How to avoid:**
1. Check if campaign ID already exists in campaigns array
2. If duplicate, generate new ID with `crypto.randomUUID()`
3. Append " (copy)" to campaign name for clarity

**Warning signs:** Campaign "disappears" after import.

### Pitfall 6: Forgetting storage quota errors

**What goes wrong:** Save fails silently with no user feedback.

**Why it happens:** Not catching `QuotaExceededError` from localStorage operations.

**How to avoid:**
1. useCampaigns hook provides `storageError` state
2. Display error message inline when set
3. Follow existing pattern from ExportButton

**Warning signs:** Campaign appears to save but doesn't persist.

## Code Examples

### Campaign Card Component

```typescript
export function CampaignCard({
  campaign,
  onSelect,
  onEdit,
  onDelete
}: {
  campaign: Campaign;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  // Calculate date range from scheduled phishes
  const scheduledPhishes = campaign.campaignPhishes.filter(p => p.scheduledDate);
  const dateRange = useMemo(() => {
    if (scheduledPhishes.length === 0) return null;

    const dates = scheduledPhishes.map(p => new Date(p.scheduledDate!)).sort((a, b) => a.getTime() - b.getTime());
    const start = dates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const end = dates[dates.length - 1].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return start === end ? start : `${start} - ${end}`;
  }, [scheduledPhishes]);

  return (
    <div style={{
      border: '1px solid #e1e5e9',
      borderRadius: '8px',
      padding: '16px',
      backgroundColor: 'white',
      cursor: 'pointer',
      transition: 'box-shadow 0.2s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }} onClick={onSelect}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>
            {campaign.name}
          </h3>
          {campaign.description && (
            <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#666' }}>
              {campaign.description}
            </p>
          )}
          <div style={{ fontSize: '13px', color: '#888' }}>
            {campaign.campaignPhishes.length} phish{campaign.campaignPhishes.length !== 1 ? 'es' : ''}
            {dateRange && ` • ${dateRange}`}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
          <button onClick={onEdit} style={{ padding: '6px 12px', fontSize: '12px' }}>
            Edit
          </button>
          <button
            onClick={onDelete}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              backgroundColor: '#fff0f0',
              border: '1px solid #cc0000',
              color: '#cc0000',
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Type-to-Confirm Deletion

```typescript
export function ConfirmDeleteModal({
  campaignName,
  onConfirm,
  onCancel
}: {
  campaignName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [confirmation, setConfirmation] = useState('');
  const isConfirmed = confirmation === campaignName;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        maxWidth: '500px',
      }}>
        <h2>Delete Campaign</h2>
        <p style={{ marginBottom: '16px' }}>
          This action cannot be undone. Type <strong>{campaignName}</strong> to confirm.
        </p>
        <input
          type="text"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          placeholder={`Type "${campaignName}" to confirm`}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            marginBottom: '16px',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button onClick={onCancel}>Cancel</button>
          <button
            onClick={onConfirm}
            disabled={!isConfirmed}
            style={{
              backgroundColor: isConfirmed ? '#cc0000' : '#ccc',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: isConfirmed ? 'pointer' : 'not-allowed',
            }}
          >
            Delete Campaign
          </button>
        </div>
      </div>
    </div>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Custom modal libraries | Inline modal components | React 16.8+ | Less dependencies, more control |
| Moment.js for dates | Native ISO 8601 strings | ES2021 | Simpler, no dependencies |
| Complex form libraries | Controlled components | React 18 | Less boilerplate for simple forms |
| Custom date pickers | `<input type="date">` | HTML5 | Native accessibility, mobile support |

**Deprecated/outdated:**
- react-modal: Use inline modal pattern from existing codebase
- moment.js: Use native Date + ISO strings
- react-datepicker: Native input is sufficient
- formik/react-hook-form: Overkill for 2-field forms

## Open Questions

1. **Campaign list entry point**
   - What we know: Campaign manager needs to be accessible from main UI
   - What's unclear: Where to add "Campaigns" button in App.tsx header
   - Recommendation: Add next to "Manage Techniques" button in ProjectSettings

2. **Multi-campaign project visualization**
   - What we know: Projects can be in multiple campaigns (via copying)
   - What's unclear: Whether to show "in campaigns: X, Y, Z" badge in UI
   - Recommendation: Skip for Phase 10 - campaigns are independent copies, no back-reference

3. **Bulk operations**
   - What we know: Users might want to export/delete multiple campaigns
   - What's unclear: Whether to support bulk selection in Phase 10
   - Recommendation: Defer to future phase - single operations are sufficient for MVP

## Sources

### Primary (HIGH confidence)
- Existing codebase analysis:
  - `/src/components/library/TechniqueLibrary.tsx` - Modal overlay pattern (verified 2026-01-22)
  - `/src/components/library/CustomTechniqueEditor.tsx` - Form validation pattern (verified 2026-01-22)
  - `/src/components/ProjectSettings.tsx` - Import/export UI pattern (verified 2026-01-22)
  - `/src/hooks/useCampaigns.ts` - CRUD operations (from Phase 9)
  - `/src/utils/campaignCopy.ts` - Project copying utilities (from Phase 9)
- [MDN: <input type="date">](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/date) - Verified 2025-11-05
- [MDN: File API](https://developer.mozilla.org/en-US/docs/Web/API/File) - FileReader pattern

### Secondary (MEDIUM confidence)
- [LogRocket: React Select comprehensive guide](https://blog.logrocket.com/react-select-comprehensive-guide/) - Multi-select patterns (verified 2025-03-03)
- [Intent UI: Multiple Select](https://intentui.com/docs/components/pickers/multiple-select) - Tag-based picker reference

### Tertiary (LOW confidence)
- [Component Depot: Best React Datepickers 2026](https://component-depot.com/posts/best-react-datepicker) - Confirms native input is viable option

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All packages already in use, no new dependencies needed
- Architecture: HIGH - Based on existing codebase patterns (TechniqueLibrary, CustomTechniqueEditor)
- UI patterns: HIGH - Verified from existing components
- Date handling: HIGH - MDN official docs verified
- Import/export: HIGH - Following existing ProjectSettings pattern

**Research date:** 2026-01-22
**Valid until:** 2026-06-22 (5 months - React patterns and HTML5 APIs are stable)
