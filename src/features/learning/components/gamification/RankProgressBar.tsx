import { useLanguage } from "@/contexts/language";
import { useUserRank } from "@/features/gamification";
import { Progress } from "@/components/ui/progress";

export function RankProgressBar() {
  const { t } = useLanguage();
  const { currentRank, nextRank, progressToNext, xpNeeded, totalXP } = useUserRank();

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-lg">{currentRank.icon}</span>
          <span className="font-bangers text-sm text-foreground tracking-wide">
            {currentRank.name}
          </span>
        </div>
        {nextRank && (
          <div className="flex items-center gap-1.5">
            <span className="font-bangers text-sm text-muted-foreground tracking-wide">
              {nextRank.name}
            </span>
            <span className="text-lg">{nextRank.icon}</span>
          </div>
        )}
      </div>

      {nextRank ? (
        <>
          <Progress value={progressToNext} className="h-2.5" />
          <p className="text-xs font-inter text-muted-foreground text-center">
            {t("learn.rankProgress.xpToNext")
              .replace("{xp}", xpNeeded.toLocaleString())
              .replace("{rank}", nextRank.name)}
          </p>
        </>
      ) : (
        <p className="text-xs font-inter text-secondary font-medium text-center">
          ☕ {t("learn.rankProgress.maxRank")}
        </p>
      )}
    </div>
  );
}
