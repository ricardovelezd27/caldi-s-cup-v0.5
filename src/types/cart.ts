import type { Product, ProductVariant, CartItem, Cart } from "./coffee";

// ============= Shopify-Ready Cart Types =============

/**
 * Extended cart state that supports both local mock data
 * and future Shopify Cart API integration
 */
export interface ShopifyCartState extends Cart {
  /** Shopify Cart ID (null when using local cart) */
  shopifyCartId: string | null;
  /** Shopify Checkout URL (null when using local cart) */
  checkoutUrl: string | null;
  /** Whether the cart is synced with Shopify */
  isShopifyConnected: boolean;
  /** Loading state for async operations */
  isLoading: boolean;
}

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

/**
 * Cart operations interface - abstraction layer
 * Allows swapping between local and Shopify implementations
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

/**
 * Cart data source type
 */
export type CartDataSource = "local" | "shopify";

/**
 * Cart service configuration
 */
export interface CartServiceConfig {
  dataSource: CartDataSource;
  /** Shopify Storefront API access token (for future use) */
  storefrontAccessToken?: string;
  /** Shopify store domain (for future use) */
  storeDomain?: string;
}

// Re-export base types for convenience
export type { CartItem, Cart } from "./coffee";
