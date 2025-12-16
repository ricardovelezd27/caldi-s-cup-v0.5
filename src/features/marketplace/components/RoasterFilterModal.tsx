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

interface Roaster {
  id: string;
  name: string;
  productCount: number;
}

interface RoasterFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roasters: Roaster[];
  selectedRoasterIds: string[];
  onApply: (roasterIds: string[]) => void;
}

/**
 * Modal for extended roaster filtering with search and multi-select
 */
export function RoasterFilterModal({
  open,
  onOpenChange,
  roasters,
  selectedRoasterIds,
  onApply,
}: RoasterFilterModalProps) {
  const [search, setSearch] = useState("");
  const [localSelection, setLocalSelection] = useState<string[]>(selectedRoasterIds);

  // Reset local selection when modal opens
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setLocalSelection(selectedRoasterIds);
      setSearch("");
    }
    onOpenChange(isOpen);
  };

  // Filter roasters by search term
  const filteredRoasters = useMemo(() => {
    if (!search.trim()) return roasters;
    const searchLower = search.toLowerCase();
    return roasters.filter((roaster) =>
      roaster.name.toLowerCase().includes(searchLower)
    );
  }, [roasters, search]);

  const toggleRoaster = (roasterId: string) => {
    setLocalSelection((prev) =>
      prev.includes(roasterId)
        ? prev.filter((id) => id !== roasterId)
        : [...prev, roasterId]
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
          <DialogTitle className="font-heading text-2xl">Filter by Roaster</DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search roasters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 border-4 border-border shadow-[4px_4px_0px_0px_hsl(var(--border))]"
          />
        </div>

        {/* Selection count */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {localSelection.length} roaster{localSelection.length !== 1 ? "s" : ""} selected
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

        {/* Roaster Grid */}
        <ScrollArea className="h-64 pr-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {filteredRoasters.map((roaster) => (
              <div
                key={roaster.id}
                className="flex items-start gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  id={`modal-roaster-${roaster.id}`}
                  checked={localSelection.includes(roaster.id)}
                  onCheckedChange={() => toggleRoaster(roaster.id)}
                />
                <Label
                  htmlFor={`modal-roaster-${roaster.id}`}
                  className="text-sm font-normal cursor-pointer leading-tight"
                >
                  {roaster.name}
                  <span className="block text-xs text-muted-foreground">
                    ({roaster.productCount} product{roaster.productCount !== 1 ? "s" : ""})
                  </span>
                </Label>
              </div>
            ))}
          </div>
          {filteredRoasters.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No roasters found matching "{search}"
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
