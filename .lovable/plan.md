# Scanner Page Cleanup and Refinement

## Summary

Reduce clutter, improve clarity, and create consistency across the scanner page by merging components, updating copy, and making the tab selector match the language toggle style.

## Changes

### 1. Tab Selector -- Match Language Toggle Style

Replace the current `TabsList` / `TabsTrigger` with a custom pill-style toggle matching the language toggle in the user menu: rounded-full border, active tab gets `bg-primary text-primary-foreground`, inactive gets muted styling. Add a small label above it like "Mode" to give users context.

**Design standard to save**: All app toggle selectors (language, scan/manual mode, future toggles) use the same pill-style component: `border-2 border-border rounded-full`, active = `bg-primary text-primary-foreground`, inactive = `bg-background text-muted-foreground`.

### 2. Merge Tribe Box + Tips into One Compact Component

Remove the `ScanningTips` component from the page entirely. Redesign `TribeScannerPreview` as a simplified two-column card:

- **Column 1**: Tribe emoji, name (e.g. "The Owl"), and title (e.g. "The Optimizer")
- **Column 2**: A single sentence like: "Let's search for a coffee that reflects your character -- we're looking for coffees that are [tribe-specific descriptor]."

Tribe-specific descriptors:

- Fox: "rare, award-winning, and exclusive"
- Owl: "precise, traceable, and data-rich"
- Hummingbird: "experimental, surprising, and full of flavor adventure"
- Bee: "consistent, comforting, and reliably delicious"

### 3. Hide "Take Photo" Button on Desktop

In `ScanUploader`, use the existing `useIsMobile` hook. Only render the camera button (both in the empty state and in the multi-photo state) when on mobile.

### 4. Copy Updates (i18n `en.ts` and `es.ts`)


| Key                  | Old Value                                          | New Value                                                |
| -------------------- | -------------------------------------------------- | -------------------------------------------------------- |
| `scanner.subtitle`   | "Scan a coffee bag or add one manually"            | "Let's find out if this coffee is your kind of cup"      |
| `scanner.scanNow`    | "Scan Now"                                         | "Analyze My Coffee"                                      |
| `scanner.addAnother` | "Add side"                                         | "Add photo"                                              |
| `scanner.addUpTo4`   | "Add up to 4 photos of different sides of the bag" | "Add photos of the bag's labels -- only sides with info" |
| `scanner.tabScan`    | "Scan"                                             | "Scan Mode"                                              |
| `scanner.tabManual`  | "Add Manually"                                     | "Manual Mode"                                            |


Equivalent translations will be applied to `es.ts`.

### 5. Modify ScanningTips Import

Modify `ScanningTips` from the scanner page imports and the component index file. The component should not have boxes surrounding the tips as they are not buttons or CTAs, the scenning tips should remain, but the version about "Tips for the [tribe]" should be removed and just use tips for the scan. For mobile make these tips in a carrousel rotating every 3 seconds.

## Technical Details

### Files Modified

1. `src/features/scanner/ScannerPage.tsx` -- Replace TabsList with pill toggle, modify ScanningTips, keep simplified TribeScannerPreview
2. `**src/features/scanner/components/TribeScannerPreview.tsx**` -- Redesign to two-column layout with tribe descriptor sentence
3. `**src/features/scanner/components/ScanUploader.tsx**` -- Conditionally render camera buttons using `useIsMobile()`
4. `**src/i18n/en.ts**` -- Update copy strings
5. `**src/i18n/es.ts**` -- Update Spanish translations
6. `src/features/scanner/components/index.ts` -- Modify ScanningTips export if present