/**
 * Cart Service Abstraction Layer
 * 
 * This module provides a unified interface for cart operations
 * that can be backed by either local storage (Phase 2A) or
 * Shopify Storefront API (Phase 2B+).
 */

export { localCartService } from "./localCartService";
export type { CartOperations, CartDataSource, CartServiceConfig } from "@/types/cart";
