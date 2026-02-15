# Coffee Profile Page -- Interactive Feedback and Layout Restructure

## Overview

This plan adds user-adjustable sliders to Coffee Attributes and Match Score, restructures the section order (placing About This Coffee and Jargon Buster below Match Score, then Flavor Notes), and stores user feedback in the database for future taste fine-tuning and roaster insights.

---

## 1. Database: New `user_coffee_ratings` Table

A new table stores the user's personal adjustments per coffee:

```sql
CREATE TABLE public.user_coffee_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coffee_id UUID NOT NULL REFERENCES public.coffees(id) ON DELETE CASCADE,
  user_body_score SMALLINT CHECK (user_body_score BETWEEN 1 AND 5),
  user_acidity_score SMALLINT CHECK (user_acidity_score BETWEEN 1 AND 5),
  user_sweetness_score SMALLINT CHECK (user_sweetness_score BETWEEN 1 AND 5),
  user_match_score SMALLINT CHECK (user_match_score BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, coffee_id)
);

ALTER TABLE public.user_coffee_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own ratings"
  ON public.user_coffee_ratings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ratings"
  ON public.user_coffee_ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ratings"
  ON public.user_coffee_ratings FOR UPDATE
  USING (auth.uid() = user_id);
```

This table captures one row per user per coffee. Upsert on `(user_id, coffee_id)` ensures idempotent saves.

---

## 2. Coffee Attributes -- Dual-Layer Slider

**File: `src/features/coffee/components/CoffeeAttributes.tsx**`

Currently the sliders are `disabled`. The change:

- The slider track will show the **AI score as a colored segment** (yellow from 0 to AI value, teal from AI value to max) -- this remains fixed and represents the scan data.
- The **draggable thumb** represents the user's personal rating. It initializes at the AI value but can be moved freely (1--5 scale).
- The numeric display updates to show both: `AI: 3/5 | You: 4/5` when they differ.
- Slider is enabled only for authenticated users; guests see the disabled slider as before.
- Changes are debounced (500ms) and saved via upsert to `user_coffee_ratings`.

**New hook: `src/features/coffee/hooks/useUserCoffeeRating.ts**`

- Fetches existing user rating for the coffee (if any) from `user_coffee_ratings`.
- Provides `saveRating(field, value)` that upserts the row.
- Uses `useDebouncedValue` for auto-save on slider change.

---

## 3. Match Score -- Interactive Slider

**File: `src/features/coffee/components/CoffeeScanMatch.tsx**`

Replace the `<Progress>` bar with the same dual-layer slider pattern:

- The colored track shows AI's match score (yellow portion = AI score).
- The draggable thumb lets the user adjust their personal match percentage (0--100).
- Display: `AI: 36% | You: 55%` when they differ.

**Tribe-aware "why" phrase:**

- Replace the generic phrases like "Excellent Match for your taste profile",  "**Low Match for your taste profile",  "**This coffee has different characteristics than your usual preferences"****  with a tribe-specific explanation phrases use AI and the context provided by the coffee attributes plus the tribe to generate these descriptive phrases. 
- Logic: Based on the user's `coffee_tribe` from AuthContext and the match score level, generate a contextual sentence. Examples:
  - Fox at 90%: "This rare gem aligns perfectly with your pursuit of the exceptional."
  - Owl at 35%: "The processing data doesn't match your precision standards."
  - Hummingbird at 80%: "This adventurous profile has the surprises you crave."
  - Bee at 40%: "This coffee strays from the consistent comfort you prefer."

**Collapsible "Why this matches/doesn't match":**

- Wrap the match reasons list in a `Collapsible` component (collapsed by default).
- The trigger text adapts: "Why this matches" (score >= 50) or "Why this doesn't match" (score < 50).
- When score is low, the reasons should already explain what doesn't align (this comes from the AI scan data).

---

## 4. Section Reorder in CoffeeProfile

**File: `src/features/coffee/components/CoffeeProfile.tsx**`

New order for both mobile and desktop right column:

1. Coffee Info + Actions (unchanged)
2. Coffee Attributes (with interactive sliders)
3. Match Score (with interactive slider, tribe phrase, collapsible reasons)
4. About This Coffee + Jargon Buster (in a card with consistent margins)
5. Flavor Notes

**About This Coffee card margins fix:**

- `CoffeeDescription` will be wrapped in the same `border-4 border-border rounded-lg p-4 shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card` container used by other sections, ensuring visual consistency.
- Jargon Buster accordion will be nested inside the same card, below the description text.

---

## 5. File Summary


| File                                                   | Action | Description                                                  |
| ------------------------------------------------------ | ------ | ------------------------------------------------------------ |
| Migration SQL                                          | New    | `user_coffee_ratings` table + RLS                            |
| `src/features/coffee/hooks/useUserCoffeeRating.ts`     | New    | Fetch/save user ratings hook                                 |
| `src/features/coffee/components/CoffeeAttributes.tsx`  | Edit   | Dual-layer interactive sliders with user thumb               |
| `src/features/coffee/components/CoffeeScanMatch.tsx`   | Edit   | Interactive match slider, tribe phrases, collapsible reasons |
| `src/features/coffee/components/CoffeeProfile.tsx`     | Edit   | Reorder sections, fix About This Coffee margins              |
| `src/features/coffee/components/CoffeeDescription.tsx` | Edit   | Wrap in consistent card styling with Jargon Buster           |


---

## Technical Notes

- **Debounced auto-save**: User slider changes debounce at 500ms before upserting to `user_coffee_ratings`. No explicit "Save" button needed.
- **Optimistic UI**: Slider updates the local state immediately; the save happens in the background with a toast on error.
- **Guest users**: Sliders remain read-only (disabled) for unauthenticated users. A subtle tooltip says "Sign in to rate this coffee."
- **CQRS alignment**: User ratings are write-optimized (simple upsert). Future aggregation for roaster dashboards will use a separate read-optimized view/materialized query, not queried inline.