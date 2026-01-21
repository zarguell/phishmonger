import React, { useRef, forwardRef } from 'react'

interface SlideWrapperProps {
  children: React.ReactNode
  annotations: Record<string, import('../../types/annotations').Annotation>
}

export const SlideWrapper = forwardRef<HTMLDivElement, SlideWrapperProps>(
  ({ children }, ref) => {
    const internalRef = useRef<HTMLDivElement>(null)
    const containerRef = (ref as React.RefObject<HTMLDivElement>) || internalRef

    return (
      <div ref={containerRef} className="slide-wrapper">
        {children}
      </div>
    )
  }
)

SlideWrapper.displayName = 'SlideWrapper'