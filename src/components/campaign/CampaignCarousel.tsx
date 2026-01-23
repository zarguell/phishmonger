import { useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Campaign } from '../../types/campaign';
import { CarouselCard } from './CarouselCard';

interface CampaignCarouselProps {
  campaign: Campaign;
  onCardClick: (phish: CampaignPhish) => void;
}

export function CampaignCarousel({ campaign, onCardClick }: CampaignCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedPhishId, setSelectedPhishId] = useState<string | null>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Keyboard navigation with arrow keys
  useHotkeys('arrowleft', (e) => {
    e.preventDefault();
    scrollLeft();
  }, { enableOnFormTags: true }, [scrollContainerRef]);

  useHotkeys('arrowright', (e) => {
    e.preventDefault();
    scrollRight();
  }, { enableOnFormTags: true }, [scrollContainerRef]);

  const handleCardClick = (phish: CampaignPhish) => {
    setSelectedPhishId(phish.id);
    onCardClick(phish);

    // Scroll the clicked card into view
    const cardElement = document.getElementById(`carousel-card-${phish.id}`);
    if (cardElement) {
      cardElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  };

  // Handle empty campaign
  if (campaign.campaignPhishes.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 20px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
          <div
            style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px',
            }}
          >
            No phishes in this campaign
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            Add phishes to this campaign to see them in the carousel
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Navigation buttons */}
      <button
        onClick={scrollLeft}
        style={{
          position: 'absolute',
          left: '8px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'white',
          border: '1px solid #d1d5db',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          color: '#374151',
          transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f3f4f6';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'white';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        }}
        aria-label="Scroll left"
      >
        ‹
      </button>

      <button
        onClick={scrollRight}
        style={{
          position: 'absolute',
          right: '8px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'white',
          border: '1px solid #d1d5db',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          color: '#374151',
          transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f3f4f6';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'white';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        }}
        aria-label="Scroll right"
      >
        ›
      </button>

      {/* Scroll container */}
      <div
        ref={scrollContainerRef}
        tabIndex={0}
        style={{
          display: 'flex',
          overflowX: 'scroll',
          scrollSnapType: 'x mandatory',
          gap: '16px',
          padding: '16px 56px', // Extra padding for navigation buttons
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE/Edge
          outline: 'none',
        }}
        onFocus={(e) => {
          e.currentTarget.style.outline = '2px solid #007bff';
          e.currentTarget.style.outlineOffset = '2px';
        }}
        onBlur={(e) => {
          e.currentTarget.style.outline = 'none';
        }}
      >
        <style>{`
          .carousel-scroll-container::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {campaign.campaignPhishes.map((phish) => (
          <div
            key={phish.id}
            id={`carousel-card-${phish.id}`}
            style={{
              flex: '0 0 200px',
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always',
            }}
          >
            <CarouselCard
              phish={phish}
              onClick={() => handleCardClick(phish)}
              isSelected={phish.id === selectedPhishId}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
