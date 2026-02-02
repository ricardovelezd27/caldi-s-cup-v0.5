import { DashboardSidebar, WidgetGrid } from "./components";
import { Skeleton } from "@/components/ui/skeleton";
import { PageLayout } from "@/components/layout";
import { RequireOnboarding } from "@/components/auth";

function DashboardContent() {
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

function DashboardLoadingSkeleton() {
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

export function DashboardPage() {
  return (
    <RequireOnboarding loadingFallback={<DashboardLoadingSkeleton />}>
      <DashboardContent />
    </RequireOnboarding>
  );
}
