import { useState, useEffect } from "react";
import { Settings, Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { getAvailableWidgets, WIDGET_REGISTRY, type WidgetType } from "../widgets";
import type { DashboardWidget } from "../widgets/types";

interface EditWidgetsDialogProps {
  existingTypes: WidgetType[];
  activeWidgets: DashboardWidget[];
  onAdd: (widgetType: WidgetType) => void;
  onRemove: (widgetType: WidgetType) => void;
  onReorder: (orderedIds: string[]) => void;
  isAdding: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EditWidgetsDialog({
  existingTypes,
  activeWidgets,
  onAdd,
  onRemove,
  onReorder,
  isAdding,
  onOpenChange,
}: EditWidgetsDialogProps) {
  const [open, setOpen] = useState(false);
  const availableWidgets = getAvailableWidgets();

  // Local reorder state — only non-structural active widgets
  const [localOrder, setLocalOrder] = useState<DashboardWidget[]>([]);

  useEffect(() => {
    // Filter to only manageable (non-structural) widgets
    const manageable = activeWidgets.filter(
      (w) => w.widgetType !== "welcome_hero"
    );
    setLocalOrder(manageable);
  }, [activeWidgets]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  const handleAdd = (type: WidgetType) => {
    onAdd(type);
  };

  const handleRemove = (type: WidgetType) => {
    onRemove(type);
  };

  const moveWidget = (index: number, direction: "up" | "down") => {
    const newOrder = [...localOrder];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;

    [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
    setLocalOrder(newOrder);

    // Include structural widgets at the front, then reordered manageable ones
    const structuralIds = activeWidgets
      .filter((w) => w.widgetType === "welcome_hero")
      .map((w) => w.id);
    const orderedIds = [...structuralIds, ...newOrder.map((w) => w.id)];
    onReorder(orderedIds);
  };

  // Widgets not yet added
  const notAdded = availableWidgets.filter(
    (meta) => !existingTypes.includes(meta.type)
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Settings className="h-4 w-4" />
          Personalize Dashboard
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-bangers text-2xl tracking-wide">
            Personalize Dashboard
          </DialogTitle>
          <DialogDescription>
            Reorder, add, or remove widgets
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto space-y-4 mt-2">
          {/* Active Widgets — reorderable */}
          {localOrder.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-bangers text-lg tracking-wide text-foreground">
                Active Widgets
              </h3>
              <div className="space-y-2">
                {localOrder.map((widget, index) => {
                  const meta = WIDGET_REGISTRY[widget.widgetType]?.meta;
                  if (!meta) return null;

                  return (
                    <div
                      key={widget.id}
                      className="flex items-center gap-3 p-3 rounded-lg border-4 border-border bg-card"
                    >
                      {/* Reorder buttons */}
                      <div className="flex flex-col gap-0.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          disabled={index === 0}
                          onClick={() => moveWidget(index, "up")}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          disabled={index === localOrder.length - 1}
                          onClick={() => moveWidget(index, "down")}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Widget info */}
                      <span className="text-xl">{meta.icon}</span>
                      <span className="font-bangers text-base tracking-wide flex-1">
                        {meta.name}
                      </span>

                      {/* Remove */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemove(meta.type)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Separator */}
          {localOrder.length > 0 && notAdded.length > 0 && <Separator />}

          {/* Available Widgets */}
          {notAdded.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-bangers text-lg tracking-wide text-foreground">
                Available Widgets
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {notAdded.map((meta) => (
                  <div
                    key={meta.type}
                    className="p-4 rounded-lg border-4 border-border text-left"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{meta.icon}</span>
                      <span className="font-bangers text-lg tracking-wide">
                        {meta.name}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {meta.description}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      disabled={isAdding}
                      onClick={() => handleAdd(meta.type)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
