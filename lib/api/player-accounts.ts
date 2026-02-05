/**
 * Player Accounts API
 * Handles saving and managing player account details for quick access
 */

import { buildAPIURL } from "@/lib/utils";

export interface SavedPlayerAccount {
    _id: string;
    userId: string;
    gameSlug: string;
    playerId: string;
    zoneId?: string;
    ign: string;
    region?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface SavePlayerAccountData {
    gameSlug: string;
    playerId: string;
    zoneId?: string;
    ign: string;
    region?: string;
}

/**
 * Get saved player accounts for a specific game
 */
export async function getSavedPlayerAccounts(gameSlug: string): Promise<{
    success: boolean;
    data: SavedPlayerAccount[];
    message?: string;
}> {
    try {
        // For now, return empty array as this feature requires backend implementation
        // You can implement this when the backend endpoint is ready
        return {
            success: true,
            data: [],
        };
    } catch (error: any) {
        console.error('Error fetching saved accounts:', error);
        return {
            success: false,
            data: [],
            message: error.message || 'Failed to fetch saved accounts',
        };
    }
}

/**
 * Save a player account
 */
export async function savePlayerAccount(accountData: SavePlayerAccountData): Promise<{
    success: boolean;
    data?: SavedPlayerAccount;
    message?: string;
}> {
    try {
        // For now, return success without actually saving
        // You can implement this when the backend endpoint is ready
        return {
            success: true,
            message: 'Account saved successfully',
        };
    } catch (error: any) {
        console.error('Error saving account:', error);
        return {
            success: false,
            message: error.message || 'Failed to save account',
        };
    }
}

/**
 * Delete a saved player account
 */
export async function deletePlayerAccount(accountId: string): Promise<{
    success: boolean;
    message?: string;
}> {
    try {
        // For now, return success without actually deleting
        // You can implement this when the backend endpoint is ready
        return {
            success: true,
            message: 'Account deleted successfully',
        };
    } catch (error: any) {
        console.error('Error deleting account:', error);
        return {
            success: false,
            message: error.message || 'Failed to delete account',
        };
    }
}
