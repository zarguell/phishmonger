/**
 * Phish metadata type definition for Phish Monger
 *
 * Stores phish identification and timestamp information
 * for persistence and export functionality.
 */

/**
 * Phish metadata including title, author, and timestamps
 */
export interface ProjectMetadata {
  title: string
  author: string
  createdAt: string  // ISO 8601 timestamp
  updatedAt?: string // ISO 8601 timestamp (optional, set on save)
  thumbnailUrl?: string // Base64 screenshot URL for campaign carousel (optional)
}
