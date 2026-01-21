interface TagsToggleProps {
  showTags: boolean
  onToggle: (show: boolean) => void
}

export function TagsToggle({ showTags, onToggle }: TagsToggleProps) {
  return (
    <div className="tags-toggle">
      <label htmlFor="show-tags-checkbox" className="toggle-label">
        <input
          id="show-tags-checkbox"
          type="checkbox"
          checked={showTags}
          onChange={(e) => onToggle(e.target.checked)}
          className="toggle-checkbox"
        />
        <span className="toggle-text">Show Tags</span>
      </label>
    </div>
  )
}
