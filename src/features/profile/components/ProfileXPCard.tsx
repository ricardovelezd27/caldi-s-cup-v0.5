import { Star } from "lucide-react";
import { useUserRank } from "@/features/gamification/hooks/useUserRank";
import { ProfileStatCard } from "./ProfileStatCard";

export function ProfileXPCard() {
  const { totalXP } = useUserRank();

  return (
    <ProfileStatCard
      icon={<Star className="h-5 w-5" />}
      iconClassName="bg-yellow-100 text-yellow-600"
      metric={totalXP.toLocaleString()}
      label="Total XP"
    />
  );
}
