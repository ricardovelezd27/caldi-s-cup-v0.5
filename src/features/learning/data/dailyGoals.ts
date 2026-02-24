export interface DailyGoalTier {
  id: string;
  icon: string;
  xp: number;
  minutes: number;
}

export const DAILY_GOALS: DailyGoalTier[] = [
  { id: "casual", icon: "☕", xp: 10, minutes: 5 },
  { id: "regular", icon: "☕☕", xp: 20, minutes: 10 },
  { id: "serious", icon: "☕☕☕", xp: 30, minutes: 15 },
  { id: "intense", icon: "🔥", xp: 50, minutes: 20 },
];
