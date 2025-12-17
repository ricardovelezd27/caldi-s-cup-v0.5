import type { CoffeeTribe } from "@/features/quiz/types/tribe";

export type BrewingLevel = "beginner" | "intermediate" | "expert";

export interface BrewLog {
  id: string;
  user_id: string;
  coffee_name: string;
  brew_method: string;
  brewed_at: string;
  rating: number | null;
  notes: string | null;
  created_at: string;
}

export interface FavoriteCoffee {
  id: string;
  user_id: string;
  coffee_name: string;
  roaster_name: string | null;
  brew_method: string | null;
  rating: number | null;
  image_url: string | null;
  added_at: string;
}

export interface DashboardProfile {
  id: string;
  display_name: string | null;
  coffee_tribe: CoffeeTribe | null;
  weekly_goal_target: number;
  brewing_level: BrewingLevel;
  is_onboarded: boolean;
}

export interface DashboardData {
  profile: DashboardProfile | null;
  recentBrews: BrewLog[];
  favorite: FavoriteCoffee | null;
  weeklyBrewCount: number;
  isLoading: boolean;
  error: Error | null;
}

export interface DashboardSidebarItem {
  label: string;
  icon: string;
  path: string;
  isActive?: boolean;
}
