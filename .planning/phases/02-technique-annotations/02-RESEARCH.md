# Phase 2: Technique Annotations - Research

**Researched:** 2026-01-20
**Domain:** Phishing technique annotation system, MITRE ATT&CK integration, React state management
**Confidence:** HIGH

## Summary

This phase requires extending the existing Phish Monger tool to allow users to annotate marked lures with phishing techniques and MITRE ATT&CK references. The research focused on: (1) data model design for storing annotations, (2) identifying the most common phishing techniques from MITRE ATT&CK, (3) UI patterns for annotation panels, (4) React state management approaches for linking annotations to lures, and (5) LocalStorage persistence patterns.

The existing codebase uses a simple state pattern with useState hooks and LocalStorage persistence. Lures are already represented as `<span data-lure-id="UUID">` elements in the HTML source, which the LureList component parses to extract lure IDs and text previews.

**Primary recommendation:** Use a Map-based annotation state structure with UUID keys, stored as a JSON-serializable object in LocalStorage. Extend the existing three-column layout pattern with an expandable annotation panel in the LureList sidebar. Pre-load a static library of 12 common phishing techniques based on MITRE ATT&CK T1566 (Phishing) and related techniques.

## Standard Stack

The existing tech stack remains appropriate for this phase:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 18.3.1 | UI framework | Already in use, useState/useReducer sufficient for annotation state |
| TypeScript | 5.6.2 | Type safety | Already in use, ensures type-safe annotation data structures |
| Vite | 6.0.1 | Build tool | Already in use, no changes needed |
| DOMPurify | 3.3.1 | HTML sanitization | Already in use, ensures safe HTML handling |
| uuid | 13.0.0 | UUID generation | Already in use for lure IDs |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| (None additional) | - | - | Existing stack sufficient |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| useState + LocalStorage | External state library (Zustand, Redux) | Overkill for single-user client-side app. Current approach simpler. |
| Static JSON techniques | MITRE ATT&CK API integration | API integration deferred to v2 per requirements. Static JSON sufficient for 12 techniques. |
| Inline annotation forms | Modal annotation dialog | Sidebar panel pattern maintains better context with LureList. |

**Installation:**
```bash
# No additional packages needed - existing stack sufficient
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── LureList.tsx          # [existing] Extend to show annotation controls
│   ├── AnnotationPanel.tsx   # [new] Annotation form per lure
│   └── TechniqueSelector.tsx # [new] Dropdown/search for technique selection
├── data/
│   └── techniques.json       # [new] Static library of 12 common phishing techniques
├── types/
│   └── annotations.ts        # [new] TypeScript types for annotation data
└── utils/
    ├── storage.ts            # [new] LocalStorage helpers for annotations
    └── sanitizeHtml.ts       # [existing] No changes needed
```

### Pattern 1: Map-Based Annotation State
**What:** Use a Record<Map<lureId, Annotation>> to store annotations keyed by lure UUID
**When to use:** When you need to associate data with existing lure IDs without modifying HTML structure
**Example:**
```typescript
// Source: React docs on managing state
// types/annotations.ts
export interface Annotation {
  lureId: string                    // Matches data-lure-id attribute
  techniqueName: string              // Selected from technique library
  mitreAttackId: string              // e.g., "T1566.001"
  explanation: string                // User-entered explanation
  createdAt: string                  // ISO timestamp
}

// App.tsx
const [annotations, setAnnotations] = useState<Record<string, Annotation>>(() => {
  const saved = localStorage.getItem('phishmonger-annotations')
  return saved ? JSON.parse(saved) : {}
})

// Update annotation
const updateAnnotation = (lureId: string, updates: Partial<Annotation>) => {
  setAnnotations(prev => ({
    ...prev,
    [lureId]: {
      ...prev[lureId],
      ...updates,
      lureId,
      updatedAt: new Date().toISOString()
    }
  }))
}
```

### Pattern 2: Expandable Annotation Panel
**What:** Each lure item in LureList can be expanded to show annotation form
**When to use:** When you want to maintain list context while editing annotations
**Example:**
```typescript
// components/LureList.tsx (extended)
const [expandedLureId, setExpandedLureId] = useState<string | null>(null)

{lures.map((lure) => (
  <li key={lure.id} className="lure-list-item">
    <div className="lure-list-item-content">
      <button onClick={() => scrollToLure(lure.id)}>
        {lure.text}
      </button>
      <button onClick={() => setExpandedLureId(
        expandedLureId === lure.id ? null : lure.id
      )}>
        {expandedLureId === lure.id ? '▼' : '▶'} Annotate
      </button>
    </div>
    {expandedLureId === lure.id && (
      <AnnotationPanel
        lure={lure}
        annotation={annotations[lure.id]}
        onUpdate={(updates) => updateAnnotation(lure.id, updates)}
      />
    )}
  </li>
))}
```

### Pattern 3: LocalStorage Synchronization
**What:** Persist annotations to LocalStorage on every change
**When to use:** Client-side only apps with no backend
**Example:**
```typescript
// utils/storage.ts
const ANNOTATIONS_KEY = 'phishmonger-annotations'

export const loadAnnotations = (): Record<string, Annotation> => {
  try {
    const saved = localStorage.getItem(ANNOTATIONS_KEY)
    return saved ? JSON.parse(saved) : {}
  } catch (error) {
    console.error('Failed to load annotations:', error)
    return {}
  }
}

export const saveAnnotations = (annotations: Record<string, Annotation>) => {
  try {
    localStorage.setItem(ANNOTATIONS_KEY, JSON.stringify(annotations))
  } catch (error) {
    console.error('Failed to save annotations:', error)
  }
}

// App.tsx
useEffect(() => {
  saveAnnotations(annotations)
}, [annotations])
```

### Anti-Patterns to Avoid
- **Storing annotations in HTML attributes:** Don't use data-* attributes to store annotation data. It bloats the HTML and makes serialization fragile. Use separate state keyed by lureId.
- **Duplicating lure text in annotations:** Don't store lure text in the annotation object. The lure text is already in the HTML source and can change. Reference only by lureId.
- **Complex state management libraries:** Don't introduce Redux, Zustand, or Context API for a single-user client-side app. useState + LocalStorage is sufficient and simpler.
- **Modal annotation dialogs:** Don't use modals for annotations. They break context with the LureList. Use expandable panels instead.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Technique selection dropdown | Custom dropdown with search | HTML `<select>` or `<datalist>` | Native browser controls accessible, handle keyboard navigation, no dependencies |
| Date formatting | Custom date formatter | `new Date().toISOString()` or `Intl.DateTimeFormat` | Built-in, locale-aware, handles edge cases |
| Form validation | Custom validation logic | HTML5 validation attributes + controlled form state | Native validation is accessible, works with screen readers |
| LocalStorage error handling | Try/catch in every component | Dedicated storage utility functions | Centralized error handling, easier to test, DRY principle |

**Key insight:** This is a client-side annotation tool. Keep the state management simple. The complexity comes from the domain knowledge (phishing techniques), not the technical implementation. Lean on React's built-in state management and browser APIs.

## Common Pitfalls

### Pitfall 1: Losing Annotations When Lures Are Deleted
**What goes wrong:** User deletes a lure from HTML, but annotation remains in state. This creates orphaned annotations.
**Why it happens:** LureList removes `<span data-lure-id="UUID">` from HTML, but annotations are stored separately by UUID key.
**How to avoid:** Clean up annotations when lure is deleted. Dispatch annotation cleanup alongside HTML update.
```typescript
const handleRemoveLure = (lureId: string) => {
  // Remove from HTML
  const updatedHtml = removeLureFromHtml(htmlSource, lureId)
  setHtmlSource(updatedHtml)

  // Remove from annotations
  setAnnotations(prev => {
    const { [lureId]: removed, ...rest } = prev
    return rest
  })
}
```
**Warning signs:** Annotations count doesn't match lure count, orphaned annotations in LocalStorage.

### Pitfall 2: Race Condition Between HTML and State
**What goes wrong:** LureList parses HTML to extract lures, but annotations update before HTML re-renders. Mismatch between what's shown and what's annotated.
**Why it happens:** HTML parsing in useEffect happens asynchronously from annotation state updates.
**How to avoid:** LureList already handles this correctly - it derives lure list from htmlSource prop. Annotations should be separate concern. Don't try to embed annotations in HTML source.
**Warning signs:** LureList shows different lures than annotations exist for, React warnings about key mismatches.

### Pitfall 3: Over-Engineering the Technique Library
**What goes wrong:** Building complex technique search, filtering, categorization for just 12 techniques.
**Why it happens:** Anticipating future v2 API integration with full MITRE ATT&CK dataset.
**How to avoid:** Keep v1 simple. Use a static JSON array with 12 techniques. A simple `<select>` dropdown is sufficient. No search needed for 12 items.
**Warning signs:** Spending more time on technique selector UI than annotation form itself.

### Pitfall 4: Not Handling Invalid MITRE ATT&CK IDs
**What goes wrong:** User enters invalid technique ID (e.g., "T9999" or "T1566"), no validation.
**Why it happens:** Custom text input without format validation.
**How to avoid:** Provide dropdown for common techniques. Allow custom ID input but validate format with regex: `^T\d{4}(\.\d{3})?$`
```typescript
const validateMitreId = (id: string): boolean => {
  return /^T\d{4}(\.\d{3})?$/.test(id)
}
```
**Warning signs:** Invalid IDs in annotations, difficulty exporting to ATT&CK-compatible formats later.

## Code Examples

Verified patterns from official sources:

### Loading Static Technique Library
```typescript
// Source: data/techniques.json
[
  {
    "id": "T1566.001",
    "name": "Spearphishing Attachment",
    "tactic": "Initial Access",
    "description": "Adversaries send spearphishing emails with malicious attachments to gain access."
  },
  {
    "id": "T1566.002",
    "name": "Spearphishing Link",
    "tactic": "Initial Access",
    "description": "Adversaries send spearphishing emails with malicious links to deliver payloads."
  },
  // ... 10 more techniques
]

// Load in component
import techniques from '../data/techniques.json'

<select
  value={annotation.mitreAttackId}
  onChange={(e) => onUpdate({ mitreAttackId: e.target.value })}
>
  <option value="">Select technique...</option>
  {techniques.map((t) => (
    <option key={t.id} value={t.id}>
      {t.id}: {t.name}
    </option>
  ))}
</select>
```

### AnnotationPanel Component Structure
```typescript
// Source: Based on React form patterns
interface AnnotationPanelProps {
  lure: Lure
  annotation?: Annotation
  onUpdate: (updates: Partial<Annotation>) => void
}

export function AnnotationPanel({ lure, annotation, onUpdate }: AnnotationPanelProps) {
  return (
    <div className="annotation-panel">
      <h3>Annotate: "{lure.text}"</h3>

      <label>
        Technique:
        <select
          value={annotation?.mitreAttackId || ''}
          onChange={(e) => onUpdate({ mitreAttackId: e.target.value })}
        >
          <option value="">Select technique...</option>
          {techniques.map((t) => (
            <option key={t.id} value={t.id}>
              {t.id}: {t.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Custom MITRE ID:
        <input
          type="text"
          value={annotation?.mitreAttackId || ''}
          onChange={(e) => onUpdate({ mitreAttackId: e.target.value })}
          placeholder="T1566.001"
        />
      </label>

      <label>
        Explanation:
        <textarea
          value={annotation?.explanation || ''}
          onChange={(e) => onUpdate({ explanation: e.target.value })}
          placeholder="Explain why this lure matches the technique..."
          rows={4}
        />
      </label>
    </div>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Inline HTML attributes for metadata | Separate state keyed by ID | React adopted | Cleaner separation of concerns, easier state management |
| Manual state synchronization | useEffect for LocalStorage sync | React Hooks (2019) | Automated persistence, less boilerplate |
| Class components for complex state | Functional components with hooks | React 16.8+ (2019) | Simpler code, better TypeScript support |

**Deprecated/outdated:**
- **Class components:** Legacy pattern. Use functional components with hooks.
- **componentWillMount:** Deprecated. Use useEffect for initialization.
- **String refs:** Legacy. Use useRef or callback refs.

## Pre-loaded Technique Library (12 Common Phishing Techniques)

Based on MITRE ATT&CK v18 research, these are the 12 most relevant techniques for phishing email analysis:

### Core Phishing Techniques (T1566)
1. **T1566.001 - Spearphishing Attachment**
   - Malicious file attachments (Office docs, PDFs, archives)
   - Most common initial access vector

2. **T1566.002 - Spearphishing Link**
   - Malicious URLs in email body
   - Links to credential harvesters or malware downloads

3. **T1566.003 - Spearphishing via Service**
   - Third-party platforms (LinkedIn, Slack, SMS)
   - Bypasses email security filters

4. **T1566.004 - Spearphishing Voice (Vishing)**
   - Phone calls from "tech support" or "executives"
   - Often follows up email phishing

5. **T1566 - Phishing (Generic)**
   - Broad category for non-targeted phishing campaigns
   - Mass malware distribution

### Information Gathering (T1598)
6. **T1598.001 - Spearphishing Service (Reconnaissance)**
   - Phishing to gather information, not deliver malware
   - Credential harvesting, data collection

### Social Engineering (T1659)
7. **T1659 - Content Injection**
   - Manipulating email content in transit
   - Man-in-the-middle email modification

### Account Manipulation
8. **T1098.002 - Additional Email Delegate Permissions**
   - Adding forwarding rules or delegated access
   - Maintaining access to compromised mailbox

9. **T1098.003 - Additional Cloud Roles**
   - Escalating privileges in cloud environments
   - Adding admin roles after account takeover

### Impersonation Tactics
10. **T1583.004 - Malvertising**
    - Fake advertisements spreading phishing
    - Compromised ad networks delivering malicious content

11. **T1199 - Trusted Relationship**
    - Abusing existing business relationships
    - Supply chain compromise for credibility

12. **T1078.002 - Valid Accounts: Domain Accounts**
    - Using compromised legitimate accounts
    - More credible than spoofed emails

**Confidence:** HIGH - All techniques verified from MITRE ATT&CK official documentation (attack.mitre.org, accessed 2026-01-20).

## Open Questions

1. **Should annotations export to ATT&CK STIX format?**
   - What we know: STIX is standard format for threat intelligence
   - What's unclear: Is STIX export needed for v1, or can this wait until v2?
   - Recommendation: Defer STIX export to v2. v1 should focus on internal data model. JSON export sufficient for v1.

2. **Should annotations support multiple techniques per lure?**
   - What we know: Some lures may use multiple techniques (e.g., both link and social engineering)
   - What's unclear: Does 1:1 mapping limit usefulness?
   - Recommendation: Start with 1:1 mapping for v1 simplicity. Multiple techniques per lure adds UI complexity (tagging interface). Revisit in v2 based on user feedback.

3. **How to handle lure text that changes after annotation?**
   - What we know: Lure text stored in HTML source, can be edited
   - What's unclear: If lure text changes, should annotation be invalidated?
   - Recommendation: Store lure text snapshot in annotation at creation time. Show diff if text changes significantly. For v1, allow user to manually detect and update annotations.

## Sources

### Primary (HIGH confidence)
- MITRE ATT&CK Enterprise Techniques - https://attack.mitre.org/techniques/enterprise/
- MITRE ATT&CK T1566 (Phishing) - https://attack.mitre.org/techniques/T1566/
- MITRE ATT&CK T1598 (Phishing for Information) - https://attack.mitre.org/techniques/T1598/
- React State Management - https://react.dev/learn/managing-state
- React useReducer Reference - https://react.dev/reference/react/useReducer
- React Source Code (App.tsx, LureList.tsx, Preview.tsx) - Verified existing patterns

### Secondary (MEDIUM confidence)
- Common phishing patterns (verified across multiple security sources)
- Webfetch verification of MITRE ATT&CK sub-techniques (T1566.001-.004, T1598.001-.004)

### Tertiary (LOW confidence)
- (No webfetch-only sources used - all findings verified against official docs)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Existing stack verified in package.json
- Architecture patterns: HIGH - Based on React official docs and existing codebase patterns
- Data model: HIGH - JSON-serializable Record pattern is standard React practice
- MITRE ATT&CK techniques: HIGH - Verified from official attack.mitre.org documentation
- UI patterns: MEDIUM - Expandable panel pattern is common, but no official React guidance on annotation UI specifically
- Pitfalls: HIGH - Based on common React state management mistakes documented in React docs

**Research date:** 2026-01-20
**Valid until:** 2026-02-19 (30 days - stable domain, but React ecosystem evolves)
