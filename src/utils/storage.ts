import type { Annotation } from '../types/annotations'
import type { ProjectMetadata } from '../types/project'
import type { ScoringData } from '../types/scoring'
import type { InputMode } from '../components/ModeToggle'

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

const METADATA_KEY = 'phishmonger-metadata'

/**
 * Load project metadata from LocalStorage
 * Returns default metadata if no saved data exists
 */
export const loadMetadata = (): ProjectMetadata => {
  try {
    const saved = localStorage.getItem(METADATA_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      return {
        title: parsed.title || 'Untitled Project',
        author: parsed.author || '',
        createdAt: parsed.createdAt || new Date().toISOString()
      }
    }
  } catch (error) {
    console.error('Failed to load metadata:', error)
  }
  // Default metadata for new projects
  return {
    title: 'Untitled Project',
    author: '',
    createdAt: new Date().toISOString()
  }
}

/**
 * Save project metadata to LocalStorage
 * Automatically adds updatedAt timestamp
 */
export const saveMetadata = (metadata: ProjectMetadata) => {
  try {
    const toSave = {
      ...metadata,
      updatedAt: new Date().toISOString()
    }
    localStorage.setItem(METADATA_KEY, JSON.stringify(toSave))
  } catch (error) {
    console.error('Failed to save metadata:', error)
  }
}

/**
 * Project export/import interface
 */
export interface ProjectJSON {
  metadata: ProjectMetadata
  htmlSource: string
  annotations: Record<string, Annotation>
  scoring: ScoringData
  inputMode: InputMode
}

/**
 * Export project data as JSON string
 */
export const exportProjectJSON = (
  metadata: ProjectMetadata,
  htmlSource: string,
  annotations: Record<string, Annotation>,
  scoring: ScoringData,
  inputMode: InputMode
): string => {
  const project: ProjectJSON = {
    metadata,
    htmlSource,
    annotations,
    scoring,
    inputMode
  }
  return JSON.stringify(project, null, 2)
}

/**
 * Import project data from JSON string with validation
 */
export const importProjectJSON = (jsonString: string): ProjectJSON => {
  try {
    const parsed = JSON.parse(jsonString)

    // Validate structure
    if (!parsed.metadata || !parsed.htmlSource || !parsed.annotations || !parsed.scoring) {
      throw new Error('Invalid project JSON: missing required fields')
    }

    // Validate metadata fields
    if (!parsed.metadata.title || typeof parsed.metadata.title !== 'string') {
      throw new Error('Invalid project JSON: metadata.title is required')
    }

    if (!parsed.metadata.createdAt || typeof parsed.metadata.createdAt !== 'string') {
      throw new Error('Invalid project JSON: metadata.createdAt is required')
    }

    return parsed
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON format')
    }
    throw error
  }
}

/**
 * Download project JSON as file
 */
export const downloadProjectJSON = (jsonString: string, filename: string) => {
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
