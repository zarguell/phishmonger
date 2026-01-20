export type InputMode = 'html' | 'richtext'

interface ModeToggleProps {
  currentMode: InputMode
  onModeChange: (mode: InputMode) => void
}

export function ModeToggle({ currentMode, onModeChange }: ModeToggleProps) {
  return (
    <div className="mode-toggle">
      <label className="mode-toggle-label">
        <input
          type="radio"
          name="inputMode"
          value="html"
          checked={currentMode === 'html'}
          onChange={(e) => onModeChange(e.target.value as InputMode)}
        />
        <span>HTML Input</span>
      </label>
      <label className="mode-toggle-label">
        <input
          type="radio"
          name="inputMode"
          value="richtext"
          checked={currentMode === 'richtext'}
          onChange={(e) => onModeChange(e.target.value as InputMode)}
        />
        <span>Rich Text</span>
      </label>
    </div>
  )
}
