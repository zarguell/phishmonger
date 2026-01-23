import type { CampaignPhish } from '../../types/campaign'
import { SlideWrapper } from '../preview/SlideWrapper'
import { EmailColumn } from '../preview/EmailColumn'
import { AnnotationColumn } from '../preview/AnnotationColumn'

interface ReadOnlyEditorProps {
  phish: CampaignPhish
  onBack: () => void
}

/**
 * Read-only viewer for campaign phishes
 *
 * Displays email content and annotation cards without editing controls.
 * Users can browse phish content but cannot modify lures, annotations, or scoring.
 */
export function ReadOnlyEditor({ phish, onBack }: ReadOnlyEditorProps) {
  const hasContent = phish.htmlSource && phish.htmlSource.trim().length > 0

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#f5f7fa',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50,
      }}
    >
      {/* Header with back button */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          borderBottom: '1px solid #e1e5e9',
          backgroundColor: '#ffffff',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}
      >
        <button
          onClick={onBack}
          type="button"
          style={{
            backgroundColor: '#007bff',
            color: '#ffffff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#0056b3'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#007bff'
          }}
        >
          ← Back to Carousel
        </button>

        <h2
          style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: '600',
            color: '#2c3e50',
            flex: 1,
            textAlign: 'center',
            paddingRight: '140px', // Balance the back button width
          }}
        >
          {phish.metadata.title || 'Untitled Phish'}
        </h2>
      </div>

      {/* Main content area */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '24px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {!hasContent ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#6c757d',
              fontSize: '16px',
            }}
          >
            No email content available
          </div>
        ) : (
          <div
            style={{
              width: '100%',
              maxWidth: '1400px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
            }}
          >
            <SlideWrapper
              annotations={phish.annotations}
              scoring={phish.scoring}
              showBadge={!!phish.scoring}
            >
              <EmailColumn
                htmlSource={phish.htmlSource}
                annotations={phish.annotations}
                arrowStyle="classic"
              />
              <AnnotationColumn
                annotations={phish.annotations}
                arrowStyle="classic"
                showTags={true}
              />
            </SlideWrapper>
          </div>
        )}
      </div>
    </div>
  )
}
