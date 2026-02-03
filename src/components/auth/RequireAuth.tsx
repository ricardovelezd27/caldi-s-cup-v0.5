import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth";

interface RequireAuthProps {
  /** Content to render if user is authenticated */
  children: ReactNode;
  /** Where to redirect if not authenticated (defaults to /auth) */
  fallbackPath?: string;
  /** Whether to require completed onboarding (quiz) */
  requireOnboarding?: boolean;
  /** Custom loading component */
  loadingFallback?: ReactNode;
}

/**
 * Route guard component that checks if the user is authenticated.
 * Optionally checks if onboarding (quiz) is complete.
 */
export function RequireAuth({
  children,
  fallbackPath = "/auth",
  requireOnboarding = false,
  loadingFallback,
}: RequireAuthProps) {
  const { user, profile, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state
  if (isLoading) {
    return loadingFallback ? (
      <>{loadingFallback}</>
    ) : (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Not authenticated - redirect to auth
  if (!user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check onboarding if required
  if (requireOnboarding && profile && !profile.coffee_tribe) {
    return <Navigate to="/quiz" replace />;
  }

  return <>{children}</>;
}
