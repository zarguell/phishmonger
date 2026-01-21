interface VisibilityTogglesProps {
  showTags: boolean
  onTagsToggle: (show: boolean) => void
  showNistBadge: boolean
  onNistBadgeToggle: (show: boolean) => void
}

export function VisibilityToggles({
  showTags,
  onTagsToggle,
  showNistBadge,
  onNistBadgeToggle,
}: VisibilityTogglesProps) {
  return (
    <div className="visibility-toggles">
      <label htmlFor="show-tags-checkbox" className="toggle-label">
        <input
          id="show-tags-checkbox"
          type="checkbox"
          checked={showTags}
          onChange={(e) => onTagsToggle(e.target.checked)}
          className="toggle-checkbox"
        />
        <span className="toggle-text">Show Tags</span>
      </label>
      <label htmlFor="show-nist-badge-checkbox" className="toggle-label">
        <input
          id="show-nist-badge-checkbox"
          type="checkbox"
          checked={showNistBadge}
          onChange={(e) => onNistBadgeToggle(e.target.checked)}
          className="toggle-checkbox"
        />
        <span className="toggle-text">Show NIST Badge</span>
      </label>
    </div>
  )
}
