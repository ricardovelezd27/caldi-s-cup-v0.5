import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import type { CoffeeScanMeta } from "../types";

/**
 * Fetch the most recent scan metadata for a given coffee from the DB.
 * Used when navigating to a coffee profile without route state (e.g. from dashboard).
 */
export function useCoffeeScanMeta(coffeeId: string | undefined, skip = false) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["coffee-scan-meta", coffeeId, user?.id],
    queryFn: async (): Promise<CoffeeScanMeta | null> => {
      if (!coffeeId || !user?.id) return null;

      const { data, error } = await supabase
        .from("coffee_scans")
        .select("id, coffee_id, ai_confidence, tribe_match_score, match_reasons, scanned_at, image_url")
        .eq("coffee_id", coffeeId)
        .eq("user_id", user.id)
        .order("scanned_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      // Also fetch jargon from the coffees table
      const { data: coffeeData } = await supabase
        .from("coffees")
        .select("jargon_explanations")
        .eq("id", coffeeId)
        .single();

      return {
        scanId: data.id,
        coffeeId: data.coffee_id,
        aiConfidence: data.ai_confidence ?? 0,
        tribeMatchScore: data.tribe_match_score ?? 0,
        matchReasons: data.match_reasons ?? [],
        jargonExplanations: (coffeeData?.jargon_explanations as Record<string, string>) ?? {},
        scannedAt: data.scanned_at ?? new Date().toISOString(),
        rawImageUrl: data.image_url,
      };
    },
    enabled: !!coffeeId && !!user?.id && !skip,
    staleTime: 1000 * 60 * 5,
  });
}
