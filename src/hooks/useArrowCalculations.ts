import { useLayoutEffect, useState, useRef } from 'react'
import type { Annotation } from '../types/annotations'

export interface ArrowPath {
  lureId: string
  start: { x: number; y: number }    // Right edge of lure span
  mid1: { x: number; y: number }     // Bus line at lure Y
  mid2: { x: number; y: number }     // Bus line at card Y
  end: { x: number; y: number }      // Left edge of annotation card
}

interface UseArrowCalculationsProps {
  containerRef: React.RefObject<HTMLDivElement>
  annotations: Record<string, Annotation>
}

/**
 * Calculates elbow-connector arrow paths from lure spans to annotation cards.
 * Uses container-relative coordinates (getBoundingClientRect) for tracking.
 * Per Phase 3 Research: useLayoutEffect prevents visual flicker on initial render.
 */
export function useArrowCalculations({ containerRef, annotations }: UseArrowCalculationsProps) {
  const [arrowPaths, setArrowPaths] = useState<ArrowPath[]>([])
  const calculationInProgress = useRef(false)

  const calculatePaths = () => {
    if (!containerRef.current || calculationInProgress.current) return

    calculationInProgress.current = true

    const containerRect = containerRef.current.getBoundingClientRect()
    const paths: ArrowPath[] = []
    const busX = 1000 // Per Phase 3 Context: center of gutter at x=1000px

    Object.values(annotations).forEach((annotation) => {
      // Find lure span element
      const lureElement = containerRef.current?.querySelector(
        `[data-lure-id="${annotation.lureId}"]`
      ) as HTMLElement

      // Find annotation card element
      const cardElement = containerRef.current?.querySelector(
        `[data-card-id="${annotation.lureId}"]`
      ) as HTMLElement

      if (!lureElement || !cardElement) return

      // Get viewport-relative coordinates
      const lureRect = lureElement.getBoundingClientRect()
      const cardRect = cardElement.getBoundingClientRect()

      // Convert to container-relative coordinates
      const start = {
        x: lureRect.right - containerRect.left,
        y: lureRect.top + lureRect.height / 2 - containerRect.top,
      }

      const end = {
        x: cardRect.left - containerRect.left,
        y: cardRect.top + cardRect.height / 2 - containerRect.top,
      }

      paths.push({
        lureId: annotation.lureId,
        start,
        mid1: { x: busX, y: start.y },
        mid2: { x: busX, y: end.y },
        end,
      })
    })

    setArrowPaths(paths)
    calculationInProgress.current = false
  }

  // Synchronous measurement before paint (prevents flicker)
  useLayoutEffect(() => {
    calculatePaths()
  }, [annotations])

  return { arrowPaths, recalculate: calculatePaths }
}