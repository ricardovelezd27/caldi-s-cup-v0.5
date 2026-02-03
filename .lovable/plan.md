
# Implementation Plan: Smart Coffee Matching & Auto-Catalog Integration

## Executive Summary

This plan addresses three critical issues:
1. **Add to Favorites/Inventory fails** - FK constraint violations because scanned coffees aren't in the master catalog
2. **No duplicate detection** - Every scan creates a new entry even if the coffee already exists
3. **No product page navigation** - Scanner results don't link to a unified product view

The solution leverages AI to match scanned coffees against the existing master catalog, only creating new entries when a coffee is truly new.

---

## Architecture Overview

```text
Current Flow (Broken):
  User scans → AI extracts data → Save to scanned_coffees → Display results
  User clicks "Add to Favorites" → Try to insert coffee.id → FK ERROR (not in coffees table)

New Flow:
  User scans → AI extracts data → Check coffees table for match
    ├─ Match found → Link scan to existing coffee, return coffeeId
    └─ No match → Create new coffee in catalog, link scan, return coffeeId + isNewCoffee flag
  User clicks "Add to Favorites" → Insert with valid coffeeId → SUCCESS
  User can navigate to /coffee/:id to view unified profile
```

---

## Phase 1: Update Edge Function for Smart Matching

### File: `supabase/functions/scan-coffee/index.ts`

**Goal**: After AI analysis, query the master catalog to find existing matches before creating a new coffee.

### Matching Logic

The edge function will use a scoring algorithm to find potential matches:

1. **Exact Name + Brand Match**: If `coffee_name` AND `brand` match exactly (case-insensitive), it's the same coffee (score: 100)
2. **Fuzzy Name Match**: If names are very similar (>85% similarity) and country matches, likely the same coffee (score: 80)
3. **Attribute-Based Match**: Same country + region + roast level + processing method = potential match (score: 60)

If best match score >= 80, link to existing coffee. Otherwise, create a new one.

### New Steps in Edge Function

After Step 5 (Calculate tribe match score), add:

```text
Step 6: Query coffees table for potential matches
  - SELECT id, name, brand, origin_country FROM coffees
    WHERE (name ILIKE '%{coffeeName}%' OR brand ILIKE '%{brand}%')
    AND origin_country = '{originCountry}'
    LIMIT 10

Step 7: Calculate match scores for each candidate
  - Use simple string similarity (Levenshtein distance or exact match)
  - Find best match

Step 8: If best match >= 80%:
  - Use existing coffee_id
  - Set isNewCoffee = false
  - Set matchedCoffeeName for display

Step 9: If no good match:
  - INSERT into coffees table (source: 'scan', is_verified: false, created_by: user.id)
  - Get new coffee_id
  - Set isNewCoffee = true

Step 10: Save to scanned_coffees with coffee_id
Step 11: Return response with coffeeId and isNewCoffee flag
```

### Response Schema Update

```typescript
{
  success: true,
  data: {
    id: string,         // scan record ID
    coffeeId: string,   // master catalog coffee ID (NEW)
    isNewCoffee: boolean, // true if this scan created a new catalog entry (NEW)
    // ... existing fields
  }
}
```

---

## Phase 2: Update Scanner Types

### File: `src/features/scanner/types/scanner.ts`

**Changes**:
- Add `coffeeId: string` to `ScannedCoffee` (no longer optional - always present)
- Add `isNewCoffee: boolean` to indicate if this scan discovered a new coffee

```typescript
export interface ScannedCoffee {
  id: string;
  coffeeId: string;      // NEW: Master catalog ID (always present now)
  isNewCoffee: boolean;  // NEW: True if this scan created the catalog entry
  imageUrl: string;
  // ... rest of existing fields
}
```

---

## Phase 3: Update ScanResults to Show "New Coffee" Badge

### File: `src/features/scanner/components/ScanResults.tsx`

**Changes**:
- Pass `isNewCoffee` flag to `CoffeeInfo` component via the coffee object
- Update `toDbRow` to include `coffee_id` from the scan data

### File: `src/features/coffee/components/CoffeeInfo.tsx`

**Changes**:
- Add optional `isNewCoffee?: boolean` prop
- Display a "New Coffee Detected!" badge with Sparkles icon when true

```typescript
{isNewCoffee && (
  <Badge className="bg-primary text-primary-foreground animate-pulse gap-1">
    <Sparkles className="h-3 w-3" />
    New Coffee Detected!
  </Badge>
)}
```

---

## Phase 4: Fix CoffeeActions to Use Correct ID

### File: `src/features/coffee/components/CoffeeActions.tsx`

**Current Problem**: 
- `coffee.id` comes from `transformScannedCoffeeRow` which uses `row.coffee_id ?? row.id`
- Currently `coffee_id` is null, so it falls back to scan ID (which doesn't exist in coffees table)

**Solution**:
After the edge function changes, `coffee_id` will always be set, so:
- `coffee.id` will correctly be the master catalog ID
- Favorites/Inventory inserts will succeed

**Additional Enhancement**:
- Add "View Full Profile" button that navigates to `/coffee/:coffeeId`

```typescript
<Button
  variant="default"
  onClick={() => navigate(`/coffee/${coffee.id}`)}
  className="flex-1"
>
  <Eye className="h-4 w-4 mr-2" />
  View Full Profile
</Button>
```

---

## Phase 5: Create Unified Coffee Profile Page

### New File: `src/features/coffee/CoffeeProfilePage.tsx`

This page will serve as the canonical view for any coffee in the master catalog. It will **not duplicate** the marketplace ProductPage - instead, it will use the same `CoffeeProfile` component already in use.

**Key Differences from ProductPage**:
- `ProductPage` uses mock data and is designed for e-commerce (variants, pricing, cart)
- `CoffeeProfilePage` fetches from database and focuses on coffee attributes (favorites, inventory, no pricing)

### Implementation

```typescript
// Uses existing hooks and components - no duplication
import { CoffeeProfile, CoffeeActions, useCoffee } from "@/features/coffee";

export function CoffeeProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { data: coffee, isLoading, error } = useCoffee(id);
  
  if (isLoading) return <Skeleton />;
  if (!coffee) return <NotFound />;
  
  return (
    <PageLayout>
      <Container>
        <BackLink to="/scanner" label="Back to Scanner" />
        <CoffeeProfile 
          coffee={coffee}
          actions={<CoffeeActions coffee={coffee} />}
        />
      </Container>
    </PageLayout>
  );
}
```

### Add Route

**File: `src/App.tsx`**
```typescript
<Route path="/coffee/:id" element={<CoffeeProfilePage />} />
```

**File: `src/constants/app.ts`**
```typescript
export const ROUTES = {
  // ... existing routes
  coffeeProfile: "/coffee",
} as const;
```

---

## Phase 6: Add useCoffee Hook

### New Function in: `src/features/coffee/services/coffeeService.ts`

```typescript
export function useCoffee(coffeeId: string | undefined) {
  return useQuery({
    queryKey: ["coffee", coffeeId],
    queryFn: async () => {
      if (!coffeeId) return null;
      return getCoffeeById(coffeeId);
    },
    enabled: !!coffeeId,
  });
}
```

---

## Technical Details

### Database Flow After Implementation

```text
User scans Ethiopian Yirgacheffe bag:

1. Edge function analyzes image
   → AI extracts: name="Ethiopian Yirgacheffe", brand="Blue Bottle", country="Ethiopia"

2. Query coffees table:
   SELECT * FROM coffees 
   WHERE name ILIKE '%Ethiopian Yirgacheffe%' 
   AND origin_country = 'Ethiopia'

3a. Match found (coffee_id = 'abc-123'):
   → INSERT INTO scanned_coffees (..., coffee_id='abc-123')
   → Response: { coffeeId: 'abc-123', isNewCoffee: false }

3b. No match:
   → INSERT INTO coffees (..., source='scan') → new id 'xyz-789'
   → INSERT INTO scanned_coffees (..., coffee_id='xyz-789')
   → Response: { coffeeId: 'xyz-789', isNewCoffee: true }

4. User clicks "Add to Favorites":
   → INSERT INTO user_coffee_favorites (coffee_id='abc-123') 
   → SUCCESS (FK constraint satisfied)
```

### RLS Policies (Already Configured)

The existing policies support this workflow:
- `coffees`: "Authenticated users can insert coffees" with `created_by = auth.uid()`
- `coffees`: "Users can view own unverified coffees"
- `user_coffee_favorites`: User can insert/view own favorites
- `user_coffee_inventory`: User can insert/view own inventory

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `supabase/functions/scan-coffee/index.ts` | Modify | Add matching logic, auto-insert to coffees |
| `src/features/scanner/types/scanner.ts` | Modify | Add `coffeeId` and `isNewCoffee` fields |
| `src/features/scanner/components/ScanResults.tsx` | Modify | Pass `isNewCoffee` flag, update coffee_id handling |
| `src/features/coffee/components/CoffeeInfo.tsx` | Modify | Add "New Coffee Detected!" badge |
| `src/features/coffee/components/CoffeeActions.tsx` | Modify | Add "View Full Profile" button |
| `src/features/coffee/CoffeeProfilePage.tsx` | Create | Unified coffee profile page |
| `src/features/coffee/index.ts` | Modify | Export new page |
| `src/App.tsx` | Modify | Add `/coffee/:id` route |
| `src/constants/app.ts` | Modify | Add `coffeeProfile` route constant |

---

## Validation Checklist

After implementation:
- [ ] Scan a new coffee → Creates entry in coffees table → Shows "New Coffee Detected!" badge
- [ ] Scan same coffee again → Links to existing entry → No duplicate created
- [ ] Click "Add to Favorites" → Succeeds (no FK error)
- [ ] Click "Add to Inventory" → Succeeds (no FK error)
- [ ] Click "View Full Profile" → Navigates to `/coffee/:id`
- [ ] Coffee profile page loads and displays correctly
- [ ] Dashboard favorites/inventory widgets show the coffee
