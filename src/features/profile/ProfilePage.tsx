import { useEffect } from "react";
import { PageLayout } from "@/components/layout";
import { Container } from "@/components/shared/Container";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useAuth } from "@/contexts/auth";
import { useLanguage } from "@/contexts/language";
import { ProfileHero, ProfileInfoForm, ChangePasswordForm, RetakeQuizSection, TribeSection, FavoritesTable, InventoryTable } from "./components";
import { Separator } from "@/components/ui/separator";
import { FeedbackCTA } from "@/components/shared/FeedbackCTA";

function ProfileContent() {
  const { user, profile, refreshProfile } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    refreshProfile();
  }, []);

  if (!user || !profile) return null;

  return (
    <PageLayout>
      <ProfileHero />

      <Container size="default" className="py-8">
        {/* Tribe + Profile Form side-by-side on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl md:text-2xl mb-3">{t("profile.tribeHeading")}</h2>
            <TribeSection tribe={profile.coffee_tribe} />
          </div>
          <div className="space-y-8">
            <ProfileInfoForm
              displayName={profile.display_name}
              city={profile.city ?? null}
              email={user.email || ""}
              userId={user.id}
            />
          </div>
        </div>

        <Separator className="my-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ChangePasswordForm />
          <RetakeQuizSection />
        </div>

        <Separator className="my-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8">
          <div className="order-1 md:order-2">
            <InventoryTable />
          </div>
          <div className="order-2 md:order-1">
            <FavoritesTable />
          </div>
        </div>

        <div className="mt-8 pb-8">
          <FeedbackCTA />
        </div>
      </Container>
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
