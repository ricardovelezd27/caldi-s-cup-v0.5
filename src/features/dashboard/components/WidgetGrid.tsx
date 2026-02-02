import { useState } from "react";
import { Link } from "react-router-dom";
import { ScanLine, Settings, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboardWidgets } from "@/hooks/useDashboardWidgets";
import { WIDGET_REGISTRY, type DashboardWidget, type WidgetType } from "../widgets";
import { WidgetWrapper } from "./WidgetWrapper";
import { AddWidgetDialog } from "./AddWidgetDialog";
import { ROUTES } from "@/constants/app";

export function WidgetGrid() {
  const [isEditing, setIsEditing] = useState(false);
  const { 
    visibleWidgets, 
    isLoading, 
    addWidget, 
    removeWidget,
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

  const handleRemoveWidget = async (widget: DashboardWidget) => {
    await removeWidget.mutateAsync(widget.id);
  };

  // Get existing widget types to prevent duplicates
  const existingTypes = visibleWidgets.map((w) => w.widgetType);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Group widgets by their intended layout
  // welcome_hero spans full width, others go in grid
  const heroWidget = visibleWidgets.find((w) => w.widgetType === "welcome_hero");
  const gridWidgets = visibleWidgets.filter((w) => w.widgetType !== "welcome_hero");

  return (
    <div className="space-y-6">
      {/* Edit Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AddWidgetDialog 
            existingTypes={existingTypes}
            onAdd={handleAddWidget}
            isAdding={addWidget.isPending}
          />
          <Button
            variant={isEditing ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Settings className="h-4 w-4 mr-2" />
            {isEditing ? "Done" : "Edit"}
          </Button>
        </div>
        
        {/* Scan FAB for mobile - in controls for desktop */}
        <Button asChild size="sm" className="hidden md:flex">
          <Link to={ROUTES.scanner}>
            <ScanLine className="h-4 w-4 mr-2" />
            Scan Coffee
          </Link>
        </Button>
      </div>

      {/* Hero Widget (full width) */}
      {heroWidget && (
        <WidgetWrapper
          widget={heroWidget}
          isEditing={isEditing}
          onRemove={() => handleRemoveWidget(heroWidget)}
        />
      )}

      {/* Widget Grid */}
      {gridWidgets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gridWidgets.map((widget) => {
            // Determine column span based on widget size
            const colSpan = widget.position.width >= 2 ? "md:col-span-2" : "";
            
            return (
              <div key={widget.id} className={colSpan}>
                <WidgetWrapper
                  widget={widget}
                  isEditing={isEditing}
                  onRemove={() => handleRemoveWidget(widget)}
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
          <AddWidgetDialog 
            existingTypes={existingTypes}
            onAdd={handleAddWidget}
            isAdding={addWidget.isPending}
          />
        </div>
      )}

      {/* Floating Action Button - Mobile only */}
      <Link to={ROUTES.scanner} className="md:hidden">
        <Button
          size="lg"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          <ScanLine className="h-6 w-6" />
          <span className="sr-only">Scan Coffee</span>
        </Button>
      </Link>
    </div>
  );
}
