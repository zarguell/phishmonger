import { useRef } from 'react'
import { sanitizeHtml } from '../utils/sanitizeHtml'

interface PreviewProps {
  htmlSource: string
  onUpdate?: (newHtml: string) => void
}

export function Preview({ htmlSource, onUpdate }: PreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null)

  const handleMarkLure = () => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)

    // Ensure selection is within preview pane
    if (!previewRef.current?.contains(range.commonAncestorContainer)) {
      alert('Please select text within the Preview pane')
      return
    }

    // Generate unique UUID for this lure
    const lureId = crypto.randomUUID()

    // Create span element with data-lure-id
    const span = document.createElement('span')
    span.setAttribute('data-lure-id', lureId)
    span.className = 'lure-mark'
    span.style.backgroundColor = '#fff3cd'
    span.style.borderBottom = '2px solid #ffc107'
    span.style.padding = '2px 4px'
    span.style.borderRadius = '2px'

    try {
      range.surroundContents(span)

      // Get updated HTML from preview pane
      const updatedHtml = previewRef.current?.innerHTML
      if (updatedHtml && onUpdate) {
        onUpdate(updatedHtml)
      }

      // Clear selection
      selection.removeAllRanges()
    } catch (error) {
      // Selection crosses element boundaries - can't use surroundContents
      alert('Please select text within a single element (not across multiple elements)')
    }
  }

  return (
    <div className="preview-container">
      <div className="preview-header">
        <h2>Preview (Victim View)</h2>
        <button
          onClick={handleMarkLure}
          className="mark-lure-btn"
          type="button"
        >
          Mark Lure
        </button>
      </div>
      <div
        ref={previewRef}
        className="preview-pane"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(htmlSource) }}
      />
    </div>
  )
}
