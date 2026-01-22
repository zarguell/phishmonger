# Domain Pitfalls

**Domain:** React + LocalStorage application adding campaign management
**Researched:** 2026-01-22
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: LocalStorage Quota Exceeded

**What goes wrong:**
Adding campaign arrays to existing LocalStorage causes "QuotaExceededError" when total storage exceeds ~5MB limit. Users lose data, app crashes, no recovery mechanism.

**Why it happens:**
LocalStorage has a hard 5-5.2MB limit across all major browsers. Storing projects (HTML content, annotations, scoring) + campaigns + project references quickly exceeds this. Each project can be 10-50KB, and campaigns add metadata arrays. No built-in quota checking before writes.

**How to avoid:**
- Implement `getStorageSize()` utility to monitor usage (Stack Overflow: [How to find the size of localStorage](https://stackoverflow.com/questions/4391575/how-to-find-the-size-of-localstorage))
- Check quota before writes: `if (estimatedSize + currentSize > QUOTA_LIMIT)` warn user
- Implement data cleanup: remove old/deleted campaigns aggressively
- Store only essential data, archive old campaigns to file exports
- Use compression for large HTML content (LZ-string or similar)

**Warning signs:**
- Intermittent save failures on larger datasets
- Works in dev (fresh storage) but fails in production (accumulated data)
- "QuotaExceededError" in browser console
- Some users affected, others not (based on usage patterns)

**Phase to address:**
Phase 1 (Data Model & Storage) — must implement quota monitoring before adding campaign storage

---

### Pitfall 2: Orphaned Many-to-Many References

**What goes wrong:**
Campaign references projects via ID arrays, but deleting projects doesn't update campaigns. Opening a campaign shows missing/broken projects, UI errors when trying to load non-existent data.

**Why it happens:**
LocalStorage has no referential integrity. Adding a `campaign.projectIds` array creates a manual many-to-many relationship that requires manual cleanup. When project is deleted, campaign's `projectIds` array isn't updated, leaving "dangling pointers." Database would enforce this with foreign keys, but LocalStorage doesn't.

**How to avoid:**
- Implement cascade delete: when deleting project, scan all campaigns and remove ID
- Add data validation on load: check `projectIds` reference existing projects
- Use cleanup functions: `removeOrphanedReferences()` that runs on app load
- Consider storing campaign data redundantly (snapshot project IDs + minimal metadata) rather than references only
- Add "Data Integrity" section in settings to scan and report orphaned references

**Warning signs:**
- Campaign shows fewer projects than expected
- Console errors: "Cannot read property of undefined" when loading campaign
- Project list shows items that don't exist when clicked
- Testing with deletes works immediately but breaks after page refresh

**Phase to address:**
Phase 1 (Data Model & Storage) — design referential integrity strategy alongside data structure

---

### Pitfall 3: Breaking Existing Workflows

**What goes wrong:**
Adding campaign layer breaks existing single-project workflow. Users can't find their projects, UI becomes confusing with two levels of navigation, keyboard shortcuts conflict, save behavior changes unexpectedly.

**Why it happens:**
Campaigns add a new abstraction layer on top of existing single-project model. Original design assumed "one project = everything." Adding campaigns makes projects "children of campaigns" but existing UI doesn't reflect this hierarchy. Users expect things to work the same way they always did.

**How to avoid:**
- Maintain backward compatibility: single-project workflow should still work without campaigns
- Use progressive disclosure: hide campaign features until user creates first campaign
- Keep existing shortcuts and navigation paths working
- Add "ungrouped projects" virtual campaign for projects not in any campaign
- Test with existing users: can they still do what they did before without learning campaigns?
- Migration guide: when upgrading, explain what changed and how to find old projects

**Warning signs:**
- Users asking "where did my projects go?"
- Confusion about when to save campaigns vs. projects
- Existing keyboard shortcuts stop working or behave differently
- Regression bugs in features that worked before campaign addition

**Phase to address:**
Phase 2 (Campaign CRUD) — must maintain backward compatibility while adding new features

---

### Pitfall 4: Month View Performance with Recurring Events

**What goes wrong:**
Calendar renders all occurrences of recurring events individually. With daily recurring projects over months, calendar displays hundreds of event objects. Navigation between months becomes slow (500ms-2s), UI freezes, scrolling jank.

**Why it happens:**
React Big Calendar and FullCalendar receive all events via props, then filter for current view. With recurring events, naive expansion creates event objects for every occurrence. Navigating months triggers re-render of entire event list. [GitHub Issue #68](https://github.com/jquense/react-big-calendar/issues/68) confirms this causes performance degradation with 1000+ events.

**How to avoid:**
- Use calendar API for events, not React state (FullCalendar recommendation)
- Implement lazy loading: only expand recurring events for visible month
- Store RRULE recurrence rules, expand on-demand rather than pre-expanding
- Use "show more" limits in month view to cap rendered events
- Filter events before passing to calendar: `events.filter(e => isInView(e, currentMonth))`
- Consider FullCalendar over React Big Calendar (Bryntum comparison shows FullCalendar superior)

**Warning signs:**
- Month navigation feels sluggish
- DevTools profiler shows calendar render taking >100ms
- Memory usage grows with each month navigation
- Works fine with 10 events, slow with 100+

**Phase to address:**
Phase 3 (Calendar UI) — must test with 100+ recurring events before marking complete

---

### Pitfall 5: Timezone Bugs in iCal Export

**What goes wrong:**
Exported .ics files have wrong times when imported to Google Calendar/Outlook. Events shift by hours, multi-day events span wrong days, recurring events drift over time. Users can't trust exported schedules.

**Why it happens:**
JavaScript Dates are timezone-ambiguous (local browser time). iCal RFC5545 requires explicit timezone handling (VTIMEZONE components or UTC with TZID). Naive serialization outputs ISO strings without timezone context. [ical.js](https://kewisch.github.io/ical.js/) docs note timezone handling requires explicit TimezoneService configuration.

**How to avoid:**
- Store all dates as UTC in LocalStorage, convert to local for display
- Use `ics.js` or `ical-generator` library with proper timezone support
- Include VTIMEZONE components in .ics export for non-UTC timezones
- Test export: import to Google Calendar, Outlook Apple Calendar and verify times match
- Handle DST transitions: recurring events across DST boundaries need explicit timezone rules
- Validate against RFC5545: RRULE syntax, EXDATE for exceptions, DTSTART/TZID format

**Warning signs:**
- Exported events show different times in external calendars vs. Phish Monger
- Events shift by 1 hour (indicating missing timezone offset)
- Recurring events drift further off over time
- Works in local timezone but breaks for users in other zones

**Phase to address:**
Phase 4 (iCal Export) — must test cross-timezone before marking complete

---

### Pitfall 6: JSON Serialization Data Loss

**What goes wrong:**
Saving to LocalStorage silently loses data: `undefined` properties vanish, Date objects become strings, functions disappear. Reloading shows broken state, missing values, wrong types.

**Why it happens:**
`JSON.stringify()` has well-known limitations: undefined → removed, functions → omitted, Date → ISO string, circular refs → error. LocalStorage only stores strings, so everything goes through JSON serialization. [MDN docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) and [Deep Dive article](https://medium.com/@tejastn10/deep-dive-into-json-stringify-and-json-parse-b8fbd2aac5f1) document these issues.

**How to avoid:**
- Never store functions in state (use callbacks, refs, or dispatchers)
- Convert Date to ISO string explicitly on save, parse back on load
- Use schema validation: after `JSON.parse()`, verify required fields exist
- Add version field to data structure for migrations
- Test: save → reload → compare objects deeply for equality
- Consider custom serializers for complex types (Date, Map, Set)

**Warning signs:**
- `undefined` properties missing after reload
- Dates are strings instead of Date objects
- Console errors: "Cannot read property of undefined" on loaded data
- Type checks fail: `typeof savedDate === 'string'` instead of 'object'

**Phase to address:**
Phase 1 (Data Model & Storage) — must verify round-trip serialization for all data types

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Storing full project objects in campaigns instead of references | No need to load projects, faster display | Massive storage bloat, sync issues when projects update, easier to hit quota | Never — use references only |
| Skipping referential integrity checks initially | Faster development, less code | Data corruption, orphaned references, hard to fix later | MVP only, must add before v1.2 release |
| Using React state for calendar events | Simpler code, easier to understand | Performance issues with 100+ events, FullCalendar docs advise against | Prototype only, must refactor before adding recurring events |
| Naive recurring event expansion (create object for each occurrence) | Simple rendering logic | Storage explosion, impossible to edit recurrence rules, performance nightmare | Never — always store RRULE |
| Manual ad-hoc cleanup of LocalStorage | Quick fix for quota issues | Not sustainable, users will hit quota again | Only as temporary workaround, must implement proper cleanup |

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| FullCalendar / React Big Calendar | Passing all events via React state, letting calendar filter | Filter events yourself before passing to calendar, use calendar API for updates |
| ics.js / ical-generator | Assuming Dates serialize correctly | Explicitly convert to ISO strings with timezone, include VTIMEZONE components |
| LocalStorage migration | Assuming existing users have empty storage | Always check for legacy data, implement version-based migration system |
| Browser export (downloadProjectJSON) | Not handling QuotaExceededError | Wrap in try/catch, show user-friendly error, suggest cleanup or export |
| Import JSON | Trusting user input, no validation | Validate schema structure, check for required fields, handle malformed JSON gracefully |

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Storing everything in LocalStorage without cleanup | Saves work initially, then QuotaExceededError after weeks of use | Implement storage monitoring, aggressive cleanup of deleted items, archive old data | After ~50-100 projects depending on HTML size |
| Expanding recurring events for entire date range | Fast for 1 month, slow for 1 year | Only expand visible range, use RRULE storage, lazy load on month change | >6 months with daily recurring events |
| No storage size monitoring | Works in dev, breaks in prod | Add `getStorageSize()` check, warn user at 80% quota | Any production user with >50 projects |
| Rendering all campaign projects in list view | Snappy with 10 projects, slow with 100+ | Virtualize list (react-window), paginate, show summary counts first | >30 projects per campaign |
| Re-renders on every keystroke in campaign forms | Noticeable lag typing | Debounce saves, useMemo for expensive computations, optimize onChange handlers | Forms with >5 fields or frequent typing |

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Storing sensitive phishing content in LocalStorage unencrypted | XSS attack could steal training materials | LocalStorage is inherently insecure, but phishing training data is not sensitive — acceptable risk. Document this decision. |
| Accepting arbitrary JSON imports | XSS via malicious JSON payload | Use DOMPurify on HTML content, validate schema, sandbox imports if needed | Already using DOMPurify for editor (verify it's applied to imports too) |
| Exporting full project data including unreleased techniques | Leakage of internal training methodology | Filter exports to only include user's annotations, not internal technique library | N/A for v1.2 (not sharing exports externally) |

**Note:** Phish Monger's security model is client-side only. No server storage means no server-side vulnerabilities. Main risk is XSS stealing LocalStorage data.

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Hiding existing projects inside campaign structure | Users can't find their old projects, feel lost | Maintain "All Projects" view alongside campaigns, progressive disclosure of campaign features |
| Requiring campaigns to use the tool | Adds friction for simple single-project use case | Make campaigns optional, allow "ungrouped projects" workflow |
| Calendar month view overwhelmed with events | Can't see individual events, UI clutter | Limit events per day cell, "show more" link, week/day views for detail |
| No indication of campaign/project relationship | Users don't know which projects belong to which campaign | Visual hierarchy, breadcrumbs, color-coding campaigns |
| Accidentally deleting campaign loses all projects | Devastating data loss, no undo | Require confirmation, show project count, archive instead of delete |
| iCal export with wrong times | Users miss scheduled events, distrust feature | Test against real calendars, show preview before export, include timezone in filename |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Campaign CRUD:** Often missing cascade delete — verify deleting project updates all campaigns referencing it
- [ ] **Calendar rendering:** Often missing recurring event expansion — verify daily event shows for all days in month view
- [ ] **iCal export:** Often missing timezone handling — verify exported .ics shows correct times in Google Calendar
- [ ] **LocalStorage migration:** Often missing versioned migrations — verify existing v1.1 users upgrade smoothly without data loss
- [ ] **Quota management:** Often missing proactive warnings — verify user sees alert before hitting storage limit
- [ ] **Referential integrity:** Often missing orphaned reference cleanup — verify deleting campaign doesn't break projects
- [ ] **Performance testing:** Often tested with 5 events — verify calendar remains snappy with 100+ recurring events
- [ ] **Cross-browser testing:** Often tested only in Chrome — verify LocalStorage quota consistent across Safari/Firefox

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| QuotaExceededError | MEDIUM | 1. Detect error, show user-friendly message 2. Offer to export old campaigns as JSON 3. Clear old data from LocalStorage 4. Implement proper cleanup to prevent recurrence |
| Orphaned references | LOW | 1. Add `scanAndCleanOrphans()` utility 2. Run on app load or via "Data Integrity" button 3. Remove project IDs from campaigns that don't exist 4. Log cleanup actions for user transparency |
| Broken workflow after campaigns | HIGH | 1. Add "Legacy Mode" toggle to hide campaign features 2. Restore single-project UI as default view 3. Make campaigns opt-in via progressive disclosure 4. User testing to verify old workflow works |
| Slow calendar performance | MEDIUM | 1. Implement event filtering before passing to calendar 2. Add virtualization for event lists 3. Lazy load recurring events for visible month only 4. Add pagination for large campaign lists |
| Timezone bugs in iCal | LOW | 1. Re-export with proper VTIMEZONE components 2. Use library (ics.js) instead of manual generation 3. Test against multiple calendar apps 4. Document timezone handling in code comments |
| Data loss from JSON serialization | HIGH | 1. Restore from user's exported JSON files (if available) 2. Add schema validation to prevent future corruption 3. Implement data backup to file exports periodically 4. Add "Data Integrity" check on app load |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| LocalStorage Quota Exceeded | Phase 1 (Data Model & Storage) | Monitor storage size, test with 100+ projects, verify warnings appear before quota hit |
| Orphaned Many-to-Many References | Phase 1 (Data Model & Storage) | Implement cascade delete, run data integrity scan, test delete operations |
| Breaking Existing Workflows | Phase 2 (Campaign CRUD) | User testing with v1.1 users, verify single-project workflow unchanged, progressive disclosure of campaign features |
| Month View Performance | Phase 3 (Calendar UI) | Test with 100+ recurring events, profile render times, verify <100ms month navigation |
| Timezone Bugs in iCal Export | Phase 4 (iCal Export) | Cross-timezone testing, import to Google/Outlook/Apple calendars, verify times match exactly |
| JSON Serialization Data Loss | Phase 1 (Data Model & Storage) | Round-trip tests for all data types, schema validation on load, deep equality checks after save/load |
| No Migration Strategy | Phase 1 (Data Model & Storage) | Test upgrade from v1.1 to v1.2, verify existing data preserved, implement versioned migrations |
| Missing Cascade Delete | Phase 2 (Campaign CRUD) | Test delete project → verify campaigns updated, test delete campaign → verify projects preserved or warned |
| Calendar Event Expansion | Phase 3 (Calendar UI) | Verify RRULE stored, not expanded instances, test with 1-year recurring daily event |
| iCal Format Errors | Phase 4 (iCal Export) | Validate output against RFC5545, test import to multiple calendar apps, handle special characters in titles |

## Sources

### LocalStorage & Quota
- [Stack Overflow: How to find the size of localStorage](https://stackoverflow.com/questions/4391575/how-to-find-the-size-of-localstorage)
- [Dev.to: Please Stop Using Local Storage](https://dev.to/rdegges/please-stop-using-local-storage-1i04)
- [GitHub: redux-persist Issue #870 - Exceeding storage quota](https://github.com/rt2zz/redux-persist/issues/870)
- [MDN: Client-side storage limits](https://developer.mozilla.org/en-US/docs/Learn/web_development/Extensions/Client-side_APIs/Client-side_storage)

### Calendar Performance
- [GitHub Issue: Month view performance hit with many events](https://github.com/jquense/react-big-calendar/issues/68)
- [GitHub Issue: 1000+ events support](https://github.com/jquense/react-big-calendar/issues/2752)
- [Bryntum: React FullCalendar vs Big Calendar](https://bryntum.com/blog/react-fullcalendar-vs-big-calendar/)

### iCal & Timezone Handling
- [ical.js Documentation](https://kewisch.github.io/ical.js/)
- [Stack Overflow: Javascript iCal Parser ignore Timezone](https://stackoverflow.com/questions/42304405/javascript-ical-parser-script-ignore-tmezone)
- [Nylas: How to handle timezones with JavaScript](https://www.nylas.com/blog/how-to-handle-timezones-with-javascript-dev/)

### Data Integrity & Serialization
- [Medium: Deep Dive into JSON.stringify() and JSON.parse()](https://medium.com/@tejastn10/deep-dive-into-json-stringify-and-json-parse-b8fbd2aac5f1)
- [Stack Overflow: Issues with Date() when using JSON.stringify()](https://stackoverflow.com/questions/11491938/issues-with-date-when-using-json-stringify-and-json-parse)
- [MDN: JSON.stringify() Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
- [Reddit: How do you manage bloat and orphaned objects in storage?](https://www.reddit.com/r/ExperiencedDevs/comments/1j9gkb0/how_do_you_manage_bloat_and_orphaned_object_in/)

### Migration & Backward Compatibility
- [Dev.to: Introduction to a stateful & maintainable React Local Storage hook](https://dev.to/prakash_chokalingam/introduction-to-a-stateful-maintainable-react-local-storage-hook-31ie)
- [GitHub: versioned-storage](https://github.com/CatChen/versioned-storage)
- [Medium: An Approach to JavaScript Object Schema Migration](https://levelup.gitconnected.com/an-approach-to-javascript-object-schema-migration-ae1bd9f0ce78)
- [Dev.to: Migration Strategies: Moving Applications and Databases Without Breaking Things](https://dev.to/lovestaco/migration-strategies-moving-applications-and-databases-without-breaking-things-57ld)

### Orphaned References (Database Patterns)
- [Stack Overflow: Delete-Orphan in ManyToMany Relation](https://stackoverflow.com/questions/19769030/delete-orphan-in-manytomany-relation-jpa)
- [Medium: Orphaned Data: What it is and how to deal with it](https://medium.com/@oseasisaac91/orphaned-data-what-it-is-and-how-to-deal-with-it-774d44f62461)

### General Best Practices
- [OWASP MASTG-TEST-0002: Testing Local Storage for Input Validation](https://mas.owasp.org/MASTG-TEST-0002/)

---

*Pitfalls research for: React + LocalStorage campaign management*
*Researched: 2026-01-22*
