import type { Annotation, PersuasionPrinciple } from '../types/annotations'
import techniques from '../data/techniques.json'
import persuasionPrinciples from '../data/persuasion.json'
import { useCustomTechniques } from '../hooks/useCustomTechniques'
import { CustomTechniqueEditor } from './library/CustomTechniqueEditor'
import { useState } from 'react'

interface AnnotationPanelProps {
  lureId: string
  lureText: string
  annotation?: Annotation
  onUpdate: (updates: Partial<Annotation>) => void
}

export function AnnotationPanel({ lureId, lureText, annotation, onUpdate }: AnnotationPanelProps) {
  const { addCustomTechnique, getAllTechniques } = useCustomTechniques()
  const [isEditorOpen, setIsEditorOpen] = useState(false)

  const allTechniques = getAllTechniques(techniques)

  const handleCreateCustomTechnique = (techniqueData: Omit<import('../types/library').CustomTechnique, 'id' | 'isCustom' | 'createdAt'>) => {
    const newId = addCustomTechnique(techniqueData)
    // Optionally select the newly created technique
    onUpdate({ techniqueId: newId })
  }

  return (
    <div className="annotation-panel">
      <h3>Annotate: "{lureText}"</h3>

      <div className="annotation-section">
        <label htmlFor={`title-${lureId}`} className="annotation-label">
          Title
        </label>
        <input
          type="text"
          id={`title-${lureId}`}
          className="annotation-input"
          value={annotation?.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Optional title..."
        />
      </div>

      <div className="annotation-section">
        <label htmlFor={`technique-${lureId}`} className="annotation-label">
          Technical Technique (What)
        </label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select
            id={`technique-${lureId}`}
            className="annotation-select"
            value={annotation?.techniqueId || ''}
             onChange={(e) => onUpdate({ techniqueId: e.target.value || undefined })}
            style={{ flex: 1 }}
          >
            <option value="">Select technique...</option>
            {allTechniques.map((technique) => (
              <option key={technique.id} value={technique.id}>
                {'isCustom' in technique ? '[Custom] ' : ''}{technique.id}: {technique.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setIsEditorOpen(true)}
            style={{
              padding: '6px 12px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              whiteSpace: 'nowrap'
            }}
            title="Create custom technique"
          >
            +
          </button>
        </div>
      </div>

      <div className="annotation-section">
        <label htmlFor={`persuasion-${lureId}`} className="annotation-label">
          Persuasion Principle (Why)
        </label>
        <select
          id={`persuasion-${lureId}`}
          className="annotation-select"
          value={annotation?.persuasionPrincipleId || ''}
          onChange={(e) => onUpdate({ persuasionPrincipleId: e.target.value || undefined })}
        >
          <option value="">Select principle...</option>
          {persuasionPrinciples.map((principle: PersuasionPrinciple) => (
            <option key={principle.id} value={principle.id}>
              {principle.name}
            </option>
          ))}
        </select>
      </div>

      <div className="annotation-section">
        <label htmlFor={`explanation-${lureId}`} className="annotation-label">
          Analyst Notes
        </label>
        <textarea
          id={`explanation-${lureId}`}
          className="annotation-textarea"
          rows={4}
          value={annotation?.explanation || ''}
          onChange={(e) => onUpdate({ explanation: e.target.value })}
          placeholder="Enter your analysis..."
        />
      </div>

      <CustomTechniqueEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleCreateCustomTechnique}
        existingIds={allTechniques.map(t => t.id)}
      />
    </div>
  )
}