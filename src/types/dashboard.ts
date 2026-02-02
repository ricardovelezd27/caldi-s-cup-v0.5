import type { Database } from "@/integrations/supabase/types";

export type WidgetType = Database["public"]["Enums"]["widget_type"];

export interface WidgetPosition {
  row: number;
  col: number;
  width: number;
  height: number;
}

export interface WidgetConfig {
  title?: string;
  [key: string]: unknown;
}

export interface DashboardWidget {
  id: string;
  userId: string;
  widgetType: WidgetType;
  position: WidgetPosition;
  config: WidgetConfig;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Recipe {
  id: string;
  userId: string;
  coffeeId: string | null;
  name: string;
  description: string | null;
  brewMethod: string;
  waterTempCelsius: number | null;
  grindSize: string | null;
  ratio: string | null;
  brewTimeSeconds: number | null;
  steps: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

// Transform database row to frontend type
export function transformWidget(
  row: Database["public"]["Tables"]["dashboard_widgets"]["Row"]
): DashboardWidget {
  const defaultPosition: WidgetPosition = { row: 0, col: 0, width: 1, height: 1 };
  const parsedPosition = row.position as unknown as WidgetPosition | null;
  
  return {
    id: row.id,
    userId: row.user_id,
    widgetType: row.widget_type,
    position: parsedPosition ?? defaultPosition,
    config: (row.config as unknown as WidgetConfig) ?? {},
    isVisible: row.is_visible ?? true,
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? new Date().toISOString(),
  };
}

export function transformRecipe(
  row: Database["public"]["Tables"]["recipes"]["Row"]
): Recipe {
  return {
    id: row.id,
    userId: row.user_id,
    coffeeId: row.coffee_id,
    name: row.name,
    description: row.description,
    brewMethod: row.brew_method,
    waterTempCelsius: row.water_temp_celsius,
    grindSize: row.grind_size,
    ratio: row.ratio,
    brewTimeSeconds: row.brew_time_seconds,
    steps: row.steps ?? [],
    isPublic: row.is_public ?? false,
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? new Date().toISOString(),
  };
}
