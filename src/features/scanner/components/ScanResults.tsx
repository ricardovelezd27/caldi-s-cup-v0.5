import { useNavigate } from "react-router-dom";
import { 
  CoffeeProfile, 
  CoffeeActions,
} from "@/features/coffee";
import type { ScannedCoffee } from "../types/scanner";
import type { Coffee, CoffeeScanMeta } from "@/features/coffee/types";

interface ScanResultsProps {
  data: ScannedCoffee;
  onScanAgain: () => void;
}

/**
 * Transform the hook's ScannedCoffee format to unified Coffee type
 */
function transformToCoffee(data: ScannedCoffee): Coffee {
  return {
    id: data.coffeeId || data.id, // Use master catalog ID
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
function extractScanMeta(data: ScannedCoffee): CoffeeScanMeta {
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

export function ScanResults({ data, onScanAgain }: ScanResultsProps) {
  const navigate = useNavigate();

  // Transform to unified types
  const coffee = transformToCoffee(data);
  const scanMeta = extractScanMeta(data);

  // Flag if this is a newly discovered coffee
  const isNewCoffee = data.isNewCoffee ?? false;

  return (
    <CoffeeProfile
      coffee={coffee}
      scanMeta={scanMeta}
      isNewCoffee={isNewCoffee}
      actions={
        <CoffeeActions
          coffee={coffee}
          scanMeta={scanMeta}
          onScanAgain={onScanAgain}
        />
      }
    />
  );
}
