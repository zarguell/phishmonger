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
 */

const SCHEMA_VERSION_KEY = 'phishmonger-schema-version';

/** Current schema version (v1.2) */
export const CURRENT_SCHEMA_VERSION = 2;

/**
 * Initialize schema version in LocalStorage
 *
 * Sets the schema version to CURRENT_SCHEMA_VERSION if not already set.
 * This is called on app mount to establish the schema version for
 * future migrations.
 *
 * For v1.2: No existing users, so we can set version 2 directly.
 * Future migrations will check the version and run migration logic if needed.
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
      // Schema migration needed (not needed for v1.2 since no existing users)
      console.log(`Schema migration needed: v${version} → v${CURRENT_SCHEMA_VERSION}`);
      localStorage.setItem(SCHEMA_VERSION_KEY, CURRENT_SCHEMA_VERSION.toString());
    }
  }
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
