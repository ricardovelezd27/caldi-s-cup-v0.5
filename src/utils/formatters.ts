/**
 * @dormant — Part of the inactive cart/marketplace pipeline.
 * Retained for future Shopify integration. No active consumers.
 *
 * Shared formatting utilities
 * Centralized to ensure consistency across the app (DRY principle)
 */

/**
 * Format a number as USD currency
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

/**
 * Format quantity for display (handles edge cases)
 */
export const formatQuantity = (quantity: number): string => {
  return Math.max(0, Math.round(quantity)).toString();
};
