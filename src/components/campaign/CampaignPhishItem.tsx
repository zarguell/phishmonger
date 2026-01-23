import { CampaignPhish } from '../../types/campaign';

interface CampaignPhishItemProps {
  phish: CampaignPhish;
  onDateChange: (phishId: string, date: string | undefined) => void;
  onRemove: (phishId: string) => void;
  onEdit?: (phish: CampaignPhish) => void;
  campaignId?: string;
}

export function CampaignPhishItem({ phish, onDateChange, onRemove, onEdit, campaignId }: CampaignPhishItemProps) {
  // Convert ISO date string to YYYY-MM-DD format for date input
  const getDateInputValue = (isoDate: string | undefined): string => {
    if (!isoDate) return '';
    return isoDate.split('T')[0];
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    // Pass YYYY-MM-DD format directly (valid ISO date format)
    onDateChange(phish.id, dateValue || undefined);
  };

  const handleRemove = () => {
    onRemove(phish.id);
  };

  const phishTitle = phish.metadata?.title || 'Untitled Phish';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      borderBottom: '1px solid #e1e5e9',
      padding: '12px',
      gap: '16px',
    }}>
      <div style={{
        flex: 1,
        fontSize: '14px',
        color: '#333',
      }}>
        {phishTitle}
      </div>

      <div>
        <input
          type="date"
          value={getDateInputValue(phish.scheduledDate)}
          onChange={handleDateChange}
          style={{
            padding: '6px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            fontSize: '13px',
            fontFamily: 'inherit',
          }}
        />
      </div>

      {onEdit && (
        <button
          onClick={() => campaignId && onEdit(phish)}
          style={{
            padding: '6px 12px',
            fontSize: '13px',
            backgroundColor: '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Edit
        </button>
      )}

      <button
        onClick={handleRemove}
        style={{
          padding: '6px 12px',
          fontSize: '13px',
          backgroundColor: '#fff0f0',
          color: '#cc0000',
          border: '1px solid #cc0000',
          borderRadius: '4px',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        Remove
      </button>
    </div>
  );
}
