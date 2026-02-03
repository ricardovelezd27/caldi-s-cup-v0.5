import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  transformRecipeRow, 
  type Recipe, 
  type RecipeFormData,
  type RecipeInsert,
  type RecipeUpdate 
} from "../types/recipe";

// ============= Fetch Functions =============

/**
 * Fetch user's own recipes
 */
export async function fetchMyRecipes(): Promise<Recipe[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(transformRecipeRow);
}

/**
 * Fetch public recipes (community recipes)
 */
export async function fetchPublicRecipes(options?: {
  brewMethod?: string;
  coffeeId?: string;
  limit?: number;
}): Promise<Recipe[]> {
  let query = supabase
    .from("recipes")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (options?.brewMethod) {
    query = query.eq("brew_method", options.brewMethod);
  }
  if (options?.coffeeId) {
    query = query.eq("coffee_id", options.coffeeId);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(transformRecipeRow);
}

/**
 * Fetch a single recipe by ID
 */
export async function fetchRecipeById(id: string): Promise<Recipe | null> {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return transformRecipeRow(data);
}

/**
 * Fetch recipes for a specific coffee
 */
export async function fetchRecipesForCoffee(coffeeId: string): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("coffee_id", coffeeId)
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(transformRecipeRow);
}

// ============= Mutation Functions =============

/**
 * Create a new recipe
 */
export async function createRecipe(formData: RecipeFormData): Promise<Recipe> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Must be logged in to create a recipe");

  const insert: RecipeInsert = {
    user_id: user.id,
    name: formData.name,
    description: formData.description || null,
    brew_method: formData.brewMethod,
    grind_size: formData.grindSize || null,
    ratio: formData.ratio || null,
    water_temp_celsius: formData.waterTempCelsius || null,
    brew_time_seconds: formData.brewTimeSeconds || null,
    steps: formData.steps,
    is_public: formData.isPublic,
    coffee_id: formData.coffeeId || null,
  };

  const { data, error } = await supabase
    .from("recipes")
    .insert(insert)
    .select()
    .single();

  if (error) throw error;
  return transformRecipeRow(data);
}

/**
 * Update an existing recipe
 */
export async function updateRecipe(
  id: string, 
  formData: Partial<RecipeFormData>
): Promise<Recipe> {
  const update: RecipeUpdate = {};
  
  if (formData.name !== undefined) update.name = formData.name;
  if (formData.description !== undefined) update.description = formData.description || null;
  if (formData.brewMethod !== undefined) update.brew_method = formData.brewMethod;
  if (formData.grindSize !== undefined) update.grind_size = formData.grindSize || null;
  if (formData.ratio !== undefined) update.ratio = formData.ratio || null;
  if (formData.waterTempCelsius !== undefined) update.water_temp_celsius = formData.waterTempCelsius || null;
  if (formData.brewTimeSeconds !== undefined) update.brew_time_seconds = formData.brewTimeSeconds || null;
  if (formData.steps !== undefined) update.steps = formData.steps;
  if (formData.isPublic !== undefined) update.is_public = formData.isPublic;
  if (formData.coffeeId !== undefined) update.coffee_id = formData.coffeeId || null;

  const { data, error } = await supabase
    .from("recipes")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return transformRecipeRow(data);
}

/**
 * Delete a recipe
 */
export async function deleteRecipe(id: string): Promise<void> {
  const { error } = await supabase
    .from("recipes")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// ============= React Query Hooks =============

export function useMyRecipes() {
  return useQuery({
    queryKey: ["my-recipes"],
    queryFn: fetchMyRecipes,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function usePublicRecipes(options?: {
  brewMethod?: string;
  coffeeId?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["public-recipes", options],
    queryFn: () => fetchPublicRecipes(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useRecipe(id: string | undefined) {
  return useQuery({
    queryKey: ["recipe", id],
    queryFn: () => fetchRecipeById(id!),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}

export function useRecipesForCoffee(coffeeId: string | undefined) {
  return useQuery({
    queryKey: ["coffee-recipes", coffeeId],
    queryFn: () => fetchRecipesForCoffee(coffeeId!),
    enabled: !!coffeeId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateRecipe() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-recipes"] });
      queryClient.invalidateQueries({ queryKey: ["public-recipes"] });
    },
  });
}

export function useUpdateRecipe() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RecipeFormData> }) => 
      updateRecipe(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["recipe", id] });
      queryClient.invalidateQueries({ queryKey: ["my-recipes"] });
      queryClient.invalidateQueries({ queryKey: ["public-recipes"] });
    },
  });
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-recipes"] });
      queryClient.invalidateQueries({ queryKey: ["public-recipes"] });
    },
  });
}
