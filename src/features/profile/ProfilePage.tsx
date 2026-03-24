import { useState } from "react";
import { PageLayout } from "@/components/layout";
import { Container } from "@/components/shared/Container";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useAuth } from "@/contexts/auth";
import { useLanguage } from "@/contexts/language";
import { ProfileHero, EditProfileDialog } from "./components";
import { WidgetGrid } from "@/features/dashboard/components";
import { Separator } from "@/components/ui/separator";
import { FeedbackCTA } from "@/components/shared/FeedbackCTA";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useEffect } from "react";

function ProfileContent() {
  const { user, profile, refreshProfile } = useAuth();
  const { t } = useLanguage();
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    refreshProfile();
  }, []);

  if (!user || !profile) return null;

  return (
    <PageLayout>
      <ProfileHero />

      <Container size="default" className="py-8">
        {/* ☕ My Dashboard — Widget Grid */}
        <section>
          <h2 className="text-xl md:text-2xl font-bangers tracking-wide mb-4">☕ My Dashboard</h2>
          <WidgetGrid />
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
