import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { loginSchema, type LoginFormData } from "@/schemas/auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/language";

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<{ error: Error | null }>;
  onSwitchToSignup: () => void;
}

export const LoginForm = ({ onSubmit, onSwitchToSignup }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleFormSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await onSubmit(data);
      if (result.error) {
        const errorMessage = result.error.message;
        if (errorMessage.includes("Invalid login credentials")) {
          setError(t("auth.invalidCredentials"));
        } else if (errorMessage.includes("Email not confirmed")) {
          setError(t("auth.emailNotConfirmed"));
        } else {
          setError(errorMessage);
        }
      }
    } catch (err) {
      setError(t("auth.unexpectedError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">{t("auth.email")}</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register("email")}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{t("auth.password")}</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          {...register("password")}
          aria-invalid={!!errors.password}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("auth.signingIn")}
          </>
        ) : (
          t("auth.signIn")
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {t("auth.noAccount")}{" "}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="text-primary hover:underline font-medium"
        >
          {t("auth.signUp")}
        </button>
      </p>
    </form>
  );
};
