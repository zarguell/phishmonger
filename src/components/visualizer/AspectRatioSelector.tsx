import React from 'react'

export type AspectRatio = '16:9' | '2:1' | '4:3' | '21:9'

interface AspectRatioSelectorProps {
  currentRatio: AspectRatio
  onRatioChange: (ratio: AspectRatio) => void
}

export function AspectRatioSelector({
  currentRatio,
  onRatioChange
}: AspectRatioSelectorProps) {
  const ratios: Array<{
    id: AspectRatio
    label: string
    icon: React.ReactNode
  }> = [
    {
      id: '16:9',
      label: '16:9',
      icon: (
        <svg width="32" height="18" viewBox="0 0 32 18">
          <rect x="0" y="0" width="32" height="18" fill="#e9ecef" rx="2" stroke="#dee2e6" strokeWidth="1"/>
        </svg>
      )
    },
    {
      id: '2:1',
      label: '2:1',
      icon: (
        <svg width="32" height="16" viewBox="0 0 32 16">
          <rect x="0" y="0" width="32" height="16" fill="#e9ecef" rx="2" stroke="#dee2e6" strokeWidth="1"/>
        </svg>
      )
    },
    {
      id: '4:3',
      label: '4:3',
      icon: (
        <svg width="32" height="24" viewBox="0 0 32 24">
          <rect x="0" y="0" width="32" height="24" fill="#e9ecef" rx="2" stroke="#dee2e6" strokeWidth="1"/>
        </svg>
      )
    },
    {
      id: '21:9',
      label: '21:9',
      icon: (
        <svg width="32" height="14" viewBox="0 0 32 14">
          <rect x="0" y="0" width="32" height="14" fill="#e9ecef" rx="2" stroke="#dee2e6" strokeWidth="1"/>
        </svg>
      )
    }
  ]

  return (
    <div className="aspect-ratio-selector">
      <label htmlFor="aspect-ratio-select">Aspect Ratio</label>
      <div className="ratio-buttons" role="group" aria-label="Aspect ratios">
        {ratios.map((ratio) => (
          <button
            key={ratio.id}
            type="button"
            className={`ratio-button ${currentRatio === ratio.id ? 'active' : ''}`}
            onClick={() => onRatioChange(ratio.id)}
            aria-pressed={currentRatio === ratio.id}
            title={ratio.label}
          >
            <div className="ratio-icon">{ratio.icon}</div>
            <div className="ratio-label">{ratio.label}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
