import React from 'react'

interface ShortcutKeyProps {
  keys: string | string[]
}

const ShortcutKey: React.FC<ShortcutKeyProps> = ({ keys }) => {
  const keyArray = Array.isArray(keys) ? keys : [keys]

  // Check if we're on macOS to show Cmd instead of Ctrl
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0

  const renderKey = (key: string) => {
    // Handle platform-specific modifier display
    let displayKey = key
    if (key.toLowerCase() === 'ctrl' && isMac) {
      displayKey = 'Cmd'
    }

    const keyStyle: React.CSSProperties = {
      display: 'inline-block',
      backgroundColor: '#f8f9fa',
      border: '1px solid #e9ecef',
      borderRadius: '4px',
      padding: '2px 8px',
      margin: '0 2px',
      fontSize: '12px',
      fontWeight: '500',
      color: '#495057',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
      fontFamily: 'monospace',
      whiteSpace: 'nowrap'
    }

    return (
      <span key={key} style={keyStyle}>
        {displayKey}
      </span>
    )
  }

  return (
    <>
      {keyArray.map((key, index) => (
        <React.Fragment key={key}>
          {renderKey(key)}
          {index < keyArray.length - 1 && (
            <span style={{ margin: '0 4px', color: '#6c757d', fontSize: '12px' }}>+</span>
          )}
        </React.Fragment>
      ))}
    </>
  )
}

export default ShortcutKey