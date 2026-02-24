import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth";
import {
  getAchievements,
  getUserAchievements,
  checkAndUnlock,
} from "../services/achievementService";
import type { LearningUserStreak, LearningAchievement } from "../types";
import { useCallback } from "react";

export function useAchievements() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const achievementsQuery = useQuery({
    queryKey: ["learning-achievements"],
    queryFn: getAchievements,
  });

  const earnedQuery = useQuery({
    queryKey: ["learning-user-achievements", user?.id],
    queryFn: () => getUserAchievements(user!.id),
    enabled: !!user,
  });

  const earned = earnedQuery.data ?? [];
  const earnedIds = new Set(earned.map((e) => e.achievementId));

  const checkAndUnlockFn = useCallback(
    async (stats: LearningUserStreak): Promise<LearningAchievement[]> => {
      if (!user) return [];
      const newly = await checkAndUnlock(user.id, stats, earnedIds);
      if (newly.length > 0) {
        qc.invalidateQueries({ queryKey: ["learning-user-achievements"] });
      }
      return newly;
    },
    [user, earnedIds, qc],
  );

  return {
    achievements: achievementsQuery.data ?? [],
    earned,
    earnedIds,
    isLoading: achievementsQuery.isLoading,
    earnedCount: earned.length,
    totalCount: achievementsQuery.data?.length ?? 0,
    checkAndUnlock: checkAndUnlockFn,
  };
}
