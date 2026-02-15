import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { toast } from "@/hooks/use-toast";

export interface UserCoffeeRating {
  userBodyScore: number | null;
  userAcidityScore: number | null;
  userSweetnessScore: number | null;
  userMatchScore: number | null;
}

const EMPTY_RATING: UserCoffeeRating = {
  userBodyScore: null,
  userAcidityScore: null,
  userSweetnessScore: null,
  userMatchScore: null,
};

/**
 * Fetches and persists a user's personal coffee rating via debounced upsert.
 */
export function useUserCoffeeRating(coffeeId: string | undefined) {
  const { user } = useAuth();
  const [rating, setRating] = useState<UserCoffeeRating>(EMPTY_RATING);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedRating = useDebouncedValue(rating, 500);
  const hasFetched = useRef(false);
  const isInitialLoad = useRef(true);

  // Fetch existing rating
  useEffect(() => {
    if (!user || !coffeeId) {
      setRating(EMPTY_RATING);
      hasFetched.current = false;
      return;
    }

    const fetch = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("user_coffee_ratings")
        .select("*")
        .eq("user_id", user.id)
        .eq("coffee_id", coffeeId)
        .maybeSingle();

      if (!error && data) {
        setRating({
          userBodyScore: data.user_body_score,
          userAcidityScore: data.user_acidity_score,
          userSweetnessScore: data.user_sweetness_score,
          userMatchScore: data.user_match_score,
        });
      }
      hasFetched.current = true;
      isInitialLoad.current = true;
      setIsLoading(false);
    };

    fetch();
  }, [user, coffeeId]);

  // Debounced save
  useEffect(() => {
    if (!user || !coffeeId || !hasFetched.current) return;
    // Skip the initial load echo
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    const allNull = Object.values(debouncedRating).every((v) => v === null);
    if (allNull) return;

    const upsert = async () => {
      const { error } = await supabase
        .from("user_coffee_ratings")
        .upsert(
          {
            user_id: user.id,
            coffee_id: coffeeId,
            user_body_score: debouncedRating.userBodyScore,
            user_acidity_score: debouncedRating.userAcidityScore,
            user_sweetness_score: debouncedRating.userSweetnessScore,
            user_match_score: debouncedRating.userMatchScore,
          },
          { onConflict: "user_id,coffee_id" }
        );

      if (error) {
        toast({
          title: "Couldn't save your rating",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    };

    upsert();
  }, [debouncedRating, user, coffeeId]);

  const updateField = useCallback(
    (field: keyof UserCoffeeRating, value: number) => {
      setRating((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  return {
    rating,
    updateField,
    isAuthenticated: !!user,
    isLoading,
  };
}
