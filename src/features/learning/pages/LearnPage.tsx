import { useLanguage } from "@/contexts/language";
import { useAuth } from "@/contexts/auth";
import { PageLayout } from "@/components/layout";
import { TrackGrid } from "../components/track/TrackGrid";
import { StreakDisplay } from "../components/gamification/StreakDisplay";
import { DailyGoalRing } from "../components/gamification/DailyGoalRing";
import { useLearningTracks } from "../hooks/useLearningTracks";
import { useStreak } from "../hooks/useStreak";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/app";
import type { CoffeeTribe, LearningTrackId } from "../types";

const TRIBE_TRACK_MAP: Record<CoffeeTribe, LearningTrackId> = {
  fox: "history_culture",
  owl: "brewing_science",
  hummingbird: "bean_knowledge",
  bee: "sustainability",
};

export default function LearnPage() {
  const { t } = useLanguage();
  const { user, profile } = useAuth();
  const { tracks, progressMap, isLoading } = useLearningTracks();
  const { streak, dailyGoal } = useStreak();

  const recommendedTrackId = profile?.coffee_tribe
    ? TRIBE_TRACK_MAP[profile.coffee_tribe as CoffeeTribe]
    : undefined;

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-bangers text-4xl md:text-5xl text-foreground tracking-wide mb-2">
            {t("learn.title")}
          </h1>
          <p className="text-muted-foreground font-inter text-lg">
            {t("learn.subtitle")}
          </p>
        </div>

        {/* Gamification bar for logged-in users */}
        {user && (
          <div className="flex items-center justify-center gap-6 mb-8">
            <StreakDisplay currentStreak={streak?.currentStreak ?? 0} />
            <DailyGoalRing
              earnedXp={dailyGoal?.earnedXp ?? 0}
              goalXp={dailyGoal?.goalXp ?? 10}
            />
          </div>
        )}

        {/* Track Grid */}
        <TrackGrid
          tracks={tracks}
          progressMap={progressMap}
          recommendedTrackId={recommendedTrackId}
          isLoading={isLoading}
        />

        {/* Anonymous signup banner */}
        {!user && (
          <div className="mt-8 text-center">
            <Link
              to={ROUTES.auth}
              className="inline-block px-6 py-3 border-4 border-border rounded-lg bg-primary/10 text-foreground font-inter font-medium hover:bg-primary/20 transition-colors shadow-[4px_4px_0px_0px_hsl(var(--border))]"
            >
              {t("learn.signupBanner")}
            </Link>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
