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
  additionalImageUrls: string[] | null;
  
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
  
  // AI-enriched fields
  brandStory: string | null;
  jargonExplanations: Record<string, string>;
  aiConfidence: number | null;
  
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
  coffeeId: string;
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
  };
}

/**
 * Coffee scan row from the new coffee_scans table
 */
export interface CoffeeScanRow {
  id: string;
  user_id: string;
  coffee_id: string;
  image_url: string;
  tribe_match_score: number | null;
  match_reasons: string[] | null;
  ai_confidence: number | null;
  raw_ai_response: any;
  scanned_at: string | null;
  created_at: string | null;
}

/**
 * Transform coffee_scans row + coffee data to unified types
 */
export function transformCoffeeScanWithCoffee(
  scanRow: CoffeeScanRow,
  coffeeRow: Database["public"]["Tables"]["coffees"]["Row"]
): { coffee: Coffee; scanMeta: CoffeeScanMeta } {
  const coffee = transformCoffeeRow(coffeeRow);

  const scanMeta: CoffeeScanMeta = {
    scanId: scanRow.id,
    coffeeId: scanRow.coffee_id,
    aiConfidence: scanRow.ai_confidence ?? 0,
    tribeMatchScore: scanRow.tribe_match_score ?? 0,
    matchReasons: scanRow.match_reasons ?? [],
    jargonExplanations: coffee.jargonExplanations,
    scannedAt: scanRow.scanned_at ?? new Date().toISOString(),
    rawImageUrl: scanRow.image_url,
  };

  return { coffee, scanMeta };
}
