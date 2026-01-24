import { useState, useEffect } from 'react'
import type { CampaignPhish } from '../../types/campaign'
import { loadCompactLayout, saveCompactLayout } from '../../utils/storage'
import { downloadCleanHtml, copyCleanHtmlToClipboard, generateCleanHtmlFilename } from '../../utils/cleanHtmlExport'
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
  const [showAnnotations, setShowAnnotations] = useState(true)
  const [compactLayout, setCompactLayout] = useState(() => loadCompactLayout())
  const hasContent = phish.htmlSource && phish.htmlSource.trim().length > 0

  // Persist compact layout preference
  useEffect(() => {
    saveCompactLayout(compactLayout)
  }, [compactLayout])

  const handleCopyHTML = async () => {
    try {
      await navigator.clipboard.writeText(phish.htmlSource)
      alert('HTML copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy HTML:', error)
      alert('Failed to copy HTML')
    }
  }

  const handleDownloadCleanHTML = () => {
    const filename = generateCleanHtmlFilename(phish.metadata.title)
    downloadCleanHtml(phish.htmlSource, filename)
  }

  const handleCopyCleanHTML = async () => {
    try {
      await copyCleanHtmlToClipboard(phish.htmlSource)
      alert('Clean HTML copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy clean HTML:', error)
      alert('Failed to copy clean HTML')
    }
  }

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
      {/* Header with back button and controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          borderBottom: '1px solid #e1e5e9',
          backgroundColor: '#ffffff',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          gap: '12px',
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
          }}
        >
          {phish.metadata.title || 'Untitled Phish'}
        </h2>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setShowAnnotations(!showAnnotations)}
            type="button"
            style={{
              backgroundColor: showAnnotations ? '#6c757d' : '#28a745',
              color: '#ffffff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            title={showAnnotations ? 'Hide annotations' : 'Show annotations'}
          >
            {showAnnotations ? 'Hide Annotations' : 'Show Annotations'}
          </button>

          <button
            onClick={() => setCompactLayout(!compactLayout)}
            type="button"
            style={{
              backgroundColor: compactLayout ? '#6c757d' : '#8b5cf6',
              color: '#ffffff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            title={compactLayout ? 'Switch to expanded view' : 'Switch to compact view'}
          >
            {compactLayout ? 'Expanded View' : 'Compact View'}
          </button>

          <button
            onClick={handleCopyHTML}
            type="button"
            style={{
              backgroundColor: '#17a2b8',
              color: '#ffffff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            title="Copy raw HTML to clipboard"
          >
            Copy HTML
          </button>

          <button
            onClick={handleDownloadCleanHTML}
            type="button"
            style={{
              backgroundColor: '#28a745',
              color: '#ffffff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#218838'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#28a745'
            }}
            title="Download clean HTML file without annotations"
          >
            Download Clean HTML
          </button>

          <button
            onClick={handleCopyCleanHTML}
            type="button"
            style={{
              backgroundColor: '#fd7e14',
              color: '#ffffff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e36a09'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fd7e14'
            }}
            title="Copy clean HTML to clipboard without annotations"
          >
            Copy Clean HTML
          </button>
        </div>
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
              annotations={showAnnotations ? phish.annotations : {}}
              scoring={phish.scoring}
              showBadge={!!phish.scoring && showAnnotations}
              compactAnnotations={compactLayout}
            >
              <EmailColumn
                htmlSource={phish.htmlSource}
                annotations={showAnnotations ? phish.annotations : {}}
                arrowStyle="classic"
              />
              {showAnnotations && (
                <AnnotationColumn
                  annotations={phish.annotations}
                  arrowStyle="classic"
                  showTags={true}
                />
              )}
            </SlideWrapper>
          </div>
        )}
      </div>
    </div>
  )
}
