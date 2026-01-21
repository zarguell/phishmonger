import type { Annotation } from '../../types/annotations'
import persuasionPrinciples from '../../data/persuasion.json' with { type: 'json' }
import styles from '../../styles/arrows.module.css'
import { useCustomTechniques } from '../../hooks/useCustomTechniques'
import { useMemo } from 'react'
import techniques from '../../data/techniques.json' with { type: 'json' }

interface AnnotationCardProps {
  annotation: Annotation
  annotationNumber?: number
  arrowStyle?: string
  showTags?: boolean
}

function getTechniqueName(id: string, allTechniques: any[]): string {
  const technique = allTechniques.find((t: any) => t.id === id)
  return technique ? `${id} - ${technique.name}` : `(Unknown Technique)`
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
}: AnnotationCardProps) {
  const { getAllTechniques } = useCustomTechniques()

  // Get all techniques (built-in + custom)
  const allTechniques = useMemo(() => {
    return getAllTechniques(techniques)
  }, [getAllTechniques])

  return (
    <div
      className="annotation-card"
      data-card-id={annotation.lureId}
    >
      {annotationNumber && (
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
              ({getTechniqueName(annotation.techniqueId, allTechniques)})
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