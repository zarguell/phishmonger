import type { Annotation, Technique } from '../../types/annotations'
import techniques from '../../data/techniques.json' with { type: 'json' }
import persuasionPrinciples from '../../data/persuasion.json' with { type: 'json' }

interface AnnotationCardProps {
  annotation: Annotation
  annotationNumber?: number
}

function getTechniqueName(id: string): string {
  const technique = (techniques as Technique[]).find((t: Technique) => t.id === id)
  return technique ? `${id} - ${technique.name}` : id
}

function getPersuasionName(id: string): string {
  const principle = persuasionPrinciples.find((p: any) => p.id === id)
  return principle?.name || id
}

export function AnnotationCard({
  annotation,
}: AnnotationCardProps) {
  return (
    <div
      className="annotation-card"
      data-card-id={annotation.lureId}
    >
      {annotation.title && (
        <div className="annotation-title">
          {annotation.title}
        </div>
      )}
      <div className="annotation-tags">
        {annotation.techniqueId && (
          <span className="mitre-tag">
            ({getTechniqueName(annotation.techniqueId)})
          </span>
        )}
        {annotation.persuasionPrincipleId && (
          <span className="persuasion-tag">
            (Persuasion: {getPersuasionName(annotation.persuasionPrincipleId)})
          </span>
        )}
      </div>
      <div className="annotation-description">
        {annotation.explanation}
      </div>
    </div>
  )
}