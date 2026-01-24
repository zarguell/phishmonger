# Phase 18: Clean HTML Export - Research

**Researched:** 2026-01-24
**Domain:** HTML sanitization, browser clipboard API, file download patterns
**Confidence:** HIGH

## Summary

This phase requires exporting clean email HTML from the carousel view by stripping all lure mark annotations (`<span data-lure-id>` elements with `.lure-mark` class) and their associated badge elements (`.lure-badge` with `data-annotation-number`). The implementation must preserve the original email content while removing UI artifacts, providing both file download and clipboard copy options without mutating the source phish data.

The standard approach for HTML manipulation in browser applications is using the native **DOMParser API** to parse HTML strings into DOM nodes, remove unwanted elements via CSS selectors or attribute queries, then serialize back to HTML using `element.innerHTML`. For downloads, follow the existing URL.createObjectURL pattern used in Phase 10 (CampaignManager JSON export) and Phase 11 (iCal export). For clipboard operations, use the modern **Navigator Clipboard API** (`navigator.clipboard.writeText()`) already present in ReadOnlyEditor.

The key challenge is ensuring the clean HTML renders correctly in email clients and browsers while preserving the original email structure (tables, inline styles, links). The sanitization must be thorough—removing ALL lure marks and badges—but conservative, preserving all legitimate email content.

**Primary recommendation:** Create a dedicated `cleanHtmlExport.ts` utility with `stripLureMarks()` and `stripAnnotationBadges()` functions using DOMParser, integrate export UI into ReadOnlyEditor header, follow existing download/clipboard patterns from Phase 10-11.

## Standard Stack

The established APIs and patterns for HTML export in browser applications:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| **DOMParser** | Native browser API | Parse HTML strings into modifiable DOM | Built-in, no dependencies, already used in EmailColumn.tsx, reliable cross-browser |
| **Navigator Clipboard API** | Native browser API | Copy text to clipboard | Modern async API, already used in ReadOnlyEditor.tsx line 31, better UX than execCommand |
| **URL.createObjectURL** | Native browser API | Trigger file downloads from generated content | Already used in Phase 10-11, standard pattern for client-side file downloads |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **Blob API** | Native browser API | Create downloadable file objects | Required for URL.createObjectURL downloads |
| **crypto.randomUUID()** | Native | Generate unique filenames | Prevent filename collisions when exporting multiple emails |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| DOMParser | String regex replacement | Regex is brittle for HTML (nested tags, edge cases). DOMParser properly handles HTML structure |
| DOMParser | jsdom library | Unnecessary dependency for browser env, DOMParser is native and sufficient |
| Navigator Clipboard API | document.execCommand('copy') | Deprecated, synchronous, poor permissions handling. Use modern async API |
| Native approach | Turndown service (HTML→Markdown) | Changes format, not requested. Requirement specifies HTML export |

**Installation:**
```bash
# No new packages required - all native browser APIs
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── utils/
│   └── cleanHtmlExport.ts   # New: HTML cleaning and export utilities
├── components/
│   └── campaign/
│       ├── ReadOnlyEditor.tsx  # Modify: Add export buttons to header
│       └── CampaignCarouselModal.tsx  # No changes needed (carousel delegates to ReadOnlyEditor)
└── types/
    └── phish.ts  # Existing: Phish type with htmlSource field
```

### Pattern 1: HTML Cleaning Utility Module
**What:** Create a dedicated utility for stripping lure marks and badges from HTML
**When to use:** Decoupling sanitization logic enables testing, reuse, and clear separation of concerns
**Example:**
```typescript
// Source: Based on existing EmailColumn.tsx DOMParser pattern (lines 14-58)
// and browser DOM manipulation best practices

/**
 * Parse HTML string, remove elements matching selector, return cleaned HTML
 */
function removeElementsFromHTML(htmlString: string, selector: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  // Select and remove all matching elements
  const elements = doc.querySelectorAll(selector);
  elements.forEach(element => element.remove());

  return doc.body.innerHTML;
}

/**
 * Strip lure mark spans from email HTML
 * Removes: <span data-lure-id="..." class="lure-mark">...</span>
 */
export function stripLureMarks(htmlString: string): string {
  return removeElementsFromHTML(htmlString, '[data-lure-id]');
}

/**
 * Strip annotation badge spans from email HTML
 * Removes: <span class="lure-badge" data-annotation-number="...">1</span>
 * Note: These are added dynamically by EmailColumn, not in source htmlSource,
 * but this function ensures complete cleanup if present
 */
export function stripAnnotationBadges(htmlString: string): string {
  return removeElementsFromHTML(htmlString, '[data-annotation-number]');
}

/**
 * Generate clean email HTML with all UI artifacts removed
 * Removes lure marks and annotation badges, preserves email content
 */
export function generateCleanHtml(htmlSource: string): string {
  let clean = htmlSource;

  // Remove lure marks (span[data-lure-id].lure-mark)
  clean = stripLureMarks(clean);

  // Remove annotation badges (span.lure-badge[data-annotation-number])
  clean = stripAnnotationBadges(clean);

  return clean;
}
```

### Pattern 2: File Download with Blob API
**What:** Generate downloadable HTML file using URL.createObjectURL pattern
**When to use:** User requests file download from export button
**Example:**
```typescript
// Source: Based on existing patterns from icalExport.ts (lines 59-78)
// and export.ts (lines 26-29)

/**
 * Trigger browser download of clean HTML file
 * Follows existing export pattern from Phase 10-11
 */
export function downloadCleanHtml(
  htmlSource: string,
  filename: string
): void {
  const cleanHtml = generateCleanHtml(htmlSource);

  // Create blob with proper MIME type
  const blob = new Blob([cleanHtml], {
    type: 'text/html; charset=utf-8'
  });
  const url = URL.createObjectURL(blob);

  // Trigger download using temporary anchor element
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up memory
  URL.revokeObjectURL(url);
}
```

### Pattern 3: Clipboard Copy with Async API
**What:** Copy clean HTML to user's clipboard using modern Clipboard API
**When to use:** User selects "Copy to Clipboard" option
**Example:**
```typescript
// Source: Based on existing ReadOnlyEditor.tsx pattern (lines 29-37)

/**
 * Copy clean HTML to clipboard
 * Uses modern async Navigator Clipboard API
 */
export async function copyCleanHtmlToClipboard(
  htmlSource: string
): Promise<void> {
  const cleanHtml = generateCleanHtml(htmlSource);

  try {
    await navigator.clipboard.writeText(cleanHtml);
  } catch (error) {
    console.error('Failed to copy HTML to clipboard:', error);
    throw new Error('Clipboard access denied or not available');
  }
}
```

### Pattern 4: Filename Generation
**What:** Generate safe, descriptive filenames for exported HTML files
**When to use:** Creating download filenames or log entries
**Example:**
```typescript
// Source: Based on existing export.ts pattern (lines 40-45)

/**
 * Generate filename for clean HTML export
 * Format: {sanitized-title}.html
 */
export function generateCleanHtmlFilename(projectTitle?: string): string {
  const sanitizedTitle = projectTitle
    ? projectTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    : 'untitled';
  return `${sanitizedTitle}.html`;
}
```

### Anti-Patterns to Avoid
- **String regex replacement for HTML:** Brittle, breaks on nested tags, malformed HTML, edge cases. Use DOMParser instead
- **Modifying source phish.htmlSource:** Violates requirement that export is derivative, not mutation. Always work with copies
- **Synchronous clipboard operations:** execCommand('copy') is deprecated. Use async navigator.clipboard API
- **Inline export logic in components:** Hard to test, reusable. Extract to utility module
- **Alert() for success feedback:** Poor UX. Use toast notifications (already imported in App.tsx from react-hotkeys-hook)

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| HTML parsing and manipulation | Custom regex or string manipulation | DOMParser API | Handles malformed HTML, nested tags, DOM structure correctly. No dependencies |
| File download triggering | Custom download logic | URL.createObjectURL + Blob pattern | Browser-standard, already used in Phase 10-11, handles large files, memory management |
| Clipboard operations | execCommand('copy') hack | navigator.clipboard.writeText() | Modern async API, better permissions, future-proof |
| Filename sanitization | Complex regex | Simple replace + lowercase | Email filenames don't need heavy sanitization, keep it simple |

**Key insight:** HTML manipulation is deceptively complex. DOMParser is a native browser API specifically designed for this use case—it's not a dependency, it's part of the platform. Use it.

## Common Pitfalls

### Pitfall 1: Modifying Source Data
**What goes wrong:** Export function directly modifies `phish.htmlSource`, permanently removing lure marks from the source
**Why it happens:** Treating export as mutation instead of derivation
**How to avoid:** Always call `generateCleanHtml(htmlSource)` with the source string, never modify the source variable directly
**Warning signs:** Export function takes `phish` object and mutates `phish.htmlSource`

### Pitfall 2: Incomplete Element Removal
**What goes wrong:** Some lure marks or badges remain in exported HTML, leaking UI artifacts
**Why it happens:** Only removing `.lure-mark` class but not `[data-lure-id]` attribute, or vice versa
**How to avoid:** Use comprehensive selectors: `[data-lure-id]` for lure marks, `[data-annotation-number]` for badges
**Warning signs:** Exported HTML shows highlighted text or numbered badges

### Pitfall 3: Breaking Email Layout
**What goes wrong:** Removing lure marks breaks email structure (e.g., `<p>text <span>lure</span> more</p>` becomes `<p>text  more</p>` with double spaces)
**Why it happens:** DOMParser removal leaves whitespace artifacts
**How to avoid:** DOMParser's `element.remove()` properly handles text nodes. Test with actual email HTML
**Warning signs:** Exported HTML has irregular spacing or broken layouts

### Pitfall 4: Clipboard Permissions Errors
**What goes wrong:** Clipboard copy fails silently or throws cryptic errors in non-secure contexts
**Why it happens:** Navigator Clipboard API requires secure context (HTTPS or localhost)
**How to avoid:** Wrap in try-catch, provide fallback or clear error message
**Warning signs:** Copy button does nothing in production HTTP environment

### Pitfall 5: Memory Leaks from Blob URLs
**What goes wrong:** Repeated exports create unreleased Blob URLs, consuming memory
**Why it happens:** Forgetting to call `URL.revokeObjectURL()` after download
**How to avoid:** Always revoke URL after download completes (see Pattern 2 example)
**Warning signs:** Memory usage increases with each export in browser DevTools

### Pitfall 6: Filename Collisions
**What goes wrong:** Multiple exports overwrite same file or user can't distinguish versions
**Why it happens:** Using static filename like `email.html` for all exports
**How to avoid:** Include phish title or timestamp in filename (follow existing export.ts pattern)
**Warning signs:** Browser asks "Replace existing file?" on every export

## Code Examples

Verified patterns from official sources:

### Complete Export Utility Module
```typescript
// File: src/utils/cleanHtmlExport.ts
// Source: Based on existing patterns in EmailColumn.tsx, icalExport.ts, export.ts

/**
 * Clean HTML export utilities for Phish Monger
 *
 * Strips lure marks and annotation UI artifacts from email HTML,
 * provides file download and clipboard copy functionality.
 */

/**
 * Remove elements matching selector from HTML string
 * Uses DOMParser for reliable HTML manipulation
 */
function removeElementsFromHTML(htmlString: string, selector: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  const elements = doc.querySelectorAll(selector);
  elements.forEach(element => element.remove());

  return doc.body.innerHTML;
}

/**
 * Strip all lure mark spans from email HTML
 * Removes: <span data-lure-id="..." class="lure-mark">...</span>
 */
export function stripLureMarks(htmlString: string): string {
  return removeElementsFromHTML(htmlString, '[data-lure-id]');
}

/**
 * Strip annotation badge spans from email HTML
 * Removes: <span class="lure-badge" data-annotation-number="...">N</span>
 * These are added by EmailColumn for display, not in source htmlSource
 */
export function stripAnnotationBadges(htmlString: string): string {
  return removeElementsFromHTML(htmlString, '[data-annotation-number]');
}

/**
 * Generate clean email HTML with all UI artifacts removed
 * Preserves email structure, tables, styles, links
 * Removes only lure marks and annotation badges
 */
export function generateCleanHtml(htmlSource: string): string {
  let clean = htmlSource;

  // Remove lure marks (primary goal)
  clean = stripLureMarks(clean);

  // Remove annotation badges (defensive cleanup)
  clean = stripAnnotationBadges(clean);

  return clean;
}

/**
 * Generate safe filename for export
 * Format: {sanitized-title}.html
 */
export function generateCleanHtmlFilename(projectTitle?: string): string {
  const sanitizedTitle = projectTitle
    ? projectTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    : 'untitled';
  return `${sanitizedTitle}.html`;
}

/**
 * Download clean HTML as file
 * Follows existing export pattern from Phase 10-11
 */
export function downloadCleanHtml(
  htmlSource: string,
  filename: string
): void {
  const cleanHtml = generateCleanHtml(htmlSource);

  const blob = new Blob([cleanHtml], {
    type: 'text/html; charset=utf-8'
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.html') ? filename : `${filename}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Copy clean HTML to clipboard
 * Uses modern async Navigator Clipboard API
 */
export async function copyCleanHtmlToClipboard(
  htmlSource: string
): Promise<void> {
  const cleanHtml = generateCleanHtml(htmlSource);

  try {
    await navigator.clipboard.writeText(cleanHtml);
  } catch (error) {
    console.error('Failed to copy HTML to clipboard:', error);
    throw new Error('Clipboard access denied or not available');
  }
}
```

### Integration in ReadOnlyEditor Component
```typescript
// File: src/components/campaign/ReadOnlyEditor.tsx
// Modify existing component (lines 29-37, 142-159)

import { downloadCleanHtml, copyCleanHtmlToClipboard, generateCleanHtmlFilename } from '../../utils/cleanHtmlExport';

// In ReadOnlyEditor component:
const handleCopyCleanHTML = async () => {
  try {
    await copyCleanHtmlToClipboard(phish.htmlSource);
    // TODO: Show toast notification (Phase 5+)
    alert('Clean HTML copied to clipboard!');
  } catch (error) {
    console.error('Failed to copy clean HTML:', error);
    alert('Failed to copy HTML to clipboard');
  }
};

const handleDownloadCleanHTML = () => {
  const filename = generateCleanHtmlFilename(phish.metadata.title);
  downloadCleanHtml(phish.htmlSource, filename);
  // TODO: Show toast notification (Phase 5+)
};

// In header JSX, add export buttons:
<div style={{ display: 'flex', gap: '8px' }}>
  <button onClick={handleCopyCleanHTML} type="button">
    Copy Clean HTML
  </button>
  <button onClick={handleDownloadCleanHTML} type="button">
    Download Clean HTML
  </button>
  {/* Keep existing "Hide Annotations" and other buttons */}
</div>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| document.execCommand('copy') | navigator.clipboard.writeText() | ~2020 | Async, better permissions, future-proof |
| String regex for HTML | DOMParser API | Always | Reliable HTML manipulation, handles edge cases |
| Synchronous XHR | URL.createObjectURL + Blob | ~2015 | Better for client-side file generation |

**Current as of:** 2026-01-24
**Browser support:** DOMParser (all), Navigator Clipboard API (Chrome 66+, Firefox 63+, Safari 13.1+)

**Deprecated/outdated:**
- document.execCommand('copy'): Deprecated, use navigator.clipboard API
- String manipulation for HTML: Always error-prone, never recommended
- Sync clipboard operations: Blocked in modern browsers, must use async

## Open Questions

None identified. All aspects of this phase are well-understood with established patterns in the codebase.

**Confidence:** HIGH - Native browser APIs, existing implementation patterns to follow, no new dependencies

## Sources

### Primary (HIGH confidence)
- **Existing codebase patterns** - Verified implementation approaches:
  - `src/utils/icalExport.ts` (lines 59-78): Download pattern with URL.createObjectURL
  - `src/utils/export.ts` (lines 26-29): Blob download trigger pattern
  - `src/components/campaign/ReadOnlyEditor.tsx` (lines 29-37): Clipboard API usage
  - `src/components/preview/EmailColumn.tsx` (lines 14-58): DOMParser HTML manipulation
  - `src/extensions/LureMark.ts` (lines 24-37): Lure mark HTML structure (`<span data-lure-id>` with `.lure-mark` class)
  - `src/index.css` (lines 120-128): Lure mark and badge styling for identification
- **MDN Web Docs** - DOMParser API: https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
- **MDN Web Docs** - Navigator Clipboard API: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/clipboard
- **MDN Web Docs** - URL.createObjectURL: https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL

### Secondary (MEDIUM confidence)
- **Email HTML best practices** - General knowledge of email client HTML rendering
- **Browser file download patterns** - Established pattern in modern web applications

### Tertiary (LOW confidence)
- None - no WebSearch-only findings

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All native browser APIs, existing codebase examples
- Architecture: HIGH - Clear utility module pattern, proven in Phase 10-11
- Pitfalls: HIGH - Well-understood domain, obvious failure modes identified
- Code examples: HIGH - Based on verified existing code patterns

**Research date:** 2026-01-24
**Valid until:** 2026-06-24 (6 months - browser APIs are stable, patterns are established)
