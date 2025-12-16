import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductFilters } from "../types/api";
import { RoastLevel } from "@/types/coffee";

interface ActiveFilterChipsProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  availableRoasters: { id: string; name: string }[];
  priceRange: [number, number];
}

/**
 * Displays active filter chips that can be clicked to remove individual filters
 */
export function ActiveFilterChips({
  filters,
  onFiltersChange,
  availableRoasters,
  priceRange,
}: ActiveFilterChipsProps) {
  const roasterNameMap = new Map(availableRoasters.map((r) => [r.id, r.name]));

  const removeOrigin = (origin: string) => {
    onFiltersChange({
      ...filters,
      origins: filters.origins.filter((o) => o !== origin),
    });
  };

  const removeRoastLevel = (level: RoastLevel) => {
    onFiltersChange({
      ...filters,
      roastLevels: filters.roastLevels.filter((l) => l !== level),
    });
  };

  const removeGrind = (grind: string) => {
    onFiltersChange({
      ...filters,
      grinds: filters.grinds.filter((g) => g !== grind),
    });
  };

  const removeRoaster = (roasterId: string) => {
    onFiltersChange({
      ...filters,
      roasterIds: filters.roasterIds.filter((id) => id !== roasterId),
    });
  };

  const removeSearch = () => {
    onFiltersChange({
      ...filters,
      search: "",
    });
  };

  const removePriceRange = () => {
    onFiltersChange({
      ...filters,
      priceRange: priceRange,
    });
  };

  const clearAll = () => {
    onFiltersChange({
      search: "",
      origins: [],
      roastLevels: [],
      grinds: [],
      roasterIds: [],
      priceRange: priceRange,
    });
  };

  // Check if price range is modified
  const isPriceModified =
    filters.priceRange[0] > priceRange[0] ||
    filters.priceRange[1] < priceRange[1];

  // Count total active filters
  const totalFilters =
    filters.origins.length +
    filters.roastLevels.length +
    filters.grinds.length +
    filters.roasterIds.length +
    (filters.search ? 1 : 0) +
    (isPriceModified ? 1 : 0);

  if (totalFilters === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {/* Search chip */}
      {filters.search && (
        <FilterChip
          label={`Search: "${filters.search}"`}
          onRemove={removeSearch}
        />
      )}

      {/* Origin chips */}
      {filters.origins.map((origin) => (
        <FilterChip
          key={`origin-${origin}`}
          label={origin}
          category="Origin"
          onRemove={() => removeOrigin(origin)}
        />
      ))}

      {/* Roast level chips */}
      {filters.roastLevels.map((level) => (
        <FilterChip
          key={`roast-${level}`}
          label={level}
          category="Roast"
          onRemove={() => removeRoastLevel(level)}
        />
      ))}

      {/* Grind chips */}
      {filters.grinds.map((grind) => (
        <FilterChip
          key={`grind-${grind}`}
          label={grind}
          category="Grind"
          onRemove={() => removeGrind(grind)}
        />
      ))}

      {/* Roaster chips */}
      {filters.roasterIds.map((roasterId) => (
        <FilterChip
          key={`roaster-${roasterId}`}
          label={roasterNameMap.get(roasterId) || roasterId}
          category="Roaster"
          onRemove={() => removeRoaster(roasterId)}
        />
      ))}

      {/* Price range chip */}
      {isPriceModified && (
        <FilterChip
          label={`$${filters.priceRange[0]} - $${filters.priceRange[1]}`}
          category="Price"
          onRemove={removePriceRange}
        />
      )}

      {/* Clear all button */}
      {totalFilters > 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAll}
          className="text-muted-foreground hover:text-foreground h-7 px-2"
        >
          Clear all
        </Button>
      )}
    </div>
  );
}

interface FilterChipProps {
  label: string;
  category?: string;
  onRemove: () => void;
}

function FilterChip({ label, category, onRemove }: FilterChipProps) {
  return (
    <Badge
      variant="secondary"
      className="gap-1 pr-1 py-1 text-sm font-normal border-2 border-border"
    >
      {category && (
        <span className="text-muted-foreground">{category}:</span>
      )}
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="ml-1 p-0.5 rounded hover:bg-foreground/10 transition-colors"
        aria-label={`Remove ${category ? `${category}: ` : ""}${label} filter`}
      >
        <X className="w-3 h-3" />
      </button>
    </Badge>
  );
}
