/**
 * Custom technique management hook
 *
 * Provides CRUD operations for user-defined phishing techniques with
 * LocalStorage persistence. Custom techniques extend the built-in MITRE
 * ATT&CK catalog with organization-specific scenarios.
 */

import { useState, useEffect, useCallback } from 'react';
import { CustomTechnique, TechniqueLibrary, isCustomTechnique } from '../types/library';
import { Technique } from '../types/annotations';

/**
 * LocalStorage key for custom techniques persistence
 */
export const CUSTOM_TECHNIQUES_KEY = 'phishmonger-custom-techniques';

/**
 * Hook for managing custom techniques
 *
 * Provides:
 * - CRUD operations (add, update, delete, get)
 * - Merge operation to combine built-in and custom techniques
 * - Automatic LocalStorage persistence
 * - Load on mount from LocalStorage
 *
 * @returns Object containing custom techniques state and operations
 */
export function useCustomTechniques() {
  const [customTechniques, setCustomTechniques] = useState<Record<string, CustomTechnique>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  /**
   * Load custom techniques from LocalStorage on mount
   */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CUSTOM_TECHNIQUES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate that parsed data is an object
        if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
          setCustomTechniques(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load custom techniques from LocalStorage:', error);
      // Start with empty state on error
      setCustomTechniques({});
    } finally {
      setIsLoaded(true);
    }
  }, []);

  /**
   * Save custom techniques to LocalStorage
   */
  const saveToStorage = useCallback((techniques: Record<string, CustomTechnique>) => {
    try {
      localStorage.setItem(CUSTOM_TECHNIQUES_KEY, JSON.stringify(techniques));
    } catch (error) {
      console.error('Failed to save custom techniques to LocalStorage:', error);
    }
  }, []);

  /**
   * Add a new custom technique
   *
   * Generates ID as CUSTOM-{timestamp} to ensure uniqueness
   * Adds isCustom: true discriminator and createdAt timestamp
   *
   * @param technique - Technique data without id, isCustom, and createdAt
   * @returns Generated technique ID
   */
  const addCustomTechnique = useCallback((technique: Omit<CustomTechnique, 'id' | 'isCustom' | 'createdAt'>): string => {
    const id = `CUSTOM-${Date.now()}`;
    const newTechnique: CustomTechnique = {
      ...technique,
      id,
      isCustom: true,
      createdAt: new Date().toISOString(),
    };

    const updated = {
      ...customTechniques,
      [id]: newTechnique,
    };

    setCustomTechniques(updated);
    saveToStorage(updated);

    return id;
  }, [customTechniques, saveToStorage]);

  /**
   * Update an existing custom technique
   *
   * @param id - Technique ID to update
   * @param updates - Partial technique data to merge
   */
  const updateCustomTechnique = useCallback((id: string, updates: Partial<CustomTechnique>): void => {
    const existing = customTechniques[id];
    if (!existing) {
      console.warn(`Cannot update non-existent custom technique: ${id}`);
      return;
    }

    // Prevent updating discriminator fields
    const { id: _, isCustom: __, createdAt, ...safeUpdates } = updates as any;

    const updated = {
      ...customTechniques,
      [id]: {
        ...existing,
        ...safeUpdates,
      },
    };

    setCustomTechniques(updated);
    saveToStorage(updated);
  }, [customTechniques, saveToStorage]);

  /**
   * Delete a custom technique
   *
   * @param id - Technique ID to delete
   */
  const deleteCustomTechnique = useCallback((id: string): void => {
    const existing = customTechniques[id];
    if (!existing) {
      console.warn(`Cannot delete non-existent custom technique: ${id}`);
      return;
    }

    const updated = { ...customTechniques };
    delete updated[id];

    setCustomTechniques(updated);
    saveToStorage(updated);
  }, [customTechniques, saveToStorage]);

  /**
   * Get a single custom technique by ID
   *
   * @param id - Technique ID to retrieve
   * @returns CustomTechnique if found, undefined otherwise
   */
  const getCustomTechnique = useCallback((id: string): CustomTechnique | undefined => {
    return customTechniques[id];
  }, [customTechniques]);

  /**
   * Merge built-in and custom techniques into a single array
   *
   * Built-in techniques are provided as parameter (typically loaded from
   * static src/data/techniques.json). Custom techniques are merged in
   * from LocalStorage state.
   *
   * Type narrowing: Result is Technique[] since CustomTechnique extends
   * Technique. Use isCustomTechnique() type guard to identify custom
   * techniques in the merged array.
   *
   * @param builtIns - Built-in techniques from techniques.json
   * @returns Merged array of all techniques
   */
  const getAllTechniques = useCallback((builtIns: Technique[]): Technique[] => {
    return [...builtIns, ...Object.values(customTechniques)];
  }, [customTechniques]);

  return {
    customTechniques,
    isLoaded,
    addCustomTechnique,
    updateCustomTechnique,
    deleteCustomTechnique,
    getCustomTechnique,
    getAllTechniques,
  };
}
