import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { transformCoffeeRow, type Coffee, type RoastLevelEnum } from "@/features/coffee/types";
import type { Database } from "@/integrations/supabase/types";

export type RoasterRow = Database["public"]["Tables"]["roasters"]["Row"];

export interface Roaster {
  id: string;
  userId: string;
  businessName: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  locationCity: string | null;
  locationCountry: string | null;
  website: string | null;
  contactEmail: string | null;
  certifications: string[];
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export function transformRoasterRow(row: RoasterRow): Roaster {
  return {
    id: row.id,
    userId: row.user_id,
    businessName: row.business_name,
    slug: row.slug,
    description: row.description,
    logoUrl: row.logo_url,
    bannerUrl: row.banner_url,
    locationCity: row.location_city,
    locationCountry: row.location_country,
    website: row.website,
    contactEmail: row.contact_email,
    certifications: row.certifications ?? [],
    isVerified: row.is_verified ?? false,
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? new Date().toISOString(),
  };
}

export interface MarketplaceFilters {
  search?: string;
  origins?: string[];
  roastLevels?: string[];
  roasterIds?: string[];
  limit?: number;
  offset?: number;
}

/**
 * Fetch verified coffees from database for marketplace
 */
export async function fetchMarketplaceCoffees(
  filters: MarketplaceFilters = {}
): Promise<{ coffees: Coffee[]; total: number }> {
  let query = supabase
    .from("coffees")
    .select("*", { count: "exact" })
    .eq("is_verified", true);

  // Apply filters
  if (filters.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,brand.ilike.%${filters.search}%,origin_country.ilike.%${filters.search}%`
    );
  }

  if (filters.origins && filters.origins.length > 0) {
    query = query.in("origin_country", filters.origins);
  }

  if (filters.roastLevels && filters.roastLevels.length > 0) {
    // Cast to RoastLevelEnum array since we know these are valid enum values
    query = query.in("roast_level", filters.roastLevels as RoastLevelEnum[]);
  }

  if (filters.roasterIds && filters.roasterIds.length > 0) {
    query = query.in("roaster_id", filters.roasterIds);
  }

  // Pagination
  if (filters.limit) {
    query = query.limit(filters.limit);
  }
  if (filters.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit ?? 10) - 1);
  }

  // Order by name
  query = query.order("name");

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching coffees:", error);
    throw error;
  }

  return {
    coffees: (data ?? []).map(transformCoffeeRow),
    total: count ?? 0,
  };
}

/**
 * Fetch a single coffee by ID
 */
export async function fetchCoffeeById(id: string): Promise<Coffee | null> {
  const { data, error } = await supabase
    .from("coffees")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Not found
      return null;
    }
    throw error;
  }

  return transformCoffeeRow(data);
}

/**
 * Fetch a roaster by ID
 */
export async function fetchRoasterById(id: string): Promise<Roaster | null> {
  const { data, error } = await supabase
    .from("roasters")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw error;
  }

  return transformRoasterRow(data);
}

/**
 * Fetch roaster by slug
 */
export async function fetchRoasterBySlug(slug: string): Promise<Roaster | null> {
  const { data, error } = await supabase
    .from("roasters")
    .select("*")
    .eq("slug", slug)
    .eq("is_verified", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw error;
  }

  return transformRoasterRow(data);
}

/**
 * Fetch coffees by roaster ID
 */
export async function fetchCoffeesByRoaster(
  roasterId: string
): Promise<Coffee[]> {
  const { data, error } = await supabase
    .from("coffees")
    .select("*")
    .eq("roaster_id", roasterId)
    .eq("is_verified", true)
    .order("name");

  if (error) {
    throw error;
  }

  return (data ?? []).map(transformCoffeeRow);
}

/**
 * Get unique origins from verified coffees
 */
export async function fetchAvailableOrigins(): Promise<string[]> {
  const { data, error } = await supabase
    .from("coffees")
    .select("origin_country")
    .eq("is_verified", true)
    .not("origin_country", "is", null);

  if (error) {
    throw error;
  }

  const origins = new Set<string>();
  data?.forEach((row) => {
    if (row.origin_country) {
      origins.add(row.origin_country);
    }
  });

  return Array.from(origins).sort();
}

/**
 * Get all verified roasters
 */
export async function fetchVerifiedRoasters(): Promise<Roaster[]> {
  const { data, error } = await supabase
    .from("roasters")
    .select("*")
    .eq("is_verified", true)
    .order("business_name");

  if (error) {
    throw error;
  }

  return (data ?? []).map(transformRoasterRow);
}

// ============= React Query Hooks =============

export function useMarketplaceCoffees(filters: MarketplaceFilters = {}) {
  return useQuery({
    queryKey: ["marketplace-coffees", filters],
    queryFn: () => fetchMarketplaceCoffees(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCoffee(id: string | undefined) {
  return useQuery({
    queryKey: ["coffee", id],
    queryFn: () => fetchCoffeeById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRoaster(id: string | undefined) {
  return useQuery({
    queryKey: ["roaster", id],
    queryFn: () => fetchRoasterById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRoasterBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["roaster-slug", slug],
    queryFn: () => fetchRoasterBySlug(slug!),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRoasterCoffees(roasterId: string | undefined) {
  return useQuery({
    queryKey: ["roaster-coffees", roasterId],
    queryFn: () => fetchCoffeesByRoaster(roasterId!),
    enabled: !!roasterId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAvailableOrigins() {
  return useQuery({
    queryKey: ["available-origins"],
    queryFn: fetchAvailableOrigins,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useVerifiedRoasters() {
  return useQuery({
    queryKey: ["verified-roasters"],
    queryFn: fetchVerifiedRoasters,
    staleTime: 10 * 60 * 1000,
  });
}
