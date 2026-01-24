---
status: verifying
trigger: "Continue debugging: campaign-phish-workflow-confusion - Save to Campaign workflow empties campaign"
created: 2026-01-23T13:30:00Z
updated: 2026-01-23T13:40:00Z
---

## Current Focus
hypothesis: Fix applied - changed handleSaveToCampaign to use updatePhishInCampaign hook function instead of manually reconstructing campaignPhishes array from stale editingCampaign state
test: Manual verification needed - reproduce the original broken workflow to confirm it now works correctly
expecting: After editing a campaign phish and clicking "Save to Campaign", the campaign should contain the updated phish along with all other existing phishes (not be empty)
next_action: User needs to test the workflow: 1) Add project to campaign 2) Edit the project 3) Import new JSON 4) Click "Save to Campaign" 5) Verify campaign shows the updated phish

## Symptoms
expected: After editing a campaign phish and clicking "Save to Campaign", the campaign should contain the updated phish along with all other existing phishes
actual: After clicking "Save to Campaign", the campaign shows 0 phishes (becomes completely empty)
errors: No error messages displayed
reproduction: 1. Add a new project to the campaign 2. Edit the project 3. Import new JSON for new content 4. Click "Save to the campaign" 5. Campaign shows 0 phishes instead of the updated phish
started: After previous fix to handleCreateNewPhish - this is a separate workflow issue

## Eliminated

## Evidence
- timestamp: 2026-01-23T13:31:00Z
  checked: App.tsx handleSaveToCampaign (lines 395-424)
  found: Line 414 uses `editingCampaign?.campaignPhishes || []` to get the phish array
  found: Line 391 in handleEditPhish sets `setEditingCampaign(undefined)` - this happens BEFORE user saves
  implication: When handleSaveToCampaign runs, editingCampaign is undefined, so editingCampaign?.campaignPhishes is undefined, which becomes [] (empty array), then mapping over [] produces [], and the campaign is saved with an empty phish array

- timestamp: 2026-01-23T13:32:00Z
  checked: useCampaigns.ts hook
  found: There's already a dedicated function `updatePhishInCampaign` (lines 182-201) that properly updates a single phish within a campaign
  found: This function loads fresh data from the campaigns state, maps over the phishes to update just the target phish, and persists to localStorage
  implication: The fix should use updatePhishInCampaign instead of manually reconstructing the campaignPhishes array from editingCampaign state

- timestamp: 2026-01-23T13:33:00Z
  checked: Current CampaignPhish structure being created in handleSaveToCampaign
  found: Lines 401-410 create updatedPhish with: id, htmlSource, annotations, metadata (title, createdAt), scoring
  found: MISSING: inputMode field (required by Phish interface)
  implication: The updated phish will also be incomplete - need to add inputMode field

## Resolution
root_cause: handleSaveToCampaign in App.tsx used editingCampaign?.campaignPhishes to reconstruct the campaign's phish array, but handleEditPhish set editingCampaign to undefined (line 391). This caused editingCampaign?.campaignPhishes to be undefined, which became [] (empty array), and the campaign was saved with zero phishes. Additionally, the updated phish was missing the required inputMode field.

fix: Modified handleSaveToCampaign (lines 395-422) to:
1. Use the dedicated updatePhishInCampaign hook function instead of manually reconstructing the array
2. Change updatedPhish type from CampaignPhish to Partial<CampaignPhish> (updatePhishInCampaign expects partial updates)
3. Add the missing inputMode field to the updated phish

verification:
- TypeScript compilation: PASS (no errors with npx tsc --noEmit)
- Code review: The updatePhishInCampaign function properly loads fresh campaign data, updates only the target phish, and persists to localStorage
- Manual testing: PENDING (user needs to test the workflow)

files_changed:
- src/App.tsx (line 132: added updatePhishInCampaign to destructured useCampaigns)
- src/App.tsx (lines 395-422: rewrote handleSaveToCampaign to use updatePhishInCampaign)
