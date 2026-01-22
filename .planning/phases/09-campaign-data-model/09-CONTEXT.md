# Phase 9: Campaign Data Model & Storage - Context

**Gathered:** 2026-01-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Data model foundation and persistence layer for campaign management. This phase delivers the core data structures and storage mechanisms that enable organizing phishing projects into campaigns, with focus on schema design, referential integrity, and reliable LocalStorage persistence.

</domain>

<decisions>
## Implementation Decisions

### Schema design

**Campaign as self-contained entity:**
- Campaigns are fully importable/exportable — they contain copied project data, not references
- Many-to-many from roadmap becomes one-to-many: projects can be copied into multiple campaigns, but each copy is independent
- Progressive schema approach — start with minimal fields, extend in later phases as needed

**Template copy workflow:**
- Library projects are templates
- Adding project to campaign = copy operation (creates independent phish objects)
- Copy includes: project metadata + phishes (annotations, content, techniques)
- Copy excludes: customTechniques (these move to global storage)

**Global custom techniques library:**
- `customTechniques[]` stored at root level in LocalStorage (shared across all projects/campaigns)
- Phishes reference technique IDs from global library
- Projects no longer store customTechniques array

**Campaign entity structure:**
```typescript
{
  id: string
  name: string
  description: string
  createdAt: string
  campaignPhishes: Phish[]  // Copied phishes embedded directly
}
```

**Schema versioning:**
- Global `schemaVersion` field in LocalStorage (set to 2 for v1.2)
- Per-entity versioning not needed

### Referential integrity

**No cascade deletes:**
- Campaigns are self-contained — deleting library project has no effect on campaigns
- Copied phishes maintain independence from source

**Copied phishes structure:**
- Embedded in campaign's `campaignPhishes[]` array (not separate entities)
- Keep original UUIDs from library project (no new IDs generated)
- No back-reference to origin project (copies are truly independent)

**Deletion validation:**
- Warning shown when deleting phish with scheduledDate set
- Deletion proceeds anyway (no blocking)
- Toast notification: "This phish is scheduled for [date]. Delete anyway?"

**CRUD operations:**
- useCampaigns hook handles all referential integrity
- No relationship validation needed (campaigns don't reference library projects)

### Storage constraints

**Quota monitoring:**
- Browser LocalStorage typically ~5MB
- Warn at 80% capacity (~4MB used)
- Error at 95% capacity (~4.75MB used)
- Calculate via: `JSON.stringify(localStorage).length`

**Warning display:**
- Try-catch wrapper around localStorage.setItem()
- Catch QuotaExceededError, show toast notification
- Toast message: "Storage nearly full. Delete old campaigns or export data."
- No pre-save validation — let browser fail, then handle gracefully

**No compression or cleanup:**
- Standard JSON.stringify() — no compression libraries
- No auto-delete or cleanup tools
- Manual cleanup only — user manages their own storage

### Migration approach

**No migration needed (v1.1 → v1.2):**
- Zero existing users — can start fresh with v1.2 schema
- No migration code needed
- Directly implement v1.2 schema from scratch

**Future migrations:**
- Global schemaVersion field enables future migrations
- When schemaVersion 3 is needed: check on app load, run migration if version mismatch

### Claude's Discretion

- Exact storage quota calculation method (try-catch vs pre-calculation)
- Toast notification wording and duration
- Whether to show storage usage meter in UI (not decided)
- Exact field names in campaign entity (can use descriptive names)

</decisions>

<specifics>
## Specific Ideas

- "Campaigns should be fully importable" — drove decision to copy data instead of referencing
- Template copy workflow similar to how users might duplicate a slide in presentation software
- Keep original UUIDs so exported campaigns maintain stable identifiers

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 09-campaign-data-model*
*Context gathered: 2026-01-22*
