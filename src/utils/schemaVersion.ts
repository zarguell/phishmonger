/**
 * Schema version management for Phish Monger
 *
 * Phish Monger uses a global schema version to track data structure changes
 * and enable future migrations. The schema version is stored in LocalStorage
 * and checked on app mount.
 *
 * Schema versions:
 * - v1: Initial schema (implicit, no version field)
 * - v2: Campaign data model with campaigns array and scheduledDate (v1.2)
 * - v3: Phish terminology rename - localStorage key updates (v1.3)
 */

const SCHEMA_VERSION_KEY = 'phishmonger-schema-version';

/** Current schema version (v1.3) */
export const CURRENT_SCHEMA_VERSION = 3;

/**
 * Initialize schema version in LocalStorage
 *
 * Sets the schema version to CURRENT_SCHEMA_VERSION if not already set.
 * This is called on app mount to establish the schema version for
 * future migrations.
 *
 * For v1.3: Checks existing schema version and runs migrations if needed.
 * Fresh installs start at schema version 3. Existing v2 users are migrated to v3.
 */
export function initializeSchema(): void {
  const storedVersion = localStorage.getItem(SCHEMA_VERSION_KEY);

  if (!storedVersion) {
    // First run - set current schema version
    localStorage.setItem(SCHEMA_VERSION_KEY, CURRENT_SCHEMA_VERSION.toString());
    console.log(`Schema initialized to v${CURRENT_SCHEMA_VERSION}`);
  } else {
    const version = parseInt(storedVersion, 10);
    if (version < CURRENT_SCHEMA_VERSION) {
      console.log(`Schema migration needed: v${version} → v${CURRENT_SCHEMA_VERSION}`);

      // Run migrations based on current version
      if (version === 2) {
        migrateV2ToV3();
      }

      // Update version after successful migration
      localStorage.setItem(SCHEMA_VERSION_KEY, CURRENT_SCHEMA_VERSION.toString());
    }
  }
}

/**
 * Migrate schema from v2 to v3
 *
 * Changes:
 * - Rename localStorage key: phishmonger-project-id → phishmonger-phish-id
 * - Update default title in metadata from "Untitled Project" to "Untitled Phish"
 *
 * This migration preserves all existing user data.
 */
function migrateV2ToV3(): void {
  console.log('Starting schema migration v2 → v3...');

  // Step 1: Migrate phishmonger-project-id → phishmonger-phish-id
  const oldProjectId = localStorage.getItem('phishmonger-project-id');
  if (oldProjectId) {
    localStorage.setItem('phishmonger-phish-id', oldProjectId);
    localStorage.removeItem('phishmonger-project-id');
    console.log('✓ Migrated phishmonger-project-id → phishmonger-phish-id');
  } else {
    console.log('  No phishmonger-project-id found, skipping key migration');
  }

  // Step 2: Update default title in metadata (if still "Untitled Project")
  const metadataStr = localStorage.getItem('phishmonger-metadata');
  if (metadataStr) {
    try {
      const metadata = JSON.parse(metadataStr);
      if (metadata.title === 'Untitled Project') {
        metadata.title = 'Untitled Phish';
        localStorage.setItem('phishmonger-metadata', JSON.stringify(metadata));
        console.log('✓ Updated default title from "Untitled Project" to "Untitled Phish"');
      } else {
        console.log('  Metadata title already customized, skipping update');
      }
    } catch (error) {
      console.error('  Failed to update metadata:', error);
    }
  }

  console.log('Schema v2 → v3 migration complete');
}

/**
 * Get current schema version from LocalStorage
 *
 * @returns Current schema version (or CURRENT_SCHEMA_VERSION if not set)
 */
export function getSchemaVersion(): number {
  const stored = localStorage.getItem(SCHEMA_VERSION_KEY);
  return stored ? parseInt(stored, 10) : CURRENT_SCHEMA_VERSION;
}
