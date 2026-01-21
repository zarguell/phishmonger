/**
 * NIST Phish Scale scoring data
 * Based on NIST Special Publication 800-53
 */
export interface ScoringData {
  visualCues: number           // Count of visual cues (logo pixelation, etc.)
  languageCues: number         // Count of language cues (grammar errors, etc.)
  premiseAlignment: number     // Premise alignment 1-5 Likert scale
}

/**
 * Difficulty level derived from NIST Phish Scale
 * Formula: Premise Alignment - (Visual Cues + Language Cues)
 * - Easy: >= 3
 * - Moderate: 1-2
 * - Hard: <= 0
 */
export type DifficultyLevel = 'easy' | 'moderate' | 'hard'

/**
 * Difficulty badge display data
 */
export interface DifficultyBadge {
  letter: 'E' | 'M' | 'H'
  color: string
  label: string
}
