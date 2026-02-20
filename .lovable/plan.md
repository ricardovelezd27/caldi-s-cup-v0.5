

# Multi-Image Scanner with Coffee Profile Gallery

## Overview

This plan implements two connected features:
1. **Multi-image scanner** -- users can add up to 4 photos of a coffee bag before scanning
2. **Thumbnail gallery on Coffee Profile page** -- Amazon-style image display with main image + horizontal thumbnails

The core optimization is **client-side canvas stitching**: all user photos are composited into a single image before the AI call, so credit cost stays at exactly 1 call per scan regardless of photo count.

---

## Part 1: Client-Side Image Stitching Utility

**New file: `src/features/scanner/utils/stitchImages.ts`**

A canvas-based utility that takes 1-4 base64 images and composites them into one:
- 1 image: pass through (no stitching)
- 2 images: 2x1 horizontal grid
- 3-4 images: 2x2 grid (blank cell if 3)
- Each sub-image scaled to fit its grid cell proportionally
- Output compressed to JPEG under 1.5MB

---

## Part 2: Multi-Image ScanUploader

**Modified: `src/features/scanner/components/ScanUploader.tsx`**

Transform from single-image picker to multi-slot collector:
- After adding first photo, show it as a thumbnail with a "+" slot to add more (up to 4)
- Thumbnail grid: `grid grid-cols-4 gap-2` -- each thumbnail is square with a remove (X) button
- A "Scan Now" button appears once at least 1 image is present
- Scanning is NO LONGER auto-triggered on first image -- user controls when to scan
- The upload/camera buttons remain the same, just add to the array instead of replacing
- The callback changes from `onImageSelected(base64)` to `onImagesReady(base64[])`

---

## Part 3: ScannerPage Orchestration

**Modified: `src/features/scanner/ScannerPage.tsx`**

- Receives `base64[]` array from the updated ScanUploader
- Calls `stitchImages()` to produce a single composite for the AI
- Stores the individual images array in a ref for passing to the coffee profile
- Passes the stitched composite to `scanCoffee()` (hook unchanged)
- When navigating to coffee profile on completion, passes `additionalImages: string[]` (all original photos) via route state

---

## Part 4: Edge Function Prompt Update

**Modified: `supabase/functions/scan-coffee/index.ts`**

Single line addition to the AI prompt:
```
This image may contain multiple views of the same coffee bag arranged in a grid. 
Analyze ALL visible panels together as one coffee product.
```

No structural changes -- it still receives and processes one image.

---

## Part 5: Coffee Profile Image Gallery

**Modified: `src/features/coffee/components/CoffeeImage.tsx`**

Add an optional `additionalImages?: string[]` prop. When present:
- Main image displays as today (large, aspect-square)
- Below it, a horizontal row of small square thumbnails (the original individual photos)
- Clicking a thumbnail swaps it into the main display
- First image is selected by default
- Thumbnails use `flex gap-2 overflow-x-auto` for horizontal scroll on mobile
- Selected thumbnail gets a highlighted border (primary color)
- Each thumbnail is ~60px square on mobile, ~72px on desktop

**Modified: `src/features/coffee/components/CoffeeProfile.tsx`**

Pass the new `additionalImages` prop through to `CoffeeImage`.

**Modified: `src/features/coffee/CoffeeProfilePage.tsx`**

Read `additionalImages` from route state and pass it down to `CoffeeProfile`.

---

## Part 6: Type & State Updates

**Modified: `src/features/coffee/types/coffee.ts`**

No changes needed -- `additionalImages` flows through route state and component props only (not persisted to DB).

**Modified: `src/features/coffee/CoffeeProfilePage.tsx` (route state interface)**

Add `additionalImages?: string[]` to `CoffeeRouteState`.

---

## Part 7: i18n Keys

**Modified: `src/i18n/en.ts` and `src/i18n/es.ts`**

Add ~8 new keys:
- `scanner.addUpTo4` -- "Add up to 4 photos of different sides"
- `scanner.scanNow` -- "Scan Now"
- `scanner.addAnother` -- "Add another side"
- `scanner.photosAdded` -- "{{count}} photo(s) added"
- `scanner.removePhoto` -- "Remove photo"
- `scanner.stitching` -- "Combining images..."

---

## Files Summary

| File | Action |
|------|--------|
| `src/features/scanner/utils/stitchImages.ts` | **Create** -- canvas compositing utility |
| `src/features/scanner/components/ScanUploader.tsx` | **Modify** -- multi-image collection UI |
| `src/features/scanner/ScannerPage.tsx` | **Modify** -- orchestrate stitching + pass images to profile |
| `supabase/functions/scan-coffee/index.ts` | **Modify** -- add multi-panel instruction to prompt |
| `src/features/coffee/components/CoffeeImage.tsx` | **Modify** -- add thumbnail gallery below main image |
| `src/features/coffee/components/CoffeeProfile.tsx` | **Modify** -- pass `additionalImages` prop |
| `src/features/coffee/CoffeeProfilePage.tsx` | **Modify** -- read `additionalImages` from route state |
| `src/i18n/en.ts` | **Modify** -- add scanner gallery keys |
| `src/i18n/es.ts` | **Modify** -- add Spanish translations |

## What Does NOT Change
- `useCoffeeScanner.ts` -- still receives a single base64 string
- Scanner types (`scanner.ts`) -- no structural changes
- Database schema -- no new tables or columns
- Credit consumption -- identical to current (1 AI call per scan)
- Firecrawl enrichment -- unchanged
- Anonymous/authenticated flow split -- unchanged

## Credit Optimization Summary
- Current: 1 photo = 1 AI call
- New: 1-4 photos = still 1 AI call (stitched client-side)
- Zero additional backend cost regardless of photo count

