import { X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DashboardWidget, WidgetComponentProps } from "../widgets/types";
import { WIDGET_REGISTRY } from "../widgets/widgetRegistry";

interface WidgetWrapperProps {
  widget: DashboardWidget;
  isEditing: boolean;
  onRemove: () => void;
}

export function WidgetWrapper({ widget, isEditing, onRemove }: WidgetWrapperProps) {
  const registryEntry = WIDGET_REGISTRY[widget.widgetType];
  
  if (!registryEntry) {
    return (
      <div className="p-4 border-4 border-destructive/50 rounded-lg bg-destructive/10">
        <p className="text-sm text-destructive">
          Unknown widget type: {widget.widgetType}
        </p>
      </div>
    );
  }

  const WidgetComponent = registryEntry.component;
  const props: WidgetComponentProps = {
    widget,
    isEditing,
    onRemove,
  };

  return (
    <div className="relative h-full group">
      {/* Edit mode overlay */}
      {isEditing && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 bg-card/90 hover:bg-destructive hover:text-destructive-foreground"
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="cursor-grab h-6 w-6 flex items-center justify-center bg-card/90 rounded">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}

      <WidgetComponent {...props} />
    </div>
  );
}
