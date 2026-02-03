import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";

export function useFavorites() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: favoriteIds = [], isLoading } = useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("user_coffee_favorites")
        .select("coffee_id")
        .eq("user_id", user.id);

      if (error) throw error;
      return data.map((f) => f.coffee_id);
    },
    enabled: !!user?.id,
  });

  const addMutation = useMutation({
    mutationFn: async (coffeeId: string) => {
      if (!user?.id) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("user_coffee_favorites")
        .insert({ user_id: user.id, coffee_id: coffeeId });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", user?.id] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (coffeeId: string) => {
      if (!user?.id) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("user_coffee_favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("coffee_id", coffeeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", user?.id] });
    },
  });

  return {
    favoriteIds,
    isLoading,
    isFavorite: (coffeeId: string) => favoriteIds.includes(coffeeId),
    addToFavorites: addMutation.mutateAsync,
    removeFromFavorites: removeMutation.mutateAsync,
    isAddingFavorite: addMutation.isPending,
    isRemovingFavorite: removeMutation.isPending,
  };
}
