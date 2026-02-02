import { supabase } from "@/integrations/supabase/client";
import type { Coffee } from "../types";
import type { Json } from "@/integrations/supabase/types";

/**
 * Promote a scanned coffee to the master catalog.
 * Creates a new coffee record and links the scan to it.
 */
export async function promoteToCatalog(
  coffee: Coffee,
  scanId: string
): Promise<string> {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Insert into coffees table
  const { data: newCoffee, error: insertError } = await supabase
    .from("coffees")
    .insert({
      name: coffee.name,
      brand: coffee.brand,
      image_url: coffee.imageUrl,
      origin_country: coffee.originCountry,
      origin_region: coffee.originRegion,
      origin_farm: coffee.originFarm,
      roast_level: coffee.roastLevel,
      processing_method: coffee.processingMethod,
      variety: coffee.variety,
      altitude_meters: coffee.altitudeMeters,
      acidity_score: coffee.acidityScore,
      body_score: coffee.bodyScore,
      sweetness_score: coffee.sweetnessScore,
      flavor_notes: coffee.flavorNotes,
      description: coffee.description,
      cupping_score: coffee.cuppingScore,
      awards: coffee.awards,
      source: "scan" as const,
      is_verified: false, // Admins can verify later
      created_by: user.id,
    })
    .select("id")
    .single();

  if (insertError) throw insertError;

  // Link the scan to the new coffee
  const { error: updateError } = await supabase
    .from("scanned_coffees")
    .update({ coffee_id: newCoffee.id })
    .eq("id", scanId);

  if (updateError) {
    console.error("Failed to link scan to coffee:", updateError);
    // Don't throw - coffee was created successfully
  }

  return newCoffee.id;
}

/**
 * Fetch a coffee by ID from the master catalog.
 */
export async function getCoffeeById(coffeeId: string): Promise<Coffee | null> {
  const { data, error } = await supabase
    .from("coffees")
    .select("*")
    .eq("id", coffeeId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    brand: data.brand,
    imageUrl: data.image_url,
    originCountry: data.origin_country,
    originRegion: data.origin_region,
    originFarm: data.origin_farm,
    roastLevel: data.roast_level,
    processingMethod: data.processing_method,
    variety: data.variety,
    altitudeMeters: data.altitude_meters,
    acidityScore: data.acidity_score,
    bodyScore: data.body_score,
    sweetnessScore: data.sweetness_score,
    flavorNotes: data.flavor_notes ?? [],
    description: data.description,
    cuppingScore: data.cupping_score ? Number(data.cupping_score) : null,
    awards: data.awards ?? [],
    roasterId: data.roaster_id,
    isVerified: data.is_verified ?? false,
    source: data.source,
    createdBy: data.created_by,
    createdAt: data.created_at ?? new Date().toISOString(),
    updatedAt: data.updated_at ?? new Date().toISOString(),
  };
}
