import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

const profileSchema = z.object({
  display_name: z.string().min(1, "Name is required").max(50),
  city: z.string().max(100).optional().or(z.literal("")),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileInfoFormProps {
  displayName: string | null;
  city: string | null;
  email: string;
  userId: string;
}

export function ProfileInfoForm({ displayName, city, email, userId }: ProfileInfoFormProps) {
  const { refreshProfile } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      display_name: displayName || "",
      city: city || "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: data.display_name,
        city: data.city || null,
      })
      .eq("id", userId);

    if (error) {
      toast.error("Failed to save profile");
      return;
    }

    await refreshProfile();
    toast.success("Profile saved!");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="display_name">Display Name</Label>
        <Input id="display_name" {...register("display_name")} />
        {errors.display_name && (
          <p className="text-destructive text-xs mt-1">{errors.display_name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={email} disabled className="opacity-60" />
        <p className="text-muted-foreground text-xs mt-1">Email cannot be changed</p>
      </div>

      <div>
        <Label htmlFor="city">City (optional)</Label>
        <Input id="city" placeholder="e.g. Barcelona" {...register("city")} />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        <Save className="mr-2 h-4 w-4" />
        {isSubmitting ? "Saving..." : "Save Profile"}
      </Button>
    </form>
  );
}
