/**
 * iCal export utilities for Phish Monger campaigns
 *
 * Converts campaign schedules to RFC 5545 compliant .ics files that can be
 * imported into external calendar applications (Google Calendar, Outlook, etc.)
 */

import ical from 'ical-generator';
import type { Campaign } from '../types/campaign';

/**
 * Generate iCal content from a campaign
 *
 * Creates an RFC 5545 compliant .ics file with one event per scheduled phish.
 * Each event is scheduled at 9:00 AM UTC on the scheduled date with a 1-hour duration.
 *
 * @param campaign - Campaign to generate iCal for
 * @returns iCal content as string (RFC 5545 format)
 */
export function generateCampaignICal(campaign: Campaign): string {
  const calendar = ical({
    name: `${campaign.name} - Phish Monger Campaign`,
    prodId: {
      company: 'Phish Monger',
      product: 'Phish Monger Campaigns',
      language: 'EN'
    }
  });

  // Filter phishes with scheduled dates and create events
  campaign.campaignPhishes
    .filter(phish => phish.scheduledDate)
    .forEach(phish => {
      // Parse the ISO 8601 date string (e.g., "2026-03-15")
      // Set time to 9:00 AM UTC to avoid timezone complexity
      const startDate = new Date(`${phish.scheduledDate}T09:00:00Z`);
      const endDate = new Date(`${phish.scheduledDate}T10:00:00Z`); // 1 hour duration

      calendar.createEvent({
        start: startDate,
        end: endDate,
        summary: `${campaign.name}: ${phish.title}`,
        description: phish.description || '',
        uid: crypto.randomUUID(),
        stamp: new Date()
      });
    });

  return calendar.toString();
}

/**
 * Trigger browser download of campaign iCal file
 *
 * Generates .ics content and triggers a download with sanitized filename.
 * Follows the existing export pattern from CampaignManager.tsx.
 *
 * @param campaign - Campaign to export as .ics file
 */
export function downloadCampaignICal(campaign: Campaign): void {
  const icsContent = generateCampaignICal(campaign);

  // Sanitize campaign name for filename (replace non-alphanumeric with underscore)
  const sanitizedName = campaign.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const filename = `${sanitizedName}_calendar.ics`;

  // Create blob and trigger download
  const blob = new Blob([icsContent], { type: 'text/calendar; charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url); // Clean up memory
}
