import { useLanguage } from "@/contexts/language";
import { PageLayout } from "@/components/layout";
import { LeagueLeaderboard } from "../components/gamification/LeagueLeaderboard";

export default function LeaderboardPage() {
  const { t } = useLanguage();

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-bangers text-4xl text-foreground tracking-wide mb-6 text-center">
          {t("learn.leaderboard.title")}
        </h1>
        <LeagueLeaderboard />
      </div>
    </PageLayout>
  );
}
