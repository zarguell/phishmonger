import { useState, useRef, useEffect } from 'react';
import type { Campaign, CampaignPhish } from '../../types/campaign';
import { CampaignCarousel } from './CampaignCarousel';
import { ReadOnlyEditor } from './ReadOnlyEditor';

interface CampaignCarouselModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign;
}

type ViewMode = 'carousel' | 'readonly-editor';

/**
 * Modal container integrating carousel and read-only editor with view state management
 *
 * Provides modal interface for browsing campaign phishes with seamless transitions
 * between carousel and detail views. Scroll position is preserved when switching views.
 */
export function CampaignCarouselModal({
  isOpen,
  onClose,
  campaign,
}: CampaignCarouselModalProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('carousel');
  const [selectedPhish, setSelectedPhish] = useState<CampaignPhish | null>(null);
  const [carouselScrollPosition, setCarouselScrollPosition] = useState(0);

  const carouselContainerRef = useRef<HTMLDivElement>(null);

  // Restore scroll position when returning to carousel view
  useEffect(() => {
    if (viewMode === 'carousel' && carouselContainerRef.current) {
      carouselContainerRef.current.scrollLeft = carouselScrollPosition;
    }
  }, [viewMode, carouselScrollPosition]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCardClick = (phish: CampaignPhish) => {
    // Capture current scroll position before switching
    if (carouselContainerRef.current) {
      setCarouselScrollPosition(carouselContainerRef.current.scrollLeft);
    }

    setSelectedPhish(phish);
    setViewMode('readonly-editor');
  };

  const handleBackToCarousel = () => {
    setViewMode('carousel');
    // selectedPhish is kept for highlighting in carousel
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setViewMode('carousel');
      setSelectedPhish(null);
      setCarouselScrollPosition(0);
    }
  }, [isOpen]);

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
          maxWidth: '1200px',
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
          <h2
            style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: '600',
            }}
          >
            {viewMode === 'carousel'
              ? `${campaign.name} (${campaign.campaignPhishes.length} phish${campaign.campaignPhishes.length !== 1 ? 'es' : ''})`
              : (selectedPhish?.metadata.title || 'Untitled Phish')}
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

        {/* Content area - conditional rendering keeps both mounted */}
        <div
          ref={carouselContainerRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
          }}
        >
          {viewMode === 'carousel' && (
            <CampaignCarousel
              campaign={campaign}
              onCardClick={handleCardClick}
            />
          )}

          {viewMode === 'readonly-editor' && selectedPhish && (
            <ReadOnlyEditor
              phish={selectedPhish}
              onBack={handleBackToCarousel}
            />
          )}
        </div>
      </div>
    </div>
  );
}
