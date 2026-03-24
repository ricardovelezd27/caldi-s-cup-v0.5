import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout";
import { Container } from "@/components/shared/Container";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/auth";
import { useLanguage } from "@/contexts/language";
import {
  ProfileHero,
  FavoritesTable,
  InventoryTable,
  EditProfileDialog,
  ProfileStreakCard,
  ProfileDailyGoalCard,
  ProfileXPCard,
  ProfileFavoritesCard,
  ProfileInventoryCard,
} from "./components";
import { WidgetGrid } from "@/features/dashboard/components";
import { Separator } from "@/components/ui/separator";
import { FeedbackCTA } from "@/components/shared/FeedbackCTA";
import { Button } from "@/components/ui/button";
import { Pencil, RefreshCw } from "lucide-react";

function ProfileContent() {
  const { user, profile, refreshProfile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    refreshProfile();
  }, []);

  if (!user || !profile) return null;

  const handleRetakeQuiz = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.QUIZ_RESULT);
      localStorage.removeItem(STORAGE_KEYS.QUIZ_STATE);
    } catch {
      // Ignore
    }
    navigate("/quiz");
  };

  return (
    <PageLayout>
      <ProfileHero />

      <Container size="default" className="py-8">
        {/* 📊 Stats Row */}
        <section>
          <h2 className="text-xl md:text-2xl font-bangers tracking-wide mb-4 hidden md:block">📊 Your Stats</h2>
          <div className={isMobile ? "flex overflow-x-auto gap-3 pb-2 -mx-4 px-4 no-scrollbar" : "grid grid-cols-2 md:grid-cols-5 gap-4"}>
            <ProfileStreakCard compact={isMobile} />
            <ProfileDailyGoalCard compact={isMobile} />
            <ProfileXPCard compact={isMobile} />
            <ProfileFavoritesCard compact={isMobile} />
            <ProfileInventoryCard compact={isMobile} />
          </div>
        </section>

        <Separator className="my-8" />

        {/* ☕ My Dashboard — Widget Grid */}
        <section>
          <h2 className="text-xl md:text-2xl font-bangers tracking-wide mb-4">☕ My Dashboard</h2>
          <WidgetGrid />
        </section>

        <Separator className="my-8" />

        {/* Collections detail tables */}
        <section>
          <h2 className="text-xl md:text-2xl font-bangers tracking-wide mb-4">📦 Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FavoritesTable />
            <InventoryTable />
          </div>
        </section>

        <Separator className="my-8" />

        {/* ⚙️ Account & Settings */}
        <section className="w-full">
          <h2 className="text-xl md:text-2xl font-bangers tracking-wide mb-4">⚙️ Account & Settings</h2>
          <div className="flex flex-col gap-3 max-w-md">
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              {t("profile.editProfile") || "Edit Profile"}
            </Button>
            <Button variant="outline" onClick={handleRetakeQuiz}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {t("profile.retakeQuiz") || "Retake Coffee Quiz"}
            </Button>
          </div>
        </section>

        <div className="mt-12">
          <FeedbackCTA />
        </div>
      </Container>

      <EditProfileDialog open={editOpen} onOpenChange={setEditOpen} />
    </PageLayout>
  );
}

export function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileContent />
    </RequireAuth>
  );
}
