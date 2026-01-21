import { useState, useEffect, useRef } from 'react'
import { HTMLInput } from './components/HTMLInput'
import { Editor } from './components/Editor'
import type { InputMode } from './components/ModeToggle'
import { Preview } from './components/Preview'
import { LureList } from './components/LureList'
import { ScoringPanel } from './components/ScoringPanel'
import { SlideWrapper } from './components/preview/SlideWrapper'
import { EmailColumn } from './components/preview/EmailColumn'
import { AnnotationColumn } from './components/preview/AnnotationColumn'
import { ExportButton } from './components/export/ExportButton'
import type { Annotation } from './types/annotations'
import type { ScoringData } from './types/scoring'
import { loadAnnotations, saveAnnotations, loadScoring, saveScoring } from './utils/storage'
import './index.css'

const STORAGE_KEY = 'phishmonger-html-source'
const MODE_KEY = 'phishmonger-input-mode'

type ViewMode = 'edit' | 'preview'
type ScaleMode = 'scroll' | 'fit'

function App() {
  const [inputMode, setInputMode] = useState<InputMode>(() => {
    const savedMode = localStorage.getItem(MODE_KEY) as InputMode | null
    return savedMode || 'html'
  })
  const [htmlSource, setHtmlSource] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved || '<p>Start typing your phishing email here...</p>'
  })
  const [annotations, setAnnotations] = useState<Record<string, Annotation>>(() => {
    return loadAnnotations()
  })
  const [scoring, setScoring] = useState<ScoringData>(() => {
    return loadScoring()
  })
  const [viewMode, setViewMode] = useState<ViewMode>('edit')
  const [scaleMode, setScaleMode] = useState<ScaleMode>('fit')
  const [annotationWidth, setAnnotationWidth] = useState(640)
  const [showBadge, setShowBadge] = useState(true)
  const slideWrapperRef = useRef<HTMLDivElement>(null)

  // Save to LocalStorage whenever htmlSource changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, htmlSource)
  }, [htmlSource])

  // Save input mode preference
  useEffect(() => {
    localStorage.setItem(MODE_KEY, inputMode)
  }, [inputMode])

  // Save annotations to LocalStorage
  useEffect(() => {
    saveAnnotations(annotations)
  }, [annotations])

  // Save scoring to LocalStorage
  useEffect(() => {
    saveScoring(scoring)
  }, [scoring])

  // Calculate scale factor for "fit to screen" mode
  useEffect(() => {
    if (viewMode === 'preview' && scaleMode === 'fit') {
      const updateScale = () => {
        const container = document.querySelector('.slide-container') as HTMLElement
        const slideWrapper = slideWrapperRef.current
        if (container && slideWrapper) {
          const containerWidth = container.clientWidth
          const slideWidth = 1600 // Fixed width of slide-wrapper
          const slideHeight = 900 // Fixed height of slide-wrapper
          const padding = 80 // Account for container padding
          
          const availableWidth = containerWidth - padding
          const availableHeight = window.innerHeight - 200 // Account for header and padding
          
          const scaleX = availableWidth / slideWidth
          const scaleY = availableHeight / slideHeight
          const scale = Math.min(scaleX, scaleY, 1) // Don't scale up, only down
          
          slideWrapper.style.setProperty('--scale-factor', scale.toString())
        }
      }

      updateScale()
      window.addEventListener('resize', updateScale)
      return () => window.removeEventListener('resize', updateScale)
    }
  }, [viewMode, scaleMode])

  const updateAnnotation = (lureId: string, updates: Partial<Annotation>) => {
    setAnnotations(prev => ({
      ...prev,
      [lureId]: {
        ...prev[lureId],
        ...updates,
        lureId,
        updatedAt: new Date().toISOString()
      }
    }))
  }

  const updateScoring = (updates: Partial<ScoringData>) => {
    setScoring(prev => ({
      ...prev,
      ...updates
    }))
  }

  const handleMarkLure = (updatedHtml: string) => {
    setHtmlSource(updatedHtml)
  }

  const handleRemoveLure = (lureId: string) => {
    // Remove all spans with matching data-lure-id from HTML source
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlSource, 'text/html')
    const lureElements = doc.querySelectorAll(`[data-lure-id="${lureId}"]`)

    lureElements.forEach((el) => {
      const parent = el.parentNode
      if (parent) {
        while (el.firstChild) {
          parent.insertBefore(el.firstChild, el)
        }
        parent.removeChild(el)
      }
    })

    setHtmlSource(doc.body.innerHTML)

    // Remove annotation
    setAnnotations(prev => {
      const { [lureId]: removed, ...rest } = prev
      return rest
    })
  }

  if (viewMode === 'preview') {
    return (
      <div className="app app-preview-mode">
        <header className="app-header">
          <h1>Phish Monger - Preview Mode</h1>
          <div className="header-actions">
            <div className="scale-toggle">
              <button
                className={scaleMode === 'fit' ? 'active' : ''}
                onClick={() => setScaleMode('fit')}
                type="button"
              >
                Scale to Fit
              </button>
              <button
                className={scaleMode === 'scroll' ? 'active' : ''}
                onClick={() => setScaleMode('scroll')}
                type="button"
              >
                Full Width
              </button>
            </div>
            <div className="width-slider-container">
              <label htmlFor="annotation-width-slider">Annotation Width</label>
              <input
                id="annotation-width-slider"
                type="range"
                min="400"
                max="800"
                step="20"
                value={annotationWidth}
                onChange={(e) => setAnnotationWidth(Number(e.target.value))}
                className="width-slider"
              />
              <span className="width-value">{annotationWidth}px</span>
            </div>
            <button
              onClick={() => setViewMode('edit')}
              className="back-to-edit-button"
              type="button"
            >
              Back to Edit
            </button>
            <ExportButton
              slideWrapperRef={slideWrapperRef}
              projectTitle="phish-analysis"
            />
          </div>
        </header>
        <main className="app-main app-main-preview">
          <div className={`slide-container scale-mode-${scaleMode}`}>
            <SlideWrapper
              ref={slideWrapperRef}
              annotations={annotations}
              scoring={scoring}
              showBadge={showBadge}
            >
              <EmailColumn htmlSource={htmlSource} annotations={annotations} />
              <AnnotationColumn 
                annotations={annotations}
                width={annotationWidth}
              />
            </SlideWrapper>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Phish Monger</h1>
        <p>Phishing Email Annotation Tool</p>
        <div className="header-actions">
          <button
            onClick={() => setViewMode('preview')}
            className="preview-mode-button"
            type="button"
            disabled={Object.keys(annotations).length === 0}
          >
            Preview Mode
          </button>
        </div>
      </header>
      <main className="app-main">
        <div className="input-column">
          <div className="mode-toggle">
            <label className="mode-toggle-label">
              <input
                type="radio"
                name="inputMode"
                value="html"
                checked={inputMode === 'html'}
                onChange={(e) => setInputMode(e.target.value as InputMode)}
              />
              <span>HTML Input</span>
            </label>
            <label className="mode-toggle-label">
              <input
                type="radio"
                name="inputMode"
                value="richtext"
                checked={inputMode === 'richtext'}
                onChange={(e) => setInputMode(e.target.value as InputMode)}
              />
              <span>Rich Text</span>
            </label>
          </div>
          {inputMode === 'html' ? (
            <HTMLInput
              value={htmlSource}
              onChange={setHtmlSource}
            />
          ) : (
            <Editor
              content={htmlSource}
              onUpdate={setHtmlSource}
            />
          )}
        </div>
        <div className="preview-column">
          <Preview
            htmlSource={htmlSource}
            onUpdate={handleMarkLure}
          />
        </div>
        <div className="lure-list-column">
          <LureList
            htmlSource={htmlSource}
            onRemoveLure={handleRemoveLure}
            annotations={annotations}
            onUpdateAnnotation={updateAnnotation}
          />
        </div>
        <div className="scoring-column">
          <ScoringPanel
            scoring={scoring}
            onUpdate={updateScoring}
            showBadge={showBadge}
            onBadgeToggle={setShowBadge}
          />
        </div>
      </main>
    </div>
  )
}

export default App
