import type { Database } from "@/integrations/supabase/types";
import type { ComponentType } from "react";

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

/**
 * Props passed to every widget component
 */
export interface WidgetComponentProps {
  widget: DashboardWidget;
  isEditing?: boolean;
  onRemove?: () => void;
}

/**
 * Widget metadata for the registry
 */
export interface WidgetMeta {
  type: WidgetType;
  name: string;
  description: string;
  defaultSize: { width: number; height: number };
  minSize?: { width: number; height: number };
  maxSize?: { width: number; height: number };
  icon: string;
}

/**
 * Widget registry entry
 */
export interface WidgetRegistryEntry {
  component: ComponentType<WidgetComponentProps>;
  meta: WidgetMeta;
}

/**
 * Transform database row to DashboardWidget type
 */
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
