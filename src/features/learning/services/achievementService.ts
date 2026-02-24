import { supabase } from "@/integrations/supabase/client";
import type { LearningAchievement, LearningUserAchievement, LearningUserStreak } from "../types";

function toAchievement(row: any): LearningAchievement {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    nameEs: row.name_es,
    description: row.description,
    descriptionEs: row.description_es,
    icon: row.icon,
    xpReward: row.xp_reward,
    category: row.category,
    conditionType: row.condition_type,
    conditionValue: row.condition_value,
    conditionTrack: row.condition_track,
    isActive: row.is_active,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

function toUserAchievement(row: any): LearningUserAchievement {
  return {
    id: row.id,
    userId: row.user_id,
    achievementId: row.achievement_id,
    earnedAt: row.earned_at,
  };
}

export async function getAchievements(): Promise<LearningAchievement[]> {
  const { data, error } = await supabase
    .from("learning_achievements")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(toAchievement);
}

export async function getUserAchievements(
  userId: string,
): Promise<LearningUserAchievement[]> {
  const { data, error } = await supabase
    .from("learning_user_achievements")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;
  return (data ?? []).map(toUserAchievement);
}

/**
 * Compare user stats against achievement definitions and insert any newly earned.
 * Returns the list of newly unlocked achievements.
 */
export async function checkAndUnlock(
  userId: string,
  stats: LearningUserStreak,
  earnedIds: Set<string>,
): Promise<LearningAchievement[]> {
  const allAchievements = await getAchievements();
  const newlyUnlocked: LearningAchievement[] = [];

  for (const ach of allAchievements) {
    if (earnedIds.has(ach.id)) continue;

    let met = false;
    switch (ach.conditionType) {
      case "streak_days":
        met = stats.currentStreak >= ach.conditionValue;
        break;
      case "lessons_completed":
        met = stats.totalLessonsCompleted >= ach.conditionValue;
        break;
      // track_complete and league achievements deferred to future
      default:
        break;
    }

    if (met) {
      const { error } = await supabase
        .from("learning_user_achievements")
        .insert({ user_id: userId, achievement_id: ach.id });

      if (error) {
        // Likely unique constraint violation if already earned — skip
        console.warn("Achievement insert skipped:", ach.code, error.message);
        continue;
      }
      newlyUnlocked.push(ach);
    }
  }

  return newlyUnlocked;
}
