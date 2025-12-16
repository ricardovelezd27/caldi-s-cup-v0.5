import type { Roaster, Product } from "@/types/coffee";

/**
 * Response shape for roaster storefront API
 * Designed for easy transition from mock data to Shopify Storefront API
 */
export interface RoasterProfileResponse {
  roaster: Roaster;
  featuredProducts: Product[];
  allProducts: Product[];
  productCount: number;
}

/**
 * Query parameters for fetching roaster storefront data
 */
export interface RoasterQueryParams {
  roasterId: string;
  productPage?: number;
  productLimit?: number;
  sortBy?: "newest" | "price-asc" | "price-desc" | "rating";
}
