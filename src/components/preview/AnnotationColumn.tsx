import type { Annotation } from '../../types/annotations'
import { AnnotationCard } from '../annotation/AnnotationCard'

interface AnnotationColumnProps {
  annotations: Record<string, Annotation>
}

export function AnnotationColumn({ annotations }: AnnotationColumnProps) {
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
      {Object.values(annotations).map((annotation) => (
        <AnnotationCard
          key={annotation.lureId}
          annotation={annotation}
        />
      ))}
    </div>
  )
}