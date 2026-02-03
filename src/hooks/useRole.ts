import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface UseRoleReturn {
  role: AppRole | null;
  isAdmin: boolean;
  isRoaster: boolean;
  isUser: boolean;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to check the current user's role.
 * Uses the user_roles table and the has_role() security definer function.
 */
export function useRole(): UseRoleReturn {
  const { user } = useAuth();

  const { data: role, isLoading, error } = useQuery({
    queryKey: ["user-role", user?.id],
    queryFn: async (): Promise<AppRole | null> => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data?.role ?? "user";
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  return {
    role: role ?? null,
    isAdmin: role === "admin",
    isRoaster: role === "roaster",
    isUser: role === "user",
    isLoading,
    error: error as Error | null,
  };
}
