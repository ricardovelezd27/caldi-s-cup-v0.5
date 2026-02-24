import { supabase } from "@/integrations/supabase/client";
import type { LearningLeague, LearningUserLeague } from "../types";

function toLeague(row: any): LearningLeague {
  return {
    id: row.id,
    name: row.name,
    nameEs: row.name_es,
    tier: row.tier,
    icon: row.icon,
    colorHex: row.color_hex,
    promoteTopN: row.promote_top_n,
    demoteBottomN: row.demote_bottom_n,
    createdAt: row.created_at,
  };
}

function toUserLeague(row: any): LearningUserLeague {
  return {
    id: row.id,
    userId: row.user_id,
    leagueId: row.league_id,
    weekStartDate: row.week_start_date,
    weeklyXp: row.weekly_xp,
    previousLeagueId: row.previous_league_id,
    promotedAt: row.promoted_at,
    demotedAt: row.demoted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// getLeagues is already exported from learningService.ts

export async function getUserLeague(userId: string): Promise<{
  userLeague: LearningUserLeague;
  league: LearningLeague;
} | null> {
  const { data, error } = await supabase
    .from("learning_user_league")
    .select("*, learning_leagues(*)")
    .eq("user_id", userId)
    .order("week_start_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    userLeague: toUserLeague(data),
    league: toLeague((data as any).learning_leagues),
  };
}

export interface LeaderboardEntry {
  userId: string;
  weeklyXp: number;
  rank: number;
}

export async function getLeaderboard(
  leagueId: string,
  weekStartDate: string,
): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from("learning_user_league")
    .select("user_id, weekly_xp")
    .eq("league_id", leagueId)
    .eq("week_start_date", weekStartDate)
    .order("weekly_xp", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row, i) => ({
    userId: row.user_id,
    weeklyXp: row.weekly_xp,
    rank: i + 1,
  }));
}

export async function addWeeklyXP(userId: string, xp: number): Promise<void> {
  // Get current week's record
  const { data: existing } = await supabase
    .from("learning_user_league")
    .select("id, weekly_xp")
    .eq("user_id", userId)
    .order("week_start_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!existing) return; // User not in a league yet

  const { error } = await supabase
    .from("learning_user_league")
    .update({ weekly_xp: existing.weekly_xp + xp })
    .eq("id", existing.id);

  if (error) throw error;
}
