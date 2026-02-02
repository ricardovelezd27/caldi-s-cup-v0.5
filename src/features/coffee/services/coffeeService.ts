import { supabase } from "@/integrations/supabase/client";
import type { Coffee } from "../types";

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
    brandStory: (data as any).brand_story ?? null,
    jargonExplanations: (data as any).jargon_explanations ?? {},
    aiConfidence: (data as any).ai_confidence ?? null,
    roasterId: data.roaster_id,
    isVerified: data.is_verified ?? false,
    source: data.source,
    createdBy: data.created_by,
    createdAt: data.created_at ?? new Date().toISOString(),
    updatedAt: data.updated_at ?? new Date().toISOString(),
  };
}

/**
 * Fetch all verified coffees (for marketplace)
 */
export async function getVerifiedCoffees(): Promise<Coffee[]> {
  const { data, error } = await supabase
    .from("coffees")
    .select("*")
    .eq("is_verified", true)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
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
    brandStory: (row as any).brand_story ?? null,
    jargonExplanations: (row as any).jargon_explanations ?? {},
    aiConfidence: (row as any).ai_confidence ?? null,
    roasterId: row.roaster_id,
    isVerified: row.is_verified ?? false,
    source: row.source,
    createdBy: row.created_by,
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? new Date().toISOString(),
  }));
}

/**
 * Fetch all coffees (verified + user's own unverified)
 */
export async function getAllCoffees(userId?: string): Promise<Coffee[]> {
  let query = supabase
    .from("coffees")
    .select("*")
    .order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) throw error;

  return (data ?? []).map((row) => ({
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
    brandStory: (row as any).brand_story ?? null,
    jargonExplanations: (row as any).jargon_explanations ?? {},
    aiConfidence: (row as any).ai_confidence ?? null,
    roasterId: row.roaster_id,
    isVerified: row.is_verified ?? false,
    source: row.source,
    createdBy: row.created_by,
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? new Date().toISOString(),
  }));
}
