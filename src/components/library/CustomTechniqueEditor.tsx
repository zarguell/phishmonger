import { useState, useEffect } from 'react';
import { CustomTechnique } from '../../types/library';

interface CustomTechniqueEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (technique: Omit<CustomTechnique, 'id' | 'isCustom' | 'createdAt'>) => void;
  editTechnique?: CustomTechnique;
  existingIds?: string[];
}

export function CustomTechniqueEditor({
  isOpen,
  onClose,
  onSave,
  editTechnique,
  existingIds = [],
}: CustomTechniqueEditorProps) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    tactic: '',
    description: '',
    url: '',
    organization: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes or editTechnique changes
  useEffect(() => {
    if (editTechnique) {
      setFormData({
        id: editTechnique.id,
        name: editTechnique.name,
        tactic: editTechnique.tactic,
        description: editTechnique.description,
        url: editTechnique.url || '',
        organization: editTechnique.organization || '',
      });
    } else {
      setFormData({
        id: '',
        name: '',
        tactic: '',
        description: '',
        url: '',
        organization: '',
      });
    }
    setErrors({});
  }, [isOpen, editTechnique]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // ID validation
    if (!formData.id.trim()) {
      newErrors.id = 'Technique ID is required';
    } else if (existingIds.includes(formData.id) && formData.id !== editTechnique?.id) {
      newErrors.id = 'This ID already exists. Please use a unique ID.';
    } else if (!formData.id.match(/^[A-Z0-9-]+$/)) {
      newErrors.id = 'ID must contain only uppercase letters, numbers, and hyphens';
    }

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Technique name is required';
    }

    // Tactic validation
    if (!formData.tactic.trim()) {
      newErrors.tactic = 'Tactic is required';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    // URL validation (if provided)
    if (formData.url && !isValidUrl(formData.url)) {
      newErrors.url = 'URL must start with https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSave({
        name: formData.name.trim(),
        tactic: formData.tactic.trim(),
        description: formData.description.trim(),
        url: formData.url.trim() || undefined,
        organization: formData.organization.trim() || undefined,
      });
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      style={{
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
      }}
      onClick={handleBackdropClick}
    >
      <div
        className="modal-content"
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: '20px' }}>
          {editTechnique ? 'Edit Custom Technique' : 'Create Custom Technique'}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* ID Field */}
          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="technique-id"
              style={{
                display: 'block',
                marginBottom: '4px',
                fontWeight: 'bold',
                fontSize: '14px',
              }}
            >
              Technique ID <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              id="technique-id"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value.toUpperCase() })}
              placeholder="CUSTOM-001 or similar"
              style={{
                width: '100%',
                padding: '8px',
                border: `1px solid ${errors.id ? 'red' : '#ccc'}`,
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
              disabled={!!editTechnique}
            />
            {errors.id && (
              <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.id}</div>
            )}
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Suggested format: CUSTOM-001, CUSTOM-ORG-001, etc.
            </div>
          </div>

          {/* Name Field */}
          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="technique-name"
              style={{
                display: 'block',
                marginBottom: '4px',
                fontWeight: 'bold',
                fontSize: '14px',
              }}
            >
              Technique Name <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              id="technique-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., CEO Fraud Variant"
              style={{
                width: '100%',
                padding: '8px',
                border: `1px solid ${errors.name ? 'red' : '#ccc'}`,
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
            {errors.name && (
              <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.name}</div>
            )}
          </div>

          {/* Tactic Field */}
          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="technique-tactic"
              style={{
                display: 'block',
                marginBottom: '4px',
                fontWeight: 'bold',
                fontSize: '14px',
              }}
            >
              Tactic <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              id="technique-tactic"
              value={formData.tactic}
              onChange={(e) => setFormData({ ...formData, tactic: e.target.value })}
              placeholder="e.g., Initial Access, Social Engineering"
              style={{
                width: '100%',
                padding: '8px',
                border: `1px solid ${errors.tactic ? 'red' : '#ccc'}`,
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
            {errors.tactic && (
              <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.tactic}</div>
            )}
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              MITRE ATT&CK tactic category (e.g., Initial Access, Defense Evasion)
            </div>
          </div>

          {/* Description Field */}
          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="technique-description"
              style={{
                display: 'block',
                marginBottom: '4px',
                fontWeight: 'bold',
                fontSize: '14px',
              }}
            >
              Description <span style={{ color: 'red' }}>*</span>
            </label>
            <textarea
              id="technique-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe how this technique is used in phishing attacks..."
              rows={4}
              style={{
                width: '100%',
                padding: '8px',
                border: `1px solid ${errors.description ? 'red' : '#ccc'}`,
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                resize: 'vertical',
              }}
            />
            {errors.description && (
              <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                {errors.description}
              </div>
            )}
          </div>

          {/* URL Field */}
          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="technique-url"
              style={{
                display: 'block',
                marginBottom: '4px',
                fontWeight: 'bold',
                fontSize: '14px',
              }}
            >
              Reference URL (optional)
            </label>
            <input
              type="url"
              id="technique-url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://..."
              style={{
                width: '100%',
                padding: '8px',
                border: `1px solid ${errors.url ? 'red' : '#ccc'}`,
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
            {errors.url && (
              <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.url}</div>
            )}
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Link to documentation or reference material
            </div>
          </div>

          {/* Organization Field */}
          <div style={{ marginBottom: '24px' }}>
            <label
              htmlFor="technique-organization"
              style={{
                display: 'block',
                marginBottom: '4px',
                fontWeight: 'bold',
                fontSize: '14px',
              }}
            >
              Organization (optional)
            </label>
            <input
              type="text"
              id="technique-organization"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              placeholder="e.g., Acme Corp - Training Scenario"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Organization-specific context or training scenario
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: '#0066cc',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Save Technique
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
