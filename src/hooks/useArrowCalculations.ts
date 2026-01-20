import { useLayoutEffect, useState, useRef } from 'react'
import type { Annotation } from '../types/annotations'

export interface ArrowPath {
  lureId: string
  start: { x: number; y: number }    // Right edge of lure span + 5px
  midHorizontal: { x: number; y: number }     // Bus line at start Y
  midVertical: { x: number; y: number }       // Bus line vertical travel
  end: { x: number; y: number }      // Left edge of card - 5px
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

    // Bus Line: Fixed X-coordinate at the 60% split point (960px) + 20px gutter
    // All vertical movement happens ONLY on this line
    const busLineX = 960 + 20 // 980px from container left edge

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
      // Start at RIGHT edge of lure highlight + 5px buffer
      const start = {
        x: lureRect.right - containerRect.left + 5,
        y: lureRect.top + lureRect.height / 2 - containerRect.top,
      }

      // End at LEFT edge of card - 5px buffer
      const end = {
        x: cardRect.left - containerRect.left - 5,
        y: cardRect.top + cardRect.height / 2 - containerRect.top,
      }

      // 3-segment Bus Line path:
      // 1. Right from lure to bus line
      // 2. Vertical movement on bus line ONLY
      // 3. Left from bus line to card
      paths.push({
        lureId: annotation.lureId,
        start,
        midHorizontal: { x: busLineX, y: start.y },  // Horizontal to bus line
        midVertical: { x: busLineX, y: end.y },       // Vertical on bus line
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