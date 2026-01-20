import React from 'react'

interface SlideWrapperProps {
  children: React.ReactNode
}

export function SlideWrapper({ children }: SlideWrapperProps) {
  return (
    <div className="slide-wrapper">
      {children}
    </div>
  )
}