import { Link } from "react-router-dom";
import { BookOpen, Target } from "lucide-react";
import { useLanguage } from "@/contexts/language";
import { useDailyGoal } from "@/features/learning/hooks/useDailyGoal";
import { useStreak } from "@/hooks/gamification/useStreak";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/app";
import type { WidgetComponentProps } from "./types";
import { WidgetCategoryTag } from "./WidgetCategoryTag";

export function LearningHubWidget({ widget }: WidgetComponentProps) {
  const { t } = useLanguage();
  const { goal } = useDailyGoal();
  const { streak } = useStreak();

  const preferredTrack = (widget.config as { preferredTrack?: string })?.preferredTrack;
  const learnUrl = preferredTrack ? `/learn/${preferredTrack}` : ROUTES.learn;

  const earnedXp = goal?.earnedXp ?? 0;
  const goalXp = goal?.goalXp ?? 10;
  const percentage = goalXp > 0 ? Math.min(Math.round((earnedXp / goalXp) * 100), 100) : 0;
  const isGoalAchieved = goalXp > 0 && earnedXp >= goalXp;

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative h-full overflow-hidden rounded-lg border-4 border-border bg-card p-0 shadow-[4px_4px_0px_0px_hsl(var(--border))]">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h3 className="font-bangers text-lg flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-secondary" />
          {t("widgets.learningHub")}
        </h3>
        <WidgetCategoryTag label={t("widgets.categoryLearn")} />
      </div>
      <div className="px-5 pb-5 flex flex-col items-center justify-center py-4">
        {/* Daily goal ring */}
        <div className="relative w-24 h-24">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
            <circle
              cx="50" cy="50" r={radius} fill="none"
              stroke={isGoalAchieved ? "hsl(var(--secondary))" : "hsl(var(--primary))"}
              strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Target className={`h-4 w-4 ${isGoalAchieved ? "text-secondary" : "text-primary"}`} />
            <span className="font-bangers text-sm text-foreground mt-0.5">
              {earnedXp}/{goalXp}
            </span>
            <span className="text-[10px] text-muted-foreground">XP</span>
          </div>
        </div>

        <p className="text-sm font-medium text-foreground mt-3">
          {t("widgets.dailyProgress")}
        </p>

        {isGoalAchieved && (
          <p className="text-xs text-secondary font-medium mt-1">
            {t("widgets.goalReached")}
          </p>
        )}

        {streak && streak.currentStreak > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            🔥 {streak.currentStreak} {t("widgets.dayStreak")}
          </p>
        )}

        <Button asChild variant="outline" size="sm" className="w-full text-xs gap-1.5 mt-4">
          <Link to={learnUrl}>{t("widgets.continueLearning")}</Link>
        </Button>
      </div>
    </div>
  );
}
