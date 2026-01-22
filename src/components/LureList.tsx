import { useEffect, useState } from 'react'
import { AnnotationPanel } from './AnnotationPanel'
import type { Annotation } from '../types/annotations'

interface Lure {
  id: string
  text: string
}

interface LureListProps {
  htmlSource: string
  onRemoveLure: (lureId: string) => void
  annotations: Record<string, Annotation>
  onUpdateAnnotation: (lureId: string, updates: Partial<Annotation>) => void
}

export function LureList({ htmlSource, onRemoveLure, annotations, onUpdateAnnotation }: LureListProps) {
  const [lures, setLures] = useState<Lure[]>([])
  const [expandedLureId, setExpandedLureId] = useState<string | null>(null)

  useEffect(() => {
    // Parse HTML source to extract all data-lure-id attributes
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlSource, 'text/html')
    const lureElements = doc.querySelectorAll('[data-lure-id]')

    // Group text by lure ID to combine spans with same UUID
    const lureMap = new Map<string, string>()
    lureElements.forEach((el) => {
      const lureId = el.getAttribute('data-lure-id')
      const text = el.textContent || ''
      if (lureId) {
        const existingText = lureMap.get(lureId) || ''
        lureMap.set(lureId, existingText + text)
      }
    })

    // Convert map to array
    const extractedLures: Lure[] = Array.from(lureMap.entries())
      .map(([id, text]) => ({ id, text }))

    setLures(extractedLures)
  }, [htmlSource])

  const scrollToLure = (lureId: string) => {
    const lureElement = document.querySelector(`[data-lure-id="${lureId}"]`)
    if (lureElement) {
      lureElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      // Flash highlight
      lureElement.classList.add('lure-flash')
      setTimeout(() => {
        lureElement.classList.remove('lure-flash')
      }, 1000)
    }
  }

  const removeLure = (lureId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    onRemoveLure(lureId)
  }

  return (
    <div className="lure-list">
      <h2>Lures ({lures.length})</h2>
      {lures.length === 0 ? (
        <p className="lure-list-empty">No lures marked yet. Select text in Preview and click "Mark Lure".</p>
      ) : (
        <ul className="lure-list-items">
          {lures.map((lure) => (
            <li key={lure.id} className="lure-list-item">
              <div className="lure-list-item-content">
                <button
                  onClick={() => scrollToLure(lure.id)}
                  className="lure-list-btn"
                  type="button"
                >
                  <span className="lure-id">{lure.id.slice(0, 8)}</span>
                  <span className="lure-text">
                    {annotations[lure.id]?.title
                      ? (annotations[lure.id].title!.length > 50
                          ? annotations[lure.id].title!.slice(0, 50) + '...'
                          : annotations[lure.id].title!)
                      : annotations[lure.id]?.explanation
                        ? (annotations[lure.id].explanation.length > 100
                            ? annotations[lure.id].explanation.slice(0, 100) + '...'
                            : annotations[lure.id].explanation)
                        : lure.text}
                  </span>
                </button>
                <button
                  onClick={() => setExpandedLureId(expandedLureId === lure.id ? null : lure.id)}
                  className="annotation-toggle"
                  type="button"
                  aria-label={expandedLureId === lure.id ? "Collapse annotation" : "Expand annotation"}
                  title={expandedLureId === lure.id ? "Collapse annotation" : "Expand annotation"}
                >
                  {expandedLureId === lure.id ? '▼' : '▶'}
                </button>
                <button
                  onClick={(e) => removeLure(lure.id, e)}
                  className="lure-remove-btn"
                  type="button"
                  aria-label="Remove lure"
                  title="Remove this lure"
                >
                  ×
                </button>
              </div>
              {expandedLureId === lure.id && (
                <AnnotationPanel
                  lureId={lure.id}
                  lureText={lure.text}
                  annotation={annotations[lure.id]}
                  onUpdate={(updates) => onUpdateAnnotation(lure.id, updates)}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
