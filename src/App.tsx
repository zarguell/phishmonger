import { useState, useEffect } from 'react'
import { HTMLInput } from './components/HTMLInput'
import { Editor } from './components/Editor'
import type { InputMode } from './components/ModeToggle'
import { Preview } from './components/Preview'
import { LureList } from './components/LureList'
import './index.css'

const STORAGE_KEY = 'phishmonger-html-source'
const MODE_KEY = 'phishmonger-input-mode'

function App() {
  const [inputMode, setInputMode] = useState<InputMode>(() => {
    const savedMode = localStorage.getItem(MODE_KEY) as InputMode | null
    return savedMode || 'html'
  })
  const [htmlSource, setHtmlSource] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved || '<p>Start typing your phishing email here...</p>'
  })

  // Save to LocalStorage whenever htmlSource changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, htmlSource)
  }, [htmlSource])

  // Save input mode preference
  useEffect(() => {
    localStorage.setItem(MODE_KEY, inputMode)
  }, [inputMode])

  const handleMarkLure = (updatedHtml: string) => {
    setHtmlSource(updatedHtml)
  }

  const handleRemoveLure = (lureId: string) => {
    // Remove all spans with matching data-lure-id from HTML source
    // Keep the text content, unwrap the spans
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlSource, 'text/html')
    const lureElements = doc.querySelectorAll(`[data-lure-id="${lureId}"]`)

    lureElements.forEach((el) => {
      const parent = el.parentNode
      if (parent) {
        // Replace the span with its text content (unwrap)
        while (el.firstChild) {
          parent.insertBefore(el.firstChild, el)
        }
        parent.removeChild(el)
      }
    })

    setHtmlSource(doc.body.innerHTML)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Phish Monger</h1>
        <p>Phishing Email Annotation Tool</p>
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
          <LureList htmlSource={htmlSource} onRemoveLure={handleRemoveLure} />
        </div>
      </main>
    </div>
  )
}

export default App
