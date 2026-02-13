# Manual Add Coffee Feature

## Overview

Add a "Manual Add" option to the Scanner page so users can add coffees to the catalog without scanning. The form inserts into the existing `coffees` table with `source = 'manual'` and auto-creates a roaster entry if the brand doesn't already exist.

## Database Change

**Migration: Add `'manual'` to the `coffee_source` enum**

The current `coffee_source` enum only has `scan | admin | roaster | import`. We need to add `'manual'` so manually entered coffees are properly flagged.

```text
ALTER TYPE coffee_source ADD VALUE 'manual';
```

No new tables are needed -- everything writes to the existing `coffees` and `roasters` tables. Existing RLS policies already allow authenticated users to insert coffees (with `created_by = auth.uid()`).

## New Files

### 1. `src/features/scanner/components/ManualAddForm.tsx`

The main form component with:

- **Required**: Coffee Name (text), Roaster/Brand (text)
- **Optional**: Origin Country (text), Roast Level (1-5 slider with Light-to-Dark labels), Processing Method (select: Washed/Natural/Honey/Anaerobic/Other), Flavor Notes (tag/chip input), Description (textarea), Image upload, Altitude ( also a slider with 500mts increments starting at 500 and ending 2500+), leave an open area for comments (text area)
- Image uploads go to the existing `coffee-scans` storage bucket, stored as URL reference in `image_url`
- Uses Zod schema for validation
- Styled with 4px borders, Bangers headings, shadcn components matching the app design system

### 2. `src/features/scanner/hooks/useManualAddCoffee.ts`

Custom hook handling the submission logic:

1. Check if a roaster with the given brand name exists in `roasters` table
2. If not, create one with `is_verified = false`, auto-generated slug, `user_id = current user`
3. Upload image to storage bucket if provided
4. Insert into `coffees` with `source = 'manual'`, `created_by = auth.uid()`, `is_verified = false`, linking `roaster_id`
5. Return the new coffee ID for navigation
6. Show toast on success/error

### 3. `src/features/scanner/components/FlavorNotesInput.tsx`

A reusable tag/chip input component for entering multiple flavor notes. Users type a note and press Enter or click to add it as a chip. Chips can be removed with an X button.

## Modified Files

### `src/features/scanner/ScannerPage.tsx`

- Add a tab-style toggle or secondary button at the top: "Scan" vs "Add Manually"
- Use React state (`mode: 'scan' | 'manual'`) to switch between the scan uploader and the manual form
- When in "manual" mode, render `ManualAddForm` instead of the scan uploader/tips
- Auth check already exists -- no changes needed there

### `src/features/scanner/components/index.ts`

- Export `ManualAddForm` and `FlavorNotesInput`

## User Flow

```text
Scanner Page
  |
  +-- [Scan] tab (default) --> existing scan flow
  |
  +-- [Add Manually] tab --> ManualAddForm
        |
        Fill required fields (name, brand)
        Fill optional fields as desired
        |
        Submit --> useManualAddCoffee hook
          |
          +-- Find or create roaster
          +-- Upload image (if any)
          +-- Insert into coffees table
          +-- Toast: "Coffee added!"
          +-- Navigate to /coffee/:newId
```

## Technical Details

- **Roaster slug generation**: lowercase brand name, replace spaces/special chars with hyphens (e.g., "Blue Bottle Coffee" becomes "blue-bottle-coffee")
- **Roaster lookup**: query `roasters` by `business_name` (case-insensitive) before creating a new one
- **Image upload**: uses Supabase Storage `coffee-scans` bucket with path `manual/{userId}/{timestamp}.jpg`
- **Form validation (Zod)**: name required (max 100 chars), brand required (max 100 chars), roast_level optional enum "1"-"5", processing_method optional string, flavor_notes optional string array, description optional (max 1000 chars)
- **Navigation**: after successful insert, `navigate(\`/coffee/{newCoffeeId})` using existing coffee profile route