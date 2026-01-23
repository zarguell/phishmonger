# Verification Steps for Campaign-Phish Workflow Fix

## Root Cause
The `handleCreateNewPhish` function in `CampaignEditor.tsx` was creating incomplete `CampaignPhish` objects, missing required fields: `scoring`, `inputMode`, and `metadata.author`.

## Fix Applied
Updated `handleCreateNewPhish` to include all required fields with appropriate defaults.

## Manual Verification Steps

### Test Case 1: Create Campaign with New Phish
1. Open http://localhost:5174/
2. Click "Campaigns" button
3. Click "Create New Campaign"
4. Enter campaign name: "Test Campaign"
5. Enter description: "Testing the fix"
6. Click "Create"
7. In the campaign editor, click "+ Create New Phish" button
8. Click "Save Changes"
9. **EXPECTED:** Campaign should now show 1 phish in the list
10. **PREVIOUS BEHAVIOR:** Campaign would be empty (0 phishes)

### Test Case 2: Add Multiple New Phishes
1. Edit the campaign created above
2. Click "+ Create New Phish" two more times
3. Click "Save Changes"
4. **EXPECTED:** Campaign shows 3 phishes total
5. Each phish should have title: "New Phish 1", "New Phish 2", "New Phish 3"

### Test Case 3: Edit Newly Created Phish
1. From campaign editor, click "Edit" button on one of the new phishes
2. The main editor should load with the phish data
3. Make changes (e.g., add some HTML content)
4. Click "Save to Campaign" button
5. **EXPECTED:** Alert shows "Saved to campaign!" and changes persist

### Test Case 4: Verify localStorage Structure
Open browser DevTools Console and run:
```javascript
const campaigns = JSON.parse(localStorage.getItem('phishmonger-campaigns'));
campaigns.forEach(c => {
  console.log(`Campaign: ${c.name}`);
  console.log(`  Phishes: ${c.campaignPhishes.length}`);
  c.campaignPhishes.forEach(p => {
    console.log(`    - ${p.metadata.title}`);
    console.log(`      Has scoring: ${!!p.scoring}`);
    console.log(`      Has inputMode: ${!!p.inputMode}`);
    console.log(`      Has author: ${p.metadata.author !== undefined}`);
  });
});
```

**EXPECTED OUTPUT:**
```
Campaign: Test Campaign
  Phishes: 3
    - New Phish 1
      Has scoring: true
      Has inputMode: true
      Has author: true
    - New Phish 2
      Has scoring: true
      Has inputMode: true
      Has author: true
    - New Phish 3
      Has scoring: true
      Has inputMode: true
      Has author: true
```

## Success Criteria
- ✅ New phishes can be created within campaigns
- ✅ Campaigns persist phishes after saving
- ✅ All phish objects have complete required fields
- ✅ Phishes can be edited and saved back to campaign
- ✅ No console errors related to missing properties

## Notes
- The fix ensures type safety by including all required fields from the Phish interface
- Default values match the defaults used elsewhere in the app (see useUndoRedo hook)
- Empty string for author is acceptable (user can fill in via ProjectSettings)
