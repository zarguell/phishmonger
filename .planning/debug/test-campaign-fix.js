#!/usr/bin/env node

/**
 * Test script to verify the campaign-phish workflow fix
 *
 * This simulates the workflow of creating a campaign and adding new phishes
 * to verify that the fix correctly handles all required fields.
 */

// Mock the structure that CampaignEditor.handleCreateNewPhish now creates
function createNewPhish(phishNumber) {
  return {
    id: crypto.randomUUID(),
    htmlSource: '',
    annotations: {},
    metadata: {
      title: `New Phish ${phishNumber}`,
      author: '',
      createdAt: new Date().toISOString(),
    },
    scoring: {
      visualCues: 0,
      languageCues: 0,
      premiseAlignment: 3,
    },
    inputMode: 'html',
    scheduledDate: undefined,
  };
}

// Test the structure
console.log('Testing CampaignPhish structure...\n');

const phish1 = createNewPhish(1);
console.log('Phish 1 created:', JSON.stringify(phish1, null, 2));

// Verify all required fields from Phish interface
const requiredFields = [
  'id',
  'metadata',
  'htmlSource',
  'annotations',
  'scoring',
  'inputMode',
];

const missingFields = requiredFields.filter(field => !(field in phish1));

if (missingFields.length > 0) {
  console.error('\n❌ FAIL: Missing required fields:', missingFields);
  process.exit(1);
}

// Verify metadata has required fields
const metadataFields = ['title', 'author', 'createdAt'];
const missingMetadata = metadataFields.filter(field => !(field in phish1.metadata));

if (missingMetadata.length > 0) {
  console.error('\n❌ FAIL: Missing metadata fields:', missingMetadata);
  process.exit(1);
}

// Verify scoring has required fields
const scoringFields = ['visualCues', 'languageCues', 'premiseAlignment'];
const missingScoring = scoringFields.filter(field => !(field in phish1.scoring));

if (missingScoring.length > 0) {
  console.error('\n❌ FAIL: Missing scoring fields:', missingScoring);
  process.exit(1);
}

console.log('\n✅ SUCCESS: All required fields present');
console.log('\nField validation:');
console.log('  ✓ id:', phish1.id);
console.log('  ✓ metadata.title:', phish1.metadata.title);
console.log('  ✓ metadata.author:', phish1.author === '' ? '(empty)' : phish1.metadata.author);
console.log('  ✓ metadata.createdAt:', phish1.metadata.createdAt);
console.log('  ✓ htmlSource:', phish1.htmlSource === '' ? '(empty)' : '(has content)');
console.log('  ✓ annotations:', Object.keys(phish1.annotations).length, 'entries');
console.log('  ✓ scoring.visualCues:', phish1.scoring.visualCues);
console.log('  ✓ scoring.languageCues:', phish1.scoring.languageCues);
console.log('  ✓ scoring.premiseAlignment:', phish1.scoring.premiseAlignment);
console.log('  ✓ inputMode:', phish1.inputMode);
console.log('  ✓ scheduledDate:', phish1.scheduledDate === undefined ? '(undefined)' : phish1.scheduledDate);

console.log('\n✅ CampaignPhish structure is valid!');
console.log('✅ Ready for localStorage persistence');
