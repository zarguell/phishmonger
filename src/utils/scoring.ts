import type { ScoringData, DifficultyLevel, DifficultyBadge } from '../types/scoring'

/**
 * Calculates NIST Phish Scale difficulty score
 * Formula: Premise Alignment - (Visual Cues + Language Cues)
 *
 * @param scoring - Input scoring data
 * @returns Numeric difficulty score
 */
export function calculateDifficulty(scoring: ScoringData): number {
  const { visualCues, languageCues, premiseAlignment } = scoring
  const totalCues = visualCues + languageCues
  return premiseAlignment - totalCues
}

/**
 * Determines difficulty level from numeric score
 * - Easy: >= 3
 * - Moderate: 1-2
 * - Hard: <= 0
 *
 * @param score - Numeric difficulty score
 * @returns Difficulty level
 */
export function getDifficultyLevel(score: number): DifficultyLevel {
  if (score >= 3) return 'easy'
  if (score >= 1) return 'moderate'
  return 'hard'
}

/**
 * Gets badge display data for difficulty level
 *
 * @param level - Difficulty level
 * @returns Badge display object
 */
export function getDifficultyBadge(level: DifficultyLevel): DifficultyBadge {
  const badges: Record<DifficultyLevel, DifficultyBadge> = {
    easy: { letter: 'E', color: '#22c55e', label: 'Easy' },
    moderate: { letter: 'M', color: '#eab308', label: 'Moderate' },
    hard: { letter: 'H', color: '#ef4444', label: 'Hard' }
  }
  return badges[level]
}
