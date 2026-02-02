import type { Database } from "@/integrations/supabase/types";

export type RoastLevelEnum = Database["public"]["Enums"]["roast_level_enum"];
export type CoffeeSource = Database["public"]["Enums"]["coffee_source"];

/**
 * Unified Coffee type - single source of truth for all coffee displays.
 * Used across scanner results, marketplace, inventory, and favorites.
 */
export interface Coffee {
  id: string;
  name: string;
  brand: string | null;
  imageUrl: string | null;
  
  // Origin details
  originCountry: string | null;
  originRegion: string | null;
  originFarm: string | null;
  
  // Roast & processing
  roastLevel: RoastLevelEnum | null;
  processingMethod: string | null;
  variety: string | null;
  altitudeMeters: number | null;
  
  // Flavor scores (1-5 scale)
  acidityScore: number | null;
  bodyScore: number | null;
  sweetnessScore: number | null;
  flavorNotes: string[];
  
  // Additional details
  description: string | null;
  cuppingScore: number | null;
  awards: string[];
  
  // Metadata
  roasterId: string | null;
  isVerified: boolean;
  source: CoffeeSource;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Scan-specific metadata (when viewing a scan result)
 */
export interface CoffeeScanMeta {
  scanId: string;
  coffeeId: string | null;
  aiConfidence: number;
  tribeMatchScore: number;
  matchReasons: string[];
  jargonExplanations: Record<string, string>;
  scannedAt: string;
  rawImageUrl: string;
}

/**
 * Inventory-specific metadata
 */
export interface CoffeeInventoryMeta {
  inventoryId: string;
  quantityGrams: number | null;
  purchaseDate: string | null;
  openedDate: string | null;
  notes: string | null;
}

/**
 * Roast level display helpers
 */
export const ROAST_LEVEL_LABELS: Record<RoastLevelEnum, string> = {
  "1": "Light",
  "2": "Light-Medium",
  "3": "Medium",
  "4": "Medium-Dark",
  "5": "Dark",
};

export const getRoastLevelLabel = (level: RoastLevelEnum | null): string => {
  if (!level) return "Unknown";
  return ROAST_LEVEL_LABELS[level] || "Unknown";
};

export const formatAltitude = (meters: number | null): string => {
  if (meters === null) return "";
  return `${meters.toLocaleString()}m`;
};

export const formatOrigin = (
  country: string | null,
  region: string | null,
  farm: string | null
): string => {
  const parts = [country, region, farm].filter(Boolean);
  return parts.join(" → ");
};

/**
 * Transform database row to unified Coffee type
 */
export function transformCoffeeRow(
  row: Database["public"]["Tables"]["coffees"]["Row"]
): Coffee {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    imageUrl: row.image_url,
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
    roasterId: row.roaster_id,
    isVerified: row.is_verified ?? false,
    source: row.source,
    createdBy: row.created_by,
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? new Date().toISOString(),
  };
}

/**
 * Transform scanned_coffees row to unified Coffee type + scan meta
 */
export function transformScannedCoffeeRow(
  row: Database["public"]["Tables"]["scanned_coffees"]["Row"]
): { coffee: Coffee; scanMeta: CoffeeScanMeta } {
  const coffee: Coffee = {
    id: row.coffee_id ?? row.id, // Use linked coffee_id if available
    name: row.coffee_name ?? "Unknown Coffee",
    brand: row.brand,
    imageUrl: row.image_url,
    originCountry: row.origin_country,
    originRegion: row.origin_region,
    originFarm: row.origin_farm,
    roastLevel: row.roast_level_numeric,
    processingMethod: row.processing_method,
    variety: row.variety,
    altitudeMeters: row.altitude_meters,
    acidityScore: row.acidity_score,
    bodyScore: row.body_score,
    sweetnessScore: row.sweetness_score,
    flavorNotes: row.flavor_notes ?? [],
    description: row.brand_story, // Use brand_story as description for scans
    cuppingScore: row.cupping_score ? Number(row.cupping_score) : null,
    awards: row.awards ?? [],
    roasterId: null,
    isVerified: false,
    source: "scan",
    createdBy: row.user_id,
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.created_at ?? new Date().toISOString(),
  };

  const scanMeta: CoffeeScanMeta = {
    scanId: row.id,
    coffeeId: row.coffee_id,
    aiConfidence: row.ai_confidence ?? 0,
    tribeMatchScore: row.tribe_match_score ?? 0,
    matchReasons: row.match_reasons ?? [],
    jargonExplanations: (row.jargon_explanations as Record<string, string>) ?? {},
    scannedAt: row.scanned_at ?? new Date().toISOString(),
    rawImageUrl: row.image_url,
  };

  return { coffee, scanMeta };
}
