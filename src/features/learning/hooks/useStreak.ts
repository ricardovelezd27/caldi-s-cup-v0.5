import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth";
import { getUserStreak, getDailyGoal } from "../services/streakService";
import type { LearningUserStreak, LearningUserDailyGoal } from "../types";

export function useStreak() {
  const { user } = useAuth();

  const streakQuery = useQuery({
    queryKey: ["learning-streak", user?.id],
    queryFn: () => getUserStreak(user!.id),
    enabled: !!user,
  });

  const goalQuery = useQuery({
    queryKey: ["learning-daily-goal", user?.id],
    queryFn: () => getDailyGoal(user!.id),
    enabled: !!user,
  });

  return {
    streak: streakQuery.data ?? null,
    dailyGoal: goalQuery.data ?? null,
    isLoading: streakQuery.isLoading,
  };
}
