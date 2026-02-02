import { useMemo } from "react";
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
      }
    ],
    basePrice: 14.99,
    processingMethod: coffee.processingMethod as any,
    altitude: coffee.altitudeMeters ? `${coffee.altitudeMeters}m` : undefined,
    tastingNotes: coffee.flavorNotes.join(", "),
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
 * Hook to fetch marketplace products - COMBINES mock data with database coffees
 */
export function useMarketplaceProducts(filters: MarketplaceFilters = {}) {
  // Always fetch database coffees
  const dbQuery = useMarketplaceCoffees(filters);
  
  // Combine mock data with database coffees
  const combinedData = useMemo(() => {
    // Start with mock products
    let allProducts = [...mockProducts];
    
    // Add database coffees (converted to Product format)
    if (dbQuery.data?.coffees) {
      const dbProducts = dbQuery.data.coffees.map(coffeeToProduct);
      // Add database products, avoiding duplicates by ID
      const mockIds = new Set(mockProducts.map(p => p.id));
      dbProducts.forEach(dbProduct => {
        if (!mockIds.has(dbProduct.id)) {
          allProducts.push(dbProduct);
        }
      });
    }
    
    // Apply filters
    if (filters.search) {
      const search = filters.search.toLowerCase();
      allProducts = allProducts.filter(
        p => p.name.toLowerCase().includes(search) || 
             p.origin.toLowerCase().includes(search) ||
             p.roasterName?.toLowerCase().includes(search)
      );
    }
    
    if (filters.origins && filters.origins.length > 0) {
      allProducts = allProducts.filter(p => 
        filters.origins!.some(o => p.origin.toLowerCase().includes(o.toLowerCase()))
      );
    }
    
    if (filters.roasterIds && filters.roasterIds.length > 0) {
      allProducts = allProducts.filter(p => filters.roasterIds!.includes(p.roasterId));
    }
    
    // Pagination
    const offset = filters.offset ?? 0;
    const limit = filters.limit ?? 10;
    
    return {
      products: allProducts.slice(offset, offset + limit),
      total: allProducts.length,
    };
  }, [dbQuery.data, filters]);

  return {
    data: combinedData,
    isLoading: dbQuery.isLoading,
    error: dbQuery.error,
    isFromDatabase: true, // Always includes database now
  };
}

/**
 * Hook to fetch a single product by ID - checks both mock and database
 */
export function useProduct(id: string | undefined) {
  const dbQuery = useCoffee(id);
  
  // Check mock data first for faster response
  const mockProduct = id ? getProductById(id) : null;
  
  // If found in mock, return immediately
  if (mockProduct) {
    return {
      data: mockProduct,
      coffee: null,
      isLoading: false,
      error: null,
      isFromDatabase: false,
    };
  }
  
  // Otherwise return database result
  return {
    data: dbQuery.data ? coffeeToProduct(dbQuery.data) : null,
    coffee: dbQuery.data,
    isLoading: dbQuery.isLoading,
    error: dbQuery.error,
    isFromDatabase: true,
  };
}

/**
 * Hook to fetch a roaster by ID - checks both mock and database
 */
export function useRoasterData(id: string | undefined) {
  const dbRoaster = useRoaster(id);
  const dbCoffees = useRoasterCoffees(id);
  
  // Check mock data first
  const mockRoaster = id ? getRoasterById(id) : null;
  
  if (mockRoaster) {
    const mockRoasterProducts = mockProducts.filter(p => p.roasterId === mockRoaster.id);
    return {
      roaster: mockRoaster,
      products: mockRoasterProducts,
      isLoading: false,
      error: null,
      isFromDatabase: false,
    };
  }

  // Database result
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

/**
 * Get all available roasters (for filter dropdowns) - combines mock and database
 */
export function useAvailableRoasters() {
  const dbQuery = useVerifiedRoasters();
  
  const combinedRoasters = useMemo(() => {
    const roasters = mockRoasters.map(r => ({ id: r.id, name: r.name }));
    
    // Add database roasters
    if (dbQuery.data) {
      const mockIds = new Set(roasters.map(r => r.id));
      dbQuery.data.forEach(r => {
        if (!mockIds.has(r.id)) {
          roasters.push({ id: r.id, name: r.businessName });
        }
      });
    }
    
    return roasters;
  }, [dbQuery.data]);

  return {
    roasters: combinedRoasters,
    isLoading: dbQuery.isLoading,
  };
}
