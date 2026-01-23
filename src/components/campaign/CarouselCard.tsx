import { useState } from 'react';
import type { CampaignPhish } from '../../types/campaign';

interface CarouselCardProps {
  phish: CampaignPhish;
  onClick: () => void;
  isSelected?: boolean;
}

export function CarouselCard({ phish, onClick, isSelected = false }: CarouselCardProps) {
  const [imageError, setImageError] = useState(false);

  // Count annotations from the Record<string, Annotation>
  const annotationCount = Object.keys(phish.annotations).length;

  // Format scheduled date
  const formattedDate = phish.scheduledDate
    ? new Date(phish.scheduledDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'No date set';

  return (
    <div
      onClick={onClick}
      style={{
        flex: '0 0 200px',
        width: '200px',
        border: `2px solid ${isSelected ? '#007bff' : 'transparent'}`,
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'border-color 0.2s ease, transform 0.2s ease',
        backgroundColor: 'white',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.transform = 'translateY(-4px)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Thumbnail area */}
      <div
        style={{
          width: '100%',
          aspectRatio: '1/1',
          backgroundColor: '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {phish.metadata.thumbnailUrl && !imageError ? (
          <img
            src={phish.metadata.thumbnailUrl}
            alt={phish.metadata.title}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            style={{
              fontSize: '48px',
              color: '#9ca3af',
            }}
          >
            🎣
          </div>
        )}
      </div>

      {/* Metadata section */}
      <div
        style={{
          padding: '12px',
        }}
      >
        {/* Title */}
        <div
          style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '4px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: '1.3',
          }}
        >
          {phish.metadata.title}
        </div>

        {/* Scheduled date */}
        <div
          style={{
            fontSize: '12px',
            color: '#666',
            marginBottom: '4px',
          }}
        >
          {formattedDate}
        </div>

        {/* Annotation count */}
        <div
          style={{
            fontSize: '12px',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              backgroundColor: '#e5e7eb',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '500',
            }}
          >
            {annotationCount} {annotationCount === 1 ? 'annotation' : 'annotations'}
          </span>
        </div>
      </div>
    </div>
  );
}
