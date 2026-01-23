# Phase 14: Sample Campaign & Demo Data - Research

**Researched:** 2026-01-23
**Domain:** Demo data patterns, localStorage persistence, phishing training content
**Confidence:** HIGH

## Summary

Phase 14 requires creating a pre-built sample campaign with 3-4 well-annotated phishing examples that users can load to explore Phish Monger's features. This is placeholder content that will be replaced by users' custom examples, so the implementation should be lightweight and straightforward.

The research confirms the existing data model is fully capable of supporting sample campaigns. The Campaign type already embeds complete phish data (not references), making campaigns portable and self-contained. The existing `useCampaigns` hook provides all necessary CRUD operations via localStorage. The implementation pattern is clear: create a static Campaign JSON object, import it via a "Load Sample Campaign" button in CampaignManager, and persist it to localStorage using existing storage utilities.

**Primary recommendation:** Store sample campaign as a static JSON file in `src/data/`, add a "Load Sample Campaign" button alongside the existing "Import" button in CampaignManager, and use the existing `addCampaign()` function to persist it. Keep annotations light (1-2 per phish) and tone casual/educational per user's explicit decision.

## Standard Stack

The existing tech stack fully supports sample campaign implementation:

### Core
| Technology | Version | Purpose | Why Standard |
|------------|---------|---------|--------------|
| React | 18.3.1 | UI framework | Already in use, stable |
| TypeScript | 5.9.0 | Type safety | Required for type-safe campaign data |
| crypto.randomUUID() | Native | ID generation | Already used throughout codebase |
| localStorage | Browser API | Data persistence | Existing storage pattern in `src/utils/storage.ts` |

### Data Files
| File | Purpose | Location |
|------|---------|----------|
| `sampleCampaign.json` | Static sample campaign data | `src/data/sampleCampaign.json` |
| `techniques.json` | MITRE ATT&CK techniques (already exists) | `src/data/techniques.json` |
| `persuasion.json` | Cialdini principles (already exists) | `src/data/persuasion.json` |

### Storage & State Management
| Hook | Purpose | Usage |
|------|---------|-------|
| `useCampaigns` | Campaign CRUD operations | Already provides `addCampaign()` |
| `loadCampaigns()` | Load from localStorage | Existing utility |
| `saveCampaigns()` | Persist to localStorage | Existing utility |

**No new installations required.**

## Architecture Patterns

### File Structure
```
src/
├── data/
│   ├── sampleCampaign.json  # NEW: Static sample campaign
│   ├── techniques.json      # EXISTING: MITRE techniques
│   └── persuasion.json      # EXISTING: Cialdini principles
├── hooks/
│   └── useCampaigns.ts      # EXISTING: Campaign management
├── types/
│   ├── campaign.ts          # EXISTING: Campaign types
│   ├── phish.ts             # EXISTING: Phish types
│   └── annotations.ts       # EXISTING: Annotation types
└── components/campaign/
    └── CampaignManager.tsx  # MODIFY: Add "Load Sample" button
```

### Pattern 1: Static Data Import
**What:** Import static JSON as TypeScript module
**When to use:** For sample/demo data that ships with the app
**Example:**
```typescript
// src/data/sampleCampaign.ts (TypeScript wrapper for JSON)
import { Campaign } from '../types/campaign';
import sampleData from './sampleCampaign.json';

export const SAMPLE_CAMPAIGN: Campaign = sampleData as Campaign;
```

**Verification:** This pattern is standard in React apps for static assets. Vite (the build tool) handles JSON imports natively.

### Pattern 2: One-Time Load Prevention
**What:** Prevent loading sample campaign if it already exists
**When to use:** Avoid duplicate sample campaigns
**Example:**
```typescript
const handleLoadSample = () => {
  const existingSample = campaigns.find(c =>
    c.name.includes('Sample') || c.name.includes('Demo')
  );

  if (existingSample) {
    alert('Sample campaign already loaded!');
    return;
  }

  addCampaign({
    name: SAMPLE_CAMPAIGN.name,
    description: SAMPLE_CAMPAIGN.description,
    campaignPhishes: SAMPLE_CAMPAIGN.campaignPhishes,
  });
};
```

### Pattern 3: Lure Mark HTML Structure
**What:** HTML format for annotated email content
**When to use:** Creating sample phish HTML source
**Example:**
```html
<div>
  <p>Dear Employee,</p>
  <p>
    Your account will be suspended in 24 hours unless you
    <span data-lure-id="lure-1" class="lure-mark">verify your credentials</span>
    immediately.
  </p>
  <p>
    Click <span data-lure-id="lure-2" class="lure-mark">here</span> to sign in.
  </p>
  <p>IT Support Team</p>
</div>
```

**CSS styling (already exists in `src/index.css`):**
```css
.lure-mark {
  background-color: #fff3cd;
  border-bottom: 2px solid #ffc107;
  padding: 2px 4px;
  border-radius: 2px;
  position: relative;
}
```

### Anti-Patterns to Avoid
- **Hardcoding sample campaign in localStorage:** Don't pre-populate localStorage. Let users explicitly load the sample.
- **Generating sample data on the fly:** Don't create sample campaign dynamically. Use static JSON for consistency and easier maintenance.
- **Over-annotating sample phishes:** Don't add 5+ annotations per email. User explicitly requested "light" annotation density (1-2 per phish).

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Campaign validation | Manual checks | Existing `importProjectJSON` pattern in `src/utils/storage.ts` | CampaignManager already validates imported campaigns (lines 94-97) |
| ID generation | Custom UUID logic | `crypto.randomUUID()` | Already used throughout codebase, browser-native |
| Duplicate detection | Complex collision logic | Simple name check with `Array.find()` | Sample campaign only loaded once; simple check sufficient |
| Storage persistence | Direct localStorage access | `useCampaigns` hook's `addCampaign()` | Handles persistence, error handling, state updates |

**Key insight:** The entire campaign management infrastructure already exists. This phase is purely about adding a "Load Sample" button that calls existing functions with static data. No new persistence logic needed.

## Common Pitfalls

### Pitfall 1: Breaking Type Safety with JSON Imports
**What goes wrong:** Importing JSON without proper typing causes TypeScript errors
**Why it happens:** Vite imports JSON as `any` by default
**How to avoid:**
```typescript
// DON'T:
import sampleData from './sampleCampaign.json';
const campaign: Campaign = sampleData; // Type error

// DO:
import sampleData from './sampleCampaign.json';
const campaign: Campaign = sampleData as Campaign; // Explicit cast
```
**Warning signs:** TypeScript errors like "Type 'any' is not assignable to type 'Campaign'"

### Pitfall 2: Lure ID Mismatch Between HTML and Annotations
**What goes wrong:** Annotations don't highlight the correct text
**Why it happens:** `data-lure-id` in HTML doesn't match `lureId` in annotation object
**How to avoid:** Double-check that every `<span data-lure-id="X">` has a matching annotation with `lureId: "X"`
**Warning signs:** Lure marks appear in preview but annotations panel shows "No annotation"

### Pitfall 3: Missing Required Fields in Sample Data
**What goes wrong:** Campaign fails to load or renders with errors
**Why it happens:** Forgetting required fields like `createdAt`, `id`, or `annotationNumber`
**How to avoid:** Use TypeScript types to validate sample data structure before writing JSON
**Warning signs:** Console errors like "Cannot read property 'metadata' of undefined"

### Pitfall 4: Stale Closure in State Updates
**What goes wrong:** Sample campaign loads but doesn't appear in UI
**Why it happens:** Using stale `campaigns` state from closure instead of fresh data
**How to avoid:** Follow pattern in `useCampaigns.ts` line 92: call `loadCampaigns()` for fresh data before updates
**Warning signs:** Campaign loads successfully (no errors) but doesn't show in list

### Pitfall 5: Overwriting User's Sample Campaign Edits
**What goes wrong:** User loads sample, edits it, then clicks "Load Sample" again and loses work
**Why it happens:** Loading sample creates duplicate or overwrites existing
**How to avoid:** Check if sample campaign exists before loading (Pattern 2 above)
**Warning signs:** User complaints about lost work

## Code Examples

Verified patterns from existing codebase:

### Loading Sample Campaign
```typescript
// Source: Based on CampaignManager.tsx lines 86-121
import { SAMPLE_CAMPAIGN } from '../../data/sampleCampaign';
import { useCampaigns } from '../../hooks/useCampaigns';

export function CampaignManager() {
  const { campaigns, addCampaign } = useCampaigns();

  const handleLoadSample = () => {
    // Prevent duplicate loads
    const existing = campaigns.find(c =>
      c.name === SAMPLE_CAMPAIGN.name ||
      c.name.includes('Sample Campaign')
    );

    if (existing) {
      alert('Sample campaign already loaded. Edit the existing one or delete it first.');
      return;
    }

    // Use existing addCampaign function
    addCampaign({
      name: SAMPLE_CAMPAIGN.name,
      description: SAMPLE_CAMPAIGN.description,
      campaignPhishes: SAMPLE_CAMPAIGN.campaignPhishes,
    });
  };

  return (
    <button onClick={handleLoadSample}>
      Load Sample Campaign
    </button>
  );
}
```

### Sample Campaign JSON Structure
```json
{
  "id": "sample-campaign-001",
  "name": "Sample Campaign (Demo)",
  "description": "Example phishing emails to explore Phish Monger's annotation and campaign features. This demonstrates urgency, authority, and technical spoofing techniques.",
  "createdAt": "2026-01-23T10:00:00.000Z",
  "campaignPhishes": [
    {
      "id": "sample-phish-001",
      "metadata": {
        "title": "Urgent Account Verification",
        "author": "Phish Monger Team",
        "createdAt": "2026-01-23T10:00:00.000Z"
      },
      "htmlSource": "<div>...</div>",
      "annotations": {
        "lure-1": {
          "lureId": "lure-1",
          "techniqueId": "T1566.002",
          "persuasionPrincipleId": "CIAL-02",
          "title": "Urgency Timeline",
          "explanation": "Creates false urgency with '24 hours' deadline to pressure user into acting without thinking.",
          "createdAt": "2026-01-23T10:00:00.000Z",
          "annotationNumber": 1
        }
      },
      "scoring": {
        "visualCues": 2,
        "languageCues": 1,
        "premiseAlignment": 4
      },
      "inputMode": "richtext",
      "scheduledDate": "2026-03-15"
    }
  ]
}
```

### Annotation with Technique and Persuasion References
```typescript
// Source: src/types/annotations.ts
{
  "lureId": "lure-1",                      // Matches data-lure-id in HTML
  "techniqueId": "T1566.002",              // Spearphishing Link
  "persuasionPrincipleId": "CIAL-02",      // Urgency / Scarcity
  "title": "Urgency Timeline",             // Optional freetext title
  "explanation": "Creates false urgency...", // User-written explanation
  "createdAt": "2026-01-23T10:00:00.000Z",
  "annotationNumber": 1,                   // Display order (1-based)
  "manualY": 150                           // Optional: manual position
}
```

**Valid technique IDs** (from `src/data/techniques.json`):
- `T1566.001` - Spearphishing Attachment
- `T1566.002` - Spearphishing Link
- `T1566.003` - Spearphishing via Service
- `T1036.005` - Masquerading: Match Legitimate Name
- `T1598` - Phishing for Information (BEC)
- And 6 more...

**Valid persuasion principle IDs** (from `src/data/persuasion.json`):
- `CIAL-01` - Authority
- `CIAL-02` - Urgency / Scarcity
- `CIAL-03` - Social Proof / Consensus
- `CIAL-04` - Liking / Similarity
- `CIAL-05` - Reciprocity
- `CIAL-06` - Consistency / Commitment
- `CIAL-07` - Fear / Curiosity

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Hardcoded demo data in component | Static JSON imports | React era | Better separation of concerns |
| Runtime data generation | Pre-built static files | Always | Faster load, better type safety |
| localStorage seeding | Explicit user action | This phase | User control, no forced data |

**Current best practices (2026):**
- **Static data as JSON:** Store sample data as JSON files, import with Vite's native JSON handling
- **Type-safe imports:** Use TypeScript `as Type` assertion for imported JSON
- **Explicit loading:** Don't auto-load demo data; let users choose (better UX)
- **Duplicate prevention:** Check for existing data before loading (Pattern 2)

**Deprecated/outdated:**
- **Seeding localStorage on app init:** Old pattern that overwrites user data
- **Generating sample data in code:** Harder to maintain, no type safety
- **One-time demo flags:** Unnecessary complexity; just check if data exists

## Open Questions

None resolved. All technical questions answered through codebase analysis and type system verification.

## Sample Content Recommendations

Based on CONTEXT.md decisions and phishing training best practices:

### Phishing Techniques to Showcase
Per Claude's discretion, these techniques align with common phishing patterns and available MITRE IDs:

1. **Urgency + Authority** (T1566.002 + CIAL-01, CIAL-02)
   - IT Support requesting immediate password reset
   - Demonstrates time pressure and impersonation

2. **Masquerading + Link** (T1036.005 + T1204.001 + CIAL-01)
   - Fake CEO email with lookalike domain
   - Demonstrates display name spoofing and malicious links

3. **Document Sharing + Service** (T1566.003 + CIAL-01)
   - Fake SharePoint/DocuSign email
   - Demonstrates third-party service impersonation

4. **BEC + Urgency** (T1598 + CIAL-02, CIAL-05)
   - Fake invoice with "refund available"
   - Demonstrates reciprocity and financial urgency

### Email Characteristics (per CONTEXT.md)
- **Length:** Brief (2-3 sentences, focused on lure)
- **Annotations:** 1-2 per phish (light, not overwhelming)
- **Tone:** Casual, friendly, educational
- **Theme:** Loosely related (workplace security scenario)

### Campaign Metadata
- **Name:** "Sample Campaign (Demo)" or similar
- **Description:** 1 sentence explaining what features it demonstrates
- **Phish count:** 3-4 phishes
- **Scheduled dates:** Optional (can include for demo purposes)

## Sources

### Primary (HIGH confidence)
- **Existing codebase:** Complete analysis of Campaign, Phish, Annotation types
  - `src/types/campaign.ts` - Campaign data structure
  - `src/types/phish.ts` - Phish data structure
  - `src/types/annotations.ts` - Annotation data structure
  - `src/hooks/useCampaigns.ts` - Campaign CRUD operations
  - `src/components/campaign/CampaignManager.tsx` - Existing import/export pattern
  - `src/utils/storage.ts` - localStorage utilities
  - `src/data/techniques.json` - MITRE ATT&CK techniques
  - `src/data/persuasion.json` - Cialdini persuasion principles
- **Vite documentation:** JSON imports are natively supported
- **React 18 documentation:** Component patterns and hooks

### Secondary (MEDIUM confidence)
- [33 React JS Best Practices For 2026](https://technostacks.com/blog/react-best-practices/) - General React patterns (2025-01-08)
- [React.js Best Practices In 2026](https://builder.aws.com/content/35mjuFWn4hSGCK1JjaZHFIGrzPG/reactjs-best-practices-in-2026) - React compiler and patterns (2025-11-21)
- [How to Use localStorage in JavaScript](https://strapi.io/blog/how-to-use-localstorage-in-javascript) - localStorage patterns (2025-05-28)
- [Client-side storage - MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Client-side_APIs/Client-side_storage) - Authoritative storage guide (2025-10-30)

### Tertiary (LOW confidence - phishing technique inspiration)
- [The 14 Phishing Red Flags Your Users Need to Know (2026)](https://hoxhunt.com/blog/phishing-red-flags) - Urgency and unusual requests (2025-10-24)
- [Phishing emails: the signs to look out for in 2026](https://www.acevo.org.uk/2026/01/phishing-emails-the-signs-to-look-out-for-in-2026/) - Urgent language and unexpected requests (2026-01-21)
- [19 Most Common Types of Phishing Attacks in 2026](https://www.upguard.com/blog/types-of-phishing-attacks) - Comprehensive phishing types
- [50 Security Awareness Training Topics for 2026](https://keepnetlabs.com/blog/security-awareness-training-topics) - Training topic ideas (2026-01-06)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All verified from existing codebase (package.json, source files)
- Architecture: HIGH - Patterns extracted from working code (CampaignManager, useCampaigns)
- Pitfalls: HIGH - Based on real bugs and patterns in existing codebase
- Sample content: LOW - WebSearch sources provide inspiration but not verified for this specific use case

**Research date:** 2026-01-23
**Valid until:** 30 days (domain is stable - React 18, localStorage patterns are mature)

**Key verification:**
- All type definitions verified from actual source files
- All storage patterns verified from working code
- lure mark HTML structure verified from LureMark extension
- CSS styling verified from index.css
- No assumptions made about library capabilities (only used what exists)
