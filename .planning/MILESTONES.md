# Project Milestones: Phish Monger

## v1.2 Campaign Management (Shipped: 2026-01-24)

**Delivered:** Complete campaign management system for organizing phishing exercises with scheduling, calendar export, carousel browsing, and sample demo data.

**Phases completed:** 9-15 (22 plans total)

**Key accomplishments:**

- Campaign data model with many-to-many phish↔campaign relationships, referential integrity, and LocalStorage schema versioning
- Campaign manager UI with full CRUD operations (create, edit, delete campaigns; add/remove phishes; assign scheduled dates)
- iCal/ics calendar export with RFC 5545 compliance for Google Calendar, Outlook, and Apple Calendar integration
- Detail carousel for horizontal browsing with prev/next navigation, keyboard shortcuts, and read-only editor mode
- Compact annotation layout toggle (denser display for carousel browsing)
- Sample campaign with 4 diverse phishing demos (IT support, BEC, SharePoint impersonation, refund scam)
- Dependency upgrades (React 19.2.3, Tiptap 3.17.0) with zero console errors and all features verified working

**Stats:**

- 50+ files created/modified
- 7,081 lines of TypeScript (+2,935 from v1.1)
- 7 phases, 22 plans, ~61 tasks
- 4 days from v1.1 to v1.2 ship

**Git range:** `feat(09-01)` → `feat(15-04)`

**Known issues:** Carousel scroll position resets when returning from detail view (non-blocking, tracked as tech debt)

**What's next:** TBD (user to decide next milestone goals)

---

## v1.1 Enhanced (Shipped: 2026-01-22)

**Delivered:** Annotation flexibility with freetext titles and optional tags, plus advanced UX features including undo/redo, custom visual styles, and technique library management.

**Phases completed:** 6-8 (15 plans total)

**Key accomplishments:**

- Flexible annotation data model with freetext titles and optional MITRE ATT&CK/Persuasion Principle tags
- Enhanced visualizer card layout (title, inline tags, numbered badges) and lure list with human-readable titles
- Undo/redo system with 50-step history and keyboard shortcuts (Ctrl+Z/Cmd+Z)
- Custom arrow badge styles (Classic, Square, Diamond) and layout templates (Balanced, Compact, Wide)
- Custom technique library with full CRUD operations, LocalStorage persistence, and orphaned reference handling
- Keyboard shortcuts help modal and NIST badge visibility toggle

**Stats:**

- 66 files created/modified
- 4,146 lines of TypeScript (+1,045 from v1.0)
- 3 phases, 15 plans, ~50 tasks
- 1 day from v1.0 to v1.1 ship

**Git range:** `feat(06-01)` → `feat(08-08)`

**What's next:** TBD (user to decide next milestone goals)

---
