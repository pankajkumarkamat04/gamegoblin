/**
 * Packages API
 * Handles fetching game packages (diamond packs) from the backend API
 */

import { buildAPIURL } from "@/lib/utils";

export interface Package {
    _id: string;
    game: string;
    amount: number;
    commission: number;
    cashback: number;
    logo: string;
    description: string;
    status: 'active' | 'inactive';
    category: string;
    region?: string;

    // Legacy fields for compatibility
    productId?: string;
    name?: string;
    price?: number;
    currency?: string;
    stock?: 'in-stock' | 'out-of-stock';
}

export interface GameData {
    _id: string;
    name: string;
    image: string;
    productId: string;
    publisher: string;
    validationFields: string[];
    createdAt: string;
    updatedAt: string;
    ogcode?: string;
}

export interface DiamondPacksResponse {
    success: boolean;
    count: number;
    diamondPacks: Package[];
    gameData: GameData;
}

/**
 * Fetch diamond packs for a specific game
 * @param gameId - The game ID (e.g., "68c18d6344fcb919aaa88213")
 */
export async function getGamePackages(gameId: string): Promise<DiamondPacksResponse> {
    try {
        const response = await fetch(buildAPIURL(`/api/v1/games/${gameId}/diamond-packs`), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store', // Always fetch fresh data
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch packages: ${response.statusText}`);
        }

        const data: DiamondPacksResponse = await response.json();

        // Transform packages to include legacy fields for compatibility
        const transformedPacks = data.diamondPacks.map(pack => ({
            ...pack,
            productId: pack._id,
            name: pack.description,
            price: pack.amount,
            currency: 'INR',
            stock: pack.status === 'active' ? 'in-stock' as const : 'out-of-stock' as const,
        }));

        return {
            ...data,
            diamondPacks: transformedPacks,
        };
    } catch (error) {
        console.error('Error fetching game packages:', error);
        throw error;
    }
}

/**
 * Create an order (placeholder - implement based on your backend)
 */
export async function createOrder(orderData: any): Promise<any> {
    try {
        const response = await fetch(buildAPIURL("/api/v1/orders/create"), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create order');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
}
