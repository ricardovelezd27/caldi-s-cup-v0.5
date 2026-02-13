import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";

export const useUsageSummary = (enabled: boolean) => {
  const { user, profile } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["usage-summary", user?.id],
    enabled: enabled && !!user,
    queryFn: async () => {
      const userId = user!.id;
      const [scans, favorites, manualCoffees] = await Promise.all([
        supabase
          .from("coffee_scans")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userId),
        supabase
          .from("user_coffee_favorites")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userId),
        supabase
          .from("coffees")
          .select("id", { count: "exact", head: true })
          .eq("created_by", userId)
          .eq("source", "manual"),
      ]);

      return {
        scansCount: scans.count ?? 0,
        favoritesCount: favorites.count ?? 0,
        manualCoffeesCount: manualCoffees.count ?? 0,
      };
    },
  });

  return {
    tribe: profile?.coffee_tribe ?? null,
    scansCount: data?.scansCount ?? 0,
    favoritesCount: data?.favoritesCount ?? 0,
    manualCoffeesCount: data?.manualCoffeesCount ?? 0,
    isLoading,
  };
};
