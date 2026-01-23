import { useState, useMemo, useRef } from 'react';
import { Campaign } from '../../types/campaign';
import { CampaignCard } from './CampaignCard';
import { useCampaigns } from '../../hooks/useCampaigns';

interface CampaignManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onEditCampaign: (campaign: Campaign) => void;
  currentProject?: any; // Optional - for future "add current project" feature
}

export function CampaignManager({ isOpen, onClose, onEditCampaign }: CampaignManagerProps) {
  const { campaigns, addCampaign, deleteCampaign } = useCampaigns();
  const [searchQuery, setSearchQuery] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter campaigns based on search query
  const filteredCampaigns = useMemo(() => {
    if (!searchQuery.trim()) {
      return campaigns;
    }

    const query = searchQuery.toLowerCase().trim();
    return campaigns.filter(campaign =>
      campaign.name.toLowerCase().includes(query) ||
      campaign.description.toLowerCase().includes(query)
    );
  }, [campaigns, searchQuery]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDelete = (campaign: Campaign) => {
    if (window.confirm(`Delete "${campaign.name}"? This action cannot be undone.`)) {
      deleteCampaign(campaign.id);
    }
  };

  const handleExport = (campaign: Campaign) => {
    const jsonString = JSON.stringify(campaign, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${campaign.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const imported = JSON.parse(text) as Campaign;

      // Validate structure
      if (!imported.id || !imported.name || typeof imported.description !== 'string' || !Array.isArray(imported.campaignPhishes)) {
        throw new Error('Invalid campaign file structure');
      }

      // Check for duplicate ID
      if (campaigns.some(c => c.id === imported.id)) {
        // Generate new ID and add "(copy)" suffix
        imported.id = crypto.randomUUID();
        imported.name = imported.name.endsWith(' (copy)') ? imported.name : `${imported.name} (copy)`;
      }

      addCampaign({
        name: imported.name,
        description: imported.description,
        campaignPhishes: imported.campaignPhishes,
      });

      setImportError(null);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Failed to import campaign');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div
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
        zIndex: 50,
      }}
      onClick={handleBackdropClick}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          width: '90%',
          maxWidth: '960px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px',
            borderBottom: '1px solid #e1e5e9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>
            Campaigns
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666',
              padding: '4px',
            }}
          >
            ×
          </button>
        </div>

        {/* Filter bar */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #e1e5e9',
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
          }}
        >
          <div style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
          </div>
          <button
            onClick={() => {/* Will be wired in task 3 */}}
            style={{
              padding: '8px 16px',
              backgroundColor: '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Create New Campaign
          </button>
          <button
            onClick={handleImportClick}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f8f9fa',
              color: '#6c757d',
              border: '1px solid #6c757d',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Import
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          {importError && (
            <div style={{ color: '#dc2626', fontSize: '13px', maxWidth: '300px' }}>
              {importError}
            </div>
          )}
        </div>

        {/* Content area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
          }}
        >
          {filteredCampaigns.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(1, 1fr)',
                gap: '16px',
              }}
            >
              {filteredCampaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  onEdit={() => onEditCampaign(campaign)}
                  onDelete={() => handleDelete(campaign)}
                  onExport={() => handleExport(campaign)}
                />
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: '#666',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
              <div style={{ fontSize: '18px', marginBottom: '8px', fontWeight: '600' }}>
                {searchQuery.trim() ? 'No campaigns found' : 'No campaigns yet'}
              </div>
              <div style={{ fontSize: '14px', marginBottom: '24px' }}>
                {searchQuery.trim()
                  ? 'Try adjusting your search criteria.'
                  : 'Create campaigns to organize your phishing exercises'}
              </div>
              {!searchQuery.trim() && (
                <button
                  onClick={() => {/* Will be wired in task 3 */}}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#0066cc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                >
                  Create your first campaign
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
