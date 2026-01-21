import type { Annotation } from '../../types/annotations'
import arrowStyles from '../../styles/arrows.module.css'

interface EmailColumnProps {
  htmlSource: string
  annotations: Record<string, Annotation>
  arrowStyle?: string
}

export function EmailColumn({ htmlSource, annotations, arrowStyle = 'classic' }: EmailColumnProps) {
  // Post-process HTML to add numbered badges to lure marks
  const getHtmlWithBadges = (): string => {
    // Parse HTML to DOM
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlSource, 'text/html')

    // Get all lure marks and sort by creation order for sequential numbering
    const lureMarks = Array.from(doc.querySelectorAll('[data-lure-id]'))
    const sortedLures = lureMarks.sort((a, b) => {
      const aId = a.getAttribute('data-lure-id')!
      const bId = b.getAttribute('data-lure-id')!
      const aAnnotation = annotations[aId]
      const bAnnotation = annotations[bId]

      // Sort by createdAt timestamp if annotations exist
      if (aAnnotation && bAnnotation) {
        return new Date(aAnnotation.createdAt).getTime() - new Date(bAnnotation.createdAt).getTime()
      }
      return 0
    })

    // Add numbered badges to each unique lure ID
    const processedIds = new Set<string>()
    let annotationNumber = 1

    sortedLures.forEach((lure) => {
      const lureId = lure.getAttribute('data-lure-id')!
      if (!processedIds.has(lureId)) {
        processedIds.add(lureId)

        // Only add badge if annotation exists
        if (annotations[lureId]) {
          const badge = doc.createElement('span')
          // Apply arrow style class to badge
          const styleClass = `lure-badge-${arrowStyle}`
          badge.className = `lure-badge ${arrowStyles[styleClass] || ''}`
          badge.textContent = annotationNumber.toString()
          badge.setAttribute('data-annotation-number', annotationNumber.toString())

          // Insert badge after the lure mark span
          lure.parentNode?.insertBefore(badge, lure.nextSibling)

          annotationNumber++
        }
      }
    })

    return doc.body.innerHTML
  }

  return (
    <div className="email-column">
      {/* Inner container ensures width: 100% and proper padding */}
      <div
        className="email-content"
        dangerouslySetInnerHTML={{ __html: getHtmlWithBadges() }}
      />
    </div>
  )
}