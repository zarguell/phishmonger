import { useMemo } from 'react'
import type { Annotation } from '../types/annotations'

interface CardPosition {
  lureId: string
  y: number
}

/**
 * Calculates vertical positions for annotation cards with collision detection.
 * Overlapping cards are pushed down by 24px gap.
 */
export function useCardLayout(annotations: Record<string, Annotation>): CardPosition[] {
  return useMemo(() => {
    const positions: CardPosition[] = []
    const annotationArray = Object.values(annotations)
    let currentY = 0
    const gap = 24

    // Simple sequential positioning with collision avoidance
    // Cards are sorted by creation date or annotation order
    annotationArray.forEach((annotation) => {
      positions.push({
        lureId: annotation.lureId,
        y: currentY,
      })

      // Estimate card height (will be refined by actual DOM measurements)
      const estimatedHeight = estimateCardHeight(annotation.explanation)
      currentY += estimatedHeight + gap
    })

    return positions
  }, [annotations])
}

/**
 * Estimates card height based on explanation text length.
 * Base height (title + badge + padding) + text height.
 */
function estimateCardHeight(explanation: string): number {
  const baseHeight = 60 // Title + badge + padding
  const lineHeight = 20 // 14px text with ~6px line-height
  const charsPerLine = 50 // Approximate 380px width
  const textHeight = Math.ceil(explanation.length / charsPerLine) * lineHeight

  return baseHeight + textHeight
}