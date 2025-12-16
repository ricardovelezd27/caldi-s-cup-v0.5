import { useMemo } from "react";
import type { RoasterProfileResponse } from "../types/roasterApi";
import { getRoasterById, getProductsByRoasterId } from "../data/mockProducts";

interface UseRoasterStorefrontResult {
  data: RoasterProfileResponse | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to fetch roaster storefront data
 * Currently uses mock data - will be replaced with React Query + API calls
 */
export const useRoasterStorefront = (roasterId: string): UseRoasterStorefrontResult => {
  const data = useMemo(() => {
    if (!roasterId) return null;

    const roaster = getRoasterById(roasterId);
    if (!roaster) return null;

    const allProducts = getProductsByRoasterId(roasterId);
    const featuredProducts = allProducts.filter(p => 
      roaster.featuredProductIds?.includes(p.id) || p.isFeatured
    ).slice(0, 2);

    return {
      roaster,
      featuredProducts,
      allProducts,
      productCount: allProducts.length,
    };
  }, [roasterId]);

  return {
    data,
    isLoading: false, // Will become real with React Query
    error: null,
  };
};
