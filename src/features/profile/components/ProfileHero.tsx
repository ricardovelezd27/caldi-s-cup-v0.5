import { useAuth } from "@/contexts/auth";
import { ProfileAvatar } from "./ProfileAvatar";
import { getTribeDefinition, type CoffeeTribe } from "@/features/quiz";
import caldiLogo from "/lovable-uploads/8e78a6bd-5f00-45be-b082-c35b57fa9a7c.png";

export function ProfileHero() {
  const { user, profile } = useAuth();

  if (!user || !profile) return null;

  const tribe = profile.coffee_tribe as CoffeeTribe | null;
  const tribeDef = tribe ? getTribeDefinition(tribe) : null;

  return (
    <div className="md:hidden w-full">
      {/* Cover banner */}
      <div
        className={`relative w-full h-[150px] flex items-center justify-center px-8 ${tribeDef?.bgClass ?? "bg-muted"}`}
      >
        <img
          src={caldiLogo}
          alt="Caldi's Cup"
          className="h-14 object-contain opacity-60"
        />
      </div>

      {/* Avatar overlapping cover */}
      <div className="px-4 -mt-14">
        <ProfileAvatar
          avatarUrl={profile.avatar_url}
          displayName={profile.display_name}
          email={user.email}
          variant="circle"
          className="w-28 h-28"
        />
      </div>

      {/* Name + Tribe tagline */}
      <div className="px-4 pt-3 pb-4">
        <h1 className="text-2xl">{profile.display_name || "Coffee Lover"}</h1>
        {tribeDef && (
          <p className="text-sm text-muted-foreground mt-1">
            <span className="mr-1">{tribeDef.emoji}</span>
            {tribeDef.name} — {tribeDef.title}
          </p>
        )}
      </div>
    </div>
  );
}
