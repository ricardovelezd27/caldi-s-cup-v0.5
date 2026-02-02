import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { useRole } from "@/hooks/useRole";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface RequireRoleProps {
  /** Roles that are allowed to access this content */
  roles: AppRole[];
  /** Content to render if user has required role */
  children: ReactNode;
  /** Where to redirect if role check fails (defaults to /dashboard) */
  fallbackPath?: string;
  /** Custom loading component */
  loadingFallback?: ReactNode;
}

/**
 * Route guard component that checks if the user has one of the required roles.
 * Redirects to fallbackPath if the user doesn't have the required role.
 */
export function RequireRole({
  roles,
  children,
  fallbackPath = "/dashboard",
  loadingFallback,
}: RequireRoleProps) {
  const { user, isLoading: authLoading } = useAuth();
  const { role, isLoading: roleLoading } = useRole();
  const location = useLocation();

  // Show loading state
  if (authLoading || roleLoading) {
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
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check if user has one of the required roles
  const hasRequiredRole = role && roles.includes(role);

  if (!hasRequiredRole) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}

/**
 * Component that only renders children if user has specified role.
 * Does not redirect - just hides content.
 */
export function ShowForRole({
  roles,
  children,
  fallback = null,
}: {
  roles: AppRole[];
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { role, isLoading } = useRole();

  if (isLoading) return null;

  const hasRole = role && roles.includes(role);
  return hasRole ? <>{children}</> : <>{fallback}</>;
}
