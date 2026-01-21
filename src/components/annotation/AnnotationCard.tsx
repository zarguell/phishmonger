import type { Annotation, Technique } from '../../types/annotations'
import techniques from '../../data/techniques.json' with { type: 'json' }

interface AnnotationCardProps {
  annotation: Annotation
  annotationNumber?: number
}

export function AnnotationCard({
  annotation,
  annotationNumber,
}: AnnotationCardProps) {
  // Find technique name from techniques.json
  const technique = (techniques as Technique[]).find((t: Technique) => t.id === annotation.techniqueId)
  const techniqueName = technique?.name || annotation.techniqueId

  return (
    <div
      className="annotation-card"
      data-card-id={annotation.lureId}
    >
      <div className="annotation-card-header">
        {annotationNumber && (
          <span className="annotation-card-number-badge">
            {annotationNumber}
          </span>
        )}
        <h3 className="annotation-card-title">
          {techniqueName}
        </h3>
      </div>
      <span className="annotation-card-badge">
        {annotation.techniqueId}
      </span>
      <p className="annotation-card-explanation">
        {annotation.explanation}
      </p>
    </div>
  )
}