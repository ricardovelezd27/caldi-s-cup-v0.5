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
