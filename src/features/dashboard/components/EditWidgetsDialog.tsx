import { useState } from "react";
import { Settings, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getAvailableWidgets, type WidgetType } from "../widgets";

interface EditWidgetsDialogProps {
  existingTypes: WidgetType[];
  onAdd: (widgetType: WidgetType) => void;
  onRemove: (widgetType: WidgetType) => void;
  isAdding: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EditWidgetsDialog({ existingTypes, onAdd, onRemove, isAdding, onOpenChange }: EditWidgetsDialogProps) {
  const [open, setOpen] = useState(false);
  const availableWidgets = getAvailableWidgets();

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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Settings className="h-4 w-4" />
          Edit Widgets
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-bangers text-2xl tracking-wide">
            Edit Widgets
          </DialogTitle>
          <DialogDescription>
            Add or remove widgets from your dashboard
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 max-h-[400px] overflow-y-auto">
          {availableWidgets.map((meta) => {
            const isAdded = existingTypes.includes(meta.type);
            
            return (
              <div
                key={meta.type}
                className={`
                  p-4 rounded-lg border-4 text-left transition-all
                  ${isAdded 
                    ? "border-secondary/50 bg-secondary/10" 
                    : "border-border"
                  }
                `}
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
                {isAdded ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemove(meta.type)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Remove
                  </Button>
                ) : (
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
                )}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
