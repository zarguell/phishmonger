import type { Annotation, Technique } from '../../types/annotations'
import techniques from '../../data/techniques.json' with { type: 'json' }
import persuasionPrinciples from '../../data/persuasion.json' with { type: 'json' }
import styles from '../../styles/arrows.module.css'

interface AnnotationCardProps {
  annotation: Annotation
  annotationNumber?: number
  arrowStyle?: string
  showTags?: boolean
  showNistBadge?: boolean
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
  annotationNumber,
  arrowStyle = 'classic',
  showTags = true,
  showNistBadge = true,
}: AnnotationCardProps) {
  return (
    <div
      className="annotation-card"
      data-card-id={annotation.lureId}
    >
      {showNistBadge && annotationNumber && (
        <div className={`${styles.arrowBadge} ${styles[arrowStyle]}`}>
          <span>{annotationNumber}</span>
        </div>
      )}
      {annotation.title && (
        <div className="annotation-title">
          {annotation.title}
        </div>
      )}
      {showTags && (
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
      )}
      <div className="annotation-description">
        {annotation.explanation}
      </div>
    </div>
  )
}