import { PageLayout } from "@/components/layout";
import { AchievementGrid } from "../components/gamification/AchievementGrid";
import { useLanguage } from "@/contexts/language";

export default function AchievementsPage() {
  const { t } = useLanguage();

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <AchievementGrid />
      </div>
    </PageLayout>
  );
}
