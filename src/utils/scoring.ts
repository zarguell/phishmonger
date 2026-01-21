import type { ScoringData, DifficultyLevel, DifficultyBadge } from '../types/scoring'

type CueZone = 'low' | 'medium' | 'high'
type AlignmentZone = 'low' | 'medium' | 'high'

/**
 * Maps total cue count to zone based on NIST Phish Scale guidelines
 * Low Cues: 1-8 errors (email looks professional)
 * Medium Cues: 9-14 errors (email looks okay)
 * High Cues: 15+ errors (email is messy, obvious errors)
 *
 * Total cues = visual cues + language cues (all observable errors)
 */
function getCueZone(visualCues: number, languageCues: number): CueZone {
  const totalCues = visualCues + languageCues
  if (totalCues <= 8) return 'low'
  if (totalCues <= 14) return 'medium'
  return 'high'
}

/**
 * Maps premise alignment score to zone based on Likert scale
 * Low Alignment: 1-2 (irrelevant story, weak premise)
 * Medium Alignment: 3 (plausible story)
 * High Alignment: 4-5 (relevant story, strong premise)
 */
function getAlignmentZone(premiseAlignment: number): AlignmentZone {
  if (premiseAlignment <= 2) return 'low'
  if (premiseAlignment === 3) return 'medium'
  return 'high'
}

/**
 * Difficulty zone matrix based on NIST Phish Scale
 * Combines cue zone and alignment zone to determine difficulty
 *
 * Matrix interpretation:
 * - Very Difficult: Few cues + High alignment (looks perfect, story makes sense)
 * - Moderately Difficult: Some/medium cues + Medium alignment
 * - Least Difficult: Many cues + Low alignment (looks fake, irrelevant story)
 */
function getDifficultyFromZones(cueZone: CueZone, alignmentZone: AlignmentZone): DifficultyLevel {
  const matrix: Record<CueZone, Record<AlignmentZone, DifficultyLevel>> = {
    low: {
      low: 'moderate',      // Few cues, irrelevant story
      medium: 'moderate',    // Few cues, plausible story
      high: 'hard'          // Few cues, relevant story → Very Difficult
    },
    medium: {
      low: 'easy',          // Some cues, irrelevant story → Least Difficult
      medium: 'moderate',    // Some cues, plausible story → Moderately Difficult
      high: 'moderate'       // Some cues, relevant story
    },
    high: {
      low: 'easy',          // Many cues, irrelevant story → Least Difficult
      medium: 'easy',        // Many cues, plausible story → Least Difficult
      high: 'moderate'       // Many cues, relevant story
    }
  }

  return matrix[cueZone][alignmentZone]
}

/**
 * Calculates NIST Phish Scale difficulty using zone-based matrix
 * Not a formula - maps cue count + alignment to difficulty zones
 *
 * @param scoring - Input scoring data
 * @returns Difficulty level
 */
export function calculateDifficulty(scoring: ScoringData): DifficultyLevel {
  const { visualCues, languageCues, premiseAlignment } = scoring
  const cueZone = getCueZone(visualCues, languageCues)
  const alignmentZone = getAlignmentZone(premiseAlignment)
  return getDifficultyFromZones(cueZone, alignmentZone)
}

/**
 * Gets badge display data for difficulty level
 *
 * @param level - Difficulty level
 * @returns Badge display object
 */
export function getDifficultyBadge(level: DifficultyLevel): DifficultyBadge {
  const badges: Record<DifficultyLevel, DifficultyBadge> = {
    easy: { letter: 'LD', color: '#22c55e', label: 'Least Difficult' },
    moderate: { letter: 'MD', color: '#eab308', label: 'Moderately Difficult' },
    hard: { letter: 'VD', color: '#ef4444', label: 'Very Difficult' }
  }
  return badges[level]
}
