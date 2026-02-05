/**
 * Order utility functions for handling quantity calculations and display
 */

/**
 * Extract numeric quantity from package name
 * Examples:
 *   "60 Diamonds" → 60
 *   "Weekly Pass" → 1 (no quantity in name)
 *   "5000 + 500 Diamonds" → 5500
 */
export function extractQuantityFromPackage(packageName: string): number {
  // Match numbers in package name
  const matches = packageName.match(/\d+/g);
  
  if (!matches || matches.length === 0) {
    return 1; // No quantity in name (e.g., "Weekly Pass")
  }
  
  // If multiple numbers (e.g., "5000 + 500"), sum them
  return matches.reduce((sum, num) => sum + parseInt(num), 0);
}

/**
 * Calculate total items delivered based on package quantity and order quantity
 */
export function calculateTotalItems(packageName: string, orderQuantity: number = 1): string {
  const unitQuantity = extractQuantityFromPackage(packageName);
  const totalQuantity = unitQuantity * orderQuantity;
  
  // Detect item type (Diamonds, Pass, etc.)
  const itemType = packageName.match(/(Diamonds?|Pass|Points?|Coins?|UC|Crystals?|Tokens?)/i)?.[0] || 'Items';
  
  return `${totalQuantity.toLocaleString('en-IN')} ${itemType}`;
}

/**
 * Format package display with quantity
 * Returns "Package × Qty" if quantity > 1, otherwise just "Package"
 */
export function formatPackageWithQuantity(packageName: string, quantity: number = 1): string {
  return quantity > 1 
    ? `${packageName} × ${quantity}`
    : packageName;
}

/**
 * Calculate unit price from total price and quantity
 */
export function calculateUnitPrice(totalPrice: number, quantity: number = 1): number {
  if (quantity <= 0) return totalPrice;
  return Math.round((totalPrice / quantity) * 100) / 100;
}

/**
 * Check if order has partial fulfillment error
 */
export function isPartialFulfillment(errorMessage?: string | null): boolean {
  if (!errorMessage) return false;
  return errorMessage.toLowerCase().includes('partial');
}

/**
 * Extract partial fulfillment stats from error message
 * Example: "Partial fulfillment: 3/5 items processed" → { fulfilled: 3, total: 5 }
 */
export function parsePartialFulfillment(errorMessage: string): { fulfilled: number; total: number } | null {
  const match = errorMessage.match(/(\d+)\/(\d+)/);
  if (match) {
    return {
      fulfilled: parseInt(match[1]),
      total: parseInt(match[2])
    };
  }
  return null;
}
