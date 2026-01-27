import React, { useState, useEffect, useRef } from 'react';
import type { Campaign, CampaignInput } from '../../types/campaign';

interface CampaignImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (campaign: CampaignInput) => Promise<void>;
  existingCampaigns: Campaign[];
}

export function CampaignImportModal({ isOpen, onClose, onImport, existingCampaigns }: CampaignImportModalProps) {
  const [importError, setImportError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [importText, setImportText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setImportError(null);
      setImportText('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle click outside modal to close
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportError(null);
    setSuccessMessage(null);

    try {
      const text = await file.text();
      const imported = JSON.parse(text) as Campaign;

      // Validate structure
      if (!imported.id || !imported.name || typeof imported.description !== 'string' || !Array.isArray(imported.campaignPhishes)) {
        throw new Error('Invalid campaign file structure. Required: id, name, description (string), campaignPhishes (array)');
      }

      // Check for duplicate ID
      if (existingCampaigns.some(c => c.id === imported.id)) {
        // Generate new ID and add "(copy)" suffix
        imported.id = crypto.randomUUID();
        imported.name = imported.name.endsWith(' (copy)') ? imported.name : `${imported.name} (copy)`;
      }

      await onImport({
        name: imported.name,
        description: imported.description,
        campaignPhishes: imported.campaignPhishes,
      });

      setImportError(null);
      setSuccessMessage('Campaign imported successfully!');
      setTimeout(() => {
        onClose();
        setSuccessMessage(null);
      }, 500);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Failed to import campaign file');
    } finally {
      setIsImporting(false);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleTextImport = async () => {
    if (!importText.trim()) {
      setImportError('Please paste campaign JSON or upload a file');
      return;
    }

    setIsImporting(true);
    setImportError(null);
    setSuccessMessage(null);

    try {
      const imported = JSON.parse(importText) as Campaign;

      // Validate structure
      if (!imported.id || !imported.name || typeof imported.description !== 'string' || !Array.isArray(imported.campaignPhishes)) {
        throw new Error('Invalid campaign structure. Required: id, name, description (string), campaignPhishes (array)');
      }

      // Check for duplicate ID
      if (existingCampaigns.some(c => c.id === imported.id)) {
        // Generate new ID and add "(copy)" suffix
        imported.id = crypto.randomUUID();
        imported.name = imported.name.endsWith(' (copy)') ? imported.name : `${imported.name} (copy)`;
      }

      await onImport({
        name: imported.name,
        description: imported.description,
        campaignPhishes: imported.campaignPhishes,
      });

      setImportError(null);
      setSuccessMessage('Campaign imported successfully!');
      setImportText('');
      setTimeout(() => {
        onClose();
        setSuccessMessage(null);
      }, 500);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Failed to parse campaign JSON');
    } finally {
      setIsImporting(false);
    }
  };

  const isImportDisabled = !importText.trim() && !fileInputRef.current?.files?.length || isImporting;

  if (!isOpen) return null;

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
  };

  const modalContentStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '80vh',
    overflow: 'auto',
    position: 'relative'
  };

  const headerStyle: React.CSSProperties = {
    padding: '20px 24px 16px',
    borderBottom: '1px solid #e9ecef',
    margin: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: '#212529'
  };

  const closeButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666',
    padding: '4px',
    lineHeight: 1
  };

  const sectionStyle: React.CSSProperties = {
    padding: '20px 24px'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    fontSize: '14px',
    color: '#495057'
  };

  const fileButtonStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '10px 16px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #6c757d',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#495057',
    marginBottom: '16px'
  };

  const textareaStyle: React.CSSProperties = {
    width: '100%',
    minHeight: '120px',
    padding: '10px',
    border: '1px solid #ced4da',
    borderRadius: '6px',
    fontSize: '13px',
    fontFamily: 'monospace',
    resize: 'vertical',
    boxSizing: 'border-box',
    marginBottom: '16px'
  };

  const errorStyle: React.CSSProperties = {
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c6cb',
    borderRadius: '6px',
    padding: '10px 14px',
    fontSize: '13px',
    color: '#721c24',
    marginBottom: '16px'
  };

  const successStyle: React.CSSProperties = {
    backgroundColor: '#d4edda',
    border: '1px solid #c3e6cb',
    borderRadius: '6px',
    padding: '10px 14px',
    fontSize: '13px',
    color: '#155724',
    marginBottom: '16px'
  };

  const loadingSpinner: React.CSSProperties = {
    display: 'inline-block',
    width: '14px',
    height: '14px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '50%',
    borderTopColor: 'white',
    animation: 'spin 0.8s linear infinite',
    marginRight: '8px'
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px'
  };

  const buttonStyle: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    border: 'none'
  };

  const cancelButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#f8f9fa',
    color: '#6c757d',
    border: '1px solid #6c757d'
  };

  const importButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: isImportDisabled ? '#ccc' : '#0066cc',
    color: 'white',
    cursor: isImportDisabled ? 'not-allowed' : 'pointer'
  };

  return (
    <div style={modalStyle} onClick={handleBackdropClick}>
      <div style={modalContentStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Import Campaign</h2>
          <button style={closeButtonStyle} onClick={onClose}>
            ×
          </button>
        </div>

        <div style={sectionStyle}>
          {/* File Upload */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Upload JSON File</label>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <button
                type="button"
                style={fileButtonStyle}
                onClick={() => fileInputRef.current?.click()}
              >
                Upload JSON file
              </button>
            </div>
          </div>

          {/* Text Paste */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Or Paste JSON</label>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste campaign JSON here..."
              style={textareaStyle}
            />
          </div>

          {/* Error Message */}
          {importError && (
            <div style={errorStyle}>
              {importError}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div style={successStyle}>
              {successMessage}
            </div>
          )}

          {/* Action Buttons */}
          <div style={buttonGroupStyle}>
            <button
              type="button"
              style={cancelButtonStyle}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              style={importButtonStyle}
              onClick={handleTextImport}
              disabled={isImportDisabled}
            >
              {isImporting && (
                <span style={loadingSpinner}></span>
              )}
              {isImporting ? 'Importing...' : 'Import'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
