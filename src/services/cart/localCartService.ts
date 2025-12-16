import type { CartItem } from "@/types/coffee";
import type { Product, ProductVariant } from "@/types/coffee";
import {
  safeParseCartJSON,
  validateQuantity,
  clampQuantity,
  CART_VALIDATION,
} from "@/utils/validation/cartValidation";

const CART_STORAGE_KEY = "caldis-cup-cart";

/**
 * Local Cart Service
 * 
 * Handles cart operations using local state and localStorage.
 * This is the Phase 2A implementation that will be swapped
 * with ShopifyCartService in Phase 2B.
 * 
 * SECURITY: All data loaded from localStorage is validated
 * through Zod schemas before use to prevent injection attacks.
 */

export interface LocalCartState {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

/**
 * Load cart from localStorage with validation
 * Returns empty cart if data is corrupted or invalid
 */
const loadCartFromStorage = (): LocalCartState => {
  const emptyState: LocalCartState = { items: [], subtotal: 0, itemCount: 0 };
  
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    
    if (!stored) {
      return emptyState;
    }

    // Validate and sanitize the stored data
    const validatedState = safeParseCartJSON(stored);
    
    if (validatedState === null) {
      // Data was corrupted - clear it
      console.warn("Corrupted cart data detected, clearing localStorage");
      localStorage.removeItem(CART_STORAGE_KEY);
      return emptyState;
    }

    return validatedState;
  } catch (error) {
    console.error("Failed to load cart from storage:", error);
    // Attempt to clear corrupted data
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // localStorage might be unavailable
    }
    return emptyState;
  }
};

/**
 * Save cart to localStorage
 * Only saves valid cart state
 */
const saveCartToStorage = (cart: LocalCartState): void => {
  try {
    // Ensure we're saving valid data
    if (!Array.isArray(cart.items)) {
      console.error("Invalid cart state: items must be an array");
      return;
    }
    
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Failed to save cart to storage:", error);
    // localStorage might be full or unavailable
    // Could implement fallback or notify user here
  }
};

/**
 * Calculate cart totals
 */
const calculateCartTotals = (items: CartItem[]): { subtotal: number; itemCount: number } => {
  const subtotal = items.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { subtotal, itemCount };
};

/**
 * Add item to cart (immutable update)
 * Validates and clamps quantity to safe bounds
 */
const addItemToCart = (
  items: CartItem[],
  product: Product,
  variant: ProductVariant,
  quantity: number
): CartItem[] => {
  // Validate and clamp quantity
  const safeQuantity = clampQuantity(quantity);
  
  // Check cart item limit
  if (items.length >= CART_VALIDATION.MAX_ITEMS) {
    console.warn(`Cart item limit (${CART_VALIDATION.MAX_ITEMS}) reached`);
    return items;
  }

  const existingIndex = items.findIndex(
    (item) => item.productId === product.id && item.variantId === variant.id
  );

  if (existingIndex >= 0) {
    // Update existing item quantity (clamped to max)
    return items.map((item, index) =>
      index === existingIndex
        ? { ...item, quantity: clampQuantity(item.quantity + safeQuantity) }
        : item
    );
  }

  // Add new item
  const newItem: CartItem = {
    productId: product.id,
    variantId: variant.id,
    product,
    variant,
    quantity: safeQuantity,
  };

  return [...items, newItem];
};

/**
 * Update item quantity (immutable update)
 * Validates quantity and removes item if <= 0
 */
const updateItemQuantity = (
  items: CartItem[],
  productId: string,
  variantId: string,
  quantity: number
): CartItem[] => {
  // Remove if quantity is zero or negative
  if (quantity <= 0) {
    return removeItemFromCart(items, productId, variantId);
  }

  // Validate quantity
  const validation = validateQuantity(quantity);
  if (!validation.success) {
    console.warn("Invalid quantity:", validation.error);
    return items; // Return unchanged if invalid
  }

  return items.map((item) =>
    item.productId === productId && item.variantId === variantId
      ? { ...item, quantity: validation.data! }
      : item
  );
};

/**
 * Remove item from cart (immutable update)
 */
const removeItemFromCart = (
  items: CartItem[],
  productId: string,
  variantId: string
): CartItem[] => {
  return items.filter(
    (item) => !(item.productId === productId && item.variantId === variantId)
  );
};

/**
 * Get cart item by product and variant ID
 */
const getCartItemByIds = (
  items: CartItem[],
  productId: string,
  variantId: string
): CartItem | undefined => {
  return items.find(
    (item) => item.productId === productId && item.variantId === variantId
  );
};

/**
 * Local cart service object - implements CartOperations interface pattern
 * All methods reference internal functions for clean encapsulation
 */
export const localCartService = {
  loadFromStorage: loadCartFromStorage,
  saveToStorage: saveCartToStorage,
  calculateTotals: calculateCartTotals,
  addItem: addItemToCart,
  updateQuantity: updateItemQuantity,
  removeItem: removeItemFromCart,
  getItem: getCartItemByIds,
  // Export validation constants for consumers
  validation: CART_VALIDATION,
};
