---
phase: 04-nist-phish-scale-scoring
plan: 02
subsystem: ui
tags: react, typescript, nist-phish-scale, export, persistence

# Dependency graph
requires:
  - phase: 04-01
    provides: Scoring types, calculation utility, ScoringPanel component
  - phase: 03-visualizer-export
    provides: SlideWrapper component, export functionality
provides:
  - Scoring state integration in App.tsx with LocalStorage persistence
  - loadScoring/saveScoring utility functions in storage.ts
  - Four-column layout (input, preview, lure list, scoring)
  - Difficulty badge overlay on preview slides
  - Badge visibility toggle for user control
affects: 05-01 (Project metadata), 05-02 (Persistence integration), 05-03 (JSON export/import)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Scoring state with LocalStorage persistence (lazy initialization)
    - Four-column grid layout (1fr 1fr 300px 280px)
    - Badge overlay positioned absolutely on slide (bottom-right)
    - Checkbox toggle for conditional feature visibility

key-files:
  modified:
    - src/App.tsx (scoring state, ScoringPanel integration, SlideWrapper wiring)
    - src/utils/storage.ts (loadScoring, saveScoring functions)
    - src/index.css (four-column layout, badge overlay styles)
    - src/components/preview/SlideWrapper.tsx (badge overlay rendering)

key-decisions:
  - "Four-column layout: input, preview, lure list, scoring (280px width for scoring)"
  - "Badge overlay: 180px rounded rectangle, bottom-right corner, z-index 10 (fits breakdown text)"
  - "Badge toggle: Show/hide checkbox in ScoringPanel, user controls export visibility"
  - "NIST scoring: Zone-based matrix (not formula) - maps cues + alignment to difficulty"
  - "Cues count: Combines visual + language cues for total (all errors count as cues)"
  - "Difficulty labels: LD (Least Difficult), MD (Moderately Difficult), VD (Very Difficult)"

patterns-established:
  - "Scoring panel: Column with state persistence, counter widgets, slider, zone-based display"
  - "Badge overlay: Absolute positioning on slide, shows difficulty label and zones"
  - "Persistence pattern: load from LocalStorage on init, save on change"
  - "NIST matrix: Zone lookup (cue zone x alignment zone) → difficulty category"

# Metrics
tasks:
  - Task 1: Add scoring state and ScoringPanel to App.tsx (completed in 04-01)
  - Task 2: Add scoring storage utility functions (completed in 04-01)
  - Task 3: Update App layout CSS for four columns (completed in 04-01)
  - Task 4: Add difficulty badge to SlideWrapper and connect scoring (completed)

commits:
  - f5ce476: Add difficulty badge overlay and wire scoring into preview
  - fb88ed7: Improve scoring UI and add badge toggle
  - b240ef8: Correct NIST Phish Scale to zone-based difficulty matrix

files-touched:
  - src/App.tsx (scoring state, ScoringPanel, badge props)
  - src/components/ScoringPanel.tsx (badge toggle checkbox, breakdown display fix)
  - src/components/preview/SlideWrapper.tsx (badge overlay with breakdown)
  - src/index.css (four-column layout, badge styles)

# Deviations and fixes
deviations:
  - None from original plan

fixes:
  - "Fixed incorrect scoring formula: Removed 'Premise - Cues' formula (was treating cues as penalties)"
  - "Implemented NIST zone-based matrix: Correct mapping of cue zones and alignment zones to difficulty"
  - "Fixed confusing breakdown UI: Removed hardcoded minus signs on cue values (was showing -3 for cues=3)"
  - "Added breakdown display: Changed badge from letter-only to full formula (NIST Phish Scale + formula)"
  - "Added badge toggle: User requested ability to hide badge from exported slide"
  - "Updated badge CSS: Changed from 80px circle to 180px rounded rectangle to fit breakdown text"

user-feedback:
  - "Score indicator shows -3 when cues set to 3" → Fixed: Removed formula, implemented zone-based matrix
  - "Scoring rubric is wrong" → Fixed: Implemented NIST TN.2276 zone matrix (not subtraction formula)
  - "Keep sliders, fix math, use zone base" → Implemented: Cue zones (1-8, 9-14, 15+) x Alignment zones (1-2, 3, 4-5)
  - "Add breakdown of difficulty on preview" → Implemented: Badge now shows difficulty label and zones
  - "Label it 'NIST Phish Scale Score'" → Implemented: Added title to badge overlay
  - "Want ability to remove badge from slide" → Implemented: Added checkbox toggle in ScoringPanel

# Deliverables
components:
  - ScoringPanel integrated in App.tsx with state and persistence
  - Badge overlay component in SlideWrapper with formula display

scoring-math:
  - Zone-based matrix: Maps cue zones to alignment zones → difficulty category
  - Cue zones: Low (1-8 errors), Medium (9-14), High (15+)
  - Alignment zones: Low (1-2), Medium (3), High (4-5)
  - Difficulty matrix:
    * Very Difficult: Low cues + High alignment (looks perfect, story makes sense)
    * Moderately Difficult: Medium cues + Medium alignment
    * Least Difficult: High cues + Low alignment (looks fake, irrelevant story)
  - No numeric formula: Difficulty determined by zone lookup, not calculation

storage:
  - loadScoring function loads from 'phishmonger-scoring' key
  - saveScoring function saves to 'phishmonger-scoring' key
  - Default values: visualCues=0, languageCues=0, premiseAlignment=3

ui-layout:
  - Four-column grid: input (1fr), preview (1fr), lure list (300px), scoring (280px)
  - Badge overlay: bottom-right, 180px min-width, z-index 10
  - Badge toggle: Checkbox in ScoringPanel, defaults to true

# Testing checklist
automated:
  - TypeScript compiles without errors (npm run build)
  - ScoringPanel imports verified in App.tsx
  - loadScoring/saveScoring functions exist in storage.ts
  - Badge overlay rendered in SlideWrapper.tsx
  - showBadge state wired to SlideWrapper in App.tsx

manual:
  - [x] ScoringPanel appears in fourth column in edit mode
  - [x] Counter widgets increment/decrement visual and language cues
  - [x] Premise alignment slider works (1-5 scale)
  - [x] Score breakdown shows: Premise Alignment + Total Cues = Difficulty Zone
  - [x] Zone display correctly categorizes difficulty (LD/MD/VD based on cues + alignment)
  - [x] Badge toggle checkbox appears in ScoringPanel
  - [x] Badge appears on preview slide when toggle checked
  - [x] Badge shows "NIST Phish Scale Score" + difficulty label + zones
  - [x] Badge shows total cues (Visual + Language) and zone ranges
  - [x] Badge disappears when toggle unchecked
  - [x] Badge appears in exported PNG when enabled
  - [x] Scoring inputs persist on page refresh
  - [x] Low cues (1-8) + High alignment = Very Difficult
  - [x] High cues (15+) + Low alignment = Least Difficult
  - [x] Medium combos = Moderately Difficult

# Summary
Phase 04-02 complete. NIST Phish Scale scoring system fully integrated with:
- ScoringPanel in edit mode with counter widgets and slider
- LocalStorage persistence for all scoring inputs
- Zone-based difficulty calculation (correct NIST TN.2276 methodology)
- Difficulty badge on preview slides with difficulty label and zones
- User-controlled badge visibility via checkbox
- Badge included in exported PNG when enabled

User feedback addressed:
- Fixed incorrect scoring rubric (was using Premise - Cues formula)
- Implemented NIST zone-based matrix (Low/Med/High cues x Low/Med/High alignment)
- Difficulty labels: Least Difficult (LD), Moderately Difficult (MD), Very Difficult (VD)
- Added "NIST Phish Scale Score" label to badge
- Added zone display (Cues total with range + Alignment zone)
- Added toggle to hide badge when not desired on slide

All 6 SCOR requirements met.
