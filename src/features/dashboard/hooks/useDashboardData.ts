import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import type { BrewLog, FavoriteCoffee, DashboardProfile, BrewingLevel } from "../types/dashboard";
import type { CoffeeTribe } from "@/features/quiz/types/tribe";

export function useDashboardData() {
  const { user } = useAuth();

  const profileQuery = useQuery({
    queryKey: ["dashboard-profile", user?.id],
    queryFn: async (): Promise<DashboardProfile | null> => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, coffee_tribe, weekly_goal_target, brewing_level, is_onboarded")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      
      return {
        id: data.id,
        display_name: data.display_name,
        coffee_tribe: data.coffee_tribe as CoffeeTribe | null,
        weekly_goal_target: data.weekly_goal_target ?? 10,
        brewing_level: (data.brewing_level as BrewingLevel) ?? "beginner",
        is_onboarded: data.is_onboarded ?? false,
      };
    },
    enabled: !!user?.id,
  });

  const recentBrewsQuery = useQuery({
    queryKey: ["recent-brews", user?.id],
    queryFn: async (): Promise<BrewLog[]> => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("brew_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("brewed_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return (data as BrewLog[]) ?? [];
    },
    enabled: !!user?.id,
  });

  const favoriteQuery = useQuery({
    queryKey: ["favorite-coffee", user?.id],
    queryFn: async (): Promise<FavoriteCoffee | null> => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("user_favorites")
        .select("*")
        .eq("user_id", user.id)
        .order("added_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as FavoriteCoffee | null;
    },
    enabled: !!user?.id,
  });

  const weeklyBrewCountQuery = useQuery({
    queryKey: ["weekly-brew-count", user?.id],
    queryFn: async (): Promise<number> => {
      if (!user?.id) return 0;

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const { count, error } = await supabase
        .from("brew_logs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("brewed_at", oneWeekAgo.toISOString());

      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!user?.id,
  });

  return {
    profile: profileQuery.data ?? null,
    recentBrews: recentBrewsQuery.data ?? [],
    favorite: favoriteQuery.data ?? null,
    weeklyBrewCount: weeklyBrewCountQuery.data ?? 0,
    isLoading:
      profileQuery.isLoading ||
      recentBrewsQuery.isLoading ||
      favoriteQuery.isLoading ||
      weeklyBrewCountQuery.isLoading,
    error:
      profileQuery.error ||
      recentBrewsQuery.error ||
      favoriteQuery.error ||
      weeklyBrewCountQuery.error,
    refetch: () => {
      profileQuery.refetch();
      recentBrewsQuery.refetch();
      favoriteQuery.refetch();
      weeklyBrewCountQuery.refetch();
    },
  };
}
