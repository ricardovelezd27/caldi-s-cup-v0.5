import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { AuthCard, LoginForm, SignupForm } from "@/components/auth";
import { ROUTES } from "@/constants/app";
import type { LoginFormData, SignupFormData } from "@/schemas/auth.schema";

type AuthMode = "login" | "signup";

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const { user, profile, isLoading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect authenticated users based on onboarding status
  useEffect(() => {
    if (user && !isLoading) {
      // If user hasn't completed onboarding (no coffee_tribe), go to quiz
      if (!profile?.is_onboarded || !profile?.coffee_tribe) {
        navigate(ROUTES.quiz, { replace: true });
      } else {
        // Onboarded users go to dashboard or where they came from
        const from = (location.state as { from?: string })?.from || ROUTES.dashboard;
        navigate(from, { replace: true });
      }
    }
  }, [user, profile, isLoading, navigate, location.state]);

  const handleLogin = async (data: LoginFormData) => {
    return signIn(data.email, data.password);
  };

  const handleSignup = async (data: SignupFormData) => {
    return signUp(data.email, data.password, data.displayName);
  };

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with logo */}
      <header className="py-4">
        <div className="container mx-auto px-4">
          <Link to={ROUTES.home} className="inline-block">
            <img
              alt="Caldi's Cup"
              className="h-10 md:h-12"
              src="/lovable-uploads/8e78a6bd-5f00-45be-b082-c35b57fa9a7c.png"
            />
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <AuthCard
          title={mode === "login" ? "Welcome Back" : "Join Caldi's Cup"}
          subtitle={
            mode === "login"
              ? "Sign in to your account"
              : "Create your account to get started"
          }
        >
          {mode === "login" ? (
            <LoginForm
              onSubmit={handleLogin}
              onSwitchToSignup={() => setMode("signup")}
            />
          ) : (
            <SignupForm
              onSubmit={handleSignup}
              onSwitchToLogin={() => setMode("login")}
            />
          )}
        </AuthCard>
      </main>
    </div>
  );
};

export default Auth;
