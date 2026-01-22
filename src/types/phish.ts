/**
 * Phish type definitions for Phish Monger
 *
 * A "Phish" represents a single phishing exercise - an email with annotations,
 * scoring data, and optional scheduling information. Phishes can exist in
 * two contexts:
 * 1. Library: Standalone projects in the user's project library
 * 2. Campaign: Copies embedded within a Campaign entity
 */

import type { ProjectMetadata } from './project';
import type { Annotation } from './annotations';
import type { ScoringData } from './scoring';

/**
 * Input mode for phish content editing
 *
 * - html: Direct HTML source editing
 * - richtext: Visual rich text editor
 */
export type InputMode = 'html' | 'richtext';

/**
 * A single phishing exercise
 *
 * Combines project metadata, email content, annotations, and scoring
 * into a single portable entity. Phishes can be copied into campaigns
 * while maintaining independence from the source library project.
 *
 * ID generation: Use crypto.randomUUID() - no manual UUID construction
 * Date format: ISO 8601 strings (new Date().toISOString())
 */
export interface Phish {
  /** Unique identifier (use crypto.randomUUID()) */
  id: string;

  /** Project metadata (title, author, timestamps) */
  metadata: ProjectMetadata;

  /** HTML email source with lure mark spans */
  htmlSource: string;

  /** Annotation data keyed by lure ID */
  annotations: Record<string, Annotation>;

  /** NIST Phish Scale scoring data */
  scoring: ScoringData;

  /** Current input mode (html or richtext) */
  inputMode: InputMode;

  /** Optional scheduled date for campaign phish (ISO 8601 string) */
  scheduledDate?: string;
}

/**
 * Input type for creating a new Phish
 *
 * Excludes id field (generated on creation) and makes all fields required
 */
export interface PhishInput {
  metadata: ProjectMetadata;
  htmlSource: string;
  annotations: Record<string, Annotation>;
  scoring: ScoringData;
  inputMode: InputMode;
  scheduledDate?: string;
}
