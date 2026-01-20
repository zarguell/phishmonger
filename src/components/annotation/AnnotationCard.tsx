import React from 'react'
import type { Annotation, Technique } from '../../types/annotations'
import techniques from '../../data/techniques.json' assert { type: 'json' }

interface AnnotationCardProps {
  annotation: Annotation
  style?: React.CSSProperties
}

export function AnnotationCard({ annotation, style }: AnnotationCardProps) {
  // Find technique name from techniques.json
  const technique = (techniques as Technique[]).find((t: Technique) => t.id === annotation.techniqueId)
  const techniqueName = technique?.name || annotation.techniqueId

  return (
    <div
      className="annotation-card"
      style={style}
      data-card-id={annotation.lureId} // For arrow calculations
    >
      <h3 className="annotation-card-title">
        {techniqueName}
      </h3>
      <span className="annotation-card-badge">
        {annotation.techniqueId}
      </span>
      <p className="annotation-card-explanation">
        {annotation.explanation}
      </p>
    </div>
  )
}