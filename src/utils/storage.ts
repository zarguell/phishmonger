import type { Annotation } from '../types/annotations'

const ANNOTATIONS_KEY = 'phishmonger-annotations'

export const loadAnnotations = (): Record<string, Annotation> => {
  try {
    const saved = localStorage.getItem(ANNOTATIONS_KEY)
    return saved ? JSON.parse(saved) : {}
  } catch (error) {
    console.error('Failed to load annotations:', error)
    return {}
  }
}

export const saveAnnotations = (annotations: Record<string, Annotation>) => {
  try {
    localStorage.setItem(ANNOTATIONS_KEY, JSON.stringify(annotations))
  } catch (error) {
    console.error('Failed to save annotations:', error)
  }
}
