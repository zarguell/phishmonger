import React, { useRef } from 'react'
import { useArrowCalculations } from '../../hooks/useArrowCalculations'
import { useDebouncedResize } from '../../hooks/useDebouncedResize'
import { ArrowOverlay } from './ArrowOverlay'

interface SlideWrapperProps {
  children: React.ReactNode
  annotations: Record<string, import('../../types/annotations').Annotation>
}

export function SlideWrapper({ children, annotations }: SlideWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { arrowPaths, recalculate } = useArrowCalculations({
    containerRef,
    annotations,
  })

  // Recalculate arrows on window resize (debounced 200ms)
  useDebouncedResize(recalculate, 200)

  return (
    <div ref={containerRef} className="slide-wrapper">
      {children}
      <ArrowOverlay paths={arrowPaths} />
    </div>
  )
}