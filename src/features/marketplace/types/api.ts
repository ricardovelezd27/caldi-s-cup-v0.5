import { Product, RoastLevel } from "@/types/coffee";

// ============= Filter Types =============

export interface ProductFilters {
  search: string;
  origins: string[];
  roastLevels: RoastLevel[];
  grinds: string[];
  roasterIds: string[];
  priceRange: [number, number];
}

export const DEFAULT_FILTERS: ProductFilters = {
  search: "",
  origins: [],
  roastLevels: [],
  grinds: [],
  roasterIds: [],
  priceRange: [0, 50],
};

// ============= Sort Types =============

export type SortOption = 
  | "best-match" 
  | "price-asc" 
  | "price-desc" 
  | "newest" 
  | "rating";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "best-match", label: "Best Match" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest Arrivals" },
  { value: "rating", label: "Highest Rated" },
];

// ============= Pagination Types =============

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// ============= API Contract for Future Backend Integration =============

/**
 * Request contract for future Shopify/Supabase integration
 * Uses cursor-based pagination for scalability
 */
export interface ProductsQueryParams {
  search?: string;
  origins?: string[];
  roastLevels?: RoastLevel[];
  grinds?: string[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: SortOption;
  cursor?: string; // For cursor-based pagination
  pageSize?: number;
}

/**
 * Response contract for products API
 */
export interface ProductsResponse {
  items: Product[];
  totalCount: number;
  nextCursor?: string;
  hasMore: boolean;
}
