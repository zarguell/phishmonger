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

    try {
      // First, try simple surroundContents (single element)
      const span = document.createElement('span')
      span.setAttribute('data-lure-id', lureId)
      span.className = 'lure-mark'
      span.style.backgroundColor = '#fff3cd'
      span.style.borderBottom = '2px solid #ffc107'
      span.style.padding = '2px 4px'
      span.style.borderRadius = '2px'

      range.surroundContents(span)

      // Get updated HTML from preview pane
      const updatedHtml = previewRef.current?.innerHTML
      if (updatedHtml && onUpdate) {
        onUpdate(updatedHtml)
      }

      // Clear selection
      selection.removeAllRanges()
    } catch (error) {
      // Selection crosses element boundaries - use cross-element wrapping
      wrapRangeWithLure(range, lureId)
    }
  }

  /**
   * Wraps a text selection with a lure span, handling cross-element selections.
   * Uses DOM TreeWalker to find all text nodes within the range.
   */
  const wrapRangeWithLure = (range: Range, lureId: string) => {
    if (!previewRef.current) return

    // Create span element with data-lure-id
    const span = document.createElement('span')
    span.setAttribute('data-lure-id', lureId)
    span.className = 'lure-mark'
    span.style.backgroundColor = '#fff3cd'
    span.style.borderBottom = '2px solid #ffc107'
    span.style.padding = '2px 4px'
    span.style.borderRadius = '2px'

    // Create a TreeWalker to find all text nodes within the range
    const walker = document.createTreeWalker(
      previewRef.current,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          // Only accept text nodes that intersect with the selection range
          if (range.intersectsNode(node)) {
            return NodeFilter.FILTER_ACCEPT
          }
          return NodeFilter.FILTER_REJECT
        },
      }
    )

    const textNodesToWrap: { node: Text; startOffset?: number; endOffset?: number }[] = []
    let currentNode: Text | null = walker.currentNode as Text

    // Collect all text nodes that intersect with the range
    while (currentNode) {
      const nodeRange = document.createRange()
      nodeRange.selectNodeContents(currentNode)

      // Check if this node is fully selected or partially selected
      const isFullySelected =
        range.startContainer === currentNode &&
        range.endContainer === currentNode &&
        range.startOffset === 0 &&
        range.endOffset === currentNode.length

      const isStartNode = range.startContainer === currentNode
      const isEndNode = range.endContainer === currentNode

      if (isFullySelected) {
        textNodesToWrap.push({ node: currentNode })
      } else if (isStartNode) {
        textNodesToWrap.push({
          node: currentNode,
          startOffset: range.startOffset,
        })
      } else if (isEndNode) {
        textNodesToWrap.push({
          node: currentNode,
          endOffset: range.endOffset,
        })
      } else if (
        nodeRange.compareBoundaryPoints(Range.START_TO_START, range) >= 0 &&
        nodeRange.compareBoundaryPoints(Range.END_TO_END, range) <= 0
      ) {
        // Node is completely within range (but not start/end nodes)
        textNodesToWrap.push({ node: currentNode })
      }

      currentNode = walker.nextNode() as Text
    }

    // Wrap each text node (or partial text node)
    textNodesToWrap.forEach(({ node, startOffset, endOffset }) => {
      if (startOffset !== undefined || endOffset !== undefined) {
        // Partial text node selection - need to split
        const splitBefore = startOffset !== undefined ? startOffset : 0
        const splitAfter = endOffset !== undefined ? endOffset : node.length

        if (splitBefore > 0) {
          node.splitText(splitBefore)
        }

        const targetNode = splitBefore > 0 ? node.nextSibling : node

        if (!targetNode) return

        // Split the text node at the end offset if needed
        if ((splitAfter - splitBefore) < (targetNode as Text).length) {
          (targetNode as Text).splitText(splitAfter - splitBefore)
        }

        // Wrap the target portion
        const wrapper = span.cloneNode(true) as HTMLSpanElement
        targetNode.parentNode?.insertBefore(wrapper, targetNode)
        wrapper.appendChild(targetNode)
      } else {
        // Full text node - wrap it entirely
        const wrapper = span.cloneNode(true) as HTMLSpanElement
        node.parentNode?.insertBefore(wrapper, node)
        wrapper.appendChild(node)
      }
    })

    // Get updated HTML from preview pane
    const updatedHtml = previewRef.current.innerHTML
    if (updatedHtml && onUpdate) {
      onUpdate(updatedHtml)
    }

    // Clear selection
    window.getSelection()?.removeAllRanges()
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
