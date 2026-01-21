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

  // Sort annotations by createdAt for sequential numbering
  const sortedAnnotations = Object.values(annotations).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )

  return (
    <div className="annotation-column">
      {sortedAnnotations.map((annotation, index) => (
        <AnnotationCard
          key={annotation.lureId}
          annotation={annotation}
          annotationNumber={index + 1}
        />
      ))}
    </div>
  )
}