import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/app";

interface RequireOnboardingProps {
  children: React.ReactNode;
  loadingFallback?: React.ReactNode;
}

/**
 * Route guard that ensures authenticated users have completed onboarding (quiz).
 * - Not authenticated → redirect to /auth
 * - Authenticated but not onboarded → redirect to /quiz
 * - Authenticated and onboarded → render children
 */
export function RequireOnboarding({ 
  children, 
  loadingFallback 
}: RequireOnboardingProps) {
  const { user, profile, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      loadingFallback ?? (
        <div className="min-h-screen flex items-center justify-center">
          <Skeleton className="h-8 w-48" />
        </div>
      )
    );
  }

  // Not authenticated - redirect to auth
  if (!user) {
    return <Navigate to={ROUTES.auth} state={{ from: location }} replace />;
  }

  // Authenticated but not onboarded - redirect to quiz
  if (!profile?.is_onboarded || !profile?.coffee_tribe) {
    return <Navigate to={ROUTES.quiz} state={{ from: location }} replace />;
  }

  // Authenticated and onboarded - render children
  return <>{children}</>;
}
