import { useState } from "react";
import { Plus, Check } from "lucide-react";
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

interface AddWidgetDialogProps {
  existingTypes: WidgetType[];
  onAdd: (widgetType: WidgetType) => void;
  isAdding: boolean;
}

export function AddWidgetDialog({ existingTypes, onAdd, isAdding }: AddWidgetDialogProps) {
  const [open, setOpen] = useState(false);
  const availableWidgets = getAvailableWidgets();

  const handleAdd = (type: WidgetType) => {
    onAdd(type);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Widget
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-bangers text-2xl tracking-wide">
            Add Widget
          </DialogTitle>
          <DialogDescription>
            Choose a widget to add to your dashboard
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-3 mt-4 max-h-[400px] overflow-y-auto">
          {availableWidgets.map((meta) => {
            const isAdded = existingTypes.includes(meta.type);
            
            return (
              <button
                key={meta.type}
                onClick={() => !isAdded && handleAdd(meta.type)}
                disabled={isAdded || isAdding}
                className={`
                  p-4 rounded-lg border-4 text-left transition-all
                  ${isAdded 
                    ? "border-secondary/50 bg-secondary/10 cursor-not-allowed" 
                    : "border-border hover:border-primary hover:shadow-[4px_4px_0px_0px_hsl(var(--primary))] cursor-pointer"
                  }
                `}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{meta.icon}</span>
                  <span className="font-bangers text-lg tracking-wide">
                    {meta.name}
                  </span>
                  {isAdded && (
                    <Check className="h-4 w-4 text-secondary ml-auto" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {meta.description}
                </p>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
