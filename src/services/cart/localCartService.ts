import type { CartItem, Cart } from "@/types/coffee";
import type { Product, ProductVariant } from "@/types/coffee";

const CART_STORAGE_KEY = "caldis-cup-cart";

/**
 * Local Cart Service
 * 
 * Handles cart operations using local state and localStorage.
 * This is the Phase 2A implementation that will be swapped
 * with ShopifyCartService in Phase 2B.
 */

export interface LocalCartState {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

/**
 * Load cart from localStorage
 */
export const loadCartFromStorage = (): LocalCartState => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        items: parsed.items || [],
        subtotal: parsed.subtotal || 0,
        itemCount: parsed.itemCount || 0,
      };
    }
  } catch (error) {
    console.error("Failed to load cart from storage:", error);
  }
  return { items: [], subtotal: 0, itemCount: 0 };
};

/**
 * Save cart to localStorage
 */
export const saveCartToStorage = (cart: LocalCartState): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Failed to save cart to storage:", error);
  }
};

/**
 * Calculate cart totals
 */
export const calculateCartTotals = (items: CartItem[]): { subtotal: number; itemCount: number } => {
  const subtotal = items.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { subtotal, itemCount };
};

/**
 * Add item to cart (immutable update)
 */
export const addItemToCart = (
  items: CartItem[],
  product: Product,
  variant: ProductVariant,
  quantity: number
): CartItem[] => {
  const existingIndex = items.findIndex(
    (item) => item.productId === product.id && item.variantId === variant.id
  );

  if (existingIndex >= 0) {
    // Update existing item quantity
    return items.map((item, index) =>
      index === existingIndex
        ? { ...item, quantity: item.quantity + quantity }
        : item
    );
  }

  // Add new item
  const newItem: CartItem = {
    productId: product.id,
    variantId: variant.id,
    product,
    variant,
    quantity,
  };

  return [...items, newItem];
};

/**
 * Update item quantity (immutable update)
 */
export const updateItemQuantity = (
  items: CartItem[],
  productId: string,
  variantId: string,
  quantity: number
): CartItem[] => {
  if (quantity <= 0) {
    return removeItemFromCart(items, productId, variantId);
  }

  return items.map((item) =>
    item.productId === productId && item.variantId === variantId
      ? { ...item, quantity }
      : item
  );
};

/**
 * Remove item from cart (immutable update)
 */
export const removeItemFromCart = (
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
export const getCartItemByIds = (
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
 * All methods are async to match future Shopify API calls
 */
export const localCartService = {
  loadFromStorage: loadCartFromStorage,
  saveToStorage: saveCartToStorage,
  calculateTotals: calculateCartTotals,
  addItem: addItemToCart,
  updateQuantity: updateItemQuantity,
  removeItem: removeItemFromCart,
  getItem: getCartItemByIds,
};
