import { useState, useEffect } from 'react'
import { Editor } from './components/Editor'
import './index.css'

const STORAGE_KEY = 'phishmonger-editor-content'

function App() {
  const [content, setContent] = useState(() => {
    // Load from LocalStorage on mount
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved || '<p>Start typing your phishing email here...</p>'
  })

  // Save to LocalStorage whenever content changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, content)
  }, [content])

  return (
    <div className="app">
      <header className="app-header">
        <h1>Phish Monger</h1>
        <p>Phishing Email Annotation Tool</p>
      </header>
      <main className="app-main">
        <Editor
          content={content}
          onUpdate={setContent}
        />
        <div className="preview">
          <h2>HTML Preview</h2>
          <pre>{content}</pre>
        </div>
      </main>
    </div>
  )
}

export default App
