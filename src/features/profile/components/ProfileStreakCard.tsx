import { Flame } from "lucide-react";
import { useStreak } from "@/hooks/gamification/useStreak";
import { ProfileStatCard } from "./ProfileStatCard";

export function ProfileStreakCard({ compact }: { compact?: boolean }) {
  const { streak } = useStreak();
  const current = streak?.currentStreak ?? 0;

  return (
    <ProfileStatCard
      icon={<Flame className="h-5 w-5" />}
      iconClassName="bg-orange-100 text-orange-600"
      metric={current}
      label="Day Streak"
      compact={compact}
    />
  );
}
