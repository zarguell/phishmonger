# Phase 4: NIST Phish Scale Scoring - Context

**Gathered:** 2026-01-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can calculate phishing difficulty scores using NIST Phish Scale methodology — input visual cues count, language cues count, premise alignment (1-5 scale), and receive a calculated difficulty score with traffic light badge (Easy/Moderate/Hard) that appears on exported PNG.

</domain>

<decisions>
## Implementation Decisions

### Input Controls
- Counter widgets for visual cues and language cues (separate counters, not combined)
- Counter widget displays current count with prominent +/- buttons (not standard number input)
- Slider for premise alignment (1-5 scale), not radio buttons or dropdown
- Scoring controls live in a dedicated Scoring Panel sidebar (not in Annotation Panel or modal)
- Scoring Panel appears alongside existing Lure List and Annotation Panel

### Score Display
- Score updates on blur (when user leaves a field or finishes sliding), not real-time
- Full breakdown displayed: premise alignment, visual cues count, language cues count, AND final calculated score
- Score display appears at the top of the Scoring Panel (above inputs), not bottom or distributed

### Badge Styling
- Circle badge for traffic light indicator (E/M/H), not pill or rectangular
- Badge contains just the letter (E / M / H), not full word or score
- Default position on exported PNG is bottom-right corner
- Badge visibility is configurable (can be hidden on export)

### Export Settings
- Export menu includes a settings dropdown to toggle badge visibility
- Settings dropdown affects both the live preview AND the final exported PNG
- User can see what they're getting before exporting

### OpenCode's Discretion
- Exact slider styling and visual feedback
- Counter widget animation/transition behavior
- Badge size relative to exported slide
- Label text for input controls ("Visual Cues", "Language Cues", "Premise Alignment" or similar)
- Export settings dropdown UI implementation

</decisions>

<specifics>
## Specific Ideas

- Counter widget should have prominent +/- buttons, not subtle stepper arrows
- Score display at top of panel shows full calculation breakdown (so user understands the NIST formula)
- Configurable badge visibility via export menu settings — preview updates first, then export matches
- Bottom-right badge position is less intrusive on the visual presentation
- Circle badge with just letter (E/M/H) is clean and minimal

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-nist-phish-scale-scoring*
*Context gathered: 2026-01-21*