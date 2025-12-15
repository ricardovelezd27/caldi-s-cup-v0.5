import { Product, RoastLevel } from "@/types/coffee";
import { ProductFilters, SortOption } from "../types/api";

/**
 * Filters products based on the provided filter criteria
 */
export function filterProducts(
  products: Product[],
  filters: ProductFilters
): Product[] {
  return products.filter((product) => {
    // Search filter - matches name, origin, roaster name, or flavor notes
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(searchLower) ||
        product.origin.toLowerCase().includes(searchLower) ||
        product.roasterName.toLowerCase().includes(searchLower) ||
        product.flavorProfile.notes.some((note) =>
          note.toLowerCase().includes(searchLower)
        );
      if (!matchesSearch) return false;
    }

    // Origin filter
    if (filters.origins.length > 0) {
      const productOrigins = product.origin.toLowerCase();
      const matchesOrigin = filters.origins.some((origin) =>
        productOrigins.includes(origin.toLowerCase())
      );
      if (!matchesOrigin) return false;
    }

    // Roast level filter
    if (filters.roastLevels.length > 0) {
      if (!filters.roastLevels.includes(product.roastLevel)) return false;
    }

    // Grind filter - check if any variant has the selected grind
    if (filters.grinds.length > 0) {
      const hasMatchingGrind = product.variants.some((variant) =>
        filters.grinds.includes(variant.grind)
      );
      if (!hasMatchingGrind) return false;
    }

    // Price range filter
    const [minPrice, maxPrice] = filters.priceRange;
    if (product.basePrice < minPrice || product.basePrice > maxPrice) {
      return false;
    }

    return true;
  });
}

/**
 * Sorts products based on the selected sort option
 */
export function sortProducts(
  products: Product[],
  sortBy: SortOption
): Product[] {
  const sorted = [...products];

  switch (sortBy) {
    case "price-asc":
      return sorted.sort((a, b) => a.basePrice - b.basePrice);
    case "price-desc":
      return sorted.sort((a, b) => b.basePrice - a.basePrice);
    case "newest":
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "rating":
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case "best-match":
    default:
      // Best match: prioritize featured, then best sellers, then rating
      return sorted.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        if (a.isBestSeller && !b.isBestSeller) return -1;
        if (!a.isBestSeller && b.isBestSeller) return 1;
        return (b.rating || 0) - (a.rating || 0);
      });
  }
}

/**
 * Paginates products for display
 */
export function paginateProducts(
  products: Product[],
  page: number,
  pageSize: number
): { items: Product[]; totalPages: number; totalItems: number } {
  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const items = products.slice(startIndex, startIndex + pageSize);

  return { items, totalPages, totalItems };
}

/**
 * Extracts unique origins from products for filter options
 */
export function getUniqueOrigins(products: Product[]): string[] {
  const origins = new Set<string>();
  products.forEach((product) => {
    // Split origins like "Colombia & Brazil" into individual countries
    const parts = product.origin.split(/[&,]/);
    parts.forEach((part) => {
      const trimmed = part.trim();
      if (trimmed) origins.add(trimmed);
    });
  });
  return Array.from(origins).sort();
}

/**
 * Extracts unique grinds from products for filter options
 */
export function getUniqueGrinds(products: Product[]): string[] {
  const grinds = new Set<string>();
  products.forEach((product) => {
    product.variants.forEach((variant) => {
      grinds.add(variant.grind);
    });
  });
  return Array.from(grinds).sort();
}

/**
 * Gets price range from products
 */
export function getPriceRange(products: Product[]): [number, number] {
  if (products.length === 0) return [0, 50];
  
  const prices = products.map((p) => p.basePrice);
  const min = Math.floor(Math.min(...prices));
  const max = Math.ceil(Math.max(...prices));
  
  return [min, max];
}

/**
 * Format grind type for display
 */
export function formatGrind(grind: string): string {
  return grind
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Format roast level for display
 */
export function formatRoastLevel(level: RoastLevel): string {
  return level.charAt(0).toUpperCase() + level.slice(1);
}
