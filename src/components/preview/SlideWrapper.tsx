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
    let badge: { letter: string, color: string, breakdown: React.ReactNode } | null = null
    if (scoring && showBadge) {
      const score = calculateDifficulty(scoring)
      const level = getDifficultyLevel(score)
      const badgeData = getDifficultyBadge(level)
      badge = {
        letter: badgeData.letter,
        color: badgeData.color,
        breakdown: (
          <div style={{ fontSize: '11px', lineHeight: '1.3' }}>
            <div style={{ fontWeight: '600', marginBottom: '2px' }}>NIST Phish Scale Score</div>
            <div>{score} = {scoring.premiseAlignment} - ({scoring.visualCues}+{scoring.languageCues})</div>
          </div>
        )
      }
    }

    return (
      <div ref={containerRef} className="slide-wrapper">
        {children}
        {badge && (
          <div className="difficulty-badge-overlay" style={{ backgroundColor: badge.color }}>
            {badge.breakdown}
          </div>
        )}
      </div>
    )
  }
)

SlideWrapper.displayName = 'SlideWrapper'