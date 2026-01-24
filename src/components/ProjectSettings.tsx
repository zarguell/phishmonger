import React, { useState } from 'react'
import type { ProjectMetadata } from '../types/project'

interface ProjectSettingsProps {
  metadata: ProjectMetadata
  onUpdate: (metadata: ProjectMetadata) => void
  onExport?: () => void
  onImportClick?: () => void  // Replaces file/text import props
  onOpenTechniqueLibrary?: () => void
}

export const ProjectSettings: React.FC<ProjectSettingsProps> = ({
  metadata,
  onUpdate,
  onExport,
  onImportClick,
  onOpenTechniqueLibrary
}) => {
  const [menuOpen, setMenuOpen] = useState(false)

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

  const handleExportClick = () => {
    if (onExport) {
      onExport()
    }
  }

  return (
    <div className="phish-settings">
      <div className="phish-settings-header">
        <h3>Phish Settings</h3>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="menu-toggle-button"
          type="button"
        >
          {menuOpen ? '▼ Hide' : '▶ Import / Export'}
        </button>
      </div>

      {menuOpen && (
        <div className="phish-settings-content">
          <div className="settings-field">
            <label htmlFor="project-title">Phish Title</label>
            <input
              id="project-title"
              type="text"
              value={metadata.title || ''}
              onChange={handleTitleChange}
              placeholder="Enter phish title"
            />
          </div>

          <div className="settings-field">
            <label htmlFor="project-author">Author</label>
            <input
              id="project-author"
              type="text"
              value={metadata.author || ''}
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
              <button
                onClick={onImportClick}
                disabled={!onImportClick}
                className="import-json-button"
                type="button"
                style={{ marginLeft: '8px' }}
              >
                Import Phish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
