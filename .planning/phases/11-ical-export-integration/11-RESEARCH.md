# Phase 11: iCal Export & Integration - Research

**Researched:** 2026-01-23
**Domain:** iCalendar (.ics) file generation and browser-based download
**Confidence:** HIGH

## Summary

This phase requires generating iCalendar (.ics) files from campaign schedules that users can import into external calendar applications (Google Calendar, Outlook, Apple Calendar). The standard approach for JavaScript/TypeScript applications is to use **`ical-generator`** (v8.1.1+), a mature, actively-maintained library with built-in TypeScript support, RFC 5545 compliance, and proven browser compatibility.

The implementation strategy: Create a utility function that maps campaign data (campaign name, scheduled phishes with dates) to iCalendar VEVENT components, then triggers a browser download using the existing URL.createObjectURL pattern established in Phase 10. Each scheduled phish becomes a separate calendar event with the title format "Campaign Name: Phish Title", a 1-hour duration, and a description containing only the phish description text.

**Primary recommendation:** Use `ical-generator` library with UTC times (no timezone complexity) and follow the existing export pattern from Phase 10.

## Standard Stack

The established libraries/tools for iCal generation in browser-based TypeScript applications:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| **ical-generator** | 8.1.1+ | Generate RFC 5545 compliant .ics files | Most popular (72+ dependents), active maintenance, built-in TypeScript types, proven browser compatibility |
| **URL.createObjectURL** | Native browser API | Trigger file downloads from client-side generated content | Standard browser API, already used in Phase 10 JSON export |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **crypto.randomUUID()** | Native | Generate unique UIDs for events | Required by RFC 5545 for globally unique event identifiers |
| **@touch4it/ical-timezones** | Latest | Generate VTIMEZONE components for timezone support | Only if timezone-specific times needed (NOT recommended for simplicity) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| ical-generator | ical-gen (TypeScript fork) | ical-gen is early draft, not production-ready, API unstable. Use mature ical-generator instead |
| ical-generator | ics package | Less popular, simpler API but fewer features. ical-generator better TypeScript support |
| ical-generator | Hand-rolled .ics string concatenation | Error-prone, must handle RFC 5545 edge cases, line folding, escaping. Don't hand-roll |

**Installation:**
```bash
npm install ical-generator
```

**Note:** No separate `@types/ical-generator` package needed - TypeScript definitions are bundled with the library.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── utils/
│   └── icalExport.ts        # New: iCal generation utilities
├── components/
│   └── campaign/
│       └── CampaignCard.tsx  # Modify: Add iCal export button
└── types/
    └── campaign.ts           # Existing: Campaign type definitions
```

### Pattern 1: iCal Generation Utility
**What:** Create a dedicated utility module for generating .ics content from campaigns
**When to use:** Decoupling iCal generation logic from UI components enables testing and reuse
**Example:**
```typescript
// Source: https://www.npmjs.com/package/ical-generator
import ical from 'ical-generator';
import type { Campaign } from '../types/campaign';

export function generateCampaignICal(campaign: Campaign): string {
  const calendar = ical({
    name: `${campaign.name} - Phish Monger Campaign`,
    prodId: {
      company: 'Phish Monger',
      product: 'Phish Monger Campaigns',
      language: 'EN'
    }
  });

  // Filter phishes with scheduled dates and create events
  campaign.campaignPhishes
    .filter(phish => phish.scheduledDate)
    .forEach(phish => {
      const startDate = new Date(phish.scheduledDate!);
      const endDate = new Date(startDate.getTime() + (60 * 60 * 1000)); // +1 hour

      calendar.createEvent({
        start: startDate,
        end: endDate,
        summary: `${campaign.name}: ${phish.title}`,
        description: phish.description || '',
        uid: crypto.randomUUID(), // Globally unique identifier
        stamp: new Date() // DTSTAMP: when event was created
      });
    });

  return calendar.toString();
}
```

### Pattern 2: Browser Download Trigger
**What:** Use URL.createObjectURL to trigger file download from generated .ics content
**When to use:** Client-side file generation without server involvement
**Example:**
```typescript
// Source: Following Phase 10 pattern from CampaignManager.tsx
export function downloadICal(icsContent: string, filename: string) {
  const blob = new Blob([icsContent], { type: 'text/calendar; charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url); // Clean up memory
}
```

### Pattern 3: UI Integration
**What:** Add export button to CampaignCard alongside existing Edit/Delete/Export buttons
**When to use:** Users need access to iCal export from campaign list view
**Example:**
```typescript
// In CampaignCard component
<button
  onClick={onExportICal}
  style={{
    padding: '6px 12px',
    fontSize: '13px',
    backgroundColor: '#28a745', // Green for download action
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }}
>
  Export Calendar
</button>
```

### Anti-Patterns to Avoid
- **Hand-rolling .ics strings:** RFC 5545 requires specific formatting (line folding, CRLF line endings, property escaping). Use a library.
- **Ignoring UID requirements:** Every VEVENT MUST have a globally unique UID. Use `crypto.randomUUID()`.
- **Forgetting DTSTAMP:** RFC 5545 requires DTSTAMP property. ical-generator handles this automatically.
- **Timezone complexity:** Using VTIMEZONE components introduces complexity and cross-platform issues. Use UTC times instead.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| .ics file generation | String concatenation with manual formatting | ical-generator | RFC 5545 requires CRLF line endings, 75-character line folding, proper escaping, VTIMEZONE components, date/time formatting. Edge cases abound. |
| UID generation | Simple counter or random string | crypto.randomUUID() | RFC 5545 requires "persistent, globally unique" identifier. UUID is standard. |
| File download trigger | Complex blob handling or server endpoint | URL.createObjectURL pattern | Standard browser API, works entirely client-side, already used in Phase 10 |
| Timezone handling | Manual VTIMEZONE component generation | Use UTC times (no timezone) | VTIMEZONE is complex (requires STANDARD/DAYLIGHT components, transition times). UTC times avoid this entirely. |

**Key insight:** iCal generation has many subtle requirements (DTSTAMP, UID uniqueness, date formatting, line folding). A library like ical-generator handles these edge cases that you'll miss with a custom solution.

## Common Pitfalls

### Pitfall 1: Missing Required VEVENT Properties
**What goes wrong:** Calendar applications reject imported events or display them incorrectly
**Why it happens:** RFC 5545 requires DTSTAMP, UID, and DTSTART as mandatory properties
**How to avoid:** Use ical-generator, which automatically handles required properties. Don't hand-roll.
**Warning signs:** Google Calendar silently fails to import, Outlook shows "Cannot import" error

### Pitfall 2: Timezone Complexity
**What goes wrong:** Events show at wrong times in different calendar applications
**Why it happens:** VTIMEZONE components are complex, and different platforms handle them inconsistently
**How to avoid:** Use UTC times (no timezone specified in ical-generator). All events render at the correct UTC time.
**Warning signs:** Events 4-5 hours off in Google Calendar, Outlook shows different time than Apple Calendar

### Pitfall 3: Line Ending Issues
**What goes wrong:** Calendar applications fail to parse the .ics file
**Why it happens:** RFC 5545 strictly requires CRLF (`\r\n`) line endings, not just `\n`
**How to avoid:** Use ical-generator, which outputs proper line endings. Don't manually construct strings.
**Warning signs:** "Invalid iCalendar file" errors, "File format not recognized"

### Pitfall 4: Browser Memory Leaks
**What goes wrong:** Multiple exports cause memory issues
**Why it happens:** Forgetting to revoke object URLs created with URL.createObjectURL
**How to avoid:** Always call `URL.revokeObjectURL(url)` after triggering download
**Warning signs:** Browser becomes sluggish after multiple exports, memory usage climbing

### Pitfall 5: Non-unique UIDs
**What goes wrong:** Calendar applications treat updated exports as duplicate events
**Why it happens:** Reusing UIDs or using non-unique identifiers
**How to avoid:** Generate new UID for each event using `crypto.randomUUID()` on every export
**Warning signs:** Importing .ics file creates duplicate events in calendar

### Pitfall 6: Special Character Escaping
**What goes wrong:** Descriptions with commas, semicolons, or newlines break .ics parsing
**Why it happens:** RFC 5545 requires escaping special characters (comma, semicolon, backslash, newline)
**How to avoid:** ical-generator handles escaping automatically. Don't hand-roll.
**Warning signs:** Events truncated at special characters, "Invalid property value" errors

## Code Examples

Verified patterns from official sources:

### Basic iCal Generation with ical-generator
```typescript
// Source: https://www.npmjs.com/package/ical-generator
import ical from 'ical-generator';

const calendar = ical({
  name: 'my first iCal',
  prodId: {
    company: 'My Company',
    product: 'My App',
    language: 'EN'
  }
});

const startTime = new Date();
const endTime = new Date(startTime.getTime() + (60 * 60 * 1000)); // +1 hour

calendar.createEvent({
  start: startTime,
  end: endTime,
  summary: 'Example Event',
  description: 'Event description here',
  uid: crypto.randomUUID(),
  stamp: new Date()
});

const icsContent = calendar.toString();
```

### Campaign-to-iCal Mapping (Complete Example)
```typescript
// Utility function: src/utils/icalExport.ts
import ical from 'ical-generator';
import type { Campaign } from '../types/campaign';

export function generateCampaignICal(campaign: Campaign): string {
  const calendar = ical({
    name: `${campaign.name} - Phish Monger Campaign`,
    prodId: {
      company: 'Phish Monger',
      product: 'Phish Monger Campaigns',
      language: 'EN'
    }
  });

  // Create one event per scheduled phish
  campaign.campaignPhishes
    .filter(phish => phish.scheduledDate)
    .forEach(phish => {
      const startDate = new Date(phish.scheduledDate!);
      const endDate = new Date(startDate.getTime() + (60 * 60 * 1000)); // +1 hour

      calendar.createEvent({
        start: startDate,
        end: endDate,
        summary: `${campaign.name}: ${phish.title}`,
        description: phish.description || '',
        uid: crypto.randomUUID(),
        stamp: new Date()
      });
    });

  return calendar.toString();
}

export function downloadCampaignICal(campaign: Campaign): void {
  const icsContent = generateCampaignICal(campaign);
  const safeName = campaign.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const filename = `${safeName}_calendar`;

  const blob = new Blob([icsContent], { type: 'text/calendar; charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
```

### Component Integration
```typescript
// src/components/campaign/CampaignCard.tsx
interface CampaignCardProps {
  campaign: Campaign;
  onEdit: () => void;
  onDelete: () => void;
  onExport: () => void;          // Existing: JSON export
  onExportICal: () => void;      // NEW: iCal export
}

export function CampaignCard({ campaign, onEdit, onDelete, onExport, onExportICal }: CampaignCardProps) {
  // ... existing code ...

  return (
    <div style={{ /* existing card styles */ }}>
      {/* ... existing card content ... */}

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete}>Delete</button>
        <button onClick={onExport}>Export JSON</button>
        <button onClick={onExportICal}>Export Calendar</button>  {/* NEW */}
      </div>
    </div>
  );
}
```

### Parent Component Handler
```typescript
// src/components/campaign/CampaignManager.tsx
import { downloadCampaignICal } from '../../utils/icalExport';

export function CampaignManager() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  const handleExportICal = (campaign: Campaign) => {
    try {
      downloadCampaignICal(campaign);
    } catch (error) {
      console.error('Failed to export iCal:', error);
      // Optionally show error to user
    }
  };

  return (
    <div>
      {campaigns.map(campaign => (
        <CampaignCard
          key={campaign.id}
          campaign={campaign}
          onEdit={() => handleEdit(campaign)}
          onDelete={() => handleDelete(campaign)}
          onExport={() => handleExportJSON(campaign)}
          onExportICal={() => handleExportICal(campaign)}  {/* NEW */}
        />
      ))}
    </div>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Server-side .ics generation | Client-side generation with ical-generator | ~2017+ | Faster, no server needed, works offline |
| Manual string concatenation | RFC 5545 compliant libraries | ~2015+ | Reliable, cross-platform compatible, handles edge cases |
| Timezone-specific VTIMEZONE components | UTC times (simpler, more portable) | Ongoing best practice | Avoids timezone complexity, works everywhere |

**Deprecated/outdated:**
- **moment-timezone:** ical-generator supports it, but project uses native Date - stick with that
- **VTIMEZONE generation for simple use cases:** Adds complexity without benefit. Use UTC instead.
- **@types/ical-generator:** No longer needed - types are bundled with ical-generator itself

## Open Questions

Things that couldn't be fully resolved:

1. **Event time-of-day specification**
   - What we know: Campaign dates are stored as ISO 8601 date strings (e.g., "2026-03-15") without time
   - What's unclear: What time of day should phish events be scheduled for?
   - Recommendation: Default to 9:00 AM UTC (or user's local timezone) for all events. Time is arbitrary for training campaigns - only the date matters. Document this decision in code.

2. **Testing across calendar applications**
   - What we know: Google Calendar, Outlook, and Apple Calendar all support .ics import
   - What's unclear: Automated testing approach for verifying cross-platform compatibility
   - Recommendation: Manual testing only. Generate sample .ics file from test campaign, manually import into each platform, verify events appear correctly. Document platform-specific quirks if found.

3. **TextEncoder browser compatibility**
   - What we know: ical-generator uses TextEncoder, available in Node.js ≥11.0.0 and all modern browsers
   - What's unclear: Need to support older browsers?
   - Recommendation: Assume modern browser support (Phase 1 decision). If older browser support is needed, add polyfill.

## Sources

### Primary (HIGH confidence)
- [ical-generator npm package](https://www.npmjs.com/package/ical-generator) - Library API, installation, TypeScript support, date/time handling, examples
- [RFC 5545 - iCalendar Specification](https://icalendar.org/iCalendar-RFC-5545/3-6-1-event-component.html) - VEVENT required properties (DTSTAMP, UID, DTSTART), format definition, examples
- [Phase 10 implementation](/Users/zach/localcode/phishmonger/src/components/campaign/CampaignManager.tsx) - URL.createObjectURL download pattern used in existing codebase
- [Campaign data model](/Users/zach/localcode/phishmonger/src/types/campaign.ts) - Campaign structure, scheduledDate field format

### Secondary (MEDIUM confidence)
- [Timezone VTIMEZONE issues discussions](https://github.com/fullcalendar/fullcalendar/issues/7805) - Common pitfalls with timezone handling, validates UTC approach
- [Google Calendar import guide](https://support.google.com/calendar/answer/37118) - Verification that .ics import is standard user workflow
- [iCal browser library comparison](https://github.com/qertis/ical-browser) - Confirms ical-generator is preferred choice over alternatives

### Tertiary (LOW confidence)
- [ical-generator CodeSandbox examples](https://codesandbox.io/examples/package/ical-generator) - Community examples, may vary in quality
- [Testing ICS files blog posts](https://calendarbridge.com/blog/how-to-upload-or-add-an-ics-file-to-your-calendar/) - General guidance on manual testing approach

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - ical-generator is mature, well-documented, with proven TypeScript support
- Architecture: HIGH - Pattern follows existing Phase 10 export implementation, RFC 5545 clearly documented
- Pitfalls: HIGH - RFC 5545 specification is explicit about requirements, common issues well-documented in GitHub issues

**Research date:** 2026-01-23
**Valid until:** 2026-04-23 (90 days - ical-generator is stable, but verify latest version before implementation)
