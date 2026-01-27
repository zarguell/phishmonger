/**
 * Clean HTML export utilities for Phish Monger
 *
 * Strips lure marks and annotation UI artifacts from email HTML,
 * provides file download and clipboard copy functionality.
 */

/**
 * Unwrap elements matching selector from HTML string, preserving their content
 * Uses DOMParser for reliable HTML manipulation
 * Removes the element wrapper but keeps all child nodes/text content intact
 *
 * @param htmlString - HTML source to clean
 * @param selector - CSS selector for elements to unwrap
 * @returns Cleaned HTML string with elements unwrapped
 */
function unwrapElementsFromHTML(htmlString: string, selector: string): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlString, 'text/html')

  const elements = Array.from(doc.querySelectorAll(selector))
  elements.forEach(element => {
    const parent = element.parentNode
    if (parent) {
      while (element.firstChild) {
        parent.insertBefore(element.firstChild, element)
      }
      parent.removeChild(element)
    }
  })

  return doc.body.innerHTML
}

/**
 * Strip all lure mark spans from email HTML
 * Unwraps: <span data-lure-id="..." class="lure-mark">...</span>
 * Preserves the text content inside the lure mark spans
 *
 * @param htmlString - HTML source with lure marks
 * @returns HTML with lure marks unwrapped (text preserved)
 */
export function stripLureMarks(htmlString: string): string {
  return unwrapElementsFromHTML(htmlString, '[data-lure-id]')
}

/**
 * Strip annotation badge spans from email HTML
 * Removes: <span class="lure-badge" data-annotation-number="...">N</span>
 * These are added by EmailColumn for display, not in source htmlSource
 *
 * @param htmlString - HTML source with annotation badges
 * @returns HTML with annotation badges removed
 */
export function stripAnnotationBadges(htmlString: string): string {
  return unwrapElementsFromHTML(htmlString, '[data-annotation-number]')
}

/**
 * Generate clean email HTML with all UI artifacts removed
 * Preserves email structure, tables, styles, links
 * Removes only lure marks and annotation badges
 *
 * @param htmlSource - Original email HTML source
 * @returns Clean HTML with all annotations removed
 */
export function generateCleanHtml(htmlSource: string): string {
  let clean = htmlSource

  // Remove lure marks (primary goal)
  clean = stripLureMarks(clean)

  // Remove annotation badges (defensive cleanup)
  clean = stripAnnotationBadges(clean)

  return clean
}

/**
 * Generate safe filename for export
 * Format: {sanitized-title}.html or 'untitled.html'
 *
 * @param projectTitle - Optional phish title for filename
 * @returns Sanitized filename with .html extension
 */
export function generateCleanHtmlFilename(projectTitle?: string): string {
  const sanitizedTitle = projectTitle
    ? projectTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    : 'untitled'
  return `${sanitizedTitle}.html`
}

/**
 * Download clean HTML as file
 * Follows existing export pattern from icalExport.ts
 *
 * @param htmlSource - Original email HTML source
 * @param filename - Filename for download (should include .html extension)
 */
export function downloadCleanHtml(htmlSource: string, filename: string): void {
  const cleanHtml = generateCleanHtml(htmlSource)

  // Create blob with proper MIME type
  const blob = new Blob([cleanHtml], { type: 'text/html; charset=utf-8' })
  const url = URL.createObjectURL(blob)

  // Trigger download using temporary anchor element
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Clean up memory
  URL.revokeObjectURL(url)
}

/**
 * Copy clean HTML to clipboard
 * Uses modern async Navigator Clipboard API
 * Follows existing pattern from ReadOnlyEditor.tsx
 *
 * @param htmlSource - Original email HTML source
 * @throws Error if clipboard access is denied or unavailable
 */
export async function copyCleanHtmlToClipboard(htmlSource: string): Promise<void> {
  const cleanHtml = generateCleanHtml(htmlSource)

  try {
    await navigator.clipboard.writeText(cleanHtml)
  } catch (error) {
    console.error('Failed to copy HTML to clipboard:', error)
    throw new Error('Clipboard access denied or not available')
  }
}
