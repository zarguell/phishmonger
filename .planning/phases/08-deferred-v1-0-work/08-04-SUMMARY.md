---
phase: 08-deferred-v1-0-work
plan: 04
subsystem: ui
tags: [layout-templates, css-modules, localstorage, flexbox, react, toggles, user-preferences]

# Dependency graph
requires:
  - phase: 03-visualizer-export
    provides: SlideWrapper, EmailColumn, AnnotationColumn components
provides:
  - Layout template system with four presets (Balanced, Wide Email, Wide Annotations, Compact)
  - LayoutTemplateSelector component with visual layout icons
  - CSS module for layout template classes with CSS custom properties for gap control
  - VisibilityToggles component for tags and NIST badge visibility
  - LocalStorage persistence for layout, tags, and badge preferences
affects: []

# Tech tracking
tech-stack:
  added: [CSS Modules, CSS custom properties for dynamic values]
  patterns: [Template-based layout system, Visual icon selectors, User preference toggles]

key-files:
  created:
    - src/styles/layouts.module.css
    - src/components/visualizer/LayoutTemplateSelector.tsx
    - src/components/visualizer/VisibilityToggles.tsx
  modified:
    - src/App.tsx
    - src/components/preview/SlideWrapper.tsx
    - src/components/preview/EmailColumn.tsx
    - src/components/preview/AnnotationColumn.tsx
    - src/components/annotation/AnnotationCard.tsx
    - src/index.css

key-decisions:
  - "Replaced manual width slider with preset layout templates for better UX"
  - "Used CSS Modules with :global() selectors to target existing global classes"
  - "CSS custom properties (--layout-gap) for template-specific gap values"
  - "Compact template with 50/50 split, 14px text, and 16px gap for maximum density"
  - "Separate toggles for tags and NIST badge - independent user preferences"
  - "All preferences persist to LocalStorage for consistent user experience"

patterns-established:
  - "Layout template pattern: Preset configurations applied via CSS classes"
  - "Visual selector pattern: Icon-based buttons with proportional representations"
  - "Preference toggle pattern: Checkboxes with LocalStorage persistence"

# Metrics
duration: 82min
completed: 2026-01-21
---

# Phase 08 Plan 04: Layout Template Presets Summary

**Four-layout template system with Compact mode, tags visibility toggle, and NIST badge control using CSS Modules and CSS custom properties**

## Performance

- **Duration:** 82 min (including 3 user checkpoint cycles with enhancements)
- **Started:** 2026-01-21T20:37:50Z
- **Completed:** 2026-01-21T21:59:04Z
- **Tasks:** 2 core tasks + 1 bug fix + 3 enhancements + 2 adjustments + 1 correction
- **Files modified:** 8
- **Checkpoint cycles:** 3 (bug fix, user refinements, user correction)

## Accomplishments

### Core Features (Delivered)
- Created CSS Module with three initial layout template classes (balanced, wideEmail, wideAnnotations)
- Built LayoutTemplateSelector component with visual SVG icons showing column proportions
- Replaced manual annotation width slider with template-based selection
- Added LocalStorage persistence for layout template preference
- Updated SlideWrapper, EmailColumn, and AnnotationColumn to use global classes with CSS module selectors

### Bug Fixes
- **Critical CSS selector bug**: Fixed template classes not applying due to CSS module/global class mismatch - used `:global()` selectors to target existing `email-column` and `annotation-column` classes

### User-Driven Enhancements
- **Compact template**: Added 50/50 split layout with 14px text for maximum annotation density
- **Reduced gap in Compact**: Changed from 40px to 16px gap using CSS custom property `--layout-gap`
- **Tags visibility toggle**: Added checkbox to show/hide MITRE and Persuasion tags
- **NIST badge toggle**: Added checkbox to show/hide overall difficulty badge overlay (E/M/H)
- **Combined visibility controls**: Created VisibilityToggles component with both checkboxes side-by-side

## Task Commits

Each task was committed atomically:

1. **Task 1: Create layout templates CSS module** - `cf774ff` (feat)
2. **Task 2: Create LayoutTemplateSelector component** - `f7a313e` (feat)
3. **Integration: Integrate LayoutTemplateSelector system** - `0eb8da9` (feat)
4. **Bug Fix: CSS selector incompatibility** - `c418db9` (fix)
5. **Enhancement: Compact template + tags toggle** - `f93391d` (feat)
6. **Adjustment: Compact to 50/50 split** - `09af05a` (fix)
7. **Enhancement: Reduce Compact gap to 16px** - `0dba028` (feat)
8. **Correction: Connect NIST badge to showBadge** - `b51fb2c` (fix)
9. **Metadata: Complete plan documentation** - `2a9173a` (docs)

**Plan metadata:** `2a9173a` (docs: complete plan)

## Files Created/Modified

### Created
- `src/styles/layouts.module.css` - CSS module with slideWrapper base class, four template variants, gap customization via CSS custom properties
- `src/components/visualizer/LayoutTemplateSelector.tsx` - Template selector with four visual SVG icons (Balanced, Wide Email, Wide Annotations, Compact)
- `src/components/visualizer/VisibilityToggles.tsx` - Combined component with Show Tags and Show NIST Badge checkboxes

### Modified
- `src/App.tsx` - Added layoutTemplate, showTags, showBadge states with LocalStorage persistence; integrated VisibilityToggles in preview header
- `src/components/preview/SlideWrapper.tsx` - Accepts layoutTemplate prop, applies CSS module classes dynamically with template-specific gap
- `src/components/preview/EmailColumn.tsx` - Uses global `email-column` class targeted by CSS module selectors
- `src/components/preview/AnnotationColumn.tsx` - Uses global `annotation-column` class; accepts and passes showTags prop
- `src/components/annotation/AnnotationCard.tsx` - Conditionally renders tags based on showTags prop
- `src/index.css` - Added styles for layout template selector and visibility toggles

## Decisions Made

### Core Architecture
- **Template-based UX over manual slider**: Presets reduce cognitive load - users select purpose (Wide Email, Wide Annotations, Compact) rather than pixel values
- **Flexbox with flex-grow for email column**: Using `flex: 1` or `flex: 1.5` allows email to fill available space while annotation has fixed width, ensuring responsive behavior
- **CSS Modules with :global() selectors**: Prevents global style conflicts while targeting existing global classes (`email-column`, `annotation-column`)
- **CSS custom properties for template-specific values**: Used `--layout-gap` to set different gap values per template (40px standard, 16px compact)

### User Experience Enhancements (from Checkpoints)
- **Compact template refinement**: User feedback that 0.5fr/600px was too extreme → adjusted to equal 1fr/1fr (50/50 split)
- **Reduced gap in Compact**: User requested less margin → reduced from 40px to 16px for maximum space usage
- **Tags visibility toggle**: User requested ability to hide tags for cleaner visuals with many annotations
- **NIST badge toggle**: User wanted control over difficulty overlay visibility (E/M/H circle) - same control as ScoringPanel but available in preview mode

## Deviations from Plan

### Deviations from Original Plan (User-Driven)

**1. [Rule 4 - Architectural] Added Compact template**

- **Found during:** User checkpoint after initial implementation
- **User request:** "Need even more annotation space than Wide Annotations"
- **What was added:** Fourth template "Compact" with 50/50 split, 14px text, 16px gap
- **Files modified:** layouts.module.css, LayoutTemplateSelector.tsx
- **Rationale:** User needed maximum density for training materials with 10+ annotations
- **Committed in:** `f93391d`

**2. [Rule 2 - Missing Critical] Added tags visibility toggle**

- **Found during:** User checkpoint (Compact template testing)
- **User request:** "Can we have an option to remove the tags line"
- **What was added:** TagsToggle component (later combined into VisibilityToggles), showTags state, LocalStorage persistence
- **Files modified:** TagsToggle.tsx (created), App.tsx, AnnotationColumn.tsx, AnnotationCard.tsx, index.css
- **Rationale:** Tags take up vertical space; users want cleaner visuals for maximum density
- **Committed in:** `f93391d`

**3. [Rule 1 - Bug] Fixed CSS selector incompatibility**

- **Found during:** User testing - "layout templates don't work at all"
- **Issue:** CSS descendant selectors `.balanced .emailColumn` couldn't match CSS module generated class names
- **Fix:** Changed to `.balanced :global(.email-column)` to target global class names
- **Files modified:** layouts.module.css, EmailColumn.tsx, AnnotationColumn.tsx
- **Verification:** Templates now apply correctly, visible column proportion changes
- **Committed in:** `c418db9`

**4. [Rule 2 - Missing Critical] Adjusted Compact proportions**

- **Found during:** User testing - "Compact is going too far"
- **Issue:** 0.5fr email + 600px annotations was too extreme
- **Fix:** Changed to 1fr/1fr (equal 50/50 split)
- **Files modified:** layouts.module.css, LayoutTemplateSelector.tsx
- **Rationale:** User wanted balanced layout with smaller text, not extreme proportions
- **Committed in:** `09af05a`

**5. [Rule 2 - Missing Critical] Reduced gap in Compact template**

- **Found during:** User testing - "Can Compact also have less margin between email and annotations"
- **Issue:** Standard 40px gap wasted space in Compact mode
- **Fix:** Added CSS custom property `--layout-gap` set to 16px for Compact, 40px for others
- **Files modified:** layouts.module.css
- **Rationale:** Maximize content space in Compact mode
- **Committed in:** `0dba028`

**6. [Rule 1 - Bug] Connected NIST badge to correct state**

- **Found during:** User testing - "wrong badge, the NIST badge is not the numbered badge"
- **Issue:** Misunderstood which badge to control - connected to annotation numbers instead of difficulty overlay
- **Fix:** Connected existing `showBadge` state (controls difficulty overlay) to toggle, added LocalStorage persistence
- **Files modified:** App.tsx, AnnotationCard.tsx, AnnotationColumn.tsx
- **Verification:** Toggle now shows/hides E/M/H difficulty overlay in bottom-right corner
- **Committed in:** `b51fb2c`

---

**Total deviations:** 6 (1 architectural, 4 missing critical, 1 bug)
**Impact on plan:** All deviations were user-driven enhancements or critical bug fixes necessary for functionality. No scope creep - all changes directly related to layout template system usability.

## Issues Encountered

### Development Issues
- **File reversion by linter/formatter**: During initial development, linter reverted changes to App.tsx, requiring re-application of imports and state. Resolved by carefully staging commits.
- **CSS module/global class mismatch**: Initial implementation used CSS module classes on children, but descendant selectors couldn't match generated names. Fixed with `:global()` selectors targeting existing global classes.

### User Feedback Issues (Resolved through checkpoints)
- **Layout templates not working**: User reported no visible effect when clicking templates. Root cause: CSS selectors not matching. Fixed with `:global()` selectors.
- **Compact too extreme**: User feedback that 0.5fr/600px was unbalanced. Adjusted to 50/50 split.
- **Wanted less gap in Compact**: User requested tighter spacing for maximum density. Implemented CSS custom property for gap.

### Misunderstandings (Corrected)
- **Wrong badge controlled**: Initially connected toggle to annotation number badges instead of difficulty overlay. User clarified: NIST badge = E/M/H difficulty circle, not numbered badges. Corrected by connecting to existing `showBadge` state.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Layout template system is complete and production-ready with four templates (Balanced, Wide Email, Wide Annotations, Compact), tags visibility toggle, and NIST badge toggle. All preferences persist across browser refresh via LocalStorage. The system integrates seamlessly with existing preview mode controls and arrow style selector.

### Final Feature Set
- **4 layout templates**: Balanced (60/40), Wide Email (75/25), Wide Annotations (55/45), Compact (50/50)
- **2 visibility toggles**: Show Tags (MITRE/Persuasion), Show NIST Badge (difficulty overlay)
- **3 persistent preferences**: Layout template, tags visibility, badge visibility
- **CSS custom properties**: Template-specific gap values (40px standard, 16px compact)
- **Smooth transitions**: 0.3s ease on all layout changes

### Ready for
- v1.1 complete - all deferred v1.0 features implemented
- Phase 08 ready to proceed to next plan (custom techniques or audit milestone)

---
*Phase: 08-deferred-v1-0-work*
*Plan: 04*
*Completed: 2026-01-21*
