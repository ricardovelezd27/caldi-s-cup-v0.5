import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";
import { Camera, Loader2 } from "lucide-react";
import caldiPlaceholder from "@/assets/characters/caldi-profile-placeholder.png";

interface ProfileAvatarProps {
  avatarUrl?: string | null;
  displayName?: string | null;
  email?: string;
  className?: string;
}

export function ProfileAvatar({ avatarUrl, displayName, email, className }: ProfileAvatarProps) {
  const { user, refreshProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const filePath = `${user.id}/avatar.${ext}`;

    setUploading(true);
    try {
      // Upload (upsert) the file
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Bust cache with timestamp
      const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      // Update profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      await refreshProfile();
      toast.success("Avatar updated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload avatar");
    } finally {
      setUploading(false);
      // Reset input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-md border-[4px] border-border cursor-pointer group p-3 bg-muted",
        className
      )}
      style={{ boxShadow: "4px 4px 0px 0px hsl(var(--border))" }}
      onClick={() => !uploading && fileInputRef.current?.click()}
    >
      <img
        src={avatarUrl || caldiPlaceholder}
        alt={displayName || "User avatar"}
        className="w-full h-auto object-contain"
      />

      {/* Upload overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 group-hover:bg-foreground/40 transition-colors">
        {uploading ? (
          <Loader2 className="h-8 w-8 text-primary-foreground animate-spin" />
        ) : (
          <Camera className="h-8 w-8 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
      />
    </div>
  );
}
