/**
 * NIST Phish Scale scoring data
 * Based on NIST TN.2276 - Phishing Email Classification
 */
export interface ScoringData {
  visualCues: number           // Count of visual cues (errors, mistakes, red flags)
  languageCues: number         // Count of language cues (grammar errors, typos)
  premiseAlignment: number     // Premise alignment 1-5 Likert scale
}

/**
 * Difficulty level derived from NIST Phish Scale zone matrix
 * - easy: Least Difficult (Many cues + Low alignment)
 * - moderate: Moderately Difficult (Medium cues + Medium alignment)
 * - hard: Very Difficult (Few cues + High alignment)
 */
export type DifficultyLevel = 'easy' | 'moderate' | 'hard'

/**
 * Difficulty badge display data
 */
export interface DifficultyBadge {
  letter: string
  color: string
  label: string
}
