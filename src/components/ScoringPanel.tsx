import type { ScoringData } from '../types/scoring'
import { calculateDifficulty, getDifficultyLevel, getDifficultyBadge } from '../utils/scoring'

interface ScoringPanelProps {
  scoring: ScoringData
  onUpdate: (updates: Partial<ScoringData>) => void
}

export function ScoringPanel({ scoring, onUpdate }: ScoringPanelProps) {
  const score = calculateDifficulty(scoring)
  const difficulty = getDifficultyLevel(score)
  const badge = getDifficultyBadge(difficulty)

  // Counter widget component
  const Counter = ({ value, label, onChange }: { value: number, label: string, onChange: (val: number) => void }) => (
    <div className="counter-widget">
      <label className="counter-label">{label}</label>
      <div className="counter-controls">
        <button
          type="button"
          className="counter-btn counter-btn-decrement"
          onClick={() => onChange(Math.max(0, value - 1))}
          aria-label={`Decrement ${label}`}
        >
          −
        </button>
        <span className="counter-value">{value}</span>
        <button
          type="button"
          className="counter-btn counter-btn-increment"
          onClick={() => onChange(value + 1)}
          aria-label={`Increment ${label}`}
        >
          +
        </button>
      </div>
    </div>
  )

  return (
    <div className="scoring-panel">
      <h2>NIST Phish Scale</h2>

      {/* Score Display */}
      <div className="score-display">
        <div className="score-badge" style={{ backgroundColor: badge.color }}>
          {badge.letter}
        </div>
        <div className="score-breakdown">
          <div className="score-row">
            <span>Premise Alignment:</span>
            <strong>{scoring.premiseAlignment}</strong>
          </div>
          <div className="score-row">
            <span>Visual Cues:</span>
            <strong>-{scoring.visualCues}</strong>
          </div>
          <div className="score-row">
            <span>Language Cues:</span>
            <strong>-{scoring.languageCues}</strong>
          </div>
          <div className="score-row score-total">
            <span>Difficulty:</span>
            <strong>{score}</strong>
          </div>
        </div>
      </div>

      {/* Input Controls */}
      <div className="scoring-controls">
        <Counter
          label="Visual Cues"
          value={scoring.visualCues}
          onChange={(val) => onUpdate({ visualCues: val })}
        />

        <Counter
          label="Language Cues"
          value={scoring.languageCues}
          onChange={(val) => onUpdate({ languageCues: val })}
        />

        <div className="slider-widget">
          <label className="slider-label">Premise Alignment</label>
          <div className="slider-controls">
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={scoring.premiseAlignment}
              onChange={(e) => onUpdate({ premiseAlignment: Number(e.target.value) })}
              className="premise-slider"
              aria-label="Premise alignment"
            />
            <div className="slider-value">{scoring.premiseAlignment}</div>
          </div>
          <div className="slider-labels">
            <span>Low (1)</span>
            <span>High (5)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
