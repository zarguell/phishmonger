/**
 * Annotation data structures for Phish Monger
 *
 * Links Lure Marks to phishing techniques and persuasion principles.
 */

/**
 * A single annotation attached to a Lure Mark
 */
export interface Annotation {
  lureId: string                 // Matches data-lure-id attribute in HTML
   techniqueId?: string           // MITRE ATT&CK ID (e.g., "T1566.001") - optional
  persuasionPrincipleId?: string // Optional ID from persuasion.json (e.g., "CIAL-02")
  title?: string                 // NEW: freetext title for annotation
  explanation: string            // User-written explanation
  createdAt: string              // ISO timestamp
  annotationNumber?: number      // Sequential number for display (1-based)
  manualY?: number               // Manual Y position for drag reordering
}

/**
 * A phishing technique from MITRE ATT&CK
 */
export interface Technique {
  id: string
  name: string
  tactic: string
  description: string
  url: string
}

/**
 * A psychological persuasion principle (Cialdini)
 */
export interface PersuasionPrinciple {
  id: string
  name: string
  description: string
}
