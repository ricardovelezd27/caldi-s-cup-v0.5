import type { ScannedCoffee } from "../types/scanner";
import type { Coffee, CoffeeScanMeta } from "@/features/coffee/types";

/**
 * Transform the hook's ScannedCoffee format to unified Coffee type
 */
export function transformToCoffee(data: ScannedCoffee): Coffee {
  return {
    id: data.coffeeId || data.id,
    name: data.coffeeName ?? "Unknown Coffee",
    brand: data.brand,
    imageUrl: data.imageUrl,
    originCountry: data.originCountry,
    originRegion: data.originRegion,
    originFarm: data.originFarm,
    roastLevel: data.roastLevelNumeric,
    processingMethod: data.processingMethod,
    variety: data.variety,
    altitudeMeters: data.altitudeMeters,
    acidityScore: data.acidityScore,
    bodyScore: data.bodyScore,
    sweetnessScore: data.sweetnessScore,
    flavorNotes: data.flavorNotes ?? [],
    description: data.brandStory,
    cuppingScore: data.cuppingScore,
    awards: data.awards ?? [],
    brandStory: data.brandStory,
    jargonExplanations: data.jargonExplanations ?? {},
    aiConfidence: data.aiConfidence,
    roasterId: null,
    isVerified: false,
    source: "scan",
    createdBy: null,
    createdAt: data.scannedAt,
    updatedAt: data.scannedAt,
  };
}

/**
 * Extract scan metadata from ScannedCoffee
 */
export function extractScanMeta(data: ScannedCoffee): CoffeeScanMeta {
  return {
    scanId: data.id,
    coffeeId: data.coffeeId || data.id,
    aiConfidence: data.aiConfidence ?? 0,
    tribeMatchScore: data.tribeMatchScore ?? 0,
    matchReasons: data.matchReasons ?? [],
    jargonExplanations: data.jargonExplanations ?? {},
    scannedAt: data.scannedAt,
    rawImageUrl: data.imageUrl,
  };
}
