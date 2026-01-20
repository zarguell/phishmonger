import DOMPurify from 'dompurify'

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      // Text formatting
      'p', 'b', 'i', 'u', 'strong', 'em', 'span', 'div',
      // Links
      'a',
      // Lists
      'ul', 'ol', 'li',
      // Headings
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      // Tables (preserves email layout)
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
      // Block elements
      'br', 'hr',
      // Inline
      'sub', 'sup',
    ],
    ALLOWED_ATTR: [
      // Links
      'href', 'target', 'rel',
      // Spans and divs (for inline styles)
      'style', 'class',
      // Tables
      'colspan', 'rowspan', 'align', 'valign',
      // Lure Mark attribute
      'data-lure-id',
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,

    // Strip dangerous elements and events
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
    FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover', 'onmouseout', 'onfocus', 'onblur'],
  })
}
