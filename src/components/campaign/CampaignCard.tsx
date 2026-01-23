import { Campaign } from '../../types/campaign';

interface CampaignCardProps {
  campaign: Campaign;
  onEdit: () => void;
  onDelete: () => void;
  onExport: () => void;
  onExportICal: () => void;
}

export function CampaignCard({ campaign, onEdit, onDelete, onExport, onExportICal }: CampaignCardProps) {
  // Calculate date range from campaign phishes
  const getDateRange = () => {
    const scheduledDates = campaign.campaignPhishes
      .map(phish => phish.scheduledDate)
      .filter((date): date is string => date !== undefined && date !== '')
      .map(dateStr => new Date(dateStr))
      .filter(date => !isNaN(date.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());

    if (scheduledDates.length === 0) {
      return 'No dates set';
    }

    if (scheduledDates.length === 1) {
      return scheduledDates[0].toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }

    // Multiple dates - show range
    const startDate = scheduledDates[0];
    const endDate = scheduledDates[scheduledDates.length - 1];
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    const startFormatted = startDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const endFormatted = endDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return `${startFormatted} - ${endFormatted} (${daysDiff} days)`;
  };

  const phishCount = campaign.campaignPhishes.length;
  const phishLabel = phishCount === 1 ? '1 phish' : `${phishCount} phish`;
  const dateRange = getDateRange();

  return (
    <div style={{
      border: '1px solid #e1e5e9',
      borderRadius: '8px',
      padding: '16px',
      backgroundColor: 'white',
      transition: 'box-shadow 0.2s ease-in-out',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{
            margin: '0 0 8px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: '#333',
          }}>
            {campaign.name}
          </h3>
          {campaign.description && (
            <p style={{
              margin: '0 0 12px 0',
              fontSize: '14px',
              color: '#666',
              lineHeight: '1.4',
            }}>
              {campaign.description}
            </p>
          )}
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: '16px',
        fontSize: '13px',
        color: '#666',
        marginBottom: '16px',
      }}>
        <div>
          <strong>{phishLabel}</strong>
        </div>
        <div>
          {dateRange}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          onClick={onEdit}
          style={{
            padding: '6px 12px',
            fontSize: '13px',
            backgroundColor: '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
          }}
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          style={{
            padding: '6px 12px',
            fontSize: '13px',
            backgroundColor: '#fff0f0',
            color: '#cc0000',
            border: '1px solid #cc0000',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Delete
        </button>
        <button
          onClick={onExport}
          style={{
            padding: '6px 12px',
            fontSize: '13px',
            backgroundColor: '#f8f9fa',
            color: '#6c757d',
            border: '1px solid #6c757d',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Export
        </button>
        <button
          onClick={onExportICal}
          style={{
            padding: '6px 12px',
            fontSize: '13px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Export Calendar
        </button>
      </div>
    </div>
  );
}
