import { Flame } from "lucide-react";
import { useStreak } from "@/hooks/gamification/useStreak";
import { useAuth } from "@/contexts/auth";
import { ProfileStatCard } from "./ProfileStatCard";

export function ProfileStreakCard() {
  const { profile } = useAuth();
  const { streak } = useStreak();
  const current = streak?.currentStreak ?? profile?.current_streak ?? 0;

  return (
    <ProfileStatCard
      icon={<Flame className="h-5 w-5" />}
      iconClassName="bg-orange-100 text-orange-600"
      metric={current}
      label="Day Streak"
    />
  );
}
