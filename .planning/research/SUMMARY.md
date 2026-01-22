# Project Research Summary

**Project:** Phish Monger v1.2 Campaign Management
**Domain:** Phishing Security Training Tools
**Researched:** 2026-01-22
**Confidence:** HIGH

## Executive Summary

Campaign management in security training tools is a well-established pattern for organizing collections of phishing exercises with temporal context (scheduling) and export capabilities. Research of GoPhish, Material Design patterns, and collection management UIs reveals clear best practices: many-to-many relationships between campaigns and projects, per-item scheduling interfaces, and iCal export for calendar integration. The recommended approach extends Phish Monger's existing React + LocalStorage architecture without breaking backward compatibility, introducing a new Campaign entity that references existing Project entities via ID arrays.

The key architectural decision is maintaining campaigns as an optional organization layer on top of the existing single-project workflow. Projects remain independent and fully functional without campaigns; campaigns simply provide grouping and scheduling for training workflows. This preserves the v1.1 user experience while adding power-user features. The integration leverages existing patterns (useCustomTechniques hook for CRUD, modal overlays for settings) and extends the LocalStorage schema with a campaigns array and optional scheduledDate field on project metadata.

Critical risks center on LocalStorage limitations and referential integrity in a manual many-to-many relationship. The QuotaExceededError pitfall is well-documented—without proactive storage monitoring and cleanup, users will hit the ~5MB browser limit after ~50-100 projects depending on HTML content size. Orphaned references are another concern: deleting projects requires cascade updates to all campaigns referencing them, or campaigns will point to non-existent data. The mitigation strategy implements quota monitoring before writes, atomic updates for relationship changes, and migration logic to safely transition v1.1 users to the v1.2 schema.

## Key Findings

### Recommended Stack

**Calendar UI library:** @schedule-x/react (^2.36.0) — Modern, lightweight, TypeScript-first calendar with zero dependencies and built-in dark mode. More maintainable than react-big-calendar (requires external localizer) and free vs. FullCalendar Premium.

**Date utilities:** date-fns (^4.0.0) — Required localizer for @schedule-x/react. Lightweight, tree-shakeable alternative to moment.js.

**iCal export:** ics (^3.8.1) — Simple browser-compatible API for generating .ics files. Better choice than ical-generator (3x larger bundle, optimized for server-side feeds).

**Dependency upgrades:** Stack research identified major version updates available (React 18→19, Tiptap 2→3) but recommends deferring these to post-v1.2 to reduce risk. Focus v1.2 on calendar/iCal features with stable React 18 + Tiptap v2.

### Expected Features

**Must have (table stakes):**
- Campaign Creation & CRUD — Users expect basic collection management
- Many-to-Many Relationship — Add/remove projects to campaigns with proper referential integrity
- Per-Item Scheduling — Each phish needs independent date assignment (not campaign-level dates)
- Campaign List/Grid View — See all campaigns at a glance with metadata

**Should have (competitive):**
- Detail Carousel — Browse through campaign phishes horizontally without leaving context (key UX differentiator)
- iCal Export Integration — Export campaign schedule to Google/Outlook/Apple Calendar
- Visual Calendar View — Month/week view showing campaign schedule at-a-glance

**Defer (v2+):**
- Bulk Date Assignment — Manual assignment acceptable for MVP
- Campaign Templates — Clone feature, not needed for initial release
- Conflict Detection — Helper feature, not blocker
- Multi-Select Bulk Actions — Individual operations acceptable initially

### Architecture Approach

Campaign management introduces a many-to-many relationship between Campaign and Project entities, requiring careful state management design within the existing React + LocalStorage architecture. The integration strategy extends existing patterns without breaking backward compatibility: campaigns reference projects via ID arrays, projects optionally track campaign membership, and all persistence follows the established useCustomTechniques hook pattern.

**Major components:**
1. **CampaignManager** — List/edit campaigns, handle CRUD operations
2. **CalendarView** — Monthly calendar grid with campaign indicators
3. **DetailCarousel** — Browse projects within selected campaign horizontally
4. **CampaignSettings** — Modal for campaign metadata, project assignment, scheduling
5. **LocalStorage Schema Evolution** — Add campaigns array, extend project metadata with scheduledDate
6. **Migration Layer** — v1.1→v1.2 migration script for legacy single-project users

**State management expansion:** App.tsx adds appMode state ('project' | 'campaign'), projects/campaigns arrays loaded from LocalStorage, and derived state for selected campaign and its projects. All CRUD operations follow the hook-based pattern from useCustomTechniques for consistency.

### Critical Pitfalls

1. **LocalStorage Quota Exceeded** — Implement storage size monitoring before writes, warn users at 80% quota, archive old campaigns to file exports to prevent ~5MB limit crashes

2. **Orphaned Many-to-Many References** — Deleting projects doesn't automatically update campaigns. Implement cascade delete: when project deleted, scan all campaigns and remove project ID atomically

3. **Breaking Existing Workflows** — Campaigns add new abstraction layer that can confuse existing users. Maintain backward compatibility: single-project workflow must still work without campaigns, use progressive disclosure for campaign features

4. **Month View Performance with Recurring Events** — Calendar libraries receive all events via props and filter for current view. With recurring events, naive expansion creates hundreds of objects causing 500ms-2s navigation lag. Filter events before passing to calendar, use RRULE storage not pre-expanded instances

5. **Timezone Bugs in iCal Export** — JavaScript Dates are timezone-ambiguous, iCal RFC5545 requires explicit timezone handling. Store dates as UTC, use ics library with VTIMEZONE components, test export against Google/Outlook/Apple calendars

## Implications for Roadmap

Based on combined research, suggested phase structure:

### Phase 1: Data Model & Storage Foundation
**Rationale:** Must establish persistence layer before UI. LocalStorage quota monitoring and referential integrity patterns are critical dependencies for all subsequent phases. Migration logic ensures v1.1 users don't lose data.

**Delivers:** Campaign/Project type definitions, storage utilities, migration script, useCampaigns hook with CRUD operations

**Addresses:** Campaign CRUD, many-to-many relationship, per-item scheduling data structure

**Avoids:** QuotaExceededError (implements monitoring), orphaned references (cascade delete), JSON serialization data loss (round-trip validation)

**Research flags:** None — patterns follow existing codebase (useCustomTechniques), LocalStorage schema is straightforward extension

### Phase 2: Campaign Manager UI
**Rationale:** Once data model exists, users need interface to create and manage campaigns. This is the primary entry point for campaign workflow.

**Delivers:** CampaignManager component (list view), CampaignSettings modal (metadata, project assignment, scheduling), App.tsx navigation between project/campaign modes

**Uses:** @schedule-x/react (optional for simple calendar icon, can defer to Phase 3), existing modal overlay pattern from TechniqueLibrary

**Implements:** Hook-based CRUD from Phase 1, modal settings pattern from existing codebase

**Avoids:** Breaking existing workflows (maintains backward compatibility, progressive disclosure)

**Research flags:** Medium — Campaign CRUD is standard, but many-to-many UI patterns (multi-select project assignment) need phase-specific research on optimal UX

### Phase 3: Calendar View
**Rationale:** Visual calendar provides at-a-glance campaign schedule. Depends on Phase 2 (campaigns exist with scheduled dates) and delivers core differentiator feature.

**Delivers:** CalendarView component (monthly grid), date utilities, month navigation, click-to-drill-down to DetailCarousel

**Uses:** @schedule-x/react for calendar rendering, date-fns for date manipulation

**Implements:** Event filtering before passing to calendar (avoid performance pitfall)

**Avoids:** Month view performance degradation (filters events, uses RRULE if recurring)

**Research flags:** Low — @schedule-x/react is well-documented, but responsive layout and event density handling (50+ events) need testing

### Phase 4: Detail Carousel
**Rationale:** Browsing experience is key UX differentiator. Depends on Phase 2 (campaigns with projects) and enables users to review campaign content before export.

**Delivers:** DetailCarousel component (horizontal scroll, prev/next navigation), Editor component readOnly mode, campaign context header

**Uses:** Existing Editor component (reused in read-only mode), carousel UI patterns from Material Design

**Implements:** Horizontal scroll with snap points, card previews showing metadata

**Avoids:** Tight coupling between Editor and Campaign views (Editor receives data via props, remains stateless)

**Research flags:** Medium — Carousel accessibility (ARIA, keyboard nav) needs phase-specific research, carousel behavior with 50+ items (virtualization?)

### Phase 5: Export Features
**Rationale:** iCal export is major differentiator for calendar integration. JSON export enables backup/sharing of campaigns. Depends on Phase 2 (campaigns with scheduled dates).

**Delivers:** Campaign JSON export/import, iCal export using ics library, ExportButton campaign mode

**Uses:** ics library for iCal generation, existing downloadProjectJSON pattern

**Implements:** iCal export with timezone handling (UTC storage, VTIMEZONE components)

**Avoids:** Timezone bugs (tests against real calendars), format errors (validates against RFC5545)

**Research flags:** Medium — ics library browser compatibility with Vite needs verification, cross-calendar testing required

### Phase 6: Polish & Testing
**Rationale:** Edge cases, error handling, and UX refinement separate working prototype from production-ready feature.

**Delivers:** Error handling (migration failures, import validation), edge case coverage (empty campaigns, orphaned IDs), UX polish (loading states, confirmation dialogs, keyboard shortcuts)

**Uses:** All previous phases

**Implements:** "Looks Done But Isn't" checklist verification (cascade delete, recurring events, quota warnings)

**Avoids:** Data loss from JSON serialization (schema validation), migration crashes (defensive parsing)

**Research flags:** None — standard QA patterns

### Phase Ordering Rationale

**Dependency chain:** Phase 1 (data) → Phase 2 (CRUD UI) → Phase 3/4 (visualizations) → Phase 5 (export) → Phase 6 (polish). This order ensures each phase has required data from predecessors. Calendar and Carousel are parallel dependencies (both need Phase 2) but Carousel is sequenced before Calendar because it's simpler (horizontal scroll vs. date grid) and delivers more immediate user value (content review vs. schedule visualization).

**Grouping rationale:** Phases 1-2 establish foundation (data + CRUD), Phases 3-4 deliver core UX (calendar + carousel), Phase 5 adds integration (export), Phase 6 hardens production readiness. This grouping matches user workflow: create campaign → schedule items → review content → export calendar.

**Pitfall avoidance:** Phase 1 addresses quota and referential integrity upfront (prevents data loss). Phase 2 maintains backward compatibility (prevents breaking existing users). Phase 3 filters events before calendar render (prevents performance issues). Phase 5 tests timezone handling (prevents iCal bugs).

### Research Flags

**Phases likely needing deeper research during planning:**
- **Phase 2:** Many-to-many UI patterns — Multi-select project assignment interface needs research on optimal UX (checkbox modal vs. dual-pane selector)
- **Phase 3:** Calendar responsive layout — Event density handling with 50+ events needs prototyping (show more limits, week/day views)
- **Phase 4:** Carousel accessibility — ARIA patterns and keyboard navigation for horizontal scroll need specification
- **Phase 5:** iCal library integration — ics library browser compatibility with Vite bundler needs verification

**Phases with standard patterns (skip research-phase):**
- **Phase 1:** Data model follows existing codebase patterns, LocalStorage schema is straightforward extension
- **Phase 6:** Standard QA and edge case handling, no domain-specific research needed

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | @schedule-x/react and ics library verified via npm and official docs, clear alternatives considered |
| Features | MEDIUM | GoPhish and Material Design provide strong sources, but competitor analysis gaps (KnowBe4 screenshots unavailable) |
| Architecture | HIGH | Extends existing codebase patterns (useCustomTechniques, storage.ts), migration strategy explicit |
| Pitfalls | HIGH | LocalStorage quota and referential integrity issues well-documented with specific mitigation strategies |

**Overall confidence:** HIGH

Research draws from official documentation (GoPhish, Schedule-X, ics library, Material Design), verified npm packages, and existing codebase analysis. Gaps exist in competitor analysis (KnowBe4) and large-scale performance patterns (100+ projects), but these are acceptable for v1.2 scope targeting ≤100 projects.

### Gaps to Address

**Many-to-many UI patterns:** Research identifies need for multi-select project assignment interface but doesn't specify optimal UX. **Handle during Phase 2 planning:** Prototype both checkbox modal and dual-pane selector, user test for clarity.

**Carousel accessibility:** Material Design provides carousel patterns but not ARIA specifics for horizontal scroll. **Handle during Phase 4 planning:** Specify keyboard navigation (arrow keys, Home/End), screen reader announcements for position/total.

**iCal library browser compatibility:** ics library docs show Node.js usage, browser build verification needed. **Handle during Phase 5 planning:** Test with Vite bundler early in phase, fallback to manual iCal string generation if build fails.

**Large-scale performance:** Calendar performance with 100+ recurring events not fully addressed. **Handle during Phase 3 planning:** Document 100-project limit in UI, implement event filtering, test with synthetic dataset.

**Competitor analysis:** KnowBe4 campaign UI not deeply reviewed due to limited public docs. **Acceptable for v1.2:** GoPhish provides sufficient patterns, Phish Monger's carousel differentiator doesn't copy competitors.

## Sources

### Primary (HIGH confidence)
- [GoPhish Campaigns Documentation](https://docs.getgophish.com/user-guide/documentation/campaigns) — Official campaign creation, scheduling, and export patterns
- [@schedule-x/react on npm](https://www.npmjs.com/package/@schedule-x/react) — Calendar library verification (v2.36.0, 2 days ago, 0 dependencies)
- [ics on npm](https://www.npmjs.com/package/ics) — iCal generation library (v3.8.1, 7 months ago, 284K weekly downloads)
- [Material Design Carousel Guidelines](https://m3.material.io/components/carousel/guidelines) — Official carousel component patterns
- [MDN: JSON.stringify() Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) — Data serialization limitations
- [Stack Overflow: LocalStorage size](https://stackoverflow.com/questions/4391575/how-to-find-the-size-of-localstorage) — Quota monitoring patterns

### Secondary (MEDIUM confidence)
- [Bulk Action UX: 8 Design Guidelines](https://www.eleken.co/blog-posts/bulk-actions-ux) — Multi-select UI patterns
- [Date Picker UI Patterns](https://cieden.com/book/atoms/date-picker/date-picker-ui) — Scheduling interface best practices
- [React Design Patterns 2026](https://trio.dev/essential-react-design-patterns/) — State management patterns
- [GitHub: Month view performance hit](https://github.com/jquense/react-big-calendar/issues/68) — Calendar performance pitfall verification
- [ical.js Documentation](https://kewisch.github.io/ical.js/) — Timezone handling requirements

### Tertiary (LOW confidence)
- KnowBe4 scheduling features — Search results vague, no official docs found (gap noted)
- Security training platform organization patterns — Generic results, not platform-specific
- Project management tool collection UI — Broad search, not security-training specific

### Internal Sources (Codebase Analysis)
- `/Users/zach/localcode/phishmonger/src/utils/storage.ts` — Current LocalStorage schema, migration patterns
- `/Users/zach/localcode/phishmonger/src/hooks/useCustomTechniques.ts` — CRUD hook pattern to replicate
- `/Users/zach/localcode/phishmonger/src/App.tsx` — Existing state management architecture
- `/Users/zach/localcode/phishmonger/.planning/milestones/v1.1-REQUIREMENTS.md` — v1.1 feature set (baseline)

---
*Research completed: 2026-01-22*
*Ready for roadmap: yes*
