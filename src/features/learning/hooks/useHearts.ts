import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";
import { useMemo, useState, useEffect } from "react";

const REFILL_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours — all 5 hearts refill at once
const DEFAULT_MAX_HEARTS = 5;

export function useHearts() {
  const { user } = useAuth();
  const qc = useQueryClient();

  // Ticking clock for reactive countdown
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  const computed = useMemo(() => {
    if (!raw) return { hearts: DEFAULT_MAX_HEARTS, maxHearts: DEFAULT_MAX_HEARTS, timeUntilRefill: null as number | null };

    const maxH = raw.max_hearts ?? DEFAULT_MAX_HEARTS;

    // If hearts are already at max, no refill needed
    if (raw.hearts >= maxH) {
      return { hearts: maxH, maxHearts: maxH, timeUntilRefill: null };
    }

    // Hearts are below max — check if 24h has elapsed since first loss
    const lostAt = raw.hearts_last_refilled_at
      ? new Date(raw.hearts_last_refilled_at).getTime()
      : now; // fallback to now (shouldn't happen)

    const elapsed = now - lostAt;

    if (elapsed >= REFILL_INTERVAL_MS) {
      // 24h passed — hearts are fully refilled (will sync to DB on next mutation)
      return { hearts: maxH, maxHearts: maxH, timeUntilRefill: null };
    }

    // Still waiting — show current hearts and countdown
    const timeUntilRefill = REFILL_INTERVAL_MS - elapsed;
    return { hearts: raw.hearts, maxHearts: maxH, timeUntilRefill };
  }, [raw, now]);

  const loseHeartMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;

      const currentHearts = computed.hearts;
      const maxH = computed.maxHearts;
      const newHearts = Math.max(0, currentHearts - 1);

      // Determine if this is the first loss (going from max to below max)
      const isFirstLoss = currentHearts === maxH;

      if (!raw) {
        // No row exists yet — insert with hearts decremented
        const { error } = await supabase
          .from("learning_user_streaks")
          .insert({
            user_id: user.id,
            hearts: newHearts,
            max_hearts: DEFAULT_MAX_HEARTS,
            hearts_last_refilled_at: new Date().toISOString(),
          });
        if (error) throw error;
      } else {
        const updatePayload: Record<string, any> = { hearts: newHearts };

        // Only set the timestamp on the FIRST loss (max → below max)
        // Subsequent losses keep the original timestamp so the 24h window is anchored
        if (isFirstLoss) {
          updatePayload.hearts_last_refilled_at = new Date().toISOString();
        }

        const { error } = await supabase
          .from("learning_user_streaks")
          .update(updatePayload)
          .eq("user_id", user.id);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["learning-hearts"] }),
  });

  const gainHeartMutation = useMutation({
    mutationFn: async () => {
      if (!user || !raw) return;
      const newHearts = Math.min((raw.hearts ?? 0) + 1, raw.max_hearts ?? DEFAULT_MAX_HEARTS);
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
    timeUntilRefill: computed.timeUntilRefill,
    isLoading: heartsQuery.isLoading,
    loseHeart: loseHeartMutation.mutateAsync,
    gainHeart: gainHeartMutation.mutateAsync,
  };
}
