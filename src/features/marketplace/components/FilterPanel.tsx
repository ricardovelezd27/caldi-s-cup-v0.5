import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { RoastLevel } from "@/types/coffee";
import { ProductFilters, DEFAULT_FILTERS } from "../types/api";
import { formatGrind, formatRoastLevel } from "../utils/productFilters";
import { RoasterFilterModal } from "./RoasterFilterModal";

interface Roaster {
  id: string;
  name: string;
  productCount: number;
}

interface FilterPanelProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  availableOrigins: string[];
  availableGrinds: string[];
  availableRoasters: Roaster[];
  priceRange: [number, number];
}

const ROAST_LEVELS: RoastLevel[] = ["light", "medium", "dark"];
const TOP_ROASTERS_COUNT = 3;

/**
 * Filter panel component for marketplace browse page
 * Contains search, roaster, origin, roast level, grind, and price filters
 */
export function FilterPanel({
  filters,
  onFiltersChange,
  availableOrigins,
  availableGrinds,
  availableRoasters,
  priceRange,
}: FilterPanelProps) {
  const [roasterModalOpen, setRoasterModalOpen] = useState(false);

  const updateFilter = <K extends keyof ProductFilters>(
    key: K,
    value: ProductFilters[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = <K extends keyof ProductFilters>(
    key: K,
    value: string
  ) => {
    const current = filters[key] as string[];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateFilter(key, updated as ProductFilters[K]);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      ...DEFAULT_FILTERS,
      priceRange: priceRange, // Keep the actual price range
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.origins.length > 0 ||
    filters.roastLevels.length > 0 ||
    filters.grinds.length > 0 ||
    filters.roasterIds.length > 0 ||
    filters.priceRange[0] > priceRange[0] ||
    filters.priceRange[1] < priceRange[1];

  // Get top roasters for concise display
  const topRoasters = availableRoasters.slice(0, TOP_ROASTERS_COUNT);
  const hasMoreRoasters = availableRoasters.length > TOP_ROASTERS_COUNT;

  // Handle roaster modal apply
  const handleRoasterApply = (roasterIds: string[]) => {
    updateFilter("roasterIds", roasterIds);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Clear All */}
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search" className="font-medium">
          Search
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="search"
            type="text"
            placeholder="Search coffees..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-9 border-4 border-border shadow-[4px_4px_0px_0px_hsl(var(--border))]"
          />
        </div>
      </div>

      <Separator className="bg-border" />

      {/* Roaster Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="font-medium">Roaster</Label>
          {filters.roasterIds.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {filters.roasterIds.length} selected
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {topRoasters.map((roaster) => (
            <div key={roaster.id} className="flex items-center gap-2">
              <Checkbox
                id={`roaster-${roaster.id}`}
                checked={filters.roasterIds.includes(roaster.id)}
                onCheckedChange={() => toggleArrayFilter("roasterIds", roaster.id)}
              />
              <Label
                htmlFor={`roaster-${roaster.id}`}
                className="text-sm font-normal cursor-pointer"
              >
                {roaster.name}
              </Label>
            </div>
          ))}
        </div>
        {hasMoreRoasters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRoasterModalOpen(true)}
            className="text-primary hover:text-primary/80 p-0 h-auto font-medium"
          >
            More Options...
          </Button>
        )}
      </div>

      <Separator className="bg-border" />

      {/* Origin Filter */}
      <div className="space-y-3">
        <Label className="font-medium">Origin</Label>
        <div className="flex flex-col gap-2">
          {availableOrigins.map((origin) => (
            <div key={origin} className="flex items-center gap-2">
              <Checkbox
                id={`origin-${origin}`}
                checked={filters.origins.includes(origin)}
                onCheckedChange={() => toggleArrayFilter("origins", origin)}
              />
              <Label
                htmlFor={`origin-${origin}`}
                className="text-sm font-normal cursor-pointer"
              >
                {origin}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-border" />

      {/* Roast Level Filter */}
      <div className="space-y-3">
        <Label className="font-medium">Roast Level</Label>
        <div className="flex flex-col gap-2">
          {ROAST_LEVELS.map((level) => (
            <div key={level} className="flex items-center gap-2">
              <Checkbox
                id={`roast-${level}`}
                checked={filters.roastLevels.includes(level)}
                onCheckedChange={() => toggleArrayFilter("roastLevels", level)}
              />
              <Label
                htmlFor={`roast-${level}`}
                className="text-sm font-normal cursor-pointer capitalize"
              >
                {formatRoastLevel(level)}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-border" />

      {/* Grind Type Filter */}
      <div className="space-y-3">
        <Label className="font-medium">Grind Type</Label>
        <div className="flex flex-col gap-2">
          {availableGrinds.map((grind) => (
            <div key={grind} className="flex items-center gap-2">
              <Checkbox
                id={`grind-${grind}`}
                checked={filters.grinds.includes(grind)}
                onCheckedChange={() => toggleArrayFilter("grinds", grind)}
              />
              <Label
                htmlFor={`grind-${grind}`}
                className="text-sm font-normal cursor-pointer"
              >
                {formatGrind(grind)}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-border" />

      {/* Price Range Filter */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="font-medium">Price Range</Label>
          <span className="text-sm text-muted-foreground">
            ${filters.priceRange[0]} - ${filters.priceRange[1]}
          </span>
        </div>
        <Slider
          min={priceRange[0]}
          max={priceRange[1]}
          step={1}
          value={filters.priceRange}
          onValueChange={(value) =>
            updateFilter("priceRange", value as [number, number])
          }
          className="py-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      {/* Roaster Filter Modal */}
      <RoasterFilterModal
        open={roasterModalOpen}
        onOpenChange={setRoasterModalOpen}
        roasters={availableRoasters}
        selectedRoasterIds={filters.roasterIds}
        onApply={handleRoasterApply}
      />
    </div>
  );
}
