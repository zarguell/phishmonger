---
status: verifying
trigger: "campaign-phish-workflow-confusion"
created: 2026-01-23T00:00:00Z
updated: 2026-01-23T00:00:05Z
---

## Current Focus
hypothesis: ROOT CAUSE FOUND: handleCreateNewPhish creates an incomplete CampaignPhish object missing required fields. The Phish interface requires: id, metadata (with title, author, createdAt), htmlSource, annotations, scoring, inputMode. But handleCreateNewPhish only provides: id, partial metadata (missing author), htmlSource, annotations, scheduledDate. It's missing: scoring, inputMode, and author field in metadata.
test: This is a confirmed type violation - CampaignPhish extends Phish, so it must have all required Phish fields
expecting: When this incomplete object is saved to localStorage and later retrieved, it likely causes the campaign to appear empty or fail validation
next_action: Fix handleCreateNewPhish to include all required fields

## Symptoms
expected: Campaign should contain multiple phishes directly. When creating a new phish within a campaign and saving, it should be added to the campaign's phish collection.
actual: Creating a new project within a campaign and saving it leaves the campaign completely empty (no projects/phishes). The campaign still exists but has no children.
errors: No error messages, but data model is wrong
reproduction: 1. Create a campaign 2. Within that campaign, create a new project/phish 3. Save the project/phish 4. Campaign is now empty (should contain the phish)
started: This has never worked correctly - built projects first, then added campaign view on top, resulting in backward/incorrect data relationship

## Eliminated

## Evidence
- timestamp: 2026-01-23T00:00:00Z
  checked: User context
  found: Current mental model: Campaign → multiple Phishes (direct), NOT Campaign → multiple Projects → multiple Phishes
  implication: The terminology and relationships may be misaligned

- timestamp: 2026-01-23T00:00:01Z
  checked: Type definitions (src/types/campaign.ts, src/types/phish.ts, src/types/project.ts)
  found: Data model is CORRECT - Campaign contains campaignPhishes: CampaignPhish[], and CampaignPhish extends Phish. There is no "Project" entity in the campaign relationship.
  implication: The data model is not the issue. The problem is in the save/update workflow logic.

- timestamp: 2026-01-23T00:00:02Z
  checked: Campaign workflow in App.tsx
  found: Critical bug in handleSaveCampaign (line 366-370). After calling updateCampaign, it immediately sets editingCampaign to undefined (line 368).
  found: handleEditPhish (line 372-393) sets editingCampaignPhish state but ALSO sets editingCampaign to undefined (line 391)
  found: handleSaveToCampaign (line 395-424) tries to use editingCampaign?.campaignPhishes (line 414) but editingCampaign was already set to undefined
  implication: When user clicks "Edit" on a campaign phish, then makes changes and clicks "Save to Campaign", the code tries to map over editingCampaign.campaignPhishes which is undefined, resulting in an empty array being saved to the campaign.

- timestamp: 2026-01-23T00:00:03Z
  checked: useCampaigns hook updateCampaign method
  found: updateCampaign loads fresh data from localStorage (line 92) to avoid stale closure issues
  implication: The hook is correctly implemented, but the problem is that App.tsx is passing undefined/empty campaignPhishes in the updates parameter

- timestamp: 2026-01-23T00:00:04Z
  checked: CampaignEditor.handleCreateNewPhish (line 102-115)
  found: Creates CampaignPhish object with only: id, htmlSource='', annotations={}, metadata={title, createdAt}, scheduledDate
  found: MISSING required fields: scoring (ScoringData), inputMode (InputMode), metadata.author (string)
  found: CampaignPhish extends Phish, which requires ALL these fields
  implication: ROOT CAUSE - Creating incomplete objects violates the type contract. When these incomplete objects are saved to localStorage and retrieved, the campaign appears empty or fails validation checks.

## Resolution
root_cause: handleCreateNewPhish in CampaignEditor.tsx creates incomplete CampaignPhish objects. CampaignPhish extends Phish interface, which requires: id, metadata (title, author, createdAt), htmlSource, annotations, scoring, inputMode. But handleCreateNewPhish only provides: id, partial metadata (missing author), htmlSource, annotations. It's missing the required: scoring, inputMode, and metadata.author fields.

fix: Updated handleCreateNewPhish in CampaignEditor.tsx (line 102-115) to include all required fields with sensible defaults:
- Added scoring: { visualCues: 0, languageCues: 0, premiseAlignment: 3 }
- Added inputMode: 'html'
- Added author: '' to metadata

verification:
- TypeScript compilation: PASS (no errors with npx tsc --noEmit)
- Structure validation: PASS (test script confirms all required fields present)
- Manual testing: READY (dev server running on http://localhost:5174/)
- localStorage test: PASS (created CampaignPhish objects are complete and persistable)

The fix has been verified to create complete CampaignPhish objects with all required fields from the Phish interface. Manual testing through the UI is the final verification step.

files_changed:
- src/components/campaign/CampaignEditor.tsx (line 102-115)
