import React from 'react'
import type { Annotation, Technique } from '../../types/annotations'
import techniques from '../../data/techniques.json' with { type: 'json' }

interface AnnotationCardProps {
  annotation: Annotation
  annotationNumber?: number
  style?: React.CSSProperties
  isDragging?: boolean
  onDragStart?: (e: React.DragEvent, lureId: string) => void
  onDragOver?: (e: React.DragEvent) => void
  onDrop?: (e: React.DragEvent, targetLureId: string) => void
}

export function AnnotationCard({
  annotation,
  annotationNumber,
  style,
  isDragging = false,
  onDragStart,
  onDragOver,
  onDrop,
}: AnnotationCardProps) {
  // Find technique name from techniques.json
  const technique = (techniques as Technique[]).find((t: Technique) => t.id === annotation.techniqueId)
  const techniqueName = technique?.name || annotation.techniqueId

  const handleDragStart = (e: React.DragEvent) => {
    if (onDragStart) {
      onDragStart(e, annotation.lureId)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    if (onDragOver) {
      onDragOver(e)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    if (onDrop) {
      onDrop(e, annotation.lureId)
    }
  }

  return (
    <div
      className={`annotation-card ${isDragging ? 'is-dragging' : ''}`}
      style={style}
      data-card-id={annotation.lureId}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="annotation-card-header">
        <div className="drag-handle">⋮⋮</div>
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