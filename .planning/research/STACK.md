# Technology Stack

**Project:** Phish Monger v1.2 Campaign Management
**Researched:** 2025-01-22
**Overall confidence:** HIGH

## Recommended Stack

### New Calendar UI Dependencies

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **@schedule-x/react** | ^2.36.0 | Calendar component (month/week views) | Modern, lightweight, TypeScript-first, actively maintained (2 days ago), 0 dependencies, built-in dark mode support. More modern than react-big-calendar with better DX. |
| **date-fns** | ^4.0.0 | Date manipulation utilities | Required localizer for @schedule-x/react. Lightweight, tree-shakeable, no legacy Date prototype pollution. |

### iCal Export Dependencies

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **ics** | ^3.8.1 | Generate .ics files for export | Simple API, browser-compatible, actively maintained (7 months ago), 284K weekly downloads. Supports recurring events, alarms, and all standard iCal fields. |
| **@types/ics** | ^3.8.1 | TypeScript definitions for ics | Type safety for iCal generation (if not included in package - verify in implementation) |

### Dependency Upgrades (Major Versions)

| Package | Current | Target | Breaking Changes | Notes |
|---------|---------|--------|------------------|-------|
| **@tiptap/react** | 2.27.2 | 3.16.0 | YES | Major upgrade with new features. Requires careful testing of LureMark extension compatibility. |
| **@tiptap/starter-kit** | 2.27.2 | 3.16.0 | YES | Coordinated upgrade with @tiptap/react. |
| **@tiptap/extension-link** | 2.27.2 | 3.16.0 | YES | Coordinated upgrade with Tiptap v3. |
| **React** | 18.3.1 | 19.2.3 | YES | React 19 is a major release. Test all components, especially Tiptap integration and hotkeys. |
| **react-dom** | 18.3.1 | 19.2.3 | YES | Coordinated with React 19. |

## Alternatives Considered

### Calendar Libraries

| Recommended | Alternative | Why Not |
|-------------|-------------|---------|
| **@schedule-x/react** | react-big-calendar (1.19.4) | react-big-calendar requires external date library (moment/day.js/date-fns) and localizer setup, has dated styling, less TypeScript support. @schedule-x/react is more modern with zero dependencies. |
| **@schedule-x/react** | FullCalendar (Premium) | FullCalendar is premium-paid for advanced features. @schedule-x/react provides all needed features (month/week view, event display) free and open-source (MIT). |
| **@schedule-x/react** | @mobiscroll/react | Mobiscroll is premium with heavy bundle size. Overkill for simple campaign calendar display. |

### iCal Libraries

| Recommended | Alternative | Why Not |
|-------------|-------------|---------|
| **ics** | ical-generator | ical-generator is more complex with 3x larger bundle size (58.3KB vs minimal). ics has simpler API better suited for client-side file generation. ical-generator is better for server-side calendar feeds. |
| **ics** | ical.js | ical.js is primarily a parser, not a generator. Wrong tool for this job. |

## Installation

```bash
# Calendar UI
npm install @schedule-x/react@^2.36.0
npm install date-fns@^4.0.0

# iCal Export
npm install ics@^3.8.1
npm install -D @types/ics@^3.8.1  # Verify if needed (package may include types)

# Major version upgrades (careful - test thoroughly)
npm install @tiptap/react@^3.16.0 @tiptap/starter-kit@^3.16.0 @tiptap/extension-link@^3.16.0
npm install react@^19.2.3 react-dom@^19.2.3
npm install -D @types/react@^19.2.9 @types/react-dom@^19.2.3
```

## What NOT to Add

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **moment.js** | Legacy, heavy, deprecated in favor of modern libraries | date-fns (already required for @schedule-x/react) |
| **@schedule-x/premium** | Premium tier with resource scheduling, recurrence UI, event modal builder | Free tier has all needed features (month/week view, event display, dark mode) |
| **file-saver** | Adds unnecessary dependency | Native Blob API + anchor element download (already used in downloadProjectJSON) |
| **react-calendar** | Only provides date picker, not event calendar | @schedule-x/react (full event calendar with month/week views) |
| **ical-generator** | Overkill for client-side file generation (better for server feeds) | ics (simple, browser-focused API) |

## Integration with Existing Stack

### LocalStorage Patterns

Campaign data will extend existing LocalStorage patterns from `/src/utils/storage.ts`:

**Current pattern:**
- Single project: `phishmonger-annotations`, `phishmonger-metadata`, `phishmonger-scoring`
- Export/import: Single ProjectJSON with all data

**New pattern for campaigns:**
```typescript
// Campaign registry (array of campaigns)
const CAMPAIGNS_KEY = 'phishmonger-campaigns'

// Individual campaign data
const CAMPAIGN_PREFIX = 'phishmonger-campaign-'
// e.g., 'phishmonger-campaign-{campaignId}'

// Many-to-many relationship: campaigns ↔ phishes
// Campaign.scheduledPhishes: string[] (array of project IDs)
// Project metadata: optional campaignId field
```

**Campaign data structure:**
```typescript
interface Campaign {
  id: string           // UUID
  name: string         // User-defined campaign name
  color: string        // Hex color for calendar display
  createdAt: string    // ISO 8601 timestamp
  scheduledPhishes: string[]  // Array of project IDs (many-to-many)
}

interface ProjectMetadata {
  title: string
  author: string
  createdAt: string
  updatedAt?: string
  scheduledDate?: string  // NEW: ISO 8601 date for calendar display
  campaignId?: string     // NEW: Link to parent campaign
}
```

### iCal Export Integration

Leverage existing `downloadProjectJSON` pattern from `/src/utils/storage.ts`:

```typescript
/**
 * Export campaign schedule as iCal file
 * @param campaigns - Array of campaigns with scheduled phishes
 * @param projects - Map of project IDs to ProjectMetadata
 * @returns .ics file for download
 */
export const exportCampaigniCal = (
  campaigns: Campaign[],
  projects: Record<string, ProjectMetadata>
): void => {
  const events = []

  for (const campaign of campaigns) {
    for (const projectId of campaign.scheduledPhishes) {
      const project = projects[projectId]
      if (project?.scheduledDate) {
        events.push({
          start: new Date(project.scheduledDate),
          duration: { hours: 1 },  // Default duration
          title: project.title,
          description: `Campaign: ${campaign.name}`,
          categories: [campaign.name],
          // Use project ID as UID for uniqueness
          uid: `${projectId}@phishmonger`
        })
      }
    }
  }

  const { error, value } = ics.createEvents(events)
  if (error) {
    console.error('Failed to generate iCal:', error)
    return
  }

  // Reuse existing download pattern
  downloadICSFile(value, `${campaign.name}-schedule.ics`)
}
```

### TypeScript Type Safety

All new dependencies provide TypeScript support:
- `@schedule-x/react`: Built-in TypeScript (no @types needed)
- `date-fns`: Built-in TypeScript
- `ics`: Verify if types are bundled or install `@types/ics`

## Breaking Changes in Major Upgrades

### Tiptap v2 → v3 (2.27.2 → 3.16.0)

**Potential breaking changes:**
- Extension API changes may affect custom LureMark extension
- Node view API updates
- Changed prop names or component exports

**Mitigation:**
- Test LureMark extension thoroughly after upgrade
- Check Tiptap v3 migration guide for extension changes
- Verify custom technique rendering still works
- Run existing test suite (if exists)

**Action:**
Create dedicated phase for "Tiptap v3 Upgrade" with regression testing focus.

### React 18 → 19 (18.3.1 → 19.2.3)

**Potential breaking changes:**
- Concurrent rendering changes
- Form API changes (unlikely to affect this project)
- Transition API changes

**Mitigation:**
- Test all components for rendering issues
- Verify Tiptap editor compatibility with React 19
- Check react-hotkeys-hook compatibility (currently 5.2.3)
- Test undo/redo functionality

**Action:**
Upgrade React and Tiptap together (they're coordinated changes).

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| @schedule-x/react@^2.36.0 | date-fns@^2.0.0 - ^4.0.0 | Requires date adapter (choose date-fns over moment/day.js) |
| @schedule-x/react@^2.36.0 | React 18+ | Compatible with both React 18 and 19 |
| ics@^3.8.1 | All modern browsers | Uses standard Blob API (already used in Phish Monger) |
| React 19.2.3 | @tiptap/react@^3.16.0 | Must upgrade Tiptap with React |
| date-fns@^4.0.0 | @schedule-x/react@^2.36.0 | Use date-fns adapter for calendar localizer |

## Stack Patterns by Variant

**If sticking with React 18 (conservative approach):**
- Defer React 19 upgrade to post-v1.2
- Upgrade Tiptap independently (verify React 18 compatibility with Tiptap v3)
- Reduces risk, allows incremental testing

**If upgrading to React 19 (aggressive approach):**
- Upgrade React and Tiptab together in single phase
- Do this BEFORE calendar/iCal features (establish stability first)
- Higher risk but future-proofs the stack

**Recommendation:**
Conservative approach - defer React 19 to post-v1.2. Focus v1.2 on calendar/iCal features with stable React 18 + Tiptap v2.

## Dependency Upgrade Strategy

### Phase 1: Safe additions (LOW RISK)
- Install @schedule-x/react, date-fns, ics
- No breaking changes to existing code
- Can be done alongside feature development

### Phase 2: Tiptap v3 upgrade (MEDIUM RISK)
- Upgrade @tiptap/* packages to v3.16.0
- Requires testing LureMark extension
- Separate phase from React 19 to isolate issues

### Phase 3: React 19 upgrade (HIGH RISK)
- Defer to post-v1.2 milestone
- Requires full regression testing
- Coordinate with all React ecosystem upgrades

## Sources

- [@schedule-x/react on npm](https://www.npmjs.com/package/@schedule-x/react) — Version 2.36.0, published 2 days ago, MIT license, 0 dependencies (HIGH confidence)
- [Schedule-X official docs](https://schedule-x.dev/) — Modern alternative to FullCalendar, drag-and-drop, dark mode support (HIGH confidence)
- [react-big-calendar on npm](https://www.npmjs.com/package/react-big-calendar) — Version 1.19.4, 295 dependents, requires external date library + localizer setup (MEDIUM confidence)
- [ics on npm](https://www.npmjs.com/package/ics) — Version 3.8.1, published 7 months ago, 284K weekly downloads, browser-compatible API (HIGH confidence)
- [ical-generator on GitHub](https://github.com/sebbo2002/ical-generator) — Alternative library, larger bundle size (58.3KB), better for server-side calendar feeds (MEDIUM confidence)
- [Phish Monger existing codebase](/Users/zach/localcode/phishmonger) — Current package.json, storage patterns, type definitions (HIGH confidence)
- [npm outdated output](/Users/zach/localcode/phishmonger) — Current dependency versions and available upgrades (HIGH confidence)

---

**Stack research for:** Phish Monger v1.2 Campaign Management (Calendar UI + iCal Export)
**Researched:** 2025-01-22
