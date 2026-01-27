/**
 * Campaign management hook
 *
 * Provides CRUD operations for campaign management with LocalStorage
 * persistence. Follows the same pattern as useCustomTechniques for
 * consistency across the codebase.
 *
 * Campaigns contain copied phish data (not references) for portability.
 * Use copyPhishForCampaign() to add phishes to campaigns.
 */

import { useState, useEffect, useCallback } from 'react';
import type { Campaign, CampaignInput, CampaignPhish } from '../types/campaign';
import { loadCampaigns, saveCampaigns } from '../utils/storage';

/**
 * LocalStorage key for campaigns persistence
 */
export const CAMPAIGNS_KEY = 'phishmonger-campaigns';

/**
 * Hook for managing campaigns
 *
 * Provides:
 * - Campaign CRUD operations (add, update, delete)
 * - Phish management within campaigns (add, remove, update)
 * - Automatic LocalStorage persistence
 * - Storage error state for quota handling
 * - Load on mount from LocalStorage
 *
 * @returns Object containing campaigns state and operations
 */
export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  /**
   * Load campaigns from LocalStorage on mount
   */
  useEffect(() => {
    const loaded = loadCampaigns();
    setCampaigns(loaded);
    setIsLoaded(true);
  }, []);

  /**
   * Save campaigns to LocalStorage with quota error handling
   * Uses requestIdleCallback to defer storage and avoid blocking main thread
   */
  const saveToStorage = useCallback((campaignsToSave: Campaign[]): Promise<void> => {
    return new Promise((resolve, reject) => {
      const performSave = () => {
        try {
          setStorageError(null);
          saveCampaigns(campaignsToSave);
          resolve();
        } catch (error) {
          if (error instanceof Error && error.name === 'QuotaExceededError') {
            setStorageError('Storage nearly full. Delete old campaigns or export data.');
          } else {
            console.error('Failed to save campaigns:', error);
            setStorageError('Failed to save campaigns.');
          }
          reject(error);
        }
      };

      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => performSave(), { timeout: 100 });
      } else {
        setTimeout(() => performSave(), 0);
      }
    });
  }, []);

  /**
   * Add a new campaign
   *
   * @param input - Campaign data without id and createdAt
   * @returns Promise that resolves to created campaign with generated id
   */
  const addCampaign = useCallback(async (input: CampaignInput): Promise<Campaign> => {
    const newCampaign: Campaign = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    const updated = [...campaigns, newCampaign];
    setCampaigns(updated);
    await saveToStorage(updated);

    return newCampaign;
  }, [campaigns, saveToStorage]);

  /**
   * Update an existing campaign
   *
   * @param id - Campaign ID to update
   * @param updates - Partial campaign data to merge
   */
  const updateCampaign = useCallback(async (id: string, updates: Partial<Omit<Campaign, 'id' | 'createdAt'>>): Promise<void> => {
    // Load fresh data from localStorage to avoid stale closure issues
    const freshCampaigns = loadCampaigns();
    const existing = freshCampaigns.find(c => c.id === id);
    if (!existing) {
      console.warn(`Cannot update non-existent campaign: ${id}`);
      return;
    }

    const updated = freshCampaigns.map(c =>
      c.id === id
        ? { ...c, ...updates }
        : c
    );

    setCampaigns(updated);
    await saveToStorage(updated);
  }, [saveToStorage]);

  /**
   * Delete a campaign
   *
   * @param id - Campaign ID to delete
   */
  const deleteCampaign = useCallback(async (id: string): Promise<void> => {
    const existing = campaigns.find(c => c.id === id);
    if (!existing) {
      console.warn(`Cannot delete non-existent campaign: ${id}`);
      return;
    }

    const updated = campaigns.filter(c => c.id !== id);
    setCampaigns(updated);
    await saveToStorage(updated);
  }, [campaigns, saveToStorage]);

  /**
   * Add a phish to a campaign
   *
   * Copies phish into campaign's phish array.
   * Use copyPhishForCampaign() to create an independent copy.
   *
   * @param campaignId - Campaign ID to add phish to
   * @param phish - Phish to add (should be a copy from copyPhishForCampaign)
   */
  const addPhishToCampaign = useCallback(async (campaignId: string, phish: CampaignPhish): Promise<void> => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign) {
      console.warn(`Cannot add phish to non-existent campaign: ${campaignId}`);
      return;
    }

    const updated = campaigns.map(c =>
      c.id === campaignId
        ? { ...c, campaignPhishes: [...c.campaignPhishes, phish] }
        : c
    );

    setCampaigns(updated);
    await saveToStorage(updated);
  }, [campaigns, saveToStorage]);

  /**
   * Remove a phish from a campaign
   *
   * @param campaignId - Campaign ID to remove phish from
   * @param phishId - Phish ID to remove
   */
  const removePhishFromCampaign = useCallback(async (campaignId: string, phishId: string): Promise<void> => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign) {
      console.warn(`Cannot remove phish from non-existent campaign: ${campaignId}`);
      return;
    }

    const updated = campaigns.map(c =>
      c.id === campaignId
        ? { ...c, campaignPhishes: c.campaignPhishes.filter(p => p.id !== phishId) }
        : c
    );

    setCampaigns(updated);
    await saveToStorage(updated);
  }, [campaigns, saveToStorage]);

  /**
   * Update a phish within a campaign
   *
   * @param campaignId - Campaign ID containing the phish
   * @param phishId - Phish ID to update
   * @param updates - Partial phish data to merge
   */
  const updatePhishInCampaign = useCallback(async (campaignId: string, phishId: string, updates: Partial<Omit<CampaignPhish, 'id'>>): Promise<void> => {
    console.log('🐛 [updatePhishInCampaign] Input:', { campaignId, phishId, updates })
    console.log('🐛 [updatePhishInCampaign] Current campaigns:', campaigns)

    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign) {
      console.warn(`Cannot update phish in non-existent campaign: ${campaignId}`);
      return;
    }

    console.log('🐛 [updatePhishInCampaign] Found campaign:', campaign.name, 'with', campaign.campaignPhishes.length, 'phishes')
    console.log('🐛 [updatePhishInCampaign] Looking for phish ID:', phishId)

    const updated = campaigns.map(c => {
      if (c.id === campaignId) {
        const updatedPhishes = c.campaignPhishes.map(p => {
          const match = p.id === phishId
          if (match) {
            console.log('🐛 [updatePhishInCampaign] Found matching phish:', p.metadata.title)
            console.log('🐛 [updatePhishInCampaign] Merging with updates:', updates)
          }
          return match ? { ...p, ...updates } : p
        });
        console.log('🐛 [updatePhishInCampaign] Updated phishes array length:', updatedPhishes.length)
        return { ...c, campaignPhishes: updatedPhishes };
      }
      return c;
    });

    console.log('🐛 [updatePhishInCampaign] Final updated campaigns:', updated)

    setCampaigns(updated);
    await saveToStorage(updated);
  }, [campaigns, saveToStorage]);

  /**
   * Get a single campaign by ID
   *
   * @param id - Campaign ID to retrieve
   * @returns Campaign if found, undefined otherwise
   */
  const getCampaign = useCallback((id: string): Campaign | undefined => {
    return campaigns.find(c => c.id === id);
  }, [campaigns]);

  return {
    campaigns,
    isLoaded,
    storageError,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    addPhishToCampaign,
    removePhishFromCampaign,
    updatePhishInCampaign,
    getCampaign,
  };
}
