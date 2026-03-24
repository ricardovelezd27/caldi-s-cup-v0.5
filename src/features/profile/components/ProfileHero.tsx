import { useState } from "react";
import { useAuth } from "@/contexts/auth";
import { ProfileAvatar } from "./ProfileAvatar";
import { EditProfileDialog } from "./EditProfileDialog";
import { getTribeCoverStyle } from "../utils/tribeCoverStyles";
import type { CoffeeTribe } from "@/features/quiz";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useLanguage } from "@/contexts/language";
import caldiLogo from "/lovable-uploads/8e78a6bd-5f00-45be-b082-c35b57fa9a7c.png";

export function ProfileHero() {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const [editOpen, setEditOpen] = useState(false);

  if (!user || !profile) return null;

  const tribe = profile.coffee_tribe as CoffeeTribe | null;
  const coverStyle = getTribeCoverStyle(tribe);
  const hasCoverImage = !!profile.cover_url;

  return (
    <div className="w-full">
      {/* Cover */}
      <div
        className="relative w-full h-[200px] md:h-[250px] flex items-center justify-center overflow-hidden"
        style={{ background: hasCoverImage ? undefined : coverStyle.gradient }}
      >
        {hasCoverImage && (
          <img
            src={profile.cover_url!}
            alt="Cover"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {!hasCoverImage && coverStyle.patternSvg && (
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: coverStyle.patternSvg, backgroundRepeat: "repeat" }}
          />
        )}

        {!hasCoverImage && (
          <img
            src={caldiLogo}
            alt=""
            aria-hidden
            className="h-20 object-contain opacity-30 select-none pointer-events-none"
          />
        )}
      </div>

      {/* Content card overlapping cover */}
      <div className="bg-background rounded-t-3xl md:rounded-none -mt-10 md:-mt-0 relative z-10 md:pt-4">
        <div className="max-w-5xl mx-auto px-5 md:px-4">
          <div className="flex flex-col items-center text-center md:flex-row md:items-end md:text-left gap-0 md:gap-6">
            <div className="-mt-16 md:-mt-16 shrink-0">
              <ProfileAvatar
                avatarUrl={profile.avatar_url}
                displayName={profile.display_name}
                email={user.email}
                variant="circle"
                className="w-28 h-28 md:w-32 md:h-32 border-4 border-background"
                onClick={() => setEditOpen(true)}
              />
            </div>

            <div className="flex-1 min-w-0 pt-3 md:pt-0 md:pb-4">
              <div className="flex items-center justify-center md:justify-start gap-1">
                <h1 className="text-2xl md:text-3xl truncate">
                  {profile.display_name || t("profile.coffeeLover")}
                </h1>
                <Button size="icon" variant="ghost" onClick={() => setEditOpen(true)} className="h-9 w-9 shrink-0">
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              {profile.city && (
                <p className="text-sm text-muted-foreground truncate text-center md:text-left">
                  📍 {profile.city}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <EditProfileDialog open={editOpen} onOpenChange={setEditOpen} />
    </div>
  );
}
