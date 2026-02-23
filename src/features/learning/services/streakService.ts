import { supabase } from "@/integrations/supabase/client";
import type { LearningUserStreak, LearningUserDailyGoal } from "../types";

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

export async function updateStreak(
  userId: string,
  xpEarned: number,
): Promise<LearningUserStreak> {
  const today = new Date().toISOString().split("T")[0];
  let streak = await getUserStreak(userId);

  if (!streak) {
    streak = await initializeStreak(userId);
  }

  const lastDate = streak.lastActivityDate;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  let newCurrent = streak.currentStreak;
  let newStart = streak.streakStartDate;

  if (lastDate === today) {
    // Already active today, just add XP
  } else if (lastDate === yesterdayStr) {
    newCurrent += 1;
  } else {
    newCurrent = 1;
    newStart = today;
  }

  const newLongest = Math.max(streak.longestStreak, newCurrent);

  const { data, error } = await supabase
    .from("learning_user_streaks")
    .update({
      current_streak: newCurrent,
      longest_streak: newLongest,
      last_activity_date: today,
      streak_start_date: newStart ?? today,
      total_days_active:
        lastDate === today ? streak.totalDaysActive : streak.totalDaysActive + 1,
      total_xp: streak.totalXp + xpEarned,
      total_lessons_completed: streak.totalLessonsCompleted + 1,
    })
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return toStreak(data);
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
    const { error } = await supabase
      .from("learning_user_daily_goals")
      .insert({ user_id: userId, date: today, earned_xp: xp, is_achieved: xp >= 10 });
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
