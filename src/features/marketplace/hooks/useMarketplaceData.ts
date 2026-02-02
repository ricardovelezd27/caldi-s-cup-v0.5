import { useMemo } from "react";
import { usesDatabaseCoffees } from "../config/featureFlags";
import { mockProducts, mockRoasters, getProductById, getRoasterById } from "../data/mockProducts";
import { 
  useMarketplaceCoffees, 
  useCoffee, 
  useRoaster, 
  useRoasterCoffees,
  useVerifiedRoasters,
  type MarketplaceFilters 
} from "../services/marketplaceService";
import type { Coffee } from "@/features/coffee/types";
import type { Product, Roaster } from "@/types/coffee";

/**
 * Transform database Coffee to legacy Product format
 * This allows gradual migration - components can still use Product type
 */
function coffeeToProduct(coffee: Coffee): Product {
  return {
    id: coffee.id,
    name: coffee.name,
    origin: coffee.originCountry ?? "Unknown",
    roastLevel: coffee.roastLevel 
      ? (["light", "light", "medium", "medium", "dark"] as const)[parseInt(coffee.roastLevel) - 1] 
      : "medium",
    flavorProfile: {
      intensity: coffee.bodyScore && coffee.bodyScore >= 4 ? "bold" : coffee.bodyScore && coffee.bodyScore <= 2 ? "light" : "medium",
      notes: coffee.flavorNotes.slice(0, 3) as any[],
      acidity: coffee.acidityScore && coffee.acidityScore >= 4 ? "high" : coffee.acidityScore && coffee.acidityScore <= 2 ? "low" : "medium",
    },
    isOrganic: false, // Not tracked in coffees table
    isFairTrade: false, // Not tracked in coffees table
    description: coffee.description ?? "",
    imageUrl: coffee.imageUrl ?? "/placeholder.svg",
    roasterId: coffee.roasterId ?? "",
    roasterName: coffee.brand ?? "Unknown Roaster",
    slug: coffee.id, // Use ID as slug for now
    variants: [
      {
        id: `${coffee.id}-default`,
        name: "250g Whole Bean",
        size: "250g",
        grind: "whole-bean" as const,
        price: 14.99, // Default price
        available: true,
        inventoryQuantity: 50,
      }
    ],
    basePrice: 14.99,
    processingMethod: coffee.processingMethod as any,
    altitude: coffee.altitudeMeters ? `${coffee.altitudeMeters}m` : undefined,
    tastingNotes: coffee.flavorNotes.join(", "),
    images: coffee.imageUrl ? [coffee.imageUrl] : ["/placeholder.svg"],
    rating: coffee.cuppingScore ? coffee.cuppingScore / 20 : undefined, // Convert 0-100 to 0-5
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
 * Hook to fetch marketplace products (from database or mock)
 */
export function useMarketplaceProducts(filters: MarketplaceFilters = {}) {
  const useDatabase = usesDatabaseCoffees();
  
  // Database query
  const dbQuery = useMarketplaceCoffees(filters);
  
  // Mock data fallback
  const mockData = useMemo(() => {
    if (useDatabase) return null;
    
    let filtered = [...mockProducts];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        p => p.name.toLowerCase().includes(search) || 
             p.origin.toLowerCase().includes(search)
      );
    }
    
    if (filters.origins && filters.origins.length > 0) {
      filtered = filtered.filter(p => 
        filters.origins!.some(o => p.origin.toLowerCase().includes(o.toLowerCase()))
      );
    }
    
    if (filters.roasterIds && filters.roasterIds.length > 0) {
      filtered = filtered.filter(p => filters.roasterIds!.includes(p.roasterId));
    }
    
    const offset = filters.offset ?? 0;
    const limit = filters.limit ?? 10;
    
    return {
      products: filtered.slice(offset, offset + limit),
      total: filtered.length,
    };
  }, [useDatabase, filters]);

  if (useDatabase) {
    return {
      data: dbQuery.data 
        ? { products: dbQuery.data.coffees.map(coffeeToProduct), total: dbQuery.data.total }
        : undefined,
      isLoading: dbQuery.isLoading,
      error: dbQuery.error,
      isFromDatabase: true,
    };
  }

  return {
    data: mockData,
    isLoading: false,
    error: null,
    isFromDatabase: false,
  };
}

/**
 * Hook to fetch a single product by ID
 */
export function useProduct(id: string | undefined) {
  const useDatabase = usesDatabaseCoffees();
  
  const dbQuery = useCoffee(id);
  
  if (useDatabase) {
    return {
      data: dbQuery.data ? coffeeToProduct(dbQuery.data) : null,
      coffee: dbQuery.data, // Also expose the raw Coffee type
      isLoading: dbQuery.isLoading,
      error: dbQuery.error,
      isFromDatabase: true,
    };
  }

  const mockProduct = id ? getProductById(id) : null;
  return {
    data: mockProduct,
    coffee: null,
    isLoading: false,
    error: null,
    isFromDatabase: false,
  };
}

/**
 * Hook to fetch a roaster by ID
 */
export function useRoasterData(id: string | undefined) {
  const useDatabase = usesDatabaseCoffees();
  
  const dbRoaster = useRoaster(id);
  const dbCoffees = useRoasterCoffees(id);
  
  if (useDatabase) {
    const roaster = dbRoaster.data;
    return {
      roaster: roaster ? {
        id: roaster.id,
        name: roaster.businessName,
        slug: roaster.slug,
        description: roaster.description ?? "",
        logoUrl: roaster.logoUrl ?? undefined,
        bannerUrl: roaster.bannerUrl ?? undefined,
        location: {
          city: roaster.locationCity ?? "Unknown",
          country: roaster.locationCountry ?? "Unknown",
        },
        website: roaster.website ?? undefined,
        certifications: roaster.certifications as any[],
        createdAt: roaster.createdAt,
      } as Roaster : null,
      products: dbCoffees.data?.map(coffeeToProduct) ?? [],
      isLoading: dbRoaster.isLoading || dbCoffees.isLoading,
      error: dbRoaster.error || dbCoffees.error,
      isFromDatabase: true,
    };
  }

  const mockRoaster = id ? getRoasterById(id) : null;
  const mockRoasterProducts = mockRoaster 
    ? mockProducts.filter(p => p.roasterId === mockRoaster.id)
    : [];
    
  return {
    roaster: mockRoaster,
    products: mockRoasterProducts,
    isLoading: false,
    error: null,
    isFromDatabase: false,
  };
}

/**
 * Get all available roasters (for filter dropdowns)
 */
export function useAvailableRoasters() {
  const useDatabase = usesDatabaseCoffees();
  const dbQuery = useVerifiedRoasters();
  
  if (useDatabase) {
    return {
      roasters: dbQuery.data?.map(r => ({ id: r.id, name: r.businessName })) ?? [],
      isLoading: dbQuery.isLoading,
    };
  }

  return {
    roasters: mockRoasters.map(r => ({ id: r.id, name: r.name })),
    isLoading: false,
  };
}
