import React, { useEffect } from 'react'
import ShortcutKey from './ShortcutKey'

interface KeyboardShortcutHelpProps {
  isOpen: boolean
  onClose: () => void
}

const KeyboardShortcutHelp: React.FC<KeyboardShortcutHelpProps> = ({ isOpen, onClose }) => {
  // Handle Escape key to close modal
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Handle click outside modal to close
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  const modalStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  }

  const modalContentStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '80vh',
    overflow: 'auto',
    position: 'relative'
  }

  const headerStyle: React.CSSProperties = {
    padding: '20px 24px 16px',
    borderBottom: '1px solid #e9ecef',
    margin: 0
  }

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: '#212529'
  }

  const sectionStyle: React.CSSProperties = {
    padding: '16px 24px'
  }

  const sectionTitleStyle: React.CSSProperties = {
    margin: '0 0 12px 0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#495057',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  }

  const shortcutRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #f8f9fa'
  }

  const shortcutRowLastStyle: React.CSSProperties = {
    ...shortcutRowStyle,
    borderBottom: 'none'
  }

  const descriptionStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#6c757d',
    margin: 0
  }

  return (
    <div style={modalStyle} onClick={handleBackdropClick}>
      <div style={modalContentStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Keyboard Shortcuts</h2>
        </div>

        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>General</h3>
          <div style={shortcutRowStyle}>
            <ShortcutKey keys="F1" />
            <p style={descriptionStyle}>Open keyboard shortcuts help</p>
          </div>
          <div style={shortcutRowLastStyle}>
            <ShortcutKey keys="Escape" />
            <p style={descriptionStyle}>Close modals / cancel actions</p>
          </div>
        </div>

        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Editing</h3>
          <div style={shortcutRowStyle}>
            <ShortcutKey keys={['Ctrl', 'Z']} />
            <p style={descriptionStyle}>Undo last action</p>
          </div>
          <div style={shortcutRowStyle}>
            <ShortcutKey keys={['Ctrl', 'Shift', 'Z']} />
            <p style={descriptionStyle}>Redo last undone action</p>
          </div>
          <div style={shortcutRowStyle}>
            <ShortcutKey keys={['Ctrl', 'Y']} />
            <p style={descriptionStyle}>Redo last undone action</p>
          </div>
          <div style={shortcutRowLastStyle}>
            <ShortcutKey keys={['Ctrl', 'B']} />
            <p style={descriptionStyle}>Bold text (rich text mode)</p>
          </div>
        </div>

        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Formatting</h3>
          <div style={shortcutRowLastStyle}>
            <ShortcutKey keys={['Ctrl', 'I']} />
            <p style={descriptionStyle}>Italic text (rich text mode)</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default KeyboardShortcutHelp