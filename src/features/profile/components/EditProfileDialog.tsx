import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import { useLanguage } from "@/contexts/language";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Save, Lock, Camera, Loader2 } from "lucide-react";
import caldiPlaceholder from "@/assets/characters/caldi-profile-placeholder.png";

const editProfileSchema = z
  .object({
    display_name: z.string().trim().min(1, "Name is required").max(50),
    city: z.string().trim().max(100).optional().or(z.literal("")),
    newPassword: z.string().max(72).optional().or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .refine(
    (d) => {
      if (d.newPassword && d.newPassword.length > 0) return d.newPassword.length >= 8;
      return true;
    },
    { message: "Password must be at least 8 characters", path: ["newPassword"] }
  )
  .refine(
    (d) => {
      if (d.newPassword && d.newPassword.length > 0) return d.newPassword === d.confirmPassword;
      return true;
    },
    { message: "Passwords don't match", path: ["confirmPassword"] }
  );

type EditProfileFormData = z.infer<typeof editProfileSchema>;

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileDialog({ open, onOpenChange }: EditProfileDialogProps) {
  const { user, profile, refreshProfile } = useAuth();
  const { t } = useLanguage();

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      display_name: profile?.display_name || "",
      city: profile?.city || "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (open && profile) {
      reset({
        display_name: profile.display_name || "",
        city: profile.city || "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [open, profile, reset]);

  const handleImageUpload = async (
    file: File,
    pathSuffix: string,
    field: "avatar_url" | "cover_url",
    setLoading: (v: boolean) => void
  ) => {
    if (!user) return;
    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const filePath = `${user.id}/${pathSuffix}.${ext}`;

    setLoading(true);
    try {
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ [field]: publicUrl })
        .eq("id", user.id);
      if (updateError) throw updateError;

      await refreshProfile();
      toast.success(field === "avatar_url" ? "Avatar updated!" : t("profile.coverUpdated"));
    } catch (err: any) {
      toast.error(err.message || t("profile.failedSave"));
    } finally {
      setLoading(false);
    }
  };

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file, "avatar", "avatar_url", setUploadingAvatar);
    if (avatarInputRef.current) avatarInputRef.current.value = "";
  };

  const onCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file, "cover", "cover_url", setUploadingCover);
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  const onSubmit = async (data: EditProfileFormData) => {
    if (!user) return;

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ display_name: data.display_name, city: data.city || null })
      .eq("id", user.id);

    if (profileError) {
      toast.error(t("profile.failedSave"));
      return;
    }

    if (data.newPassword && data.newPassword.length > 0) {
      const { error: pwError } = await supabase.auth.updateUser({ password: data.newPassword });
      if (pwError) {
        toast.error(pwError.message || t("profile.passwordFailed"));
        return;
      }
    }

    await refreshProfile();
    toast.success(t("profile.profileSaved"));
    onOpenChange(false);
  };

  if (!user || !profile) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("profile.editProfile") ?? "Edit Profile"}</DialogTitle>
          <DialogDescription>
            {t("profile.editProfileDesc") ?? "Update your profile information."}
          </DialogDescription>
        </DialogHeader>

        {/* Photo upload section */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">{t("profile.photos") ?? "Photos"}</Label>
          <div className="flex items-end gap-4">
            {/* Avatar upload */}
            <button
              type="button"
              onClick={() => !uploadingAvatar && avatarInputRef.current?.click()}
              className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-border bg-muted shrink-0 group"
            >
              <img
                src={profile.avatar_url || caldiPlaceholder}
                alt="Avatar"
                className={`w-full h-full ${profile.avatar_url ? "object-cover" : "object-contain p-1"}`}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 group-hover:bg-foreground/40 transition-colors">
                {uploadingAvatar ? (
                  <Loader2 className="h-5 w-5 text-primary-foreground animate-spin" />
                ) : (
                  <Camera className="h-5 w-5 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
            </button>

            {/* Cover upload */}
            <button
              type="button"
              onClick={() => !uploadingCover && coverInputRef.current?.click()}
              className="relative flex-1 h-20 rounded-md overflow-hidden border-2 border-border bg-muted group"
            >
              {profile.cover_url ? (
                <img src={profile.cover_url} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                  {t("profile.addCover") ?? "Add cover"}
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 group-hover:bg-foreground/40 transition-colors">
                {uploadingCover ? (
                  <Loader2 className="h-5 w-5 text-primary-foreground animate-spin" />
                ) : (
                  <Camera className="h-5 w-5 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
            </button>
          </div>

          <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
          <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={onCoverChange} />
        </div>

        <Separator />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="edit-display-name">{t("profile.displayName")}</Label>
            <Input id="edit-display-name" {...register("display_name")} />
            {errors.display_name && (
              <p className="text-destructive text-xs mt-1">{errors.display_name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="edit-email">{t("profile.emailLabel")}</Label>
            <Input id="edit-email" value={user.email || ""} disabled className="opacity-60" />
            <p className="text-muted-foreground text-xs mt-1">{t("profile.emailNoChange")}</p>
          </div>

          <div>
            <Label htmlFor="edit-city">{t("profile.cityLabel")}</Label>
            <Input id="edit-city" placeholder={t("profile.cityPlaceholder")} {...register("city")} />
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{t("profile.changePassword")}</span>
            </div>

            <div>
              <Label htmlFor="edit-new-password">{t("profile.newPassword")}</Label>
              <Input id="edit-new-password" type="password" placeholder="••••••••" {...register("newPassword")} />
              {errors.newPassword && (
                <p className="text-destructive text-xs mt-1">{errors.newPassword.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="edit-confirm-password">{t("profile.confirmPassword")}</Label>
              <Input id="edit-confirm-password" type="password" placeholder="••••••••" {...register("confirmPassword")} />
              {errors.confirmPassword && (
                <p className="text-destructive text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <p className="text-muted-foreground text-xs">
              {t("profile.passwordOptionalHint") ?? "Leave blank to keep your current password."}
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? t("profile.savingProfile") : t("profile.saveProfile")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
