import { useLanguage } from "@/contexts/language";
import { useAchievements } from "../../hooks/useAchievements";
import { AchievementBadge } from "./AchievementBadge";

export function AchievementGrid() {
  const { t } = useLanguage();
  const { achievements, earned, earnedIds, earnedCount, totalCount } = useAchievements();

  const earnedMap = new Map(earned.map((e) => [e.achievementId, e.earnedAt]));

  const earnedAchs = achievements.filter((a) => earnedIds.has(a.id));
  const lockedAchs = achievements.filter((a) => !earnedIds.has(a.id));

  return (
    <div className="space-y-6">
      <h2 className="font-bangers text-2xl text-foreground tracking-wide">
        🏆 {t("learn.exercise.correct")} ({earnedCount}/{totalCount})
      </h2>

      {earnedAchs.length > 0 && (
        <div>
          <h3 className="font-inter font-bold text-sm text-foreground mb-2 uppercase tracking-wider">
            ✓ Earned
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {earnedAchs.map((a) => (
              <AchievementBadge
                key={a.id}
                achievement={a}
                isEarned
                earnedAt={earnedMap.get(a.id)}
              />
            ))}
          </div>
        </div>
      )}

      {lockedAchs.length > 0 && (
        <div>
          <h3 className="font-inter font-bold text-sm text-muted-foreground mb-2 uppercase tracking-wider">
            🔒 Locked
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {lockedAchs.map((a) => (
              <AchievementBadge key={a.id} achievement={a} isEarned={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
