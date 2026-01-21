# State: Phish Monger

**Last Updated:** 2026-01-21
**Current Phase:** 08-deferred-v1-0-work
**Status:** In progress (Plan 5 of 8 complete)

**Last activity:** 2026-01-21 - Completed 08-02-PLAN.md (Keyboard shortcuts help system)

**Progress:** ████████████░░░░░░░░░ 62.5% (08-01: Undo/Redo, 08-02: Keyboard shortcuts, 08-03: Arrow styles, 08-04: Layout templates, 08-05: Custom techniques complete)

**Current Focus:** Executing deferred v1.0 features (undo/redo, keyboard shortcuts, arrow styles, layout templates, custom techniques)
**Next Step:** Continue with plan 08-05 (Custom technique library with LocalStorage persistence) or audit milestone

---

## Performance Metrics

*No metrics yet — project in planning phase*

---

## Accumulated Context

### Key Decisions Made

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Tiptap over other editors | Mark API makes span wrapping trivial; headless allows custom UI | Editor foundation (Phase 1) |
| DOM-based annotation over coordinate-based | Arrows track with text layout changes; more robust | Visualizer (Phase 3) |
| Client-side only with LocalStorage | Privacy (no data leaves browser), no infra complexity | Data & Persistence (Phase 5) |
| NIST Phish Scale methodology | Industry-standard for phishing difficulty assessment | Scoring (Phase 4) |
| Flexbox over absolute positioning for cards | Simpler, more maintainable, responsive layout; no manual Y calculations | Visualizer (Phase 3) |
| Deleted useCardLayout hook | No longer needed with flexbox gap handling; simplifies codebase | Visualizer (Phase 3) |
 | Numbered badges over arrows | Simpler, industry standard (Microsoft Attack Simulator, NIST), lower cognitive load for presenters, better scalability | Visualizer (Phase 3) |
 | HTML5 drag/drop for card reordering | Native browser support without additional dependencies, uses manualY field for sort order persistence | Visualizer (Phase 3) |
 | Overflow handling for wide email content | Added overflow-x: auto to .app-preview-mode and .email-content to handle wide phishing emails (tables, images) without clipping | Visualizer (Phase 3) |
| Manual project setup vs create-vite | Non-empty directory blocked create-vite; manual files match template exactly | 01-01: Project initialized |
| Latest Tiptap 2.27.2 over ^2.8.0 | Latest stable version with all bug fixes and features | 01-01: Tiptap installed |
| Lure Mark as atom Node extension | Prevents cursor issues, simplest implementation for span wrapping | 01-02: Lure Mark extension |
| UUID for lure IDs | Ensures unique identifiers across all Lure Marks for annotation linking | 01-02: UUID integration |
| crypto.randomUUID() for Mark Lure button | Native browser API, no additional dependency needed | 01-03: Editor component |
| Two-column layout (editor + preview) | Shows rendered output and HTML source side-by-side for debugging | 01-03: App layout |
| Yellow highlight for Lure Marks | Matches warning/alert visual language, high contrast | 01-03: Lure Mark styling |
| Split Editor/Viewer with Toggle | Phishing emails come as HTML; users paste HTML, see victim view, mark lures in preview (not editor) | 01-04: Architectural pivot |
| Preview-first architecture | Live Preview pane is central; users select text in preview to mark lures; HTML source shows <span data-lure-id> tags | 01-04: New architecture |
| Lure marks as HTML spans (not Tiptap extension) | Simpler: manipulate HTML strings directly with DOM Range API; no complex Tiptap extension needed | 01-04: Lure storage model |
| Mode toggle (HTML input ↔ Rich Text) | Supports pasting raw phishing emails OR typing formatted content; flexibility for different workflows | 01-04: Input modes |
| Radio button toggle for mode switching | Simple, familiar UI pattern; clear indication of current mode | 01-05: Mode toggle UI |
| Content state shared across modes | Single content state ensures no data loss when switching between HTML and Rich Text modes | 01-05: Content preservation |
| localStorage for mode preference | Remembers user's preferred input mode across sessions | 01-05: Mode persistence |
| Selection-based Lure marking | User selects text in Preview pane (not editor) using DOM Range API; wraps selection in span with UUID | 01-06: Preview marking workflow |
| Three-column layout (Input, Preview, Lure List) | Shows HTML input, live preview, and lure list side by side; Preview column centered as primary focus | 01-06: Layout architecture |
| LureList with scroll-to functionality | Parses HTML source to extract data-lure-id attributes; displays lures with UUID preview; scrolls to lure with flash animation | 01-06: Lure list sidebar |
| Cross-element text marking | Use TreeWalker to find all text nodes within selection range; split partial nodes with splitText(); wrap each with data-lure-id span | 01-07: Lure marking across elements |
| LureList groups by UUID | Multiple spans with same UUID show as single lure entry with combined text | 01-07: Lure list grouping |
| Remove lure button | Users can delete lures from LureList; unwraps spans while preserving text content | 01-07: Lure removal UX |
| Static JSON libraries for v1 | Pre-loaded technique and persuasion libraries; MITRE ATT&CK API deferred to v2 | 02-01: Data foundation |
| 12 techniques from MITRE ATT&CK | Focus on observable email artifacts (T1566, T1598, T1036, T1078, T1586, T1027, T1001, T1204) | 02-01: Technique selection |
| 7 persuasion principles from Cialdini | Authority, Urgency, Social Proof, Liking, Reciprocity, Consistency, Fear/Curiosity | 02-01: Psychological analysis |
| Record<lureId, Annotation> pattern | Maps lure IDs to annotation objects for efficient lookup and updates | 02-02: Annotation state |
| LocalStorage initialization for annotations | Lazy evaluation in useState with empty object fallback | 02-02: Persistence pattern |
| LocalStorage utility functions | Centralized persistence logic with error handling for reusability | 02-03: Storage utilities |
| Expandable annotation panels | Toggle button (▶/▼) expands/collapses AnnotationPanel for each lure | 02-03: LureList integration |
| Orphaned annotation cleanup | Remove annotation when lure is deleted to prevent memory leaks | 02-03: Cleanup logic |
| NIST Phish Scale calculation | Formula: Premise Alignment (1-5) - (Visual Cues + Language Cues) = Difficulty Score | 04-01: Scoring logic |
| Counter widgets with +/- buttons | Prominent 40px buttons for visual/language cues counting, not subtle stepper arrows | 04-01: ScoringPanel UX |
| Score breakdown at top | Display calculation details above inputs (not below) for immediate visibility | 04-01: ScoringPanel layout |
| Circle badge (E/M/H) | 60px circular badge with single letter and color coding (Green/Yellow/Red) | 04-01: Difficulty indicator |
| Title field for annotations | Optional `title?: string` field enables freetext annotation titles in visualizer | 06-01: Data model extension |
| Optional techniqueId | Changed `techniqueId: string` to `techniqueId?: string` - annotations now work without MITRE technique | 06-02: Optional tags |
| AnnotationCard component | New component displays title (bold), tags inline, description below per ANN-12 layout | 06-03: Visualizer cards |
| useReducer for undo/redo | History pattern with past/present/future arrays more testable and maintainable than manual useState | 08-01: Undo/redo implementation |
| MAX_HISTORY = 50 | Balances UX (enough steps for session) with memory (prevents unbounded growth) | 08-01: Memory management |
| react-hotkeys-hook for shortcuts | Declarative API with enableOnFormTags option prevents form input interference | 08-01: Keyboard shortcuts |
| Only wrap annotations state | Users expect separate undo for text editors; annotations are primary state to track | 08-01: State selection |
| CSS Modules for badge styling | Scoped styles, lighter than CSS-in-JS, already in project | 08-03: Arrow badge styles |
| Arrow style as user preference | Stored in LocalStorage globally, not per-project (simpler UX) | 08-03: Style persistence |
| Diamond text counter-rotation | Nested span with -45deg transform keeps numbers upright despite 45deg parent rotation | 08-03: Badge rendering |
| Template-based layout UX | Presets reduce cognitive load compared to pixel-level slider control | 08-04: Layout templates |
| Flexbox with flex-grow for email column | Allows responsive sizing while keeping annotation column at fixed width | 08-04: Layout system |
| CSS Modules with :global() selectors | Targets existing global classes while preventing style conflicts | 08-04: CSS architecture |
| CSS custom properties for template values | Used --layout-gap for template-specific gap values (40px standard, 16px compact) | 08-04: Dynamic styling |
| Compact template 50/50 split | User feedback: 0.5fr/600px too extreme, adjusted to equal 1fr/1fr for balance | 08-04: User refinement |
| Tags and NIST badge visibility toggles | Independent LocalStorage-persistent preferences for cleaner visuals | 08-04: User control |
| CustomTechnique extends base Technique | Allows optional URL field for user-defined techniques without MITRE links | 08-05: Type safety |

### Requirements Coverage

**v1 Total:** 27 requirements
**v1.1 Total:** 5 requirements (planned)

**Category Breakdown:**
- Editor: 6 requirements → Phase 1 ✓ COMPLETE
- Annotations (v1): 6 requirements → Phase 2 ✓ COMPLETE
- Visualizer (v1): 6 requirements → Phase 3 ✓ COMPLETE
- Scoring: 6 requirements → Phase 4 ✓ COMPLETE
- Data & Persistence: 6 requirements → Phase 5 ✓ COMPLETE
- Annotations (v1.1): 5 requirements → Phase 6 📋 PLANNED

### Technical Notes

- **Lure Mark Implementation:** Selection-based marking in Preview pane using DOM Range API and TreeWalker; wraps text in `<span data-lure-id="UUID">` elements across element boundaries
- **Cross-element Marking:** Uses TreeWalker to find all text nodes intersecting with selection; splitText() for partial nodes; cloned spans for multiple wraps
- **Preview Rendering:** dangerouslySetInnerHTML with DOMPurify sanitization for secure HTML rendering
- **Lure List Parsing:** DOMParser to extract data-lure-id attributes from HTML source string
- **Annotation Positioning:** BoundingClientRect API for arrow calculations (Phase 3)
- **Export Pipeline:** html2canvas for PNG generation with burned-in overlays (Phase 3)
- **Security:** DOMPurify for HTML sanitization on paste and render
- **Persistence:** LocalStorage with auto-save on every state change; separate keys for HTML source and input mode

### Active Todos

- [x] Set up React + Vite project structure (01-01)
- [x] Install Tiptap and dependencies (01-01)
- [x] Implement Lure Mark custom extension (01-02)
- [x] Implement DOMPurify paste sanitization (01-02)
- [x] Create Editor component with toolbar (01-03)
- [x] Implement LocalStorage persistence (01-03)
- [x] Create mode toggle with HTML input and Rich Text switching (01-05)
- [x] Implement live preview pane with lure marking (01-06)
- [x] Fix cross-element text marking for lures (01-07)
- [x] Build technique library JSON structure (02-01)
- [x] Create annotation panel UI (02-02)
- [x] Link Lure Marks to technique annotations (02-03)
- [x] Install html2canvas and TypeScript types (03-01)
- [x] Create export utility and ExportButton component (03-05)
- [x] Create SVG overlay component for visualizer (03-02)
- [x] Implement NIST Phish Scale calculation logic (04-01)
- [x] Integrate ScoringPanel into App with persistence (04-02)
- [x] Define ProjectMetadata type with title, author, timestamps (05-01)
- [x] Integrate ProjectSettings into App.tsx (05-02)
- [x] Render ProjectSettings in edit mode header with Export/Import UI (05-03)
- [x] Add optional title field to Annotation type (06-01)
- [x] Make techniqueId optional in Annotation type (06-02)
- [x] Create AnnotationCard component with tag display (06-03)
- [x] Add Persuasion tag display to AnnotationCard (06-03)
- [x] Add title input field to AnnotationPanel (06-04)
- [x] Restore numbered annotation badges in visualizer cards (06-05)
- [x] Install react-hotkeys-hook dependency (08-01)
- [x] Create useUndoRedo hook with history management (08-01)
- [x] Integrate undo/redo into App.tsx with keyboard shortcuts (08-01)
- [x] Create layout templates CSS module with four presets including Compact (08-04)
- [x] Create LayoutTemplateSelector component with visual icons (08-04)
- [x] Fix CSS selector incompatibility with :global() selectors (08-04)
- [x] Add Compact template with 50/50 split, 14px text, 16px gap (08-04)
- [x] Create VisibilityToggles component (Show Tags, Show NIST Badge) (08-04)
- [x] Integrate layout template system with LocalStorage persistence (08-04)
- [x] Create CustomTechnique type extending base Technique (08-05)
- [x] Create useCustomTechniques hook with LocalStorage persistence (08-05)
- [x] Implement merge operation for built-in + custom techniques (08-05)
- [x] Fix TypeScript compilation errors in custom technique system (08-05)

### Blockers

*None identified*

---

## Session Continuity

**Last Session:** 2026-01-21 (Completed 08-05-PLAN.md)
**Current Session:** 2026-01-21 (Phase 08 plan 05 execution complete with custom technique system)

**What Was Done:**
- Defined 27 v1 requirements across 5 categories
- Created 5-phase roadmap (Editor → Annotations → Visualizer → Scoring → Data)
- Validated 100% requirement coverage
- Initialized project state tracking
- Executed 01-01: Project initialization with Vite + React + TypeScript
- Installed Tiptap editor and DOMPurify dependencies
- Executed 01-02: Lure Mark Tiptap extension with UUID generation
- Executed 01-02: DOMPurify sanitization preserving email layout
- Executed 01-03: Editor component with toolbar and LocalStorage persistence
- Executed 01-04: Architectural decision checkpoint (split Editor/Viewer)
- Executed 01-05: Mode toggle with HTML input and Rich Text editor
- Executed 01-06: Live Preview pane with selection-based Lure marking and LureList sidebar
- Executed 01-07: Cross-element text marking fix using TreeWalker and splitText()
- **Phase 1 complete:** All 6 requirements verified (6/6 passed)
- **Verification report:** .planning/phases/01-editor-foundation/01-editor-foundation-VERIFICATION.md
- **Phase 2 (02-01) complete:** Static technique and persuasion libraries with TypeScript types
- **Phase 2 (02-02) complete:** Annotation state management and AnnotationPanel component
- **Phase 2 (02-03) complete:** Annotation integration with LureList, LocalStorage persistence, and cleanup
- **Phase 2 complete:** All 6 requirements verified (11/11 must-haves passed)
- **Verification report:** .planning/phases/02-technique-annotations/02-TECHNIQUE-ANNOTATIONS-VERIFICATION.md
- **Phase 6 (06-01) complete:** Added optional title field to Annotation type
- **Phase 6 (06-02) complete:** Made techniqueId optional in Annotation type
- **Phase 6 (06-03) complete:** Created AnnotationCard component with combined MITRE and Persuasion tag display
- **Phase 6 (06-04) complete:** Added title input field to AnnotationPanel for freetext annotation titles
- **Phase 6 (06-05) complete:** Restored numbered annotation badges (1, 2, 3...) in visualizer cards
- All 5 ANN requirements satisfied for v1.1 (ANN-08 through ANN-12)
- Gap closure complete: v1.1 fully shipped with enhanced annotation data model
- **Phase 8 (08-01) complete:** Undo/redo functionality with keyboard shortcuts
  - Installed react-hotkeys-hook@5.2.3 for global keyboard shortcuts
  - Created useUndoRedo hook with useReducer pattern and MAX_HISTORY=50
  - Wrapped annotations state with undo/redo history tracking
  - Added Ctrl+Z/Cmd+Z for undo, Ctrl+Shift+Z/Ctrl+Y for redo
  - Configured enableOnFormTags:false to prevent form input interference
  - Added visual undo/redo buttons to header with disabled states
  - SUMMARY: .planning/phases/08-deferred-v1-0-work/08-01-SUMMARY.md
- **Phase 8 (08-02) complete:** Keyboard shortcuts help modal
  - Created KeyboardShortcutHelp component with modal overlay
  - Created ShortcutKey component for visual key cap styling
  - Added Ctrl+/ or Cmd+/ shortcut to open help modal
  - Listed all available shortcuts with descriptions
  - Escape key and click-outside to dismiss modal
  - SUMMARY: .planning/phases/08-deferred-v1-0-work/08-02-SUMMARY.md
- **Phase 8 (08-03) complete:** Custom arrow badge styles with all checkpoint fixes
  - Created arrows.module.css with Classic Blue, Classic Red, Square, and Diamond variants
  - Created ArrowStyleSelector component with live preview badges
  - Integrated arrowStyle state with LocalStorage persistence (ARROW_STYLE_KEY)
  - Updated AnnotationCard to use CSS module badges
  - Diamond style counter-rotates text to keep numbers upright
  - **Checkpoint fixes applied (2 rounds):**
    - Round 1: Fixed badge positioning in email content, applied arrow styles to inline badges, added Classic Red option
    - Round 2: Fixed annotation title overlapping badge (added 30px left padding to title)
  - All issues resolved, plan complete
  - SUMMARY: .planning/phases/08-deferred-v1-0-work/08-03-SUMMARY.md
- **Phase 8 (08-04) complete:** Layout template presets with user-driven enhancements
  - Created layouts.module.css with four templates: Balanced, Wide Email, Wide Annotations, Compact
  - Created LayoutTemplateSelector component with four visual SVG icons
  - Replaced annotation width slider with template buttons
  - Added LocalStorage persistence for layout template (LAYOUT_TEMPLATE_KEY)
  - Fixed CSS selector bug using :global() selectors to target existing global classes
  - Created VisibilityToggles component with Show Tags and Show NIST Badge checkboxes
  - Added LocalStorage persistence for tags (SHOW_TAGS_KEY) and badge (SHOW_BADGE_KEY)
  - Compact template: 50/50 split, 14px text, 16px gap (CSS custom property --layout-gap)
  - Flexbox layout with flex-grow for responsive email column sizing
   - All preferences persist across browser refresh
   - **User-driven enhancements (3 checkpoint cycles):**
     - Cycle 1: Fixed templates not working (CSS selector bug)
     - Cycle 2: Added Compact template, Tags toggle, refined proportions to 50/50
     - Cycle 3: Reduced gap in Compact, fixed NIST badge toggle connection
   - All issues resolved, plan complete
   - SUMMARY: .planning/phases/08-deferred-v1-0-work/08-04-SUMMARY.md
- **Phase 8 (08-05) complete:** Custom technique library with LocalStorage persistence
   - Created CustomTechnique type extending Technique with optional URL and organization fields
   - Implemented useCustomTechniques hook with full CRUD operations and automatic LocalStorage persistence
   - Added getAllTechniques() merge operation for combining built-in and custom techniques
   - Fixed TypeScript compilation errors in integrated components
   - **Deviation handling:** Applied Rule 3 (blocking issues) to resolve 3 compilation errors
   - Commits: 1075bfc, 51d308e, 6595765
   - SUMMARY: .planning/phases/08-deferred-v1-0-work/08-05-SUMMARY.md

**What's Next:**
- Continue with Phase 08 deferred features (08-06 through 08-08)
- Or: Audit milestone - review phase 08 progress and remaining work

**Context to Preserve:**
- Each phase builds on the previous (vertical slices, not horizontal layers)
- DOM-based positioning (not coordinate-based) for arrow annotations
- Static JSON for technique library (v1) — MITRE ATT&CK API integration deferred to v2
- Export format is high-res PNG with burned-in annotations (not editable layers)
- **Split Editor/Viewer architecture (01-04):**
  - Lure marks created by selecting text in Preview pane (not editor)
  - Lure storage as `<span data-lure-id="UUID">` in HTML source
  - Mode toggle: HTML input mode (textarea) OR rich text mode (Tiptap)
  - Live Preview pane always visible, shows rendered email with highlights
  - Tiptap simplified (no LureMark extension needed)

---

## Session Continuity

**Last Session:** 2026-01-21 (Completed 08-03-PLAN.md)
**Current Session:** 2026-01-21 (Phase 8 in progress - 3 of 8 plans complete)

**What Was Done:**
- **Phase 8 (08-03) complete:** Arrow badge style customization
  - Created src/styles/arrows.module.css with three badge variants (Classic, Square, Diamond)
  - Created ArrowStyleSelector component with live preview
  - Integrated arrowStyle state with LocalStorage persistence
  - Updated AnnotationCard to use CSS module badges instead of inline classes
  - Commits: 5b432c5, 2892ff7, 66a6dca, 10ac2fb, 6dbd5eb, e19a78b
  - SUMMARY: .planning/phases/08-deferred-v1-0-work/08-03-SUMMARY.md

**What's Next:**
- Continue with Phase 08 deferred features (08-04 through 08-08)
- Dev server running on http://localhost:5174/ for verification
- Plans 08-02, 08-03, 08-04, 08-05 already executed in parallel
- Ready for v2 planning or audit milestone

---
