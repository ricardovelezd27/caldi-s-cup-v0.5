import { Target } from "lucide-react";
import { useDailyGoal } from "@/features/learning/hooks/useDailyGoal";
import { ProfileStatCard } from "./ProfileStatCard";

export function ProfileDailyGoalCard() {
  const { goal, isGoalSet } = useDailyGoal();

  const metric = isGoalSet && goal
    ? `${goal.earnedXp}/${goal.goalXp}`
    : "—";

  return (
    <ProfileStatCard
      icon={<Target className="h-5 w-5" />}
      iconClassName="bg-blue-100 text-blue-600"
      metric={metric}
      label="Daily Goal"
    />
  );
}
