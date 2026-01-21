import React from 'react'
import type { ProjectMetadata } from '../types/project'

interface ProjectSettingsProps {
  metadata: ProjectMetadata
  onUpdate: (metadata: ProjectMetadata) => void
}

/**
 * ProjectSettings component for managing project metadata
 *
 * Provides UI for editing project title and author,
 * and displays read-only creation timestamp.
 */
export const ProjectSettings: React.FC<ProjectSettingsProps> = ({
  metadata,
  onUpdate
}) => {
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

  return (
    <div className="project-settings">
      <h3>Project Settings</h3>
      
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
    </div>
  )
}
