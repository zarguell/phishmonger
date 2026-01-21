import { useState, useEffect, useRef } from 'react'
import { HTMLInput } from './components/HTMLInput'
import { Editor } from './components/Editor'
import type { InputMode } from './components/ModeToggle'
import { Preview } from './components/Preview'
import { LureList } from './components/LureList'
import { SlideWrapper } from './components/preview/SlideWrapper'
import { EmailColumn } from './components/preview/EmailColumn'
import { AnnotationColumn } from './components/preview/AnnotationColumn'
import { ExportButton } from './components/export/ExportButton'
import type { Annotation } from './types/annotations'
import { loadAnnotations, saveAnnotations } from './utils/storage'
import './index.css'

const STORAGE_KEY = 'phishmonger-html-source'
const MODE_KEY = 'phishmonger-input-mode'

type ViewMode = 'edit' | 'preview'

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
  const [viewMode, setViewMode] = useState<ViewMode>('edit')
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
          <SlideWrapper
            ref={slideWrapperRef}
            annotations={annotations}
          >
            <EmailColumn htmlSource={htmlSource} annotations={annotations} />
            <AnnotationColumn annotations={annotations} onUpdateAnnotation={updateAnnotation} />
          </SlideWrapper>
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
      </main>
    </div>
  )
}

export default App
