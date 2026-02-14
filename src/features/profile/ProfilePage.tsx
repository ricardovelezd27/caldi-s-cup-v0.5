import { PageLayout } from "@/components/layout";
import { Container } from "@/components/shared/Container";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useAuth } from "@/contexts/auth";
import { ProfileAvatar, ProfileInfoForm, ChangePasswordForm, TribeSection } from "./components";
import { Separator } from "@/components/ui/separator";

function ProfileContent() {
  const { user, profile } = useAuth();

  if (!user || !profile) return null;

  return (
    <PageLayout>
      <Container size="default" className="py-8">
        <h1 className="text-3xl md:text-4xl mb-8">My Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          {/* Left column */}
          <div className="space-y-6">
            <ProfileAvatar
              avatarUrl={profile.avatar_url}
              displayName={profile.display_name}
              email={user.email}
            />
            <TribeSection tribe={profile.coffee_tribe} />
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
