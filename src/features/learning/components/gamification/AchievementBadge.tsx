import { useLanguage } from "@/contexts/language";
import type { LearningAchievement } from "../../types";
import { cn } from "@/lib/utils";

interface AchievementBadgeProps {
  achievement: LearningAchievement;
  isEarned: boolean;
  earnedAt?: string;
  size?: "sm" | "md";
  onClick?: () => void;
}

export function AchievementBadge({
  achievement,
  isEarned,
  earnedAt,
  size = "md",
  onClick,
}: AchievementBadgeProps) {
  const { language } = useLanguage();
  const name = language === "es" ? achievement.nameEs : achievement.name;
  const desc = language === "es" ? achievement.descriptionEs : achievement.description;

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center text-center p-3 rounded-lg border-4 transition-all",
        isEarned
          ? "border-primary bg-primary/5 shadow-[2px_2px_0px_0px_hsl(var(--primary))]"
          : "border-border/50 bg-card/50 opacity-60",
        size === "sm" ? "p-2" : "p-3",
      )}
    >
      <span className={cn("mb-1", size === "sm" ? "text-2xl" : "text-3xl")}>
        {isEarned ? achievement.icon : "🔒"}
      </span>
      <span
        className={cn(
          "font-bangers tracking-wide text-foreground leading-tight",
          size === "sm" ? "text-xs" : "text-sm",
        )}
      >
        {name}
      </span>
      <span className="text-[10px] font-inter text-muted-foreground mt-0.5">{desc}</span>
      {isEarned && earnedAt ? (
        <span className="text-[10px] font-inter text-secondary mt-1">
          {new Date(earnedAt).toLocaleDateString()}
        </span>
      ) : (
        <span className="text-[10px] font-inter text-primary mt-1">+{achievement.xpReward} XP</span>
      )}
    </button>
  );
}
