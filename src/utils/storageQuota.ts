/**
 * LocalStorage quota monitoring for Phish Monger
 *
 * Browser LocalStorage has a ~5MB limit per origin. This module
 * provides utilities to monitor usage and warn users before they
 * hit the limit.
 *
 * Quota thresholds per CONTEXT.md:
 * - Warn at 80% (~4MB used)
 * - Error at 95% (~4.75MB used)
 *
 * Note: Storage is calculated by measuring actual LocalStorage content,
 * not by pre-calculating. This handles different browser implementations.
 */

/** Approximate LocalStorage quota in bytes (5MB is typical) */
const QUOTA_BYTES = 5 * 1024 * 1024;

/** Warn threshold: 80% of quota */
const WARN_THRESHOLD = 0.8;

/** Error threshold: 95% of quota */
const ERROR_THRESHOLD = 0.95;

/**
 * Calculate current LocalStorage usage in bytes
 *
 * Sums the length of all keys and values in LocalStorage.
 * Each character is 2 bytes in UTF-16 (JavaScript string encoding).
 *
 * @returns Bytes used by LocalStorage
 */
export function getStorageUsage(): number {
  let total = 0;
  for (const [key, value] of Object.entries(localStorage)) {
    // Key + value length, times 2 for UTF-16 encoding
    total += (key.length + value.length) * 2;
  }
  return total;
}

/**
 * Get storage usage as a percentage of quota
 *
 * @returns Usage percentage (0-100)
 */
export function getStoragePercentage(): number {
  const usage = getStorageUsage();
  return Math.min(100, (usage / QUOTA_BYTES) * 100);
}

/**
 * Check if storage is near quota limit (warning threshold)
 *
 * Returns true when usage exceeds 80% of quota.
 *
 * @returns true if storage usage > 80%
 */
export function isStorageNearQuota(): boolean {
  return getStoragePercentage() > WARN_THRESHOLD * 100;
}

/**
 * Check if storage is at quota limit (error threshold)
 *
 * Returns true when usage exceeds 95% of quota.
 *
 * @returns true if storage usage > 95%
 */
export function isStorageAtQuota(): boolean {
  return getStoragePercentage() > ERROR_THRESHOLD * 100;
}

/**
 * Format bytes as human-readable string (e.g., "4.2 MB")
 *
 * @param bytes - Bytes to format
 * @returns Formatted string
 */
export function formatBytes(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) {
    return `${mb.toFixed(1)} MB`;
  }
  const kb = bytes / 1024;
  return `${kb.toFixed(0)} KB`;
}
