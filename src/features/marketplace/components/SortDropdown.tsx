import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortOption, SORT_OPTIONS } from "../types/api";

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

/**
 * Sort dropdown for marketplace browse page
 */
export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as SortOption)}>
      <SelectTrigger 
        className="w-[180px] border-4 border-border shadow-[4px_4px_0px_0px_hsl(var(--border))]"
        aria-label="Sort products by"
      >
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent className="border-4 border-border">
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
