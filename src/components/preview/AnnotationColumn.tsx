import type { Annotation } from '../../types/annotations'
import { AnnotationCard } from '../annotation/AnnotationCard'

interface AnnotationColumnProps {
  annotations: Record<string, Annotation>
  arrowStyle?: string
  showTags?: boolean
}

export function AnnotationColumn({ annotations, arrowStyle = 'classic', showTags = true }: AnnotationColumnProps) {
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

  // Sort by manualY first, then createdAt
  const sortedAnnotations = Object.values(annotations).sort((a, b) => {
    const aY = a.manualY ?? Infinity
    const bY = b.manualY ?? Infinity

    if (aY !== Infinity && bY !== Infinity) {
      return aY - bY
    }

    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  })

  return (
    <div className="annotation-column">
      {sortedAnnotations.map((annotation, index) => (
        <AnnotationCard
          key={annotation.lureId}
          annotation={annotation}
          annotationNumber={index + 1}
          arrowStyle={arrowStyle}
          showTags={showTags}
        />
      ))}
    </div>
  )
}