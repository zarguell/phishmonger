import type { Annotation } from '../types/annotations'
import type { ScoringData } from '../types/scoring'

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

/**
 * Load scoring data from LocalStorage
 */
export function loadScoring(): ScoringData {
  try {
    const saved = localStorage.getItem('phishmonger-scoring')
    if (saved) {
      const parsed = JSON.parse(saved)
      return {
        visualCues: parsed.visualCues ?? 0,
        languageCues: parsed.languageCues ?? 0,
        premiseAlignment: parsed.premiseAlignment ?? 3
      }
    }
  } catch (error) {
    console.error('Failed to load scoring:', error)
  }
  return {
    visualCues: 0,
    languageCues: 0,
    premiseAlignment: 3
  }
}

/**
 * Save scoring data to LocalStorage
 */
export function saveScoring(scoring: ScoringData): void {
  try {
    localStorage.setItem('phishmonger-scoring', JSON.stringify(scoring))
  } catch (error) {
    console.error('Failed to save scoring:', error)
  }
}
