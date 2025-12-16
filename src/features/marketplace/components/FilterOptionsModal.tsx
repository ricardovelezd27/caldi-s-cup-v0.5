import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterOptionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  options: FilterOption[];
  selectedIds: string[];
  onApply: (ids: string[]) => void;
  showSearch?: boolean;
  searchPlaceholder?: string;
}

/**
 * Reusable modal for extended filtering with search and multi-select
 */
export function FilterOptionsModal({
  open,
  onOpenChange,
  title,
  options,
  selectedIds,
  onApply,
  showSearch = true,
  searchPlaceholder = "Search...",
}: FilterOptionsModalProps) {
  const [search, setSearch] = useState("");
  const [localSelection, setLocalSelection] = useState<string[]>(selectedIds);

  // Reset local selection when modal opens
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setLocalSelection(selectedIds);
      setSearch("");
    }
    onOpenChange(isOpen);
  };

  // Filter options by search term
  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const searchLower = search.toLowerCase();
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchLower)
    );
  }, [options, search]);

  const toggleOption = (optionId: string) => {
    setLocalSelection((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleApply = () => {
    onApply(localSelection);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleClearAll = () => {
    setLocalSelection([]);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl border-4 border-border shadow-[4px_4px_0px_0px_hsl(var(--border))]">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">{title}</DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        {showSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 border-4 border-border shadow-[4px_4px_0px_0px_hsl(var(--border))]"
            />
          </div>
        )}

        {/* Selection count */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {localSelection.length} selected
          </span>
          {localSelection.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-muted-foreground hover:text-foreground h-auto py-1"
            >
              Clear selection
            </Button>
          )}
        </div>

        {/* Options Grid */}
        <ScrollArea className="h-64 pr-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {filteredOptions.map((option) => (
              <div
                key={option.id}
                className="flex items-start gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  id={`modal-option-${option.id}`}
                  checked={localSelection.includes(option.id)}
                  onCheckedChange={() => toggleOption(option.id)}
                />
                <Label
                  htmlFor={`modal-option-${option.id}`}
                  className="text-sm font-normal cursor-pointer leading-tight"
                >
                  {option.label}
                  {option.count !== undefined && (
                    <span className="block text-xs text-muted-foreground">
                      ({option.count} product{option.count !== 1 ? "s" : ""})
                    </span>
                  )}
                </Label>
              </div>
            ))}
          </div>
          {filteredOptions.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No options found matching "{search}"
            </p>
          )}
        </ScrollArea>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="border-4 border-border shadow-[4px_4px_0px_0px_hsl(var(--border))]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            className="border-4 border-border shadow-[4px_4px_0px_0px_hsl(var(--border))]"
          >
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
