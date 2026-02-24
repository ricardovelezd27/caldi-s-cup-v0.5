/**
 * Pure XP calculation — no side effects, fully testable.
 */

export interface XPBonuses {
  perfect: number;
  speed: number;
  streak: number;
  firstOfDay: number;
}

export interface XPCalculation {
  baseXP: number;
  bonuses: XPBonuses;
  totalXP: number;
}

export function calculateLessonXP(
  lessonXpReward: number,
  correctCount: number,
  totalCount: number,
  timeSpentSeconds: number,
  currentStreak: number,
  isFirstLessonToday: boolean,
): XPCalculation {
  const baseXP = lessonXpReward;

  const bonuses: XPBonuses = {
    perfect: totalCount > 0 && correctCount === totalCount ? 5 : 0,
    speed: timeSpentSeconds < 120 ? 3 : 0,
    streak: Math.floor(currentStreak / 10) * 2,
    firstOfDay: isFirstLessonToday ? 5 : 0,
  };

  const totalXP =
    baseXP + bonuses.perfect + bonuses.speed + bonuses.streak + bonuses.firstOfDay;

  return { baseXP, bonuses, totalXP };
}
