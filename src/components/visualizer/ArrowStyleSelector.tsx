import styles from '../../styles/arrows.module.css'

interface ArrowStyleSelectorProps {
  currentStyle: string
  onStyleChange: (style: string) => void
}

export function ArrowStyleSelector({ currentStyle, onStyleChange }: ArrowStyleSelectorProps) {
  const styleOptions = [
    { name: 'classic', label: 'Classic Blue' },
    { name: 'red', label: 'Classic Red' },
    { name: 'square', label: 'Square' },
    { name: 'diamond', label: 'Diamond' }
  ]

  return (
    <div className="arrow-style-selector">
      <label style={{ fontSize: '12px', fontWeight: 500, marginRight: '8px' }}>Badge Style</label>
      <div style={{ display: 'flex', gap: '8px' }}>
        {styleOptions.map((option) => (
          <button
            key={option.name}
            onClick={() => onStyleChange(option.name)}
            className={`style-preview-button ${currentStyle === option.name ? 'active' : ''}`}
            type="button"
            title={`${option.label} badge style`}
            style={{
              padding: '8px 12px',
              border: '2px solid #dee2e6',
              borderRadius: '4px',
              background: currentStyle === option.name ? '#e9ecef' : 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              fontWeight: currentStyle === option.name ? 600 : 400,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (currentStyle !== option.name) {
                e.currentTarget.style.background = '#f8f9fa'
                e.currentTarget.style.borderColor = '#adb5bd'
              }
            }}
            onMouseLeave={(e) => {
              if (currentStyle !== option.name) {
                e.currentTarget.style.background = 'white'
                e.currentTarget.style.borderColor = '#dee2e6'
              }
            }}
          >
            {/* Preview badge */}
            <div
              style={{
                position: 'relative',
                width: '24px',
                height: '24px',
                flexShrink: 0
              }}
            >
              <div className={`${styles.arrowBadge} ${styles[option.name]}`}>
                <span>1</span>
              </div>
            </div>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
