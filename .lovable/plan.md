

# Display Scanned Image for Anonymous Users with Sign-In Prompt

## Problem
When a non-authenticated user scans a coffee, the resulting profile page shows "No image" because the edge function returns `imageUrl: null` for anonymous users (the image is not uploaded to storage). The original base64 image data is available on the frontend but is discarded.

## Solution
1. Pass the original base64 image through the scanner flow so it displays on the profile page
2. Add a sign-in banner overlay on the image when the source is a temporary (non-persisted) data URL

## Changes

### 1. ScannerPage -- pass the original base64 image along with route state
Store the base64 image from `handleImageSelected` and include it in the route state when navigating to the coffee profile. If the scan result has no `imageUrl`, use the base64 as a fallback.

**File**: `src/features/scanner/ScannerPage.tsx`
- Store the selected base64 in a `useRef`
- In the navigation effect, if `coffee.imageUrl` is null, set it to the base64 data URL
- Add a flag `isTemporaryImage` to route state so the profile page knows to show the sign-in prompt

### 2. CoffeeProfilePage -- pass the temporary image flag down
Accept `isTemporaryImage` from route state and pass it through to `CoffeeProfile`.

**File**: `src/features/coffee/CoffeeProfilePage.tsx`
- Add `isTemporaryImage` to `CoffeeRouteState`
- Pass it as a prop to `CoffeeProfile`

### 3. CoffeeProfile -- forward the flag to CoffeeImage

**File**: `src/features/coffee/components/CoffeeProfile.tsx`
- Accept `isTemporaryImage` prop
- Pass it to `CoffeeImage`

### 4. CoffeeImage -- show sign-in overlay when image is temporary
Add a semi-transparent overlay banner at the bottom of the image saying "Sign in to save this image" when `isTemporaryImage` is true.

**File**: `src/features/coffee/components/CoffeeImage.tsx`
- Accept `isTemporaryImage` prop
- Render an overlay with a sign-in message and a link to `/auth`

## Technical Details

### ScannerPage.tsx
```tsx
const imageBase64Ref = useRef<string | null>(null);

const handleImageSelected = (imageBase64: string) => {
  imageBase64Ref.current = imageBase64;
  scanCoffee(imageBase64);
};

// In the navigation effect:
useEffect(() => {
  if (isComplete && scanResult) {
    const coffee = transformToCoffee(scanResult);
    const scanMeta = extractScanMeta(scanResult);
    const isNewCoffee = scanResult.isNewCoffee ?? false;
    const coffeeId = scanResult.coffeeId || scanResult.id;

    // If no image URL from backend (anonymous), use the original base64
    let isTemporaryImage = false;
    if (!coffee.imageUrl && imageBase64Ref.current) {
      const base64 = imageBase64Ref.current;
      coffee.imageUrl = base64.startsWith("data:") ? base64 : `data:image/jpeg;base64,${base64}`;
      isTemporaryImage = true;
    }

    navigate(`/coffee/${coffeeId}`, {
      state: { coffee, scanMeta, isNewCoffee, isTemporaryImage },
      replace: true,
    });
  }
}, [isComplete, scanResult, navigate]);
```

### CoffeeImage.tsx
```tsx
interface CoffeeImageProps {
  src: string | null;
  alt: string;
  className?: string;
  isTemporaryImage?: boolean;
}

export function CoffeeImage({ src, alt, className, isTemporaryImage }: CoffeeImageProps) {
  return (
    <div className={cn("relative aspect-square ...", className)}>
      {src ? (
        <>
          <img src={src} alt={alt} ... />
          {isTemporaryImage && (
            <div className="absolute bottom-0 inset-x-0 bg-foreground/80 px-3 py-2 text-center">
              <p className="text-background text-sm font-medium">
                <a href="/auth" className="underline text-primary font-bold">Sign in</a>
                {" "}to save this image to your collection
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="flex ..."><span>No image</span></div>
      )}
    </div>
  );
}
```

### Files Modified
1. `src/features/scanner/ScannerPage.tsx` -- store base64, inject into coffee data for anon users
2. `src/features/coffee/CoffeeProfilePage.tsx` -- forward `isTemporaryImage` from route state
3. `src/features/coffee/components/CoffeeProfile.tsx` -- accept and pass `isTemporaryImage` prop
4. `src/features/coffee/components/CoffeeImage.tsx` -- render sign-in overlay when temporary

