import { useLanguage } from "@/contexts/language";

interface DailyGoalRingProps {
  earnedXp: number;
  goalXp: number;
  size?: number;
}

export function DailyGoalRing({ earnedXp, goalXp, size = 56 }: DailyGoalRingProps) {
  const { t } = useLanguage();
  const percent = goalXp > 0 ? Math.min((earnedXp / goalXp) * 100, 100) : 0;
  const achieved = percent >= 100;
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth={4}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={achieved ? "hsl(var(--primary))" : "hsl(var(--secondary))"}
            strokeWidth={4}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-inter font-bold text-foreground">
            {earnedXp}/{goalXp}
          </span>
        </div>
      </div>
      <span className="text-xs font-inter text-muted-foreground">{t("learn.dailyGoal")}</span>
    </div>
  );
}
