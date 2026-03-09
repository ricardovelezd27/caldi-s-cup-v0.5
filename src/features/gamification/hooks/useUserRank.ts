import { useMemo } from "react";
import { useAuth } from "@/contexts/auth";
import { BARISTA_RANKS, type BaristaRank } from "../config/ranks";

interface UseUserRankResult {
  currentRank: BaristaRank;
  nextRank: BaristaRank | null;
  progressToNext: number;
  xpNeeded: number;
  totalXP: number;
}

export function useUserRank(): UseUserRankResult {
  const { profile } = useAuth();
  const totalXP = profile?.total_xp ?? 0;

  return useMemo(() => {
    let currentIndex = 0;
    for (let i = BARISTA_RANKS.length - 1; i >= 0; i--) {
      if (totalXP >= BARISTA_RANKS[i].minXP) {
        currentIndex = i;
        break;
      }
    }

    const currentRank = BARISTA_RANKS[currentIndex];
    const nextRank = currentIndex < BARISTA_RANKS.length - 1 ? BARISTA_RANKS[currentIndex + 1] : null;

    const progressToNext = nextRank
      ? Math.min(100, Math.max(0, ((totalXP - currentRank.minXP) / (nextRank.minXP - currentRank.minXP)) * 100))
      : 100;

    const xpNeeded = nextRank ? nextRank.minXP - totalXP : 0;

    return { currentRank, nextRank, progressToNext, xpNeeded, totalXP };
  }, [totalXP]);
}
