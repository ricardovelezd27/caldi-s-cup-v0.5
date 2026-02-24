import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth";
import { getUserLeague, getLeaderboard } from "../services/leagueService";

export function useLeague() {
  const { user } = useAuth();

  const leagueQuery = useQuery({
    queryKey: ["learning-league", user?.id],
    queryFn: () => getUserLeague(user!.id),
    enabled: !!user,
  });

  const userLeagueData = leagueQuery.data ?? null;

  const leaderboardQuery = useQuery({
    queryKey: [
      "learning-leaderboard",
      userLeagueData?.league.id,
      userLeagueData?.userLeague.weekStartDate,
    ],
    queryFn: () =>
      getLeaderboard(
        userLeagueData!.league.id,
        userLeagueData!.userLeague.weekStartDate,
      ),
    enabled: !!userLeagueData,
  });

  const leaderboard = leaderboardQuery.data ?? [];
  const myRank = leaderboard.find((e) => e.userId === user?.id)?.rank ?? null;

  // Days remaining in week (week ends Sunday)
  const daysRemaining = (() => {
    if (!userLeagueData) return 0;
    const weekStart = new Date(userLeagueData.userLeague.weekStartDate);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const now = new Date();
    return Math.max(0, Math.ceil((weekEnd.getTime() - now.getTime()) / 86400000));
  })();

  return {
    league: userLeagueData?.league ?? null,
    userLeague: userLeagueData?.userLeague ?? null,
    leaderboard,
    myRank,
    daysRemaining,
    isLoading: leagueQuery.isLoading,
  };
}
