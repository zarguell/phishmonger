import type { Annotation, Technique, PersuasionPrinciple } from '../types/annotations'
import techniques from '../data/techniques.json'
import persuasionPrinciples from '../data/persuasion.json'

interface AnnotationPanelProps {
  lureId: string
  lureText: string
  annotation?: Annotation
  onUpdate: (updates: Partial<Annotation>) => void
}

export function AnnotationPanel({ lureId, lureText, annotation, onUpdate }: AnnotationPanelProps) {
  return (
    <div className="annotation-panel">
      <h3>Annotate: "{lureText}"</h3>

      <div className="annotation-section">
        <label htmlFor={`technique-${lureId}`} className="annotation-label">
          Technical Technique (What)
        </label>
        <select
          id={`technique-${lureId}`}
          className="annotation-select"
          value={annotation?.techniqueId || ''}
           onChange={(e) => onUpdate({ techniqueId: e.target.value || undefined })}
        >
          <option value="">Select technique...</option>
          {techniques.map((technique: Technique) => (
            <option key={technique.id} value={technique.id}>
              {technique.id}: {technique.name}
            </option>
          ))}
        </select>
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
    </div>
  )
}