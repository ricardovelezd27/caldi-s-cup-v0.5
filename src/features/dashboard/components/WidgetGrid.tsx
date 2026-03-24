import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useDashboardWidgets } from "@/hooks/useDashboardWidgets";
import { WIDGET_REGISTRY, type DashboardWidget, type WidgetType } from "../widgets";
import { WidgetWrapper } from "./WidgetWrapper";
import { EditWidgetsDialog } from "./EditWidgetsDialog";

export function WidgetGrid() {
  const [isEditing, setIsEditing] = useState(false);
  const { 
    visibleWidgets, 
    isLoading, 
    addWidget, 
    removeWidget,
    reorderWidgets,
  } = useDashboardWidgets();

  const handleAddWidget = async (widgetType: WidgetType) => {
    const meta = WIDGET_REGISTRY[widgetType].meta;
    await addWidget.mutateAsync({
      widgetType,
      position: { 
        row: Math.floor(visibleWidgets.length / 3), 
        col: visibleWidgets.length % 3, 
        width: meta.defaultSize.width, 
        height: meta.defaultSize.height 
      },
    });
  };

  const handleRemoveByType = async (widgetType: WidgetType) => {
    const widget = visibleWidgets.find((w) => w.widgetType === widgetType);
    if (widget) await removeWidget.mutateAsync(widget.id);
  };

  const handleReorder = (orderedIds: string[]) => {
    reorderWidgets.mutate(orderedIds);
  };

  const existingTypes = visibleWidgets.map((w) => w.widgetType);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Filter out widgets that are no longer registered (e.g. coffee_tribe, brewing_level)
  const registeredWidgets = visibleWidgets.filter((w) => WIDGET_REGISTRY[w.widgetType]);
  const heroWidget = registeredWidgets.find((w) => w.widgetType === "welcome_hero");
  const gridWidgets = registeredWidgets.filter((w) => w.widgetType !== "welcome_hero");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <EditWidgetsDialog 
          existingTypes={existingTypes}
          activeWidgets={visibleWidgets}
          onAdd={handleAddWidget}
          onRemove={handleRemoveByType}
          onReorder={handleReorder}
          isAdding={addWidget.isPending}
          onOpenChange={setIsEditing}
        />
        
      </div>

      {heroWidget && (
        <WidgetWrapper
          widget={heroWidget}
          isEditing={isEditing}
          onRemove={() => removeWidget.mutateAsync(heroWidget.id)}
        />
      )}

      {gridWidgets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gridWidgets.map((widget) => {
            const colSpan = widget.position.width >= 2 ? "md:col-span-2" : "";
            
            return (
              <div key={widget.id} className={colSpan}>
                <WidgetWrapper
                  widget={widget}
                  isEditing={isEditing}
                  onRemove={() => removeWidget.mutateAsync(widget.id)}
                />
              </div>
            );
          })}
        </div>
      ) : !heroWidget && (
        <div className="text-center py-12 border-4 border-dashed border-border rounded-lg">
          <p className="text-muted-foreground mb-4">
            No widgets yet. Add some to customize your dashboard!
          </p>
          <EditWidgetsDialog 
            existingTypes={existingTypes}
            activeWidgets={visibleWidgets}
            onAdd={handleAddWidget}
            onRemove={handleRemoveByType}
            onReorder={handleReorder}
            isAdding={addWidget.isPending}
            onOpenChange={setIsEditing}
          />
        </div>
      )}

    </div>
  );
}
