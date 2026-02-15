import { PageLayout } from "@/components/layout";
import { Container } from "@/components/shared/Container";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useAuth } from "@/contexts/auth";
import { ProfileAvatar, ProfileInfoForm, ChangePasswordForm, TribeSection, FavoritesTable, InventoryTable } from "./components";
import { Separator } from "@/components/ui/separator";
import { FeedbackCTA } from "@/components/shared/FeedbackCTA";

function ProfileContent() {
  const { user, profile } = useAuth();

  if (!user || !profile) return null;

  return (
    <PageLayout>
      <Container size="default" className="py-8">
        <h1 className="text-3xl md:text-4xl mb-8">My Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          {/* Left column — avatar + tribe */}
          <div className="space-y-6">
            <ProfileAvatar
              avatarUrl={profile.avatar_url}
              displayName={profile.display_name}
              email={user.email}
            />
            {/* Tribe always under avatar */}
            <div>
              <h2 className="text-xl md:text-2xl mb-3">You experience coffee like...</h2>
              <TribeSection tribe={profile.coffee_tribe} />
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-8">
            <ProfileInfoForm
              displayName={profile.display_name}
              city={profile.city ?? null}
              email={user.email || ""}
              userId={user.id}
            />

            <Separator />

            <ChangePasswordForm />
          </div>
        </div>

        <Separator className="my-8" />

        {/* Mobile: Inventory first, then Favorites. Desktop: side-by-side */}
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
