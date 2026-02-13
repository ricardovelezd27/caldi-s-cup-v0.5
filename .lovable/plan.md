

# Merge Scanner Results into Coffee Profile Page

## Problem
Two separate pages display coffee data: the scanner renders results inline via `ScanResults` component, and a separate `CoffeeProfilePage` exists at `/coffee/:id`. This creates redundancy, increases bundle size, and splits the user's mental model. The "View Full Profile" button in scan results navigating to a near-identical page is confusing.

## Solution: Navigate to `/coffee/:id` After Scan
After a scan completes, navigate directly to the `CoffeeProfilePage` with the scan data passed via React Router state. The profile page becomes the single rendering surface for all coffee data -- whether from a scan, favorites, inventory, or direct link.

```text
Scan completes
  |
  +-- Transform ScannedCoffee -> Coffee + CoffeeScanMeta (already exists)
  +-- Navigate to /coffee/{coffeeId}
  |     state: { coffee, scanMeta, isNewCoffee }
  |
  +-- CoffeeProfilePage receives data
        |
        +-- If route state has coffee data: render immediately (no DB fetch)
        +-- If no state (direct URL visit): fetch from DB (existing behavior)
        +-- scanMeta in state? Show match score, jargon buster, "Scan Again" button
        +-- No scanMeta? Show standard profile with favorites/inventory actions
```

This approach scales well because:
- Authenticated scan results are persisted to DB, so the `/coffee/:id` URL is shareable and bookmarkable
- Anonymous scan results work via route state (ephemeral but functional)
- Future marketplace products use the same page via DB fetch
- One component to optimize, cache, and maintain

## Changes

### 1. ScannerPage.tsx -- Navigate on completion instead of inline rendering
Remove the inline `ScanResults` rendering. When `isComplete && scanResult`, transform the data and call `navigate('/coffee/{id}', { state })`. The scanner page only handles: upload UI, progress, errors, and the redirect.

### 2. CoffeeProfilePage.tsx -- Accept route state as primary data source
Add `location.state` handling. If state contains `coffee` + optional `scanMeta`, use that directly (skip DB fetch). If no state, fall back to `useCoffee(id)` fetch. Pass `onScanAgain` (navigates back to `/scanner`) to `CoffeeActions` when `scanMeta` is present.

### 3. CoffeeActions.tsx -- Remove "View Full Profile" button
The "View Full Profile" button (`handleViewProfile` / `Eye` icon) is no longer needed since the user is already on the profile page. Remove it. Keep "Scan Another" visible when `onScanAgain` is provided.

### 4. Delete ScanResults.tsx
The `ScanResults` component is no longer used. Its transformation logic (`transformToCoffee`, `extractScanMeta`) moves to `ScannerPage` (or a small utility) for the navigate call.

### 5. Update scanner barrel export
Remove `ScanResults` from `src/features/scanner/components/index.ts`.

## Technical Details

### ScannerPage.tsx
- Import `useNavigate` and the transform functions from `ScanResults` (moved inline or to a utility)
- Replace the `{isComplete && scanResult && <ScanResults ... />}` block with a `useEffect` that triggers navigation:
```typescript
useEffect(() => {
  if (isComplete && scanResult) {
    const coffee = transformToCoffee(scanResult);
    const scanMeta = extractScanMeta(scanResult);
    const isNewCoffee = scanResult.isNewCoffee ?? false;
    const coffeeId = scanResult.coffeeId || scanResult.id;
    navigate(`/coffee/${coffeeId}`, {
      state: { coffee, scanMeta, isNewCoffee },
      replace: true, // prevent back-button returning to "complete" state
    });
  }
}, [isComplete, scanResult, navigate]);
```

### CoffeeProfilePage.tsx
- Read `location.state` for `{ coffee, scanMeta, isNewCoffee }`
- If state has `coffee`, use it directly; skip `useCoffee` fetch (or let it run in background for freshness)
- Pass `scanMeta`, `isNewCoffee`, and `onScanAgain={() => navigate('/scanner')}` to `CoffeeProfile` and `CoffeeActions`

### CoffeeActions.tsx
- Remove `handleViewProfile` and the "View Full Profile" `Button` (lines 86-88, 144-149)
- Remove `Eye` import

### Files Modified
1. `src/features/scanner/ScannerPage.tsx` -- navigate on completion
2. `src/features/coffee/CoffeeProfilePage.tsx` -- accept route state
3. `src/features/coffee/components/CoffeeActions.tsx` -- remove "View Full Profile"
4. `src/features/scanner/components/ScanResults.tsx` -- delete file
5. `src/features/scanner/components/index.ts` -- remove ScanResults export

