import type { Product, ProductVariant, CartItem, Cart } from "./coffee";

// ============= Backend-Agnostic Cart Types =============

/**
 * Extended cart state that supports both local mock data
 * and future backend integration (Shopify, Supabase, etc.)
 */
export interface ExtendedCartState extends Cart {
  /** External cart ID from backend (null when using local cart) */
  externalCartId: string | null;
  /** Checkout URL from backend (null when using local cart) */
  checkoutUrl: string | null;
  /** Whether the cart is synced with a backend */
  isBackendConnected: boolean;
  /** Loading state for async operations */
  isLoading: boolean;
  /** Per-item operation states for optimistic updates */
  itemOperations: CartItemOperations;
}

/**
 * @deprecated Use ExtendedCartState instead. Kept for backwards compatibility.
 */
export type ShopifyCartState = ExtendedCartState;

/**
 * Cart line item structure matching Shopify's Cart API
 * Used for future Shopify integration
 */
export interface ShopifyCartLine {
  id: string;
  merchandiseId: string; // Shopify variant GID
  quantity: number;
  product: Product;
  variant: ProductVariant;
}

// ============= Optimistic Update Types =============

/**
 * Per-item operation state for optimistic updates
 * Tracks loading/error state for individual cart items
 */
export interface CartItemOperationState {
  isUpdating: boolean;
  error: string | null;
  /** Previous quantity for rollback on failure */
  previousQuantity?: number;
}

/**
 * Map of operation states by composite key (productId:variantId)
 */
export type CartItemOperations = Record<string, CartItemOperationState>;

/**
 * Helper to create composite key for item operations
 */
export const getItemOperationKey = (productId: string, variantId: string): string =>
  `${productId}:${variantId}`;

// ============= Cart Operations Interface =============

/**
 * Cart operations interface - abstraction layer
 * Allows swapping between local, Shopify, and Supabase implementations
 */
export interface CartOperations {
  /** Add item to cart */
  addToCart: (product: Product, variant: ProductVariant, quantity: number) => Promise<void>;
  /** Update quantity of existing item */
  updateQuantity: (productId: string, variantId: string, quantity: number) => Promise<void>;
  /** Remove item from cart */
  removeItem: (productId: string, variantId: string) => Promise<void>;
  /** Clear all items from cart */
  clearCart: () => Promise<void>;
  /** Get cart item by product and variant ID */
  getCartItem: (productId: string, variantId: string) => CartItem | undefined;
  /** Proceed to checkout - returns checkout URL */
  proceedToCheckout: () => Promise<string | null>;
}

// ============= Service Configuration =============

/**
 * Cart data source type - supports multiple backends
 */
export type CartDataSource = "local" | "shopify" | "supabase";

/**
 * Cart service configuration
 */
export interface CartServiceConfig {
  dataSource: CartDataSource;
  /** Backend API key or access token */
  apiKey?: string;
  /** Backend endpoint or store domain */
  endpoint?: string;
}

// Re-export base types for convenience
export type { CartItem, Cart } from "./coffee";
