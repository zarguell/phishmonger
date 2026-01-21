/**
 * Custom technique library types for Phish Monger
 *
 * Extends base MITRE ATT&CK techniques with user-defined custom techniques.
 * Custom techniques are stored separately in LocalStorage but merge seamlessly
 * with built-in techniques via the getAllTechniques() helper.
 */

import { Technique } from './annotations';

/**
 * A user-defined custom technique
 *
 * Extends the base Technique type with custom metadata:
 * - isCustom: Discriminator field for type narrowing (always true for custom techniques)
 * - createdAt: ISO timestamp when the custom technique was created
 * - organization: Optional org-specific context (e.g., "Acme Corp - CEO fraud variant")
 * - url: Optional (custom techniques may not have official MITRE URLs)
 *
 * Custom techniques can have any ID format (not limited to MITRE T####.### pattern)
 * and may not have a valid MITRE URL since they represent organization-specific
 * scenarios or training materials.
 */
export interface CustomTechnique extends Omit<Technique, 'url'> {
  isCustom: true;
  createdAt: string;
  organization?: string;
  url?: string;
}

/**
 * Type guard to narrow a Technique to CustomTechnique
 *
 * Usage:
 *   if (isCustomTechnique(technique)) {
 *     console.log(technique.organization); // TypeScript knows this is safe
 *   }
 */
export function isCustomTechnique(technique: Technique | CustomTechnique): technique is CustomTechnique {
  return 'isCustom' in technique && technique.isCustom === true;
}

/**
 * Complete technique library including built-in and custom techniques
 *
 * Built-ins are loaded from static src/data/techniques.json
 * Custom techniques are loaded from LocalStorage
 *
 * Type narrowing example:
 *   library.custom[id].createdAt // Safe - CustomTechnique
 *   library.builtIns[0].createdAt // TypeScript error - not a CustomTechnique
 */
export interface TechniqueLibrary {
  custom: Record<string, CustomTechnique>;
  builtIns: Technique[];
}

/**
 * Union type for all techniques (built-in or custom)
 *
 * Useful when you need to accept either type but don't need the discriminator
 */
export type AnyTechnique = Technique | CustomTechnique;
