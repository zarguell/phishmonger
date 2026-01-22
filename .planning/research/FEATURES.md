# Feature Landscape: Campaign Management

**Domain:** Phishing Security Training Tools
**Milestone:** v1.2 Campaign Management
**Researched:** 2025-01-22
**Overall Confidence:** MEDIUM

## Executive Summary

Campaign management in security training tools follows well-established patterns for organizing collections of items with scheduling and export capabilities. Research of GoPhish, KnowBe4, and general collection management UIs reveals clear table stakes for campaign features: campaign creation, many-to-many item relationships, scheduling interfaces, and export functionality. The key differentiator for Phish Monger will be the detail carousel browsing experience combined with iCal integration for calendar-based training workflow integration.

## Table Stakes

Features users expect in campaign management tools. Missing = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Campaign Creation** | Basic requirement for organizing multiple phishing exercises | Low | Name, description, creation flow |
| **Add/Remove Phishes to Campaign** | Core many-to-many relationship management | Medium | UI needs clear affordance for item selection |
| **Campaign List/Grid View** | Users need to see all campaigns at a glance | Low | Standard dashboard pattern |
| **Per-Item Scheduling** | Each phish in campaign needs independent date assignment | Medium | Date picker per item, not just campaign-level |
| **Bulk Date Assignment** | Power users need to set multiple dates quickly | Medium | Select multiple → assign date range or single date |
| **Campaign Detail View** | View all phishes in a campaign with metadata | Low | List/card view showing scheduled dates |
| **Edit Campaign Metadata** | Title, description updates after creation | Low | Standard CRUD operations |
| **Delete Campaign** | Remove unwanted campaigns | Low | Requires confirmation (destructive action) |
| **Export Campaign Data** | Backup or share campaign configuration | Low | JSON export of campaign + referenced phishes |
| **Import Campaign Data** | Restore or share campaigns | Medium | Handle duplicate detection, referenced phishes |

## Differentiators

Features that set Phish Monger apart. Not expected, but valued.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Detail Carousel** | Browse through campaign phishes without leaving context | High | Horizontal swipe/scroll, prev/next controls, preview cards |
| **iCal Export Integration** | Users can add scheduled phishes to Outlook/Google Calendar | Medium | Generate .ics with events per phishing exercise |
| **Visual Calendar View** | See campaign schedule at-a-glance (not just list) | High | Month/week view with campaign summaries per date |
| **Quick-Edit from Carousel** | Edit phish metadata while browsing in carousel | Medium | Inline editing or slide-out panel from carousel |
| **Campaign Templates** | Save campaign structure for reuse | Medium | Clone campaign with/without items |
| **Drag-and-Drop Reordering** | Visual organization of phishes within campaign | Low | Intuitive for manual sequencing |
| **Campaign Progress Tracking** | Visual indicator of completed vs. scheduled phishes | Low | Progress bar or status badges |
| **Multi-Select Bulk Actions** | Select multiple phishes → batch operations | Medium | Delete from campaign, bulk date assign, export subset |
| **Campaign Duration Auto-Calc** | Show date range based on scheduled phishes | Low | Auto-compute start/end from item dates |
| **Conflict Detection** | Warn if scheduling two phishes on same day | Medium | Optional helper to prevent scheduling mistakes |

## Anti-Features

Features to explicitly NOT build. Common mistakes in this domain.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Folders + Tags Together** | Choice paralysis and navigation confusion | Start with campaigns as flat collections, add tags later if needed |
| **Complex Campaign Workflows** | Status flows (Draft → Scheduled → Active → Complete) add complexity | Keep it simple: campaign exists or doesn't exist; items have dates or don't |
| **Email Scheduling Integration** | GoPhish does this, but Phish Monger is annotation tool not email sender | Focus on training material creation, not delivery |
| **User/Group Management** | KnowBe4 manages recipients; out of scope for annotation tool | Assume campaigns are for trainer's planning, not multi-user deployment |
| **Real-Time Collaboration** | Complexity explosion for single-use case | Local storage + JSON import/export sufficient |
| **Automated Reminders** | Requires notification system, backend infrastructure | iCal export lets users use their own calendar reminders |
| **Campaign Analytics Dashboard** | GoPhish tracks open/click rates; Phish Monger creates materials | Focus on authoring, not delivery analytics |
| **Nested Campaigns** | Campaigns containing campaigns = complexity nightmare | Flat collection model; use clear naming if grouping needed |
| **Version History per Campaign** | Auto-save and import/export provide rollback | Keep it simple: manual save points via JSON export |

## Feature Dependencies

```
Campaign Creation → Add Phishes → Schedule Phishes → Browse/Export
                    ↓
              Detail Carousel ← Per-Item Scheduling
                    ↓
              iCal Export ← Calendar View
```

**Dependency notes:**
- **Detail Carousel** requires: Campaign model, many-to-many relationship, phish list
- **iCal Export** requires: Per-item scheduling (dates on each phish)
- **Calendar View** requires: Per-item scheduling, campaign metadata
- **Bulk Date Assignment** requires: Multi-select UI pattern

## MVP Recommendation

For v1.2 MVP, prioritize:

1. **Campaign Creation & Management** (Table stakes)
   - Create campaign with name/description
   - List all campaigns
   - Edit/delete campaign

2. **Many-to-Many Relationship** (Table stakes)
   - Add existing phishes to campaign
   - Remove phishes from campaign
   - View campaign's phishes in list view

3. **Per-Item Scheduling** (Table stakes + enables differentiator)
   - Date picker on each phish in campaign
   - Store date per campaign-phish relationship

4. **Detail Carousel** (Differentiator - core UX value)
   - Browse phishes horizontally within campaign
   - Previous/next navigation
   - Show phish preview in carousel card

5. **iCal Export** (Differentiator - integration value)
   - Export campaign to .ics file
   - One event per scheduled phish
   - Import to Google/Outlook calendar

Defer to post-v1.2:
- **Calendar View**: Nice-to-have visual, carousel provides browse value first
- **Bulk Date Assignment**: Manual assignment acceptable for initial campaigns
- **Campaign Templates**: Clone feature, not needed for MVP
- **Conflict Detection**: Helper, not blocker
- **Multi-Select Bulk Actions**: Individual operations acceptable initially

## Many-to-Many Relationship Pattern

**Research findings from collection management UIs:**

GoPhish uses a simple multi-select pattern:
- Campaigns have "Groups" field (many-to-many with target groups)
- Checkbox-based selection in campaign creation flow
- Groups managed separately, then referenced in campaign

**Recommended pattern for Phish Monger:**

```
Campaign Model:
{
  id: string
  name: string
  description?: string
  createdAt: string
  phishes: Array<{
    phishId: string        // Reference to existing phish project
    scheduledDate?: string  // ISO 8601 date (optional)
    order?: number          // Manual sequence for carousel
  }>
}
```

**UI pattern:** Add Phish button → searchable modal with checkboxes → bulk add

**Avoid:** folders, nested collections, tags (start simple, add later if users ask)

## Browsing Interface Comparison

Based on research from [Carousel UI best practices](https://www.eleken.co/blog-posts/carousel-ui) and [Grid vs Carousel guidance](https://support.limespot.net/en/articles/1458720-should-i-use-carousel-or-grid-style):

| View | Best For | Limitations |
|------|----------|-------------|
| **List View** | Detailed information, quick scanning of metadata | Not visually engaging, requires vertical scroll |
| **Grid View** | Seeing many items at once, comparing across items | Can feel cluttered if cards are complex |
| **Carousel** | Focused browsing, featured content, space-constrained areas | Hides items off-screen, can require many clicks |

**Recommendation:** Provide both for v1.2
- **Carousel** as primary browse experience (differentiator value)
- **List view** as fallback for power users (quick scanning, bulk operations)

**Carousel pattern from Material Design:**
- Horizontal scroll with snap points
- Visible prev/next controls
- Card preview showing key metadata (title, date, technique count)
- Click to open full phish detail

## Scheduling Interface Patterns

Research from [Date Picker UI patterns](https://cieden.com/book/atoms/date-picker/date-picker-ui) and [Calendar UI examples](https://www.eleken.co/blog-posts/calendar-ui):

**Table stakes:**
- Standard `<input type="date">` or date picker component
- Per-phish date field in campaign detail
- Clear date format display (ISO 8601 stored, localized display)

**Per-item scheduling (GoPhish pattern):**
- Launch Date (campaign start)
- Send Emails By (campaign end)
- Emails spread evenly between dates

**Phish Monger adaptation:**
- Each phish has optional `scheduledDate`
- Campaign auto-calculates duration from min/max item dates
- No "spread evenly" logic (trainer sets explicit dates)

**Date picker UX best practices:**
- Show calendar widget for visual selection
- Allow text input for power users (YYYY-MM-DD format)
- Validate dates (no past dates for future campaigns)
- Show timezone if relevant (local storage = local timezone)

## Export Patterns

### iCal Export

**Research from [iCal integration libraries](https://www.jsdelivr.com/package/npm/ical-generator) and [Google Calendar integration guides](https://business.osunstate.gov.ng/blog/google-calendar-and-ical-your-calendar-integration-guide-1767648122):**

**Technical approach:**
- Use `ical-generator` npm package (HIGH confidence - well-maintained, RFC5545 compliant)
- Generate one VEVENT per scheduled phish
- Event title: campaign name + phish title
- Event date: scheduledDate from campaign-phish relationship
- Event description: link to phish or technique summary

**File format:** .ics (iCalendar format)
- Standard for Google Calendar, Outlook, Apple Calendar
- Text-based, easy to generate
- Single file can contain multiple events

**UI pattern:**
- "Export to Calendar" button in campaign detail
- Download .ics file
- User imports into their calendar app

**Event metadata recommendations:**
```
BEGIN:VEVENT
SUMMARY:Q3 Phishing Campaign - Invoice Scam (T1566.001)
DTSTART:20250315T090000Z
DESCRIPTION:5 annotated techniques • High difficulty • View in Phish Monger
END:VEVENT
```

### Bulk Export (JSON)

**Pattern from GoPhish:**
- "Export CSV" button for results
- Single file contains all campaign data

**Phish Monger pattern:**
- Export campaign as JSON (extends existing ProjectJSON)
- Include campaign metadata + array of referenced phish IDs
- Include full phish data or references (decision point: embed vs. reference)

**Recommendation:** Reference phish IDs, embed on export
- Campaign JSON stores `phishIds: string[]`
- Export expands to full phish data for portability
- Import handles duplicate detection by ID

## Campaign vs Single-Project Workflow Distinctions

**Current v1.1 workflow:**
1. Create single phishing project
2. Annotate with techniques
3. Export visualizer PNG
4. Save JSON locally

**New v1.2 campaign workflow:**
1. Create multiple phishing projects (same as v1.1)
2. Create campaign
3. Add existing projects to campaign
4. Assign dates to each project in campaign
5. Browse via carousel to review
6. Export campaign to iCal for calendar integration

**Key distinction:**
- **Single project** = individual phishing email analysis
- **Campaign** = collection of projects with temporal context (dates)
- Projects exist independently; campaigns are optional organization layer

**UX implication:**
- Don't force campaign creation for single-phish users
- Campaign creation is opt-in after creating 2+ projects
- "Add to Campaign" action available from project list

## Complexity Notes by Feature

| Feature | Complexity Rating | Why |
|---------|------------------|-----|
| Campaign CRUD | Low | Standard form + list patterns |
| Many-to-Many UI | Medium | Dual-pane selector or checkbox modal |
| Per-Item Scheduling | Low | Date picker per row, straightforward |
| Detail Carousel | High | Horizontal scroll, state management, card previews |
| iCal Export | Medium | Library integration, event generation, file download |
| Calendar View | High | Date grid rendering, event positioning, responsive layout |
| Bulk Date Assignment | Medium | Multi-select + date range UI, validation |
| Multi-Select Actions | Medium | Checkbox UI + contextual action bar |
| Campaign Templates | Medium | Clone logic with/without items |
| Conflict Detection | Medium | Date comparison algorithm, warning UI |

## Sources

**HIGH Confidence (Official Documentation):**
- [GoPhish Campaigns Documentation](https://docs.getgophish.com/user-guide/documentation/campaigns) - Official campaign creation, scheduling, and export patterns
- [ical-generator npm package](https://www.jsdelivr.com/package/npm/ical-generator) - RFC5545 compliant iCal generation library
- [Material Design Carousel Guidelines](https://m3.material.io/components/carousel/guidelines) - Official carousel component patterns

**MEDIUM Confidence (WebSearch + Verification):**
- [Bulk Action UX: 8 Design Guidelines](https://www.eleken.co/blog-posts/bulk-actions-ux) - Verified design principles for multi-select patterns
- [Carousel UI Best Practices](https://www.justinmind.com/ui-design/carousel) - Verified implementation patterns
- [Date Picker UI Patterns](https://cieden.com/book/atoms/date-picker/date-picker-ui) - Comprehensive date picker patterns
- [Google Calendar & iCal Integration Guide](https://business.osunstate.gov.ng/blog/google-calendar-and-ical-your-calendar-integration-guide-1767648122) - iCal export best practices

**LOW Confidence (WebSearch Only - Needs Validation):**
- KnowBe4 scheduling features (search results vague, no official docs found)
- Security training platform organization patterns (generic results, no specific platform docs)
- Project management tool collection UI (broad search, not security-training specific)

**Confidence Assessment Notes:**
- **Stack/Features:** MEDIUM - Good official sources (GoPhish, Material Design), some gaps in competitor analysis
- **Architecture:** MEDIUM - Clear patterns from GoPhish and collection UI research
- **Pitfalls:** LOW to MEDIUM - Anti-features based on general UX principles, not security-training specific post-mortems

## Gaps to Address

**Topics needing phase-specific research:**
1. **iCal library integration** - Technical implementation details for ical-generator with React
2. **Carousel accessibility** - ARIA patterns, keyboard navigation for horizontal scroll
3. **Calendar view library** - Whether to use FullCalendar, build custom, or defer
4. **Duplicate detection on import** - Strategy for handling conflicting project IDs when importing campaigns
5. **Performance with large campaigns** - Carousel behavior with 50+ phishes (virtualization?)

**Competitor analysis gaps:**
- No deep dive into KnowBe4's actual campaign UI (screenshots/videos needed)
- Haven't reviewed current open-source phishing training tools beyond GoPhish
- Missing comparison with commercial security awareness training platforms (Huntress, Trend Micro)

**User research needed:**
- How do trainers currently schedule phishing exercises? (calendar, spreadsheet, etc.)
- Do trainers want campaign templates or is one-off creation sufficient?
- Is calendar view actually valuable or just a "nice to have" visual?
