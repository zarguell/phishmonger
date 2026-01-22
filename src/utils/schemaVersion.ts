/**
 * Schema version management for Phish Monger
 *
 * Tracks the LocalStorage schema version to enable future migrations.
 * v1.2 uses schema version 2. Future versions can increment this and
 * run migration logic on app load when version mismatch is detected.
 *
 * No v1.1 -> v1.2 migration needed (zero existing users), but we establish
 * the schemaVersion field now for future migrations.
 */

const SCHEMA_VERSION_KEY = 'phishmonger-schema-version';

/**
 * Current schema version for this codebase
 * Increment this when LocalStorage structure changes in a way that
 * requires migration
 */
export const CURRENT_SCHEMA_VERSION = 2;

/**
 * Load schema version from LocalStorage
 * Returns 1 (v1.1) as default if not set (assumes pre-v1.2 install)
 */
export function loadSchemaVersion(): number {
  try {
    const saved = localStorage.getItem(SCHEMA_VERSION_KEY);
    if (saved) {
      const parsed = parseInt(saved, 10);
      return isNaN(parsed) ? 1 : parsed;
    }
  } catch (error) {
    console.error('Failed to load schema version:', error);
  }
  return 1; // Default to v1.1 schema
}

/**
 * Save schema version to LocalStorage
 */
export function saveSchemaVersion(version: number): void {
  try {
    localStorage.setItem(SCHEMA_VERSION_KEY, version.toString());
  } catch (error) {
    console.error('Failed to save schema version:', error);
  }
}

/**
 * Initialize schema version on first run or update
 * Sets the schema version to CURRENT_SCHEMA_VERSION
 *
 * Call this on app mount to ensure schema version is set.
 * Future migrations will check loadSchemaVersion() against
 * CURRENT_SCHEMA_VERSION and run migrations if mismatch.
 */
export function initializeSchema(): void {
  const currentVersion = loadSchemaVersion();
  if (currentVersion !== CURRENT_SCHEMA_VERSION) {
    // Future: Run migration here based on currentVersion
    // For now, just set to current version
    saveSchemaVersion(CURRENT_SCHEMA_VERSION);
  }
}
