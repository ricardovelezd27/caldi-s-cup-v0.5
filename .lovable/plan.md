
# Plan: Fix Add to Favorites & Optimize Scanner Feedback

## Issue 1: Add to Favorites Not Working

### Current Problem
The `handleAddToFavorites` function in `ScanResults.tsx` shows a success toast but does NOT actually save to the database - it's just a placeholder.

### Solution
Implement the actual database insert to the `user_favorites` table:

**File: `src/features/scanner/components/ScanResults.tsx`**

```typescript
// Add imports
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import { useState } from "react";

// Inside component:
const { user } = useAuth();
const [isSaving, setIsSaving] = useState(false);
const [isSaved, setIsSaved] = useState(false);

const handleAddToFavorites = async () => {
  if (!user || isSaved) return;
  
  setIsSaving(true);
  try {
    const { error } = await supabase
      .from("user_favorites")
      .insert({
        user_id: user.id,
        coffee_name: data.coffeeName || "Unknown Coffee",
        roaster_name: data.brand,
        image_url: data.imageUrl,
        // brew_method and rating can be added later
      });

    if (error) throw error;

    setIsSaved(true);
    toast.success("Added to favorites!", {
      description: `${data.coffeeName || "This coffee"} has been saved.`,
    });
  } catch (err) {
    toast.error("Failed to save favorite", {
      description: "Please try again later.",
    });
  } finally {
    setIsSaving(false);
  }
};

// Update button to show state
<Button
  variant="default"
  onClick={handleAddToFavorites}
  disabled={isSaving || isSaved}
  className="gap-2"
>
  <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
  {isSaved ? "Saved!" : isSaving ? "Saving..." : "Add to Favorites"}
</Button>
```

---

## Issue 2: Scanner Appears Slow

### Analysis
From the edge function logs, the actual timing is:
- Image upload: ~1 second
- **AI processing: ~30 seconds** (Gemini vision model analyzing the image)
- Database save: ~7 seconds
- **Total: ~38 seconds**

This is normal for vision AI processing. The perceived slowness can be improved with better progress feedback.

### Solution: More Accurate Progress Messaging

**File: `src/features/scanner/hooks/useCoffeeScanner.ts`**

Update the progress states to set more realistic expectations:

```typescript
// Current message: "AI is reading your coffee bag..." at 50%
// Users see this for 30 seconds which feels stuck

// Better approach: Add time estimates
SCAN_PROGRESS_STATES = {
  idle: { status: "idle", message: "Ready to scan", progress: 0 },
  uploading: { status: "uploading", message: "Uploading image...", progress: 15 },
  analyzing: { 
    status: "analyzing", 
    message: "AI is analyzing your coffee bag (this may take 20-30 seconds)...", 
    progress: 40 
  },
  enriching: { 
    status: "enriching", 
    message: "Almost done! Saving results...", 
    progress: 85 
  },
  complete: { status: "complete", message: "Scan complete!", progress: 100 },
  error: { status: "error", message: "Something went wrong", progress: 0 },
};
```

**File: `src/features/scanner/components/ScanProgress.tsx`**

Add an animated countdown or elapsed time display during the analyzing phase to show the user something is happening:

```typescript
// Add elapsed time display during analyzing phase
const [elapsedTime, setElapsedTime] = useState(0);

useEffect(() => {
  let interval: NodeJS.Timeout;
  if (progress.status === "analyzing" || progress.status === "enriching") {
    interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
  }
  return () => clearInterval(interval);
}, [progress.status]);

// Display in UI:
{progress.status === "analyzing" && (
  <p className="text-sm text-muted-foreground">
    Time elapsed: {elapsedTime}s
  </p>
)}
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/features/scanner/components/ScanResults.tsx` | Implement actual database insert for favorites with loading/saved states |
| `src/features/scanner/types/scanner.ts` | Update progress messages with time estimates |
| `src/features/scanner/components/ScanProgress.tsx` | Add elapsed time counter during AI analysis |

---

## Why The Scanner Takes Time

The ~30 second AI processing time is **expected behavior** for vision AI models:
1. The image must be sent to Gemini's servers
2. The model analyzes the coffee bag image
3. It extracts text, identifies features, and generates structured data
4. This is already using `gemini-2.5-flash` which is the fastest option

Switching to a faster model would reduce accuracy. The better UX solution is to set proper expectations with progress messaging.
