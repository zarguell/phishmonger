import type { Annotation } from '../types/annotations'
import type { ProjectMetadata } from '../types/project'
import type { ScoringData } from '../types/scoring'
import type { InputMode } from '../components/ModeToggle'
import type { CustomTechnique } from '../types/library'
import type { Campaign } from '../types/campaign'
import type { ColumnID } from '../types/columns'

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
 * Load phish metadata from LocalStorage
 * Returns default metadata if no saved data exists
 */
export const loadPhishMetadata = (): ProjectMetadata => {
  try {
    const saved = localStorage.getItem(METADATA_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      return {
        title: parsed.title || 'Untitled Phish',
        author: parsed.author || '',
        createdAt: parsed.createdAt || new Date().toISOString()
      }
    }
  } catch (error) {
    console.error('Failed to load metadata:', error)
  }
  // Default metadata for new phishes
  return {
    title: 'Untitled Phish',
    author: '',
    createdAt: new Date().toISOString()
  }
}

/**
 * Save phish metadata to LocalStorage
 * Automatically adds updatedAt timestamp
 */
export const savePhishMetadata = (metadata: ProjectMetadata) => {
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
 * Check if user has existing phish data (for backward compatibility)
 *
 * Returns true if the user has customized their phish metadata,
 * indicating they are an existing user who should see the editor view.
 *
 * @returns true if user has existing data, false for new users
 */
export function hasExistingPhishData(): boolean {
  try {
    const metadataStr = localStorage.getItem(METADATA_KEY);
    if (!metadataStr) {
      return false; // No data at all - new user
    }

    const metadata = JSON.parse(metadataStr);
    // Check if user has customized the title from default
    // "Untitled Phish" (post-migration) or "Untitled Project" (pre-migration)
    const hasCustomTitle = metadata.title &&
      metadata.title !== 'Untitled Phish' &&
      metadata.title !== 'Untitled Project';

    return hasCustomTitle;
  } catch (error) {
    console.error('Failed to check for existing data:', error);
    return false;
  }
}

/**
 * Phish export/import interface
 *
 * Includes optional customTechniques field for portability:
 * - Custom techniques travel with the phish JSON
 * - Built-in techniques are NOT included (reference by ID only)
 * - This prevents bloat and allows sharing phishes with custom techniques
 */
export interface ProjectJSON {
  metadata: ProjectMetadata
  htmlSource: string
  annotations: Record<string, Annotation>
  scoring: ScoringData
  inputMode: InputMode
  customTechniques?: Record<string, CustomTechnique>
}

/**
 * Export phish data as JSON string
 *
 * @param metadata - Phish metadata (title, author, timestamps)
 * @param htmlSource - HTML email source with lure mark spans
 * @param annotations - Annotation data keyed by lure ID
 * @param scoring - NIST Phish Scale scoring data
 * @param inputMode - Current input mode (html or richtext)
 * @param customTechniques - Optional custom techniques to include in export
 * @returns JSON string representation of the phish
 */
export const exportProjectJSON = (
  metadata: ProjectMetadata,
  htmlSource: string,
  annotations: Record<string, Annotation>,
  scoring: ScoringData,
  inputMode: InputMode,
  customTechniques?: Record<string, CustomTechnique>
): string => {
  const phish: ProjectJSON = {
    metadata,
    htmlSource,
    annotations,
    scoring,
    inputMode,
    ...(customTechniques && Object.keys(customTechniques).length > 0 && { customTechniques })
  }
  return JSON.stringify(phish, null, 2)
}

/**
 * Import phish data from JSON string with validation
 *
 * Validates required fields (metadata, htmlSource, annotations, scoring)
 * and optionally accepts customTechniques for merging into LocalStorage.
 *
 * @param jsonString - JSON string representation of phish
 * @returns Parsed and validated phish data
 * @throws Error if JSON is malformed or missing required fields
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

    // Validate customTechniques if present (optional field)
    if (parsed.customTechniques !== undefined) {
      if (typeof parsed.customTechniques !== 'object' || parsed.customTechniques === null || Array.isArray(parsed.customTechniques)) {
        throw new Error('Invalid project JSON: customTechniques must be an object')
      }

      // Validate each custom technique has required fields
      for (const [id, technique] of Object.entries(parsed.customTechniques)) {
        if (typeof technique !== 'object' || technique === null) {
          throw new Error(`Invalid project JSON: custom technique "${id}" is not an object`)
        }
        const tech = technique as any; // Type assertion for validation
        if (!tech.id || typeof tech.id !== 'string') {
          throw new Error(`Invalid project JSON: custom technique "${id}" missing id`)
        }
        if (!tech.name || typeof tech.name !== 'string') {
          throw new Error(`Invalid project JSON: custom technique "${id}" missing name`)
        }
        if (tech.isCustom !== true) {
          throw new Error(`Invalid project JSON: custom technique "${id}" must have isCustom: true`)
        }
        if (!tech.createdAt || typeof tech.createdAt !== 'string') {
          throw new Error(`Invalid project JSON: custom technique "${id}" missing createdAt`)
        }
      }
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
 * Download phish JSON as file
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

// Compact layout preference

const COMPACT_LAYOUT_KEY = 'phishmonger-compact-layout';

/**
 * Load compact layout preference from LocalStorage
 * Returns false by default (disabled)
 */
export function loadCompactLayout(): boolean {
  try {
    const saved = localStorage.getItem(COMPACT_LAYOUT_KEY);
    return saved === 'true';
  } catch (error) {
    console.error('Failed to load compact layout preference:', error);
    return false;
  }
}

/**
 * Save compact layout preference to LocalStorage
 */
export function saveCompactLayout(enabled: boolean): void {
  try {
    localStorage.setItem(COMPACT_LAYOUT_KEY, String(enabled));
  } catch (error) {
    console.error('Failed to save compact layout preference:', error);
  }
}

// Focused column storage

const FOCUSED_COLUMN_KEY = 'phishmonger-focused-column';

const VALID_COLUMN_IDS: Set<string> = new Set(['input', 'preview', 'lure-list', 'scoring']);

/**
 * Load focused column from LocalStorage
 * Returns null if no column is focused or if the stored value is invalid
 */
export function loadFocusedColumn(): ColumnID | null {
  try {
    const saved = localStorage.getItem(FOCUSED_COLUMN_KEY);
    if (!saved) {
      return null;
    }
    // Validate that the saved value is a valid ColumnID
    if (VALID_COLUMN_IDS.has(saved)) {
      return saved as ColumnID;
    }
    return null;
  } catch (error) {
    console.error('Failed to load focused column:', error);
    return null;
  }
}

/**
 * Save focused column to LocalStorage
 * Pass null to clear the focused column (reset to normal view)
 */
export function saveFocusedColumn(columnId: ColumnID | null): void {
  try {
    if (columnId === null) {
      localStorage.removeItem(FOCUSED_COLUMN_KEY);
    } else {
      localStorage.setItem(FOCUSED_COLUMN_KEY, columnId);
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('LocalStorage quota exceeded while saving focused column:', error);
    } else {
      console.error('Failed to save focused column:', error);
    }
  }
}

// Collapsed columns storage

const COLLAPSED_COLUMNS_KEY = 'phishmonger-collapsed-columns';

/**
 * Load collapsed columns from LocalStorage
 * Returns empty set if no columns are collapsed or if the stored value is invalid
 */
export function loadCollapsedColumns(): Set<ColumnID> {
  try {
    const saved = localStorage.getItem(COLLAPSED_COLUMNS_KEY);
    if (!saved) {
      return new Set<ColumnID>();
    }
    // Parse and validate each column ID
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      return new Set<ColumnID>();
    }
    const validColumns = new Set<ColumnID>();
    for (const id of parsed) {
      if (VALID_COLUMN_IDS.has(id)) {
        validColumns.add(id as ColumnID);
      }
    }
    return validColumns;
  } catch (error) {
    console.error('Failed to load collapsed columns:', error);
    return new Set<ColumnID>();
  }
}

/**
 * Save collapsed columns to LocalStorage
 * Removes key if set is empty
 */
export function saveCollapsedColumns(columns: Set<ColumnID>): void {
  try {
    if (columns.size === 0) {
      localStorage.removeItem(COLLAPSED_COLUMNS_KEY);
    } else {
      localStorage.setItem(COLLAPSED_COLUMNS_KEY, JSON.stringify(Array.from(columns)));
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('LocalStorage quota exceeded while saving collapsed columns:', error);
    } else {
      console.error('Failed to save collapsed columns:', error);
    }
  }
}

// Campaign storage

const CAMPAIGNS_KEY = 'phishmonger-campaigns';

/**
 * Load campaigns from LocalStorage
 * Returns empty array if no saved data exists
 */
export const loadCampaigns = (): Campaign[] => {
  try {
    const saved = localStorage.getItem(CAMPAIGNS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Validate that parsed data is an array
      if (Array.isArray(parsed)) {
        return parsed;
      }
      console.warn('Invalid campaigns data in LocalStorage, starting fresh');
      return [];
    }
  } catch (error) {
    console.error('Failed to load campaigns from LocalStorage:', error);
  }
  return [];
};

/**
 * Save campaigns to LocalStorage
 * Throws QuotaExceededError if storage is full
 */
export const saveCampaigns = (campaigns: Campaign[]): void => {
  try {
    localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns));
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      throw error; // Re-throw for useCampaigns to handle
    }
    console.error('Failed to save campaigns to LocalStorage:', error);
    throw error;
  }
};

// Backward compatibility aliases (deprecated)
export const loadMetadata = loadPhishMetadata;
export const saveMetadata = savePhishMetadata;
