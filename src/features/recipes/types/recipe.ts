import type { Database } from "@/integrations/supabase/types";

export type RecipeRow = Database["public"]["Tables"]["recipes"]["Row"];
export type RecipeInsert = Database["public"]["Tables"]["recipes"]["Insert"];
export type RecipeUpdate = Database["public"]["Tables"]["recipes"]["Update"];

/**
 * Unified Recipe type for frontend use
 */
export interface Recipe {
  id: string;
  userId: string;
  coffeeId: string | null;
  name: string;
  description: string | null;
  brewMethod: string;
  grindSize: string | null;
  ratio: string | null;
  waterTempCelsius: number | null;
  brewTimeSeconds: number | null;
  steps: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Form data for creating/editing recipes
 */
export interface RecipeFormData {
  name: string;
  description?: string;
  brewMethod: string;
  grindSize?: string;
  ratio?: string;
  waterTempCelsius?: number;
  brewTimeSeconds?: number;
  steps: string[];
  isPublic: boolean;
  coffeeId?: string;
}

/**
 * Brew method options
 */
export const BREW_METHODS = [
  { value: "pour-over", label: "Pour Over" },
  { value: "french-press", label: "French Press" },
  { value: "espresso", label: "Espresso" },
  { value: "aeropress", label: "AeroPress" },
  { value: "chemex", label: "Chemex" },
  { value: "moka-pot", label: "Moka Pot" },
  { value: "cold-brew", label: "Cold Brew" },
  { value: "drip", label: "Drip Coffee" },
  { value: "siphon", label: "Siphon" },
  { value: "turkish", label: "Turkish" },
  { value: "other", label: "Other" },
] as const;

/**
 * Grind size options
 */
export const GRIND_SIZES = [
  { value: "extra-fine", label: "Extra Fine (Turkish)" },
  { value: "fine", label: "Fine (Espresso)" },
  { value: "medium-fine", label: "Medium-Fine (Pour Over)" },
  { value: "medium", label: "Medium (Drip)" },
  { value: "medium-coarse", label: "Medium-Coarse (Chemex)" },
  { value: "coarse", label: "Coarse (French Press)" },
  { value: "extra-coarse", label: "Extra Coarse (Cold Brew)" },
] as const;

/**
 * Transform database row to Recipe type
 */
export function transformRecipeRow(row: RecipeRow): Recipe {
  return {
    id: row.id,
    userId: row.user_id,
    coffeeId: row.coffee_id,
    name: row.name,
    description: row.description,
    brewMethod: row.brew_method,
    grindSize: row.grind_size,
    ratio: row.ratio,
    waterTempCelsius: row.water_temp_celsius,
    brewTimeSeconds: row.brew_time_seconds,
    steps: row.steps ?? [],
    isPublic: row.is_public ?? false,
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? new Date().toISOString(),
  };
}

/**
 * Format brew time for display
 */
export function formatBrewTime(seconds: number | null): string {
  if (!seconds) return "";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  if (secs === 0) return `${mins}m`;
  return `${mins}m ${secs}s`;
}

/**
 * Get brew method label
 */
export function getBrewMethodLabel(value: string): string {
  return BREW_METHODS.find(m => m.value === value)?.label ?? value;
}

/**
 * Get grind size label
 */
export function getGrindSizeLabel(value: string): string {
  return GRIND_SIZES.find(g => g.value === value)?.label ?? value;
}
