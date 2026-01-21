import React, { useRef, forwardRef } from 'react'
import type { ScoringData } from '../../types/scoring'
import { calculateDifficulty, getDifficultyLevel, getDifficultyBadge } from '../../utils/scoring'

interface SlideWrapperProps {
  children: React.ReactNode
  annotations: Record<string, import('../../types/annotations').Annotation>
  scoring?: ScoringData
  showBadge?: boolean
}

export const SlideWrapper = forwardRef<HTMLDivElement, SlideWrapperProps>(
  ({ children, scoring, showBadge = true }, ref) => {
    const internalRef = useRef<HTMLDivElement>(null)
    const containerRef = (ref as React.RefObject<HTMLDivElement>) || internalRef

    // Calculate difficulty if scoring provided
    let badge: { letter: string, color: string } | null = null
    if (scoring && showBadge) {
      const score = calculateDifficulty(scoring)
      const level = getDifficultyLevel(score)
      const badgeData = getDifficultyBadge(level)
      badge = { letter: badgeData.letter, color: badgeData.color }
    }

    return (
      <div ref={containerRef} className="slide-wrapper">
        {children}
        {badge && (
          <div className="difficulty-badge-overlay" style={{ backgroundColor: badge.color }}>
            {badge.letter}
          </div>
        )}
      </div>
    )
  }
)

SlideWrapper.displayName = 'SlideWrapper'