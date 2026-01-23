import { useState, useEffect } from 'react';
import type { Campaign, CampaignPhish } from '../../types/campaign';
import type { Phish } from '../../types/phish';
import { CampaignPhishItem } from './CampaignPhishItem';
import { copyPhishForCampaign } from '../../utils/campaignCopy';

interface CampaignEditorProps {
  campaign: Campaign;
  onClose: () => void;
  onSave: (campaignId: string, updates: Partial<Omit<Campaign, 'id' | 'createdAt'>>) => void;
  currentProject: Phish;
}

interface FormData {
  name: string;
  description: string;
}

interface FormErrors {
  name?: string;
}

export function CampaignEditor({ campaign, onClose, onSave, currentProject }: CampaignEditorProps) {
  const [formData, setFormData] = useState<FormData>({
    name: campaign.name,
    description: campaign.description,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [campaignPhishes, setCampaignPhishes] = useState<CampaignPhish[]>(campaign.campaignPhishes);

  // Reset form when campaign changes
  useEffect(() => {
    setFormData({
      name: campaign.name,
      description: campaign.description,
    });
    setCampaignPhishes(campaign.campaignPhishes);
    setErrors({});
  }, [campaign]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Campaign name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSave(campaign.id, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        campaignPhishes,
      });
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDateChange = (phishId: string, date: string | undefined) => {
    setCampaignPhishes(prev =>
      prev.map(p =>
        p.id === phishId ? { ...p, scheduledDate: date } : p
      )
    );
  };

  const handleRemovePhish = (phishId: string) => {
    const phish = campaignPhishes.find(p => p.id === phishId);
    if (!phish) return;

    const confirmed = window.confirm(`Remove '${phish.metadata.title}' from campaign?`);
    if (confirmed) {
      setCampaignPhishes(prev => prev.filter(p => p.id !== phishId));
    }
  };

  const handleAddCurrentProject = () => {
    // Check for duplicate
    const isDuplicate = campaignPhishes.some(p => p.id === currentProject.id);
    if (isDuplicate) {
      alert('This project is already in the campaign');
      return;
    }

    const copiedPhish = copyPhishForCampaign(currentProject);
    setCampaignPhishes(prev => [...prev, copiedPhish]);
  };

  const handleCreateNewPhish = () => {
    const newPhishNumber = campaignPhishes.length + 1;
    const newPhish: CampaignPhish = {
      id: crypto.randomUUID(),
      htmlSource: '',
      annotations: {},
      metadata: {
        title: `New Phish ${newPhishNumber}`,
        createdAt: new Date().toISOString(),
      },
      scheduledDate: undefined,
    };
    setCampaignPhishes(prev => [...prev, newPhish]);
  };

  const isCurrentProjectInCampaign = campaignPhishes.some(p => p.id === currentProject.id);

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
          maxWidth: '700px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px',
          borderBottom: '1px solid #e1e5e9',
        }}>
          <h2 style={{ margin: 0, fontSize: '20px' }}>Edit Campaign</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0',
              lineHeight: 1,
              color: '#666',
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Content */}
          <div style={{ padding: '24px' }}>
            {/* Name Field */}
            <div style={{ marginBottom: '16px' }}>
              <label
                htmlFor="campaign-name"
                style={{
                  display: 'block',
                  marginBottom: '4px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                }}
              >
                Campaign Name <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                id="campaign-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Q1 Security Awareness Campaign"
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

            {/* Description Field */}
            <div style={{ marginBottom: '24px' }}>
              <label
                htmlFor="campaign-description"
                style={{
                  display: 'block',
                  marginBottom: '4px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                }}
              >
                Description
              </label>
              <textarea
                id="campaign-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this campaign..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Phishes Section */}
            <div style={{
              borderTop: '1px solid #e1e5e9',
              paddingTop: '16px',
              backgroundColor: '#f9fafb',
              padding: '16px',
              marginTop: '16px',
            }}>
              <div style={{ marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', marginBottom: '4px' }}>
                  Phishes in this campaign ({campaignPhishes.length})
                </h3>

                {/* Current Project Info */}
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                  <div>Current project: <strong>{currentProject.metadata.title}</strong></div>
                  <div>Current project will be copied into this campaign</div>
                </div>

                {/* Add Current Project Button */}
                <button
                  type="button"
                  onClick={handleAddCurrentProject}
                  disabled={isCurrentProjectInCampaign}
                  style={{
                    padding: '8px 16px',
                    fontSize: '13px',
                    backgroundColor: isCurrentProjectInCampaign ? '#ccc' : '#0066cc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isCurrentProjectInCampaign ? 'not-allowed' : 'pointer',
                    marginBottom: '12px',
                  }}
                >
                  {isCurrentProjectInCampaign ? 'Project Already Added' : '+ Add Current Project'}
                </button>

                {/* Create New Phish Button */}
                <button
                  type="button"
                  onClick={handleCreateNewPhish}
                  style={{
                    padding: '8px 16px',
                    fontSize: '13px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginBottom: '12px',
                    marginLeft: '8px',
                  }}
                >
                  + Create New Phish
                </button>
              </div>

              {/* Phish List */}
              {campaignPhishes.length === 0 ? (
                <div style={{
                  padding: '20px',
                  textAlign: 'center',
                  color: '#666',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  border: '1px dashed #ccc',
                  borderRadius: '4px',
                }}>
                  No phishes in this campaign
                  <div style={{ fontSize: '12px', marginTop: '4px' }}>
                    Add your current project to get started
                  </div>
                </div>
              ) : (
                <div style={{
                  border: '1px solid #e1e5e9',
                  borderRadius: '4px',
                  maxHeight: '300px',
                  overflow: 'auto',
                  backgroundColor: 'white',
                }}>
                  {campaignPhishes.map(phish => (
                    <CampaignPhishItem
                      key={phish.id}
                      phish={phish}
                      onDateChange={handleDateChange}
                      onRemove={handleRemovePhish}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            padding: '16px 24px',
            borderTop: '1px solid #e1e5e9',
          }}>
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
