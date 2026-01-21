import React, { useState } from 'react'
import type { ProjectMetadata } from '../types/project'

interface ProjectSettingsProps {
  metadata: ProjectMetadata
  onUpdate: (metadata: ProjectMetadata) => void
  onExport?: () => void
  onImportFromFile?: (file: File) => void
  onImportFromText?: (jsonText: string) => void
  onOpenTechniqueLibrary?: () => void
}

export const ProjectSettings: React.FC<ProjectSettingsProps> = ({
  metadata,
  onUpdate,
  onExport,
  onImportFromFile,
  onImportFromText,
  onOpenTechniqueLibrary
}) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [importText, setImportText] = useState('')
  const [importError, setImportError] = useState<string | null>(null)

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...metadata,
      title: e.target.value
    })
  }

  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...metadata,
      author: e.target.value
    })
  }

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return isoString
    }
  }

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onImportFromFile) {
      const reader = new FileReader()
      reader.onload = () => {
        onImportFromFile(file)
        setImportError(null)
      }
      reader.onerror = () => {
        setImportError('Failed to read file')
      }
      reader.readAsText(file)
    }
    e.target.value = ''
  }

  const handleTextImport = () => {
    if (onImportFromText && importText.trim()) {
      try {
        onImportFromText(importText)
        setImportText('')
        setImportError(null)
      } catch (error) {
        setImportError(error instanceof Error ? error.message : 'Import failed')
      }
    }
  }

  const handleExportClick = () => {
    if (onExport) {
      onExport()
    }
  }

  const handleImportTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setImportText(e.target.value)
    if (importError) {
      setImportError(null)
    }
  }

  return (
    <div className="project-settings">
      <div className="project-settings-header">
        <h3>Project Settings</h3>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="menu-toggle-button"
          type="button"
        >
          {menuOpen ? '▼ Hide' : '▶ Import / Export'}
        </button>
      </div>

      {menuOpen && (
        <div className="project-settings-content">
          <div className="settings-field">
            <label htmlFor="project-title">Project Title</label>
            <input
              id="project-title"
              type="text"
              value={metadata.title}
              onChange={handleTitleChange}
              placeholder="Enter project title"
            />
          </div>

          <div className="settings-field">
            <label htmlFor="project-author">Author</label>
            <input
              id="project-author"
              type="text"
              value={metadata.author}
              onChange={handleAuthorChange}
              placeholder="Enter author name"
            />
          </div>

          <div className="settings-field">
            <label>Created</label>
            <div className="created-date">
              {formatDate(metadata.createdAt)}
            </div>
          </div>

           <hr className="settings-divider" />

           {onOpenTechniqueLibrary && (
             <div className="settings-field">
               <button
                 onClick={onOpenTechniqueLibrary}
                 className="manage-techniques-button"
                 type="button"
               >
                 Manage Techniques
               </button>
             </div>
           )}

           <div className="settings-export-import">
            <div className="export-import-section">
              <button
                onClick={handleExportClick}
                disabled={!onExport}
                className="export-json-button"
                type="button"
              >
                Export Phish
              </button>
            </div>

            <div className="export-import-section">
              <label htmlFor="import-file" className="import-file-label">
                Import from File
              </label>
              <input
                id="import-file"
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="import-file-input"
              />
            </div>

            <div className="export-import-section">
              <label htmlFor="import-text">Import from Pasted JSON</label>
              <textarea
                id="import-text"
                value={importText}
                onChange={handleImportTextChange}
                placeholder="Paste project JSON here..."
                className="import-textarea"
              />
              <button
                onClick={handleTextImport}
                disabled={!onImportFromText || !importText.trim()}
                className="import-text-button"
                type="button"
              >
                Import
              </button>
              {importError && <div className="import-error">{importError}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
