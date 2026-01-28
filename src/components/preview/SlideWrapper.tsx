import React, { useRef, forwardRef } from 'react'
import type { ScoringData } from '../../types/scoring'
import { calculateDifficulty, getDifficultyBadge } from '../../utils/scoring'
import styles from '../../styles/layouts.module.css'
import type { LayoutTemplate } from '../visualizer/LayoutTemplateSelector'

interface SlideWrapperProps {
  children: React.ReactNode
  annotations: Record<string, import('../../types/annotations').Annotation>
  scoring?: ScoringData
  showBadge?: boolean
  layoutTemplate?: LayoutTemplate
  compactAnnotations?: boolean
  dimensions?: { width: number; height: number }
}

export const SlideWrapper = forwardRef<HTMLDivElement, SlideWrapperProps>(
  ({ children, scoring, showBadge = true, layoutTemplate = 'balanced', compactAnnotations = false, dimensions }, ref) => {
    const internalRef = useRef<HTMLDivElement>(null)
    const containerRef = (ref as React.RefObject<HTMLDivElement>) || internalRef

    // Determine CSS classes based on layout template
    const getSlideWrapperClasses = (): string => {
      const baseClass = styles.slideWrapper
      const templateClass = styles[layoutTemplate]
      const compactClass = compactAnnotations ? styles['compact-annotations'] : ''
      return `${baseClass} ${templateClass} ${compactClass}`.trim()
    }

    // Calculate difficulty if scoring provided
    let badge: { letter: string, color: string, breakdown: React.ReactNode } | null = null
    if (scoring && showBadge) {
      const difficulty = calculateDifficulty(scoring)
      const badgeData = getDifficultyBadge(difficulty)

      // Zone labels for badge display
      const totalCues = scoring.visualCues + scoring.languageCues
      const cueZone = totalCues <= 8 ? 'Low (1-8)' : totalCues <= 14 ? 'Medium (9-14)' : 'High (15+)'
      const alignmentZone = scoring.premiseAlignment <= 2 ? 'Low' : scoring.premiseAlignment === 3 ? 'Medium' : 'High'

      badge = {
        letter: badgeData.letter,
        color: badgeData.color,
        breakdown: (
          <div style={{ fontSize: '11px', lineHeight: '1.3' }}>
            <div style={{ fontWeight: '600', marginBottom: '2px' }}>NIST Phish Scale Score</div>
            <div>{badgeData.label}</div>
            <div style={{ fontSize: '10px', marginTop: '2px', opacity: 0.9 }}>
              Cues ({totalCues}): {cueZone} • Alignment: {alignmentZone}
            </div>
          </div>
        )
      }
    }

    return (
      <div
        ref={containerRef}
        className={getSlideWrapperClasses()}
        style={dimensions ? {
          '--slide-width': `${dimensions.width}px`,
          '--slide-height': `${dimensions.height}px`
        } as React.CSSProperties : undefined}
      >
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