# Phish Monger

## What This Is

A client-side Single Page Application that enables security trainers to annotate phishing emails with technique explanations, generate visual slides with numbered badges, and calculate phishing difficulty using the NIST Phish Scale. Users mark text in emails, map techniques to MITRE ATT&CK, and export high-res PNGs for training materials.

## Core Value

Security trainers can create visual, annotated phishing training materials that clearly highlight deceptive techniques with educational context — without manual layout work.

## Requirements

### Validated

- ✅ Editor with Tiptap integration for email composition — v1.0
- ✅ Custom "Lure Mark" extension wrapping text in spans with IDs — v1.0
- ✅ Sanitized paste feature using DOMPurify — v1.0
- ✅ Technique library sidebar with pre-loaded common techniques — v1.0
- ✅ MITRE ATT&CK ID mapping for each annotation — v1.0
- ✅ NIST Phish Scale scoring interface (cues + premise alignment) — v1.0
- ✅ Visualizer with numbered badge overlay connecting lures to explanations — v1.0
- ✅ html2canvas export to PNG with burned-in annotations — v1.0
- ✅ JSON export with full project structure — v1.0
- ✅ LocalStorage persistence for projects — v1.0
- ✅ Full preview mode before export — v1.0
- ✅ Project metadata (title, author, timestamps) — v1.0
- ✅ JSON import (file + text paste) — v1.0
- ✅ Flexible annotations with freetext title and optional MITRE/Persuasion tags — v1.1
- ✅ Visualizer card displays title, inline tags, and full description — v1.1
- ✅ Lure list shows annotation titles instead of UUIDs — v1.1
- ✅ Undo/redo with 50-step history and keyboard shortcuts — v1.1
- ✅ Custom arrow badge styles (Classic, Square, Diamond) — v1.1
- ✅ Layout templates (Balanced, Compact, Wide) — v1.1
- ✅ Custom technique library with LocalStorage persistence — v1.1
- ✅ Technique library management interface (CRUD operations) — v1.1
- ✅ Keyboard shortcuts help modal — v1.1
- ✅ NIST badge visibility toggle — v1.1
- ✅ Terminology consistency: "project" → "phish" throughout UI, code, and localStorage — v1.3
- ✅ Campaigns-first workflow with smart default landing view — v1.3
- ✅ localStorage migration v2→v3 for key rename — v1.3
- ✅ Modal-based import UI for phishes (file + text paste) — v1.3
- ✅ Modal-based import UI for campaigns (file + text paste) — v1.3
- ✅ Clean HTML export from carousel view (strips lure marks and annotation badges) — v1.3
- ✅ Column focus mode with keyboard shortcuts (1-4 keys) — v1.3
- ✅ Column collapse to header bar with localStorage persistence — v1.3

### Active

**Next Milestone Goals:**
Planning next milestone (use /gsd-new-milestone to define requirements and roadmap)

- ✅ Campaign creation with name, description, and project list — v1.2
- ✅ Campaign list view with metadata (project count, date range) — v1.2
- ✅ Campaign editing (name, description, phishes) — v1.2
- ✅ Campaign deletion with confirmation — v1.2
- ✅ Add/remove phishing projects from campaigns — v1.2
- ✅ Per-phish scheduled date assignment with date picker — v1.2
- ✅ Auto-calculated campaign duration (min/max phish dates) — v1.2
- ✅ Campaign JSON export/import with duplicate detection — v1.2
- ✅ iCal/ics calendar export (RFC 5545 compliant) — v1.2
- ✅ Detail carousel for horizontal browsing (prev/next, keyboard) — v1.2
- ✅ Compact annotation layout toggle (denser display) — v1.2
- ✅ Read-only editor for viewing campaign phishes — v1.2
- ✅ Sample campaign with 4 demo phishes — v1.2
- ✅ LocalStorage schema versioning (v2) for campaigns — v1.2
- ✅ Many-to-many phish↔campaign relationships (self-contained design) — v1.2
- ✅ React 19.2.3 upgrade — v1.2
- ✅ Tiptap 3.17.0 upgrade with LureMark extension migration — v1.2
- ✅ Dependency upgrades (uuid v11, Vite plugin v5) — v1.2

### Out of Scope

- User accounts/authentication — LocalStorage-only, no cloud sync
- Real-time collaboration — Single-user tool
- Email sending — Creation/annotation only
- Mobile app — Web-first, desktop-focused design
- Backend API — Purely client-side

## Context

Built for security teams creating phishing awareness training materials. The tool bridges the gap between raw phishing emails and educational slides by automating annotation layout and providing standard technique references (MITRE ATT&CK, NIST Phish Scale). DOM-based association ensures badges track with text across screen sizes.

Shipped v1.0 with 3,101 LOC TypeScript. Tech stack: React + Vite, Tiptap editor, html2canvas, DOMPurify.
Shipped v1.1 with 4,146 LOC TypeScript. Added: react-hotkeys-hook for keyboard shortcuts.
Shipped v1.2 with 7,081 LOC TypeScript. Added: ical-generator for calendar export.
Shipped v1.3 with 8,114 LOC TypeScript. Added: modal-based import, clean HTML export, column focus/collapse.

## Constraints

- **Tech stack:** React + Vite, Tiptap editor, html2canvas, DOMPurify — Chosen for client-side simplicity and modularity
- **Hosting:** Static only (Netlify/GitHub Pages) — No server required
- **Data persistence:** LocalStorage only — No cloud sync or user accounts
- **Browser support:** Modern browsers with ES2020+ — Chrome/Firefox/Safari/Edge
- **Single user:** No authentication or multi-user features

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Tiptap over other editors | Mark API makes span wrapping trivial; headless allows custom UI | ✅ Confirmed in v1.0 |
| DOM-based annotation over coordinate-based | Badges track with text layout changes; more robust | ✅ Confirmed in v1.0 |
| Client-side only with LocalStorage | Privacy (no data leaves browser), no infra complexity | ✅ Confirmed in v1.0 |
| Split Editor/Viewer architecture | Users paste HTML, mark lures in preview, not editor | ✅ Confirmed in v1.0 |
| Numbered badges over arrows | Simpler, industry standard, better scalability | ✅ Confirmed in v1.0 |
| Flexbox over absolute positioning | Simpler, more maintainable, responsive layout | ✅ Confirmed in v1.0 |
| Static JSON for technique library | MITRE ATT&CK API deferred to v2 | ⚠️ Revisit v2 |
| NIST zone-based matrix | More accurate than subtraction formula | ✅ Confirmed in v1.0 |
| useReducer for undo/redo | Single update point prevents race conditions, easier to enforce history limit | ✅ Confirmed in v1.1 |
| 50-step undo history limit | Prevents memory leaks while providing sufficient workflow depth | ✅ Confirmed in v1.1 |
| react-hotkeys-hook for shortcuts | Declarative API with form tag scoping, handles cross-platform differences | ✅ Confirmed in v1.1 |
| Optional techniqueId in annotations | Enables freetext annotations without MITRE technique mapping | ✅ Confirmed in v1.1 |
| Modal overlay for technique library | Consistent UX pattern with other tools (settings, shortcuts) | ✅ Confirmed in v1.1 |
| Orphaned technique warnings | Preserve user annotations even when custom techniques deleted | ✅ Confirmed in v1.1 |
| Self-contained campaign design | No referential integrity issues, fully importable/exportable | ✅ Confirmed in v1.2 |
| crypto.randomUUID() for IDs | Native browser API, zero dependencies | ✅ Confirmed in v1.2 |
| ISO 8601 strings for dates | JSON-serializable, lexicographically sortable | ✅ Confirmed in v1.2 |
| Schema version 2 for campaigns | Future migration support established | ✅ Confirmed in v1.2 |
| ical-generator for iCal export | RFC 5545 compliance, library over custom implementation | ✅ Confirmed in v1.2 |
| Deferred to final phase | Reduce risk, verify all features before upgrades | ✅ Confirmed in v1.2 |
| Function-based Tiptap defaults | Prevents state sharing between editor instances (v3 requirement) | ✅ Confirmed in v1.2 |

---

*Last updated: 2026-01-24 after v1.3 milestone completion*
