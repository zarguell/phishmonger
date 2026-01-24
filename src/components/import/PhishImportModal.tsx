import React, { useEffect, useState, useRef } from 'react'
import { importProjectJSON, type ProjectJSON } from '../../utils/storage'

interface PhishImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (project: ProjectJSON) => void
}

const PhishImportModal: React.FC<PhishImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [importError, setImportError] = useState<string | null>(null)
  const [importText, setImportText] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setImportError(null)
      setImportText('')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }, [isOpen])

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

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImportError(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const project = importProjectJSON(content)
        onImport(project)
        onClose()
        setImportText('')
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } catch (error) {
        setImportError(error instanceof Error ? error.message : 'Failed to import file')
      }
    }
    reader.onerror = () => {
      setImportError('Failed to read file')
    }
    reader.readAsText(file)
  }

  // Handle text paste import
  const handleTextImport = () => {
    if (!importText.trim()) {
      setImportError('Please paste JSON content')
      return
    }

    setImportError(null)

    try {
      const project = importProjectJSON(importText)
      onImport(project)
      onClose()
      setImportText('')
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Failed to import JSON')
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: '#212529'
  }

  const closeButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    color: '#6c757d',
    cursor: 'pointer',
    padding: '0',
    lineHeight: '1',
    width: '24px',
    height: '24px'
  }

  const sectionStyle: React.CSSProperties = {
    padding: '24px'
  }

  const sectionTitleStyle: React.CSSProperties = {
    margin: '0 0 12px 0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#495057'
  }

  const fileInputStyle: React.CSSProperties = {
    display: 'none'
  }

  const buttonStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '10px 16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    width: '100%',
    marginBottom: '12px'
  }

  const buttonHoverStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#0056b3'
  }

  const textareaStyle: React.CSSProperties = {
    width: '100%',
    minHeight: '150px',
    padding: '12px',
    border: '1px solid #ced4da',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'monospace',
    resize: 'vertical',
    boxSizing: 'border-box',
    marginBottom: '12px'
  }

  const errorStyle: React.CSSProperties = {
    padding: '12px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb',
    borderRadius: '4px',
    fontSize: '14px',
    marginBottom: '12px'
  }

  const importButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#28a745',
    opacity: !importText.trim() ? '0.5' : '1',
    cursor: !importText.trim() ? 'not-allowed' : 'pointer'
  }

  const dividerStyle: React.CSSProperties = {
    borderTop: '1px solid #e9ecef',
    margin: '0 24px'
  }

  return (
    <div style={modalStyle} onClick={handleBackdropClick}>
      <div style={modalContentStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Import Phish</h2>
          <button
            style={closeButtonStyle}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* File Upload Section */}
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Import from File</h3>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            style={fileInputStyle}
          />
          <button
            style={buttonStyle}
            onClick={() => fileInputRef.current?.click()}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, buttonHoverStyle)
            }}
            onMouseLeave={(e) => {
              Object.assign(e.currentTarget.style, buttonStyle)
            }}
          >
            Choose JSON File
          </button>
        </div>

        <div style={dividerStyle}></div>

        {/* Text Paste Section */}
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Import from Text</h3>
          {importError && (
            <div style={errorStyle}>
              {importError}
            </div>
          )}
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Paste phish JSON here..."
            style={textareaStyle}
          />
          <button
            style={importButtonStyle}
            onClick={handleTextImport}
            disabled={!importText.trim()}
            onMouseEnter={(e) => {
              if (importText.trim()) {
                Object.assign(e.currentTarget.style, {
                  ...importButtonStyle,
                  backgroundColor: '#218838'
                })
              }
            }}
            onMouseLeave={(e) => {
              Object.assign(e.currentTarget.style, importButtonStyle)
            }}
          >
            Import from Text
          </button>
        </div>
      </div>
    </div>
  )
}

export default PhishImportModal
