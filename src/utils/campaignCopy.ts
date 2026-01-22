/**
 * Phish copying utilities for campaign management
 *
 * When adding a phish to a campaign, we create an independent copy
 * so that edits within the campaign don't affect the source library
 * project. This enables campaigns to be fully self-contained and
 * portable.
 */

import type { Phish, PhishInput } from '../types/phish';
import type { Annotation } from '../types/annotations';
import type { ScoringData } from '../types/scoring';
import type { ProjectMetadata } from '../types/project';

/**
 * Create a deep copy of a phish for campaign use
 *
 * Per CONTEXT.md:
 * - Keep original UUIDs from library project (no new IDs generated)
 * - No back-reference to origin project (copies are truly independent)
 * - Deep copy annotations, scoring, and metadata
 *
 * @param phish - Source phish to copy
 * @returns Independent phish copy for campaign use
 */
export function copyPhishForCampaign(phish: Phish): Phish {
  // Deep copy annotations to prevent shared reference
  const copiedAnnotations: Record<string, Annotation> = {};
  for (const [lureId, annotation] of Object.entries(phish.annotations)) {
    copiedAnnotations[lureId] = { ...annotation };
  }

  // Deep copy scoring data
  const copiedScoring: ScoringData = { ...phish.scoring };

  // Deep copy metadata
  const copiedMetadata: ProjectMetadata = {
    title: phish.metadata.title,
    author: phish.metadata.author,
    createdAt: phish.metadata.createdAt,
    updatedAt: phish.metadata.updatedAt,
  };

  // Create new phish with original UUID, copied data
  return {
    id: phish.id, // Keep original UUID
    metadata: copiedMetadata,
    htmlSource: phish.htmlSource, // Strings are immutable in JS
    annotations: copiedAnnotations,
    scoring: copiedScoring,
    inputMode: phish.inputMode,
    scheduledDate: phish.scheduledDate,
  };
}

/**
 * Create a new phish from input data
 *
 * Generates new UUID using crypto.randomUUID()
 *
 * @param input - Phish data without id
 * @returns New phish with generated id
 */
export function createPhish(input: PhishInput): Phish {
  return {
    ...input,
    id: crypto.randomUUID(),
  };
}
