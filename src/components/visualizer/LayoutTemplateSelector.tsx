import React from 'react'

export type LayoutTemplate = 'balanced' | 'wideEmail' | 'wideAnnotations'

interface LayoutTemplateSelectorProps {
  currentTemplate: LayoutTemplate
  onTemplateChange: (template: LayoutTemplate) => void
}

export function LayoutTemplateSelector({
  currentTemplate,
  onTemplateChange
}: LayoutTemplateSelectorProps) {
  const templates: Array<{
    id: LayoutTemplate
    label: string
    icon: React.ReactNode
  }> = [
    {
      id: 'balanced',
      label: 'Balanced',
      icon: (
        <svg width="60" height="24" viewBox="0 0 60 24">
          <rect x="0" y="0" width="36" height="24" fill="#e9ecef" rx="2" />
          <rect x="38" y="0" width="22" height="24" fill="#dee2e6" rx="2" />
        </svg>
      )
    },
    {
      id: 'wideEmail',
      label: 'Wide Email',
      icon: (
        <svg width="60" height="24" viewBox="0 0 60 24">
          <rect x="0" y="0" width="44" height="24" fill="#e9ecef" rx="2" />
          <rect x="46" y="0" width="14" height="24" fill="#dee2e6" rx="2" />
        </svg>
      )
    },
    {
      id: 'wideAnnotations',
      label: 'Wide Annotations',
      icon: (
        <svg width="60" height="24" viewBox="0 0 60 24">
          <rect x="0" y="0" width="32" height="24" fill="#e9ecef" rx="2" />
          <rect x="34" y="0" width="26" height="24" fill="#dee2e6" rx="2" />
        </svg>
      )
    }
  ]

  return (
    <div className="layout-template-selector">
      <label htmlFor="layout-template-select">Layout Template</label>
      <div className="template-buttons" role="group" aria-label="Layout templates">
        {templates.map((template) => (
          <button
            key={template.id}
            type="button"
            className={`template-button ${currentTemplate === template.id ? 'active' : ''}`}
            onClick={() => onTemplateChange(template.id)}
            aria-pressed={currentTemplate === template.id}
            title={template.label}
          >
            <div className="template-icon">{template.icon}</div>
            <div className="template-label">{template.label}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
