import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { useDashboardData } from "./hooks/useDashboardData";
import {
  DashboardSidebar,
  WelcomeHero,
  UserTypeCard,
  RecentBrewsCard,
  FavoriteCoffeeCard,
  WeeklyGoalCard,
  BrewingLevelCard,
} from "./components";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/app";

export function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { profile, recentBrews, favorite, weeklyBrewCount, isLoading } = useDashboardData();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate(ROUTES.auth, { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Show loading skeleton while auth is checking
  if (authLoading || isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <div className="w-64 border-r-4 border-border bg-card">
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
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
          {/* Welcome Hero */}
          <WelcomeHero
            displayName={profile?.display_name}
            tribe={profile?.coffee_tribe ?? null}
          />

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* User Type Card - spans 1 column */}
            <UserTypeCard tribe={profile?.coffee_tribe ?? null} />

            {/* Recent Brews - spans 2 columns on large screens */}
            <div className="md:col-span-1 lg:col-span-2">
              <RecentBrewsCard brews={recentBrews} />
            </div>

            {/* Favorite Coffee */}
            <FavoriteCoffeeCard favorite={favorite} />

            {/* Weekly Goal */}
            <WeeklyGoalCard
              currentCount={weeklyBrewCount}
              targetCount={profile?.weekly_goal_target ?? 10}
            />

            {/* Brewing Level */}
            <BrewingLevelCard level={profile?.brewing_level ?? "beginner"} />
          </div>
        </div>
      </main>
    </div>
  );
}
