/**
 * @dormant — Part of the inactive cart/marketplace pipeline.
 * Retained for future Shopify integration. No active consumers.
 */
import {
  CartItemSchema,
  LocalCartStateSchema,
  CART_VALIDATION,
} from "@/schemas/cart.schema";
import type { CartItem } from "@/types/coffee";
import type { LocalCartState } from "@/services/cart/localCartService";

/**
 * Cart Validation Utilities
 * 
 * Input validation and sanitization for cart operations.
 * Prevents injection attacks and ensures data integrity.
 */

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Validate quantity input
 * Ensures quantity is a positive integer within bounds
 */
export const validateQuantity = (quantity: unknown): ValidationResult<number> => {
  // Handle non-number inputs
  if (typeof quantity !== "number") {
    return { success: false, error: "Quantity must be a number" };
  }

  // Check for NaN or Infinity
  if (!Number.isFinite(quantity)) {
    return { success: false, error: "Quantity must be a finite number" };
  }

  // Ensure integer
  if (!Number.isInteger(quantity)) {
    return { success: false, error: "Quantity must be a whole number" };
  }

  // Check bounds
  if (quantity < CART_VALIDATION.MIN_QUANTITY) {
    return { success: false, error: `Minimum quantity is ${CART_VALIDATION.MIN_QUANTITY}` };
  }

  if (quantity > CART_VALIDATION.MAX_QUANTITY) {
    return { success: false, error: `Maximum quantity is ${CART_VALIDATION.MAX_QUANTITY}` };
  }

  return { success: true, data: quantity };
};

/**
 * Validate a cart item structure
 * Used when adding items to cart
 */
export const validateCartItem = (item: unknown): ValidationResult<CartItem> => {
  try {
    const result = CartItemSchema.safeParse(item);
    if (result.success) {
      // Zod validates required structure, trust the passthrough data
      return { success: true, data: item as CartItem };
    }
    return { 
      success: false, 
      error: result.error.errors[0]?.message || "Invalid cart item" 
    };
  } catch (error) {
    return { success: false, error: "Failed to validate cart item" };
  }
};

/**
 * Validate and sanitize cart state from localStorage
 * Returns empty cart if data is corrupted or invalid
 */
export const sanitizeCartState = (data: unknown): LocalCartState => {
  const emptyState: LocalCartState = {
    items: [],
    subtotal: 0,
    itemCount: 0,
  };

  // Handle null/undefined
  if (data === null || data === undefined) {
    return emptyState;
  }

  try {
    const result = LocalCartStateSchema.safeParse(data);
    if (result.success) {
      // Zod validates required structure, trust the passthrough data for full types
      const items = (data as LocalCartState).items;
      // Recalculate totals to ensure consistency (don't trust stored values)
      const subtotal = items.reduce(
        (sum, item) => sum + item.variant.price * item.quantity,
        0
      );
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
      
      return { items, subtotal, itemCount };
    }

    // Log validation errors for debugging (without exposing to user)
    console.warn("Cart validation failed:", result.error.errors);
    return emptyState;
  } catch (error) {
    console.error("Cart sanitization error:", error);
    return emptyState;
  }
};

/**
 * Safely parse JSON with validation
 * Prevents JSON injection attacks
 */
export const safeParseCartJSON = (jsonString: string): LocalCartState | null => {
  try {
    // First, safely parse JSON
    const parsed = JSON.parse(jsonString);
    
    // Then validate structure
    return sanitizeCartState(parsed);
  } catch (error) {
    // JSON parse failed - likely corrupted data
    console.error("Failed to parse cart JSON:", error);
    return null;
  }
};

/**
 * Clamp quantity to valid bounds
 * Useful for normalizing user input
 */
export const clampQuantity = (quantity: number): number => {
  if (!Number.isFinite(quantity) || !Number.isInteger(quantity)) {
    return CART_VALIDATION.MIN_QUANTITY;
  }
  return Math.max(
    CART_VALIDATION.MIN_QUANTITY,
    Math.min(CART_VALIDATION.MAX_QUANTITY, quantity)
  );
};

// Re-export validation constants
export { CART_VALIDATION };
