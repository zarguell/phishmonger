import React from 'react'
import type { Annotation } from '../../types/annotations'
import { AnnotationCard } from '../annotation/AnnotationCard'

interface AnnotationColumnProps {
  annotations: Record<string, Annotation>
  onUpdateAnnotation?: (lureId: string, updates: Partial<Annotation>) => void
}

export function AnnotationColumn({ annotations, onUpdateAnnotation }: AnnotationColumnProps) {
  const hasAnnotations = Object.keys(annotations).length > 0
  const [draggedLureId, setDraggedLureId] = React.useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent, lureId: string) => {
    e.dataTransfer.setData('text/plain', lureId)
    e.dataTransfer.effectAllowed = 'move'
    setDraggedLureId(lureId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetLureId: string) => {
    e.preventDefault()
    const draggedId = e.dataTransfer.getData('text/plain')

    if (!draggedId || draggedId === targetLureId) {
      setDraggedLureId(null)
      return
    }

    if (!onUpdateAnnotation) {
      setDraggedLureId(null)
      return
    }

    // Get current manualY values
    const draggedAnnotation = annotations[draggedId]
    const targetAnnotation = annotations[targetLureId]

    if (!draggedAnnotation || !targetAnnotation) {
      setDraggedLureId(null)
      return
    }

    // Simple swap strategy
    const draggedY = draggedAnnotation.manualY ?? 0
    const targetY = targetAnnotation.manualY ?? 0

    // If neither has manualY, assign unique values based on sort order
    let newDraggedY: number
    let newTargetY: number

    if (draggedY === 0 && targetY === 0) {
      const step = 100
      newDraggedY = step
      newTargetY = step * 2
    } else if (draggedY === 0) {
      newDraggedY = targetY + 50
      newTargetY = targetY
    } else if (targetY === 0) {
      newDraggedY = draggedY
      newTargetY = draggedY - 50
    } else {
      // Swap
      newDraggedY = targetY
      newTargetY = draggedY
    }

    onUpdateAnnotation(draggedId, { manualY: newDraggedY })
    onUpdateAnnotation(targetLureId, { manualY: newTargetY })
    setDraggedLureId(null)
  }

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
          isDragging={draggedLureId === annotation.lureId}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      ))}
    </div>
  )
}