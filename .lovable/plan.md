

# Homogenize Coffee Profile Page Across All Entry Points

## Problem
When clicking a coffee from dashboard widgets (Recent Scans, Favorites, Inventory), the resulting Coffee Profile Page looks different from the scan-result version of the same page. The visual inconsistency comes from:
1. Inventory widget items are not clickable (no link to `/coffee/:id`)
2. Sections like Coffee Attributes, Flavor Notes, and Description silently hide when data is null instead of showing a "No data available" placeholder
3. The scan-result version shows extra sections (Match Score, Jargon Buster, "Scan Another") that disappear on the DB-fetched version, creating a jarring difference

## Solution
Ensure every coffee entry point links to the same `/coffee/:id` route AND that the profile page renders consistently regardless of how it was reached -- always showing all section headings with "No data available" fallbacks for missing fields.

## Changes

### 1. InventoryWidget -- Make items clickable
Wrap each inventory item in a `Link` to `/coffee/:id` so users can tap through to the profile page, matching the behavior of Recent Scans and Favorites widgets.

### 2. CoffeeAttributes -- Show placeholder when scores are null
Instead of returning `null` when all scores are missing, always render the "Coffee Attributes" card. Individual sliders show "No data available" when their value is null.

### 3. CoffeeFlavorNotes -- Show placeholder when empty
Instead of returning `null` when there are no flavor notes, render the card with a "No flavor notes detected" message.

### 4. CoffeeDescription -- Show placeholder when empty
Instead of returning `null`, render the section with "No description available" text.

### 5. CoffeeInfo -- Show fallbacks for missing fields
When origin, roast level, or other metadata fields are null, show "Unknown" or "Not specified" instead of hiding them entirely.

## Technical Details

### InventoryWidget.tsx (lines 62-85)
Wrap each item `div` in a `Link to={/coffee/${item.coffee?.id}}`:
```tsx
<Link
  key={item.id}
  to={`/coffee/${item.coffee?.id}`}
  className="p-2 rounded-lg border border-border bg-muted/30 text-center hover:bg-muted/50 transition-colors"
>
  {/* ...existing content... */}
</Link>
```

### CoffeeAttributes.tsx (lines 32-51)
Remove the early `return null` when `!hasAttributes`. Always render the card. Update `AttributeSlider` to show "No data" text when value is null:
```tsx
function AttributeSlider({ label, value, leftLabel, rightLabel }) {
  if (value === null) {
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium text-foreground">{label}</span>
          <span className="text-muted-foreground italic text-xs">No data available</span>
        </div>
      </div>
    );
  }
  // ...existing slider rendering
}
```

### CoffeeFlavorNotes.tsx (lines 11-14)
Replace the early `return null` with a placeholder:
```tsx
if (!coffee.flavorNotes || coffee.flavorNotes.length === 0) {
  return (
    <div className="border-4 border-border rounded-lg p-4 shadow-[...] bg-card space-y-3">
      <h3 className="font-bangers text-lg tracking-wide">Flavor Notes</h3>
      <p className="text-sm text-muted-foreground italic">No flavor notes detected for this coffee.</p>
    </div>
  );
}
```

### CoffeeDescription.tsx (lines 9-11)
Replace early `return null` with placeholder text:
```tsx
if (!coffee.description) {
  return (
    <div className="space-y-2">
      <h3 className="font-bangers text-lg tracking-wide">About This Coffee</h3>
      <p className="text-muted-foreground italic">No description available for this coffee.</p>
    </div>
  );
}
```

### CoffeeInfo.tsx (lines 44-48)
Always show origin line even when empty:
```tsx
<div className="flex items-center gap-2 text-muted-foreground">
  <MapPin className="h-4 w-4 shrink-0" />
  <span>{origin || "Origin not specified"}</span>
</div>
```

### Files Modified
1. `src/features/dashboard/widgets/InventoryWidget.tsx` -- make items clickable links
2. `src/features/coffee/components/CoffeeAttributes.tsx` -- always render, show "No data" per slider
3. `src/features/coffee/components/CoffeeFlavorNotes.tsx` -- show placeholder when empty
4. `src/features/coffee/components/CoffeeDescription.tsx` -- show placeholder when empty
5. `src/features/coffee/components/CoffeeInfo.tsx` -- show fallback for missing origin
