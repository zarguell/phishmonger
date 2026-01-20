import type { Annotation } from '../../types/annotations'

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
      {/* Annotation cards will be rendered in Plan 03 */}
      {Object.values(annotations).map(annotation => (
        <div key={annotation.lureId} className="annotation-card-placeholder">
          {annotation.techniqueId}
        </div>
      ))}
    </div>
  )
}