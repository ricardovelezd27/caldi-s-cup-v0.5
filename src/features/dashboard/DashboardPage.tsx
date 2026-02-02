import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { DashboardSidebar, WidgetGrid } from "./components";
import { Skeleton } from "@/components/ui/skeleton";
import { PageLayout } from "@/components/layout";
import { ROUTES } from "@/constants/app";

export function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate(ROUTES.auth, { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Show loading skeleton while auth is checking
  if (authLoading) {
    return (
      <PageLayout showFooter={false}>
        <div className="flex flex-1">
          <div className="hidden md:block w-64 border-r-4 border-border bg-card">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="flex-1 p-6">
            <div className="space-y-6">
              <Skeleton className="h-32 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <PageLayout showFooter={false}>
      <div className="flex flex-1">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <WidgetGrid />
          </div>
        </main>
      </div>
    </PageLayout>
  );
}
