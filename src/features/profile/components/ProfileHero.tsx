import { useState } from "react";
import { useAuth } from "@/contexts/auth";
import { ProfileAvatar } from "./ProfileAvatar";
import { getTribeDefinition, type CoffeeTribe } from "@/features/quiz";
import { getTribeCoverStyle } from "../utils/tribeCoverStyles";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import caldiLogo from "/lovable-uploads/8e78a6bd-5f00-45be-b082-c35b57fa9a7c.png";

export function ProfileHero() {
  const { user, profile, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempCity, setTempCity] = useState("");
  const [saving, setSaving] = useState(false);

  if (!user || !profile) return null;

  const tribe = profile.coffee_tribe as CoffeeTribe | null;
  const tribeDef = tribe ? getTribeDefinition(tribe) : null;
  const coverStyle = getTribeCoverStyle(tribe);

  const startEdit = () => {
    setTempName(profile.display_name || "");
    setTempCity(profile.city || "");
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const saveEdit = async () => {
    if (!tempName.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: tempName.trim(),
        city: tempCity.trim() || null,
      })
      .eq("id", user.id);

    if (error) {
      toast.error("Failed to save profile");
    } else {
      await refreshProfile();
      toast.success("Profile saved!");
      setIsEditing(false);
    }
    setSaving(false);
  };

  return (
    <div className="md:hidden w-full">
      {/* Cover gradient with SVG pattern */}
      <div
        className="relative w-full h-[65vh] flex items-center justify-center overflow-hidden"
        style={{ background: coverStyle.gradient }}
      >
        {/* SVG pattern overlay */}
        {coverStyle.patternSvg && (
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: coverStyle.patternSvg, backgroundRepeat: "repeat" }}
          />
        )}

        {/* Caldi watermark */}
        <img
          src={caldiLogo}
          alt=""
          aria-hidden
          className="h-20 object-contain opacity-30 select-none pointer-events-none"
        />
      </div>

      {/* White content card overlapping cover */}
      <div className="bg-background rounded-t-3xl -mt-10 relative z-10 px-5 pt-0 pb-2">
        {/* Avatar overlapping the boundary */}
        <div className="-mt-16">
          <ProfileAvatar
            avatarUrl={profile.avatar_url}
            displayName={profile.display_name}
            email={user.email}
            variant="circle"
            className="w-28 h-28"
            showOverlayAlways={isEditing}
          />
        </div>

        {/* Identity + edit toggle */}
        <div className="flex items-start justify-between pt-3 pb-4">
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Your name"
                  className="text-xl font-bold !border-2"
                  style={{ fontFamily: "'Bangers', cursive" }}
                  autoFocus
                />
                <Input
                  value={tempCity}
                  onChange={(e) => setTempCity(e.target.value)}
                  placeholder="City (optional)"
                  className="!border-2"
                />
              </div>
            ) : (
              <>
                <h1 className="text-2xl truncate">
                  {profile.display_name || "Coffee Lover"}
                </h1>
                <p className="text-sm text-muted-foreground truncate">
                  {user.email}
                </p>
              </>
            )}

            {tribeDef && !isEditing && (
              <p className="text-sm text-muted-foreground mt-1">
                <span className="mr-1">{tribeDef.emoji}</span>
                {tribeDef.name} — {tribeDef.title}
              </p>
            )}
          </div>

          {/* Pencil / Save+Cancel buttons */}
          <div className="flex items-center gap-1 ml-2 pt-1">
            {isEditing ? (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={cancelEdit}
                  disabled={saving}
                  className="h-9 w-9"
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  onClick={saveEdit}
                  disabled={saving}
                  className="h-9 w-9"
                >
                  <Check className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button
                size="icon"
                variant="ghost"
                onClick={startEdit}
                className="h-9 w-9"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
