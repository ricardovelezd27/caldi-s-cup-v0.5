import type { WidgetType, WidgetRegistryEntry } from "./types";
import { WelcomeHeroWidget } from "./WelcomeHeroWidget";
import { CoffeeTribeWidget } from "./CoffeeTribeWidget";
import { QuickScanWidget } from "./QuickScanWidget";
import { WeeklyGoalWidget } from "./WeeklyGoalWidget";
import { BrewingLevelWidget } from "./BrewingLevelWidget";
import { RecentBrewsWidget } from "./RecentBrewsWidget";
import { RecentScansWidget } from "./RecentScansWidget";
import { FavoritesWidget } from "./FavoritesWidget";
import { InventoryWidget } from "./InventoryWidget";
import { RecommendationsWidget } from "./RecommendationsWidget";

/**
 * Registry of all available widget types and their components
 */
export const WIDGET_REGISTRY: Record<WidgetType, WidgetRegistryEntry> = {
  welcome_hero: {
    component: WelcomeHeroWidget,
    meta: {
      type: "welcome_hero",
      name: "Welcome Hero",
      description: "Personalized greeting with tribe info",
      defaultSize: { width: 2, height: 1 },
      icon: "👋",
    },
  },
  coffee_tribe: {
    component: CoffeeTribeWidget,
    meta: {
      type: "coffee_tribe",
      name: "Coffee Tribe",
      description: "Your coffee personality type",
      defaultSize: { width: 1, height: 1 },
      icon: "🦊",
    },
  },
  quick_scan: {
    component: QuickScanWidget,
    meta: {
      type: "quick_scan",
      name: "Quick Scan",
      description: "Start scanning a coffee bag",
      defaultSize: { width: 1, height: 1 },
      icon: "📱",
    },
  },
  weekly_goal: {
    component: WeeklyGoalWidget,
    meta: {
      type: "weekly_goal",
      name: "Weekly Goal",
      description: "Track your weekly brew goal",
      defaultSize: { width: 1, height: 1 },
      icon: "🎯",
    },
  },
  brewing_level: {
    component: BrewingLevelWidget,
    meta: {
      type: "brewing_level",
      name: "Brewing Level",
      description: "Your expertise progress",
      defaultSize: { width: 1, height: 1 },
      icon: "⭐",
    },
  },
  recent_brews: {
    component: RecentBrewsWidget,
    meta: {
      type: "recent_brews",
      name: "Recent Brews",
      description: "Your latest brewed coffees",
      defaultSize: { width: 2, height: 1 },
      minSize: { width: 1, height: 1 },
      icon: "☕",
    },
  },
  recent_scans: {
    component: RecentScansWidget,
    meta: {
      type: "recent_scans",
      name: "Recent Scans",
      description: "Your latest scanned coffees",
      defaultSize: { width: 1, height: 1 },
      icon: "📷",
    },
  },
  favorites: {
    component: FavoritesWidget,
    meta: {
      type: "favorites",
      name: "Favorites",
      description: "Your favorite coffee",
      defaultSize: { width: 1, height: 1 },
      icon: "❤️",
    },
  },
  inventory: {
    component: InventoryWidget,
    meta: {
      type: "inventory",
      name: "Inventory",
      description: "Coffees you have at home",
      defaultSize: { width: 1, height: 1 },
      icon: "📦",
    },
  },
  recommendations: {
    component: RecommendationsWidget,
    meta: {
      type: "recommendations",
      name: "Recommendations",
      description: "AI-powered suggestions",
      defaultSize: { width: 1, height: 1 },
      icon: "✨",
    },
  },
};

/**
 * Get list of all available widget types for "Add Widget" UI
 */
export function getAvailableWidgets() {
  return Object.values(WIDGET_REGISTRY).map((entry) => entry.meta);
}
