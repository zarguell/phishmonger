# Phase 11: iCal Export & Integration - Context

**Gathered:** 2026-01-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Generate iCalendar (.ics) files from campaign schedules that users can import into external calendar applications (Google Calendar, Outlook, Apple Calendar). Each scheduled phish becomes a calendar event.

</domain>

<decisions>
## Implementation Decisions

### Event granularity
- One event per phish — never combine multiple phishes into a single event
- Event title format: "Campaign Name: Phish Title" (campaign name prefixes phish title)
- No sequence numbers in titles — rely on dates to distinguish events
- Event description contains phish title and phish description only (no annotations, no metadata)

### Event content
- Title: "Campaign Name: Phish Title"
- Description: Phish description text only
- Location: Empty (no location field)
- Duration: 1 hour (start time + 1 hour end time)
- URL/UID: Generate unique UIDs for each event, no clickable URLs

### Claude's Discretion
- Event timing/timezone handling
- Exact time of day for scheduled phishes
- iCal library selection and integration
- VTIMEZONE component implementation details
- Testing approach for different calendar applications

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard iCal export patterns.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 11-ical-export-integration*
*Context gathered: 2026-01-23*
