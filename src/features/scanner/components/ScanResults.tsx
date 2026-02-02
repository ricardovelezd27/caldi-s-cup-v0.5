import { useNavigate } from "react-router-dom";
import { 
  CoffeeProfile, 
  CoffeeActions,
  transformScannedCoffeeRow,
} from "@/features/coffee";
import type { ScannedCoffee } from "../types/scanner";
import type { Database } from "@/integrations/supabase/types";

interface ScanResultsProps {
  data: ScannedCoffee;
  onScanAgain: () => void;
}

/**
 * Transform the hook's ScannedCoffee format to database row format
 * so we can use the unified transformScannedCoffeeRow function.
 */
function toDbRow(data: ScannedCoffee): Database["public"]["Tables"]["scanned_coffees"]["Row"] {
  return {
    id: data.id,
    user_id: "", // Not needed for display
    image_url: data.imageUrl,
    coffee_name: data.coffeeName,
    brand: data.brand,
    origin: data.origin,
    origin_country: data.originCountry,
    origin_region: data.originRegion,
    origin_farm: data.originFarm,
    roast_level: data.roastLevel,
    roast_level_numeric: data.roastLevelNumeric,
    altitude: data.altitude,
    altitude_meters: data.altitudeMeters,
    processing_method: data.processingMethod,
    variety: data.variety,
    acidity_score: data.acidityScore,
    body_score: data.bodyScore,
    sweetness_score: data.sweetnessScore,
    flavor_notes: data.flavorNotes,
    brand_story: data.brandStory,
    awards: data.awards,
    cupping_score: data.cuppingScore,
    ai_confidence: data.aiConfidence,
    tribe_match_score: data.tribeMatchScore,
    match_reasons: data.matchReasons,
    jargon_explanations: data.jargonExplanations,
    scanned_at: data.scannedAt,
    created_at: data.scannedAt,
    coffee_id: data.coffeeId, // Now populated from edge function
    raw_ai_response: null,
  };
}

export function ScanResults({ data, onScanAgain }: ScanResultsProps) {
  const navigate = useNavigate();

  // Transform to unified types
  const dbRow = toDbRow(data);
  const { coffee, scanMeta } = transformScannedCoffeeRow(dbRow);

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
