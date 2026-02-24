import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";

const REFILL_INTERVAL_MS = 4 * 60 * 60 * 1000; // 4 hours

export function useHearts() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const heartsQuery = useQuery({
    queryKey: ["learning-hearts", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("learning_user_streaks")
        .select("hearts, max_hearts, hearts_last_refilled_at")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const raw = heartsQuery.data;

  // Compute how many hearts should have refilled since last refill
  const computed = useMemo(() => {
    if (!raw) return { hearts: 5, maxHearts: 5, timeUntilNext: null as number | null };

    const lastRefill = raw.hearts_last_refilled_at
      ? new Date(raw.hearts_last_refilled_at).getTime()
      : Date.now();
    const elapsed = Date.now() - lastRefill;
    const refillCount = Math.floor(elapsed / REFILL_INTERVAL_MS);
    const currentHearts = Math.min(raw.hearts + refillCount, raw.max_hearts);

    const timeUntilNext =
      currentHearts < raw.max_hearts
        ? REFILL_INTERVAL_MS - (elapsed % REFILL_INTERVAL_MS)
        : null;

    return { hearts: currentHearts, maxHearts: raw.max_hearts, timeUntilNext };
  }, [raw]);

  const loseHeartMutation = useMutation({
    mutationFn: async () => {
      if (!user || !raw) return;
      const newHearts = Math.max(0, (raw.hearts ?? 5) - 1);
      const { error } = await supabase
        .from("learning_user_streaks")
        .update({
          hearts: newHearts,
          hearts_last_refilled_at:
            newHearts < (raw.max_hearts ?? 5) && raw.hearts === raw.max_hearts
              ? new Date().toISOString()
              : raw.hearts_last_refilled_at,
        })
        .eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["learning-hearts"] }),
  });

  const gainHeartMutation = useMutation({
    mutationFn: async () => {
      if (!user || !raw) return;
      const newHearts = Math.min((raw.hearts ?? 0) + 1, raw.max_hearts ?? 5);
      const { error } = await supabase
        .from("learning_user_streaks")
        .update({ hearts: newHearts })
        .eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["learning-hearts"] }),
  });

  return {
    hearts: computed.hearts,
    maxHearts: computed.maxHearts,
    hasHearts: computed.hearts > 0,
    timeUntilNextHeart: computed.timeUntilNext,
    isLoading: heartsQuery.isLoading,
    loseHeart: loseHeartMutation.mutateAsync,
    gainHeart: gainHeartMutation.mutateAsync,
  };
}
