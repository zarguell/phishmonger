/**
 * Campaign type definitions for Phish Monger
 *
 * Campaigns organize multiple phishing exercises into a collection for
 * scheduled training campaigns. Campaigns are self-contained entities
 * that embed copied phish data for portability.
 */

import type { Phish } from './phish';

/**
 * A campaign containing copied phish data
 *
 * Campaigns are fully importable/exportable - they contain copies of
 * phish data rather than references to library projects. This design
 * enables:
 * - Single-file campaign export/import
 * - Independent phish editing within campaigns
 * - No referential integrity concerns when library projects are deleted
 *
 * Per CONTEXT.md: Keep original UUIDs when copying phishes to campaigns.
 * No back-reference to origin project - copies are truly independent.
 *
 * ID generation: Use crypto.randomUUID() - no manual UUID construction
 * Date format: ISO 8601 strings (new Date().toISOString())
 */
export interface Campaign {
  /** Unique identifier (use crypto.randomUUID()) */
  id: string;

  /** Campaign name */
  name: string;

  /** Campaign description */
  description: string;

  /** ISO 8601 timestamp when campaign was created */
  createdAt: string;

  /**
   * Copied phishes embedded in campaign
   *
   * Each CampaignPhish extends the base Phish with campaign-specific
   * scheduling metadata. Phishes are copied from library projects when
   * added to campaigns, maintaining original UUIDs.
   */
  campaignPhishes: CampaignPhish[];
}

/**
 * A phish within a campaign
 *
 * Extends base Phish with campaign-specific scheduling. Phishes are
 * deep-copied from library projects, so edits within a campaign don't
 * affect the source.
 */
export interface CampaignPhish extends Phish {
  /**
   * Scheduled date for this phish within the campaign
   *
   * ISO 8601 date string (e.g., "2026-03-15") for calendar integration.
   * Optional - phishes can be added to campaign without scheduling.
   */
  scheduledDate?: string;
}

/**
 * Input type for creating a new Campaign
 *
 * Excludes id and createdAt (generated on creation)
 */
export interface CampaignInput {
  name: string;
  description: string;
  campaignPhishes: CampaignPhish[];
}
