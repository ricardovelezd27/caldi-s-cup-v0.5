

# Fix: Allow Multiple Roaster Entries Per User

## Problem
The `roasters` table has a `UNIQUE(user_id)` constraint, preventing a user from creating more than one roaster record. This breaks the Manual Add flow when a user submits coffees from different brands.

There is also a `UNIQUE(slug)` constraint that could cause collisions if two brands generate the same slug.

## Database Migration

Drop the unique constraint on `user_id` so users can create multiple roaster entries:

```text
ALTER TABLE public.roasters DROP CONSTRAINT roasters_user_id_key;
```

## Code Change: `src/features/scanner/hooks/useManualAddCoffee.ts`

Improve the roaster lookup and slug generation to be more robust:

1. **Roaster lookup**: Use case-insensitive match on `business_name` (already done with `ilike`), but also ensure we pick the right one if multiple exist.
2. **Slug uniqueness**: Append a short timestamp suffix to the slug to avoid `roasters_slug_key` violations (e.g., `blue-bottle-coffee-1739...`).

## Summary of Changes

| File | Change |
|------|--------|
| New migration SQL | Drop `roasters_user_id_key` unique constraint |
| `useManualAddCoffee.ts` | Make slug unique with timestamp suffix |

