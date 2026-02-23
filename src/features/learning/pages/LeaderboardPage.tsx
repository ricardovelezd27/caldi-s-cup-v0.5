import { useLanguage } from "@/contexts/language";
import { PageLayout } from "@/components/layout";
import { MascotReaction } from "../components/mascot/MascotReaction";

export default function LeaderboardPage() {
  const { t } = useLanguage();

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-bangers text-4xl text-foreground tracking-wide mb-4">
          {t("learn.leaderboard.title")}
        </h1>
        <p className="text-muted-foreground font-inter mb-8">
          {t("learn.leaderboard.subtitle")}
        </p>
        <MascotReaction
          mascot="caldi"
          mood="thinking"
          dialogue={t("learn.leaderboard.comingSoon")}
        />
      </div>
    </PageLayout>
  );
}
