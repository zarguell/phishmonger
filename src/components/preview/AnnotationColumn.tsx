import type { Annotation } from '../../types/annotations'
import { useCardLayout } from '../../hooks/useCardLayout'
import { AnnotationCard } from '../annotation/AnnotationCard'

interface AnnotationColumnProps {
  annotations: Record<string, Annotation>
}

export function AnnotationColumn({ annotations }: AnnotationColumnProps) {
  const cardPositions = useCardLayout(annotations)
  const hasAnnotations = Object.keys(annotations).length > 0

  if (!hasAnnotations) {
    return (
      <div className="annotation-column">
        <div className="ghost-card">
          No annotations yet. Switch to Edit Mode to highlight lures.
        </div>
      </div>
    )
  }

  return (
    <div className="annotation-column">
      {cardPositions.map((position) => {
        const annotation = annotations[position.lureId]
        if (!annotation) return null

        return (
          <AnnotationCard
            key={annotation.lureId}
            annotation={annotation}
            style={{
              position: 'absolute',
              top: position.y,
              left: '130px', // Center in 640px column: (640 - 380) / 2
              width: '380px',
            }}
          />
        )
      })}
    </div>
  )
}