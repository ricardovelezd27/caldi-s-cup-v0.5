import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { mockProducts, mockRoasters } from "../data/mockProducts";
import type { Product, RoastLevel, Roaster as LegacyRoaster } from "@/types/coffee";
import type { Coffee } from "@/features/coffee/types";
import type { ProductFilters, SortOption } from "../types/api";
import {
  filterProducts,
  sortProducts,
  paginateProducts,
  getUniqueOrigins,
  getUniqueGrinds,
  getPriceRange,
} from "../utils/productFilters";

/**
 * Transform database Coffee to legacy Product format for marketplace display
 */
function coffeeToProduct(coffee: Coffee): Product {
  // Map roast level enum (1-5) to legacy string format
  const roastLevelMap: Record<string, RoastLevel> = {
    "1": "light",
    "2": "light",
    "3": "medium",
    "4": "medium",
    "5": "dark",
  };

  return {
    id: coffee.id,
    name: coffee.name,
    origin: coffee.originCountry ?? "Unknown",
    roastLevel: coffee.roastLevel ? roastLevelMap[coffee.roastLevel] ?? "medium" : "medium",
    flavorProfile: {
      intensity: coffee.bodyScore && coffee.bodyScore >= 4 ? "bold" : coffee.bodyScore && coffee.bodyScore <= 2 ? "light" : "medium",
      notes: (coffee.flavorNotes?.slice(0, 3) ?? []) as any[],
      acidity: coffee.acidityScore && coffee.acidityScore >= 4 ? "high" : coffee.acidityScore && coffee.acidityScore <= 2 ? "low" : "medium",
    },
    isOrganic: false,
    isFairTrade: false,
    description: coffee.description ?? "",
    imageUrl: coffee.imageUrl ?? "/placeholder.svg",
    roasterId: coffee.roasterId ?? "",
    roasterName: coffee.brand ?? "Unknown Roaster",
    slug: coffee.id,
    variants: [
      {
        id: `${coffee.id}-default`,
        name: "250g Whole Bean",
        size: "250g",
        grind: "whole-bean" as const,
        price: 14.99,
        available: true,
        inventoryQuantity: 50,
      },
    ],
    basePrice: 14.99,
    processingMethod: coffee.processingMethod as any,
    altitude: coffee.altitudeMeters ? `${coffee.altitudeMeters}m` : undefined,
    tastingNotes: coffee.flavorNotes?.join(", ") ?? "",
    images: coffee.imageUrl ? [coffee.imageUrl] : ["/placeholder.svg"],
    rating: coffee.cuppingScore ? coffee.cuppingScore / 20 : undefined,
    reviewCount: 0,
    attributeScores: {
      body: coffee.bodyScore ?? 3,
      acidity: coffee.acidityScore ?? 3,
      sweetness: coffee.sweetnessScore ?? 3,
    },
    createdAt: coffee.createdAt,
    updatedAt: coffee.updatedAt,
  };
}

/**
 * Fetch ALL coffees from database (verified + user-scanned)
 */
async function fetchAllCoffees(): Promise<Coffee[]> {
  const { data, error } = await supabase
    .from("coffees")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching coffees:", error);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    brand: row.brand,
    imageUrl: row.image_url,
    additionalImageUrls: (row as any).additional_image_urls ?? null,
    originCountry: row.origin_country,
    originRegion: row.origin_region,
    originFarm: row.origin_farm,
    roastLevel: row.roast_level,
    processingMethod: row.processing_method,
    variety: row.variety,
    altitudeMeters: row.altitude_meters,
    acidityScore: row.acidity_score,
    bodyScore: row.body_score,
    sweetnessScore: row.sweetness_score,
    flavorNotes: row.flavor_notes ?? [],
    description: row.description,
    cuppingScore: row.cupping_score ? Number(row.cupping_score) : null,
    awards: row.awards ?? [],
    brandStory: (row as any).brand_story ?? null,
    jargonExplanations: (row as any).jargon_explanations ?? {},
    aiConfidence: (row as any).ai_confidence ?? null,
    roasterId: row.roaster_id,
    isVerified: row.is_verified ?? false,
    source: row.source,
    createdBy: row.created_by,
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? new Date().toISOString(),
  }));
}

/**
 * Database roaster row type
 */
interface DbRoaster {
  id: string;
  business_name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  location_city: string | null;
  location_country: string | null;
  is_verified: boolean;
}

/**
 * Fetch ALL roasters from database (verified + unverified)
 */
async function fetchAllRoasters(): Promise<DbRoaster[]> {
  const { data, error } = await supabase
    .from("roasters")
    .select("id, business_name, slug, description, logo_url, location_city, location_country, is_verified")
    .order("business_name");

  if (error) {
    console.error("Error fetching roasters:", error);
    return [];
  }

  return data ?? [];
}

/**
 * Hook to fetch and merge all products (mock + database)
 */
export function useAllProducts() {
  const { data: dbCoffees = [], isLoading, error } = useQuery({
    queryKey: ["all-coffees-marketplace"],
    queryFn: fetchAllCoffees,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Merge mock products with database coffees
  const allProducts = useMemo(() => {
    const mockIds = new Set(mockProducts.map((p) => p.id));
    const dbProducts = dbCoffees.map(coffeeToProduct);
    
    // Add database products that don't exist in mock data
    const mergedProducts = [...mockProducts];
    for (const dbProduct of dbProducts) {
      if (!mockIds.has(dbProduct.id)) {
        mergedProducts.push(dbProduct);
      }
    }
    
    return mergedProducts;
  }, [dbCoffees]);

  return {
    products: allProducts,
    isLoading,
    error,
    dbCount: dbCoffees.length,
  };
}

/**
 * Hook to fetch all roasters (mock + database) for filters
 */
export function useAllRoasters() {
  const { data: dbRoasters = [], isLoading } = useQuery({
    queryKey: ["all-roasters-marketplace"],
    queryFn: fetchAllRoasters,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return { dbRoasters, isLoading };
}

/**
 * Get unique roasters from products AND database roasters table
 */
function getUniqueRoastersWithDb(
  products: Product[],
  dbRoasters: DbRoaster[]
): { id: string; name: string; productCount: number }[] {
  // Start with roasters from products
  const roasterMap = new Map<string, { name: string; count: number }>();
  
  products.forEach((product) => {
    const existing = roasterMap.get(product.roasterId);
    if (existing) {
      existing.count++;
    } else if (product.roasterId) {
      roasterMap.set(product.roasterId, { name: product.roasterName, count: 1 });
    }
  });

  // Add database roasters (they might not have products yet, but should appear in filter)
  dbRoasters.forEach((roaster) => {
    if (!roasterMap.has(roaster.id)) {
      roasterMap.set(roaster.id, { name: roaster.business_name, count: 0 });
    }
  });

  // Also add mock roasters that might not have products
  mockRoasters.forEach((roaster) => {
    if (!roasterMap.has(roaster.id)) {
      roasterMap.set(roaster.id, { name: roaster.name, count: 0 });
    }
  });

  return Array.from(roasterMap.entries())
    .map(([id, { name, count }]) => ({ id, name, productCount: count }))
    .filter((r) => r.name && r.name !== "Unknown Roaster") // Filter out unknowns
    .sort((a, b) => b.productCount - a.productCount || a.name.localeCompare(b.name));
}

interface UseMarketplaceProductsOptions {
  filters: ProductFilters;
  sortBy: SortOption;
  currentPage: number;
  pageSize: number;
}

/**
 * Complete marketplace hook with filtering, sorting, and pagination
 */
export function useMarketplaceProducts({
  filters,
  sortBy,
  currentPage,
  pageSize,
}: UseMarketplaceProductsOptions) {
  const { products: allProducts, isLoading: productsLoading, error, dbCount } = useAllProducts();
  const { dbRoasters, isLoading: roastersLoading } = useAllRoasters();

  // Compute available filter options from ALL products + database roasters
  const availableOrigins = useMemo(() => getUniqueOrigins(allProducts), [allProducts]);
  const availableGrinds = useMemo(() => getUniqueGrinds(allProducts), [allProducts]);
  const availableRoasters = useMemo(
    () => getUniqueRoastersWithDb(allProducts, dbRoasters),
    [allProducts, dbRoasters]
  );
  const priceRange = useMemo(() => getPriceRange(allProducts), [allProducts]);

  // Apply filters, sort, and pagination
  const result = useMemo(() => {
    // Filter products
    const filtered = filterProducts(allProducts, filters);

    // Sort products
    const sorted = sortProducts(filtered, sortBy);

    // Paginate
    const { items, totalPages, totalItems } = paginateProducts(sorted, currentPage, pageSize);

    return { displayedProducts: items, totalPages, totalItems };
  }, [allProducts, filters, sortBy, currentPage, pageSize]);

  return {
    ...result,
    allProducts,
    isLoading: productsLoading || roastersLoading,
    error,
    dbCount,
    availableOrigins,
    availableGrinds,
    availableRoasters,
    priceRange,
  };
}
