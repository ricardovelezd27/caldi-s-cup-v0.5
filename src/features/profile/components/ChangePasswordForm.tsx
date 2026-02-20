import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Lock, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/language";

const passwordSchema = z
  .object({
    password: z.string().min(6, "At least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export function ChangePasswordForm() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormData) => {
    const { error } = await supabase.auth.updateUser({ password: data.password });

    if (error) {
      toast.error(error.message || t("profile.passwordFailed"));
      return;
    }

    toast.success(t("profile.passwordUpdated"));
    reset();
    setOpen(false);
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex items-center gap-2 w-full text-left text-lg font-medium hover:text-primary transition-colors py-2">
        <Lock className="h-5 w-5" />
        {t("profile.changePassword")}
        <ChevronDown className={`h-4 w-4 ml-auto transition-transform ${open ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div>
            <Label htmlFor="password">{t("profile.newPassword")}</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && (
              <p className="text-destructive text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword">{t("profile.confirmPassword")}</Label>
            <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
            {errors.confirmPassword && (
              <p className="text-destructive text-xs mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" variant="outline" disabled={isSubmitting}>
            {isSubmitting ? t("profile.updatingPassword") : t("profile.updatePassword")}
          </Button>
        </form>
      </CollapsibleContent>
    </Collapsible>
  );
}
