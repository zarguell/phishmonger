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

### Active

**Current Milestone: v1.2 Campaign Management**

**Goal:** Enable security teams to organize multiple phishing exercises into campaigns, schedule them, and export to external calendars.

**Target features:**
- Campaign manager interface (create/edit campaigns, add phishes)
- Many-to-many phish↔campaign relationships
- Campaign JSON export/import (single file as array of phishes)
- Detail carousel for browsing campaign phishes (prev/next navigation)
- Per-phish scheduled date field
- Calendar view showing campaign-level summaries
- iCal/ics export for external calendar integration (Outlook, Google Calendar)
- Dependency updates (careful upgrade of major version bumps)

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

---

*Last updated: 2026-01-22 after v1.2 milestone initiated*
