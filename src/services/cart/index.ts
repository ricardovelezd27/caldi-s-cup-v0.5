/**
 * Cart Service Abstraction Layer
 * 
 * This module provides a unified interface for cart operations
 * that can be backed by local storage (Phase 2A), Shopify (Phase 2B Option A),
 * or Supabase+Stripe (Phase 2B Option B).
 */

import { localCartService } from "./localCartService";
import type { CartServiceConfig, CartDataSource } from "@/types/cart";

// ============= Service Exports =============

export { localCartService } from "./localCartService";
export type { CartOperations, CartDataSource, CartServiceConfig } from "@/types/cart";

// ============= Service Factory =============

/**
 * Cart Service Factory
 * 
 * Returns the appropriate cart service based on configuration.
 * Enables easy swapping between local, Shopify, and Supabase implementations.
 * 
 * @param config - Service configuration specifying the data source
 * @returns Cart service implementation
 * 
 * @example
 * // Local cart (Phase 2A - current)
 * const service = createCartService({ dataSource: 'local' });
 * 
 * // Shopify cart (Phase 2B Option A)
 * const service = createCartService({ 
 *   dataSource: 'shopify',
 *   apiKey: process.env.SHOPIFY_STOREFRONT_TOKEN,
 *   endpoint: 'mystore.myshopify.com'
 * });
 * 
 * // Supabase cart (Phase 2B Option B)
 * const service = createCartService({ 
 *   dataSource: 'supabase',
 *   apiKey: process.env.SUPABASE_ANON_KEY,
 *   endpoint: process.env.SUPABASE_URL
 * });
 */
export function createCartService(config: CartServiceConfig): typeof localCartService {
  switch (config.dataSource) {
    case "local":
      return localCartService;

    case "shopify":
      // Phase 2B Option A: Shopify Storefront API integration
      // TODO: Implement shopifyCartService using Storefront API
      // return createShopifyCartService(config);
      console.warn(
        "[Cart Service] Shopify integration not yet implemented. Using local cart. " +
        "See docs/BACKEND_OPTIONS.md for implementation details."
      );
      return localCartService;

    case "supabase":
      // Phase 2B Option B: Supabase + Stripe integration
      // TODO: Implement supabaseCartService with Stripe checkout
      // return createSupabaseCartService(config);
      console.warn(
        "[Cart Service] Supabase integration not yet implemented. Using local cart. " +
        "See docs/BACKEND_OPTIONS.md for implementation details."
      );
      return localCartService;

    default: {
      const exhaustiveCheck: never = config.dataSource;
      console.error(`[Cart Service] Unknown data source: ${exhaustiveCheck}`);
      return localCartService;
    }
  }
}

// ============= Helper Functions =============

/**
 * Get the current cart data source from environment or configuration
 * Defaults to 'local' for Phase 2A
 */
export function getDefaultDataSource(): CartDataSource {
  // Future: Check environment variables or feature flags
  // if (import.meta.env.VITE_SHOPIFY_ENABLED === 'true') return 'shopify';
  // if (import.meta.env.VITE_SUPABASE_CART_ENABLED === 'true') return 'supabase';
  return "local";
}

/**
 * Check if a backend integration is available
 */
export function isBackendAvailable(dataSource: CartDataSource): boolean {
  switch (dataSource) {
    case "local":
      return true;
    case "shopify":
      // Future: Check if Shopify credentials are configured
      return false;
    case "supabase":
      // Future: Check if Supabase is connected
      return false;
    default:
      return false;
  }
}
