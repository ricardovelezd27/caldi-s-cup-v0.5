import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import { transformWidget, type DashboardWidget, type WidgetPosition, type WidgetConfig } from "@/types/dashboard";
import type { Database, Json } from "@/integrations/supabase/types";

type WidgetType = Database["public"]["Enums"]["widget_type"];

export function useDashboardWidgets() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: widgets = [], isLoading, error } = useQuery({
    queryKey: ["dashboard-widgets", user?.id],
    queryFn: async (): Promise<DashboardWidget[]> => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("dashboard_widgets")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return (data ?? []).map(transformWidget);
    },
    enabled: !!user?.id,
  });

  const addWidget = useMutation({
    mutationFn: async ({
      widgetType,
      position,
      config,
    }: {
      widgetType: WidgetType;
      position?: Partial<WidgetPosition>;
      config?: WidgetConfig;
    }) => {
      if (!user?.id) throw new Error("Not authenticated");

      const insertData = {
        user_id: user.id,
        widget_type: widgetType,
        position: (position ?? { row: 0, col: 0, width: 1, height: 1 }) as Json,
        config: (config ?? {}) as Json,
      };

      const { data, error } = await supabase
        .from("dashboard_widgets")
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;
      return transformWidget(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-widgets", user?.id] });
    },
  });

  const updateWidget = useMutation({
    mutationFn: async ({
      id,
      position,
      config,
      isVisible,
    }: {
      id: string;
      position?: WidgetPosition;
      config?: WidgetConfig;
      isVisible?: boolean;
    }) => {
      const updates: Record<string, unknown> = {};
      if (position !== undefined) updates.position = position;
      if (config !== undefined) updates.config = config;
      if (isVisible !== undefined) updates.is_visible = isVisible;

      const { data, error } = await supabase
        .from("dashboard_widgets")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return transformWidget(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-widgets", user?.id] });
    },
  });

  const removeWidget = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("dashboard_widgets")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-widgets", user?.id] });
    },
  });

  const toggleVisibility = useMutation({
    mutationFn: async ({ id, isVisible }: { id: string; isVisible: boolean }) => {
      const { error } = await supabase
        .from("dashboard_widgets")
        .update({ is_visible: isVisible })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-widgets", user?.id] });
    },
  });

  return {
    widgets,
    visibleWidgets: widgets.filter((w) => w.isVisible),
    isLoading,
    error,
    addWidget,
    updateWidget,
    removeWidget,
    toggleVisibility,
  };
}
