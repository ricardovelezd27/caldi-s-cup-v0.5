/**
 * Global Streak Service — manages streaks and daily goals.
 * Also re-exports learning-specific streak helpers for backward compat.
 */

import { supabase } from "@/integrations/supabase/client";
import type { LearningUserStreak, LearningUserDailyGoal } from "@/features/learning/types";

// ── Row mappers ──

function toStreak(row: any): LearningUserStreak {
  return {
    id: row.id,
    userId: row.user_id,
    currentStreak: row.current_streak,
    longestStreak: row.longest_streak,
    lastActivityDate: row.last_activity_date,
    streakStartDate: row.streak_start_date,
    streakFreezesAvailable: row.streak_freezes_available,
    streakFreezeUsedToday: row.streak_freeze_used_today,
    totalDaysActive: row.total_days_active,
    totalXp: row.total_xp,
    totalLessonsCompleted: row.total_lessons_completed,
    hearts: row.hearts ?? 5,
    maxHearts: row.max_hearts ?? 5,
    heartsLastRefilledAt: row.hearts_last_refilled_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toDailyGoal(row: any): LearningUserDailyGoal {
  return {
    id: row.id,
    userId: row.user_id,
    date: row.date,
    goalXp: row.goal_xp,
    earnedXp: row.earned_xp,
    isAchieved: row.is_achieved,
  };
}

// ── Existing learning streak helpers ──

export async function getUserStreak(userId: string): Promise<LearningUserStreak | null> {
  const { data, error } = await supabase
    .from("learning_user_streaks")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data ? toStreak(data) : null;
}

export async function initializeStreak(userId: string): Promise<LearningUserStreak> {
  const { data, error } = await supabase
    .from("learning_user_streaks")
    .insert({ user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return toStreak(data);
}

export async function updateStreakViaRPC(
  userId: string,
  xpEarned: number,
): Promise<{ action: string; currentStreak: number; longestStreak: number; totalXp: number; totalLessonsCompleted: number }> {
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase.rpc("update_streak_and_xp", {
    p_user_id: userId,
    p_date: today,
    p_xp_earned: xpEarned,
  });

  if (error) throw error;
  const result = data as any;
  return {
    action: result.action,
    currentStreak: result.current_streak,
    longestStreak: result.longest_streak,
    totalXp: result.total_xp,
    totalLessonsCompleted: result.total_lessons_completed,
  };
}

export async function getDailyGoal(
  userId: string,
): Promise<LearningUserDailyGoal | null> {
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("learning_user_daily_goals")
    .select("*")
    .eq("user_id", userId)
    .eq("date", today)
    .maybeSingle();

  if (error) throw error;
  return data ? toDailyGoal(data) : null;
}

export async function addXPToDaily(userId: string, xp: number): Promise<void> {
  const today = new Date().toISOString().split("T")[0];
  let goal = await getDailyGoal(userId);

  if (!goal) {
    // Fetch user's most recent goal_xp to use as threshold instead of hardcoded 10
    const { data: lastGoal } = await supabase
      .from("learning_user_daily_goals")
      .select("goal_xp")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .limit(1)
      .maybeSingle();
    const threshold = lastGoal?.goal_xp ?? 10;

    const { error } = await supabase
      .from("learning_user_daily_goals")
      .insert({ user_id: userId, date: today, earned_xp: xp, goal_xp: threshold, is_achieved: xp >= threshold });
    if (error) throw error;
    return;
  }

  const newEarned = goal.earnedXp + xp;
  const { error } = await supabase
    .from("learning_user_daily_goals")
    .update({ earned_xp: newEarned, is_achieved: newEarned >= goal.goalXp })
    .eq("id", goal.id);

  if (error) throw error;
}

// ── Global streak update for any action ──

export async function updateStreakOnAction(userId: string): Promise<void> {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  // Read current streak state from the source of truth
  const { data: streakRow, error: fetchError } = await supabase
    .from("learning_user_streaks")
    .select("current_streak, longest_streak, last_activity_date")
    .eq("user_id", userId)
    .maybeSingle();

  if (fetchError) throw fetchError;

  if (!streakRow) {
    // No streak row yet — create one (first-ever action)
    await supabase
      .from("learning_user_streaks")
      .insert({
        user_id: userId,
        current_streak: 1,
        longest_streak: 1,
        last_activity_date: today,
        streak_start_date: today,
        total_days_active: 1,
      });
    await supabase.from("profiles").update({ current_streak: 1 }).eq("id", userId);
    return;
  }

  const lastDate = streakRow.last_activity_date;

  // Already active today — nothing to do
  if (lastDate === today) return;

  // Determine new streak value using same logic as the RPC
  const isContinuation = lastDate === yesterday;
  const newStreak = isContinuation ? streakRow.current_streak + 1 : 1;
  const newLongest = Math.max(streakRow.longest_streak, newStreak);

  // Update learning_user_streaks
  const updates: Record<string, any> = {
    current_streak: newStreak,
    longest_streak: newLongest,
    last_activity_date: today,
    total_days_active: (streakRow as any).total_days_active
      ? (streakRow as any).total_days_active + 1
      : 1,
    streak_freeze_used_today: false,
  };
  if (!isContinuation) {
    updates.streak_start_date = today;
  }

  const { error: updateError } = await supabase
    .from("learning_user_streaks")
    .update(updates)
    .eq("user_id", userId);

  if (updateError) throw updateError;

  // Keep profiles.current_streak in sync
  await supabase.from("profiles").update({ current_streak: newStreak }).eq("id", userId);
}
