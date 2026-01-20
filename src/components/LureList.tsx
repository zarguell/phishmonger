import { useEffect, useState } from 'react'

interface Lure {
  id: string
  text: string
}

interface LureListProps {
  htmlSource: string
}

export function LureList({ htmlSource }: LureListProps) {
  const [lures, setLures] = useState<Lure[]>([])

  useEffect(() => {
    // Parse HTML source to extract all data-lure-id attributes
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlSource, 'text/html')
    const lureElements = doc.querySelectorAll('[data-lure-id]')

    const extractedLures: Lure[] = []
    lureElements.forEach((el) => {
      const lureId = el.getAttribute('data-lure-id')
      const text = el.textContent?.slice(0, 50) || ''
      if (lureId) {
        extractedLures.push({ id: lureId, text })
      }
    })

    setLures(extractedLures)
  }, [htmlSource])

  const scrollToLure = (lureId: string) => {
    const lureElement = document.querySelector(`[data-lure-id="${lureId}"]`)
    if (lureElement) {
      lureElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      // Flash highlight
      lureElement.classList.add('lure-flash')
      setTimeout(() => {
        lureElement.classList.remove('lure-flash')
      }, 1000)
    }
  }

  return (
    <div className="lure-list">
      <h2>Lures ({lures.length})</h2>
      {lures.length === 0 ? (
        <p className="lure-list-empty">No lures marked yet. Select text in Preview and click "Mark Lure".</p>
      ) : (
        <ul className="lure-list-items">
          {lures.map((lure) => (
            <li key={lure.id} className="lure-list-item">
              <button
                onClick={() => scrollToLure(lure.id)}
                className="lure-list-btn"
                type="button"
              >
                <span className="lure-id">{lure.id.slice(0, 8)}</span>
                <span className="lure-text">"{lure.text}"</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
