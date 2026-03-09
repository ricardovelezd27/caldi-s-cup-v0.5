

# Plan: Wire Global Gamification to Scanner and Recipe Features

## Overview
Create a unified `useAwardXP` React hook that combines XP awarding + streak updating + visual feedback, then integrate it into the scanner and recipe creation flows.

## 1. Create `useAwardXP` Hook (`src/hooks/gamification/useAwardXP.ts`)

A single hook that encapsulates the full gamification reward flow:
- Calls `awardXP(userId, actionType, xpAmount)` from the global service
- Automatically calls `updateStreakOnAction(userId)` on success
- Returns `{ rewardAction, pendingXP }` where `rewardAction` is an async function and `pendingXP` tracks the last awarded amount for animation
- Shows a `toast.success` with XP earned (e.g., "☕ +10 XP — Coffee Scanned!")
- Fires-and-forgets (non-blocking) so it doesn't slow down the main UX flow
- Silently catches errors (logs to console, never blocks the user)

```typescript
export function useAwardXP() {
  const { user } = useAuth();
  const [pendingXP, setPendingXP] = useState(0);

  const rewardAction = useCallback(async (actionType: string, xpAmount: number, label?: string) => {
    if (!user) return;
    try {
      await awardXP(user.id, actionType, xpAmount);
      await updateStreakOnAction(user.id);
      setPendingXP(xpAmount);
      toast.success(`☕ +${xpAmount} XP — ${label || actionType}!`);
      setTimeout(() => setPendingXP(0), 2000);
    } catch (err) {
      console.error("[Gamification] Failed to award XP:", err);
    }
  }, [user]);

  return { rewardAction, pendingXP };
}
```

Export from `src/hooks/gamification/index.ts`.

## 2. Wire Scanner (`src/features/scanner/hooks/useCoffeeScanner.ts`)

After the scan completes successfully (line ~112, after `setScanResult`):
- Import and call `awardXP` + `updateStreakOnAction` directly from services (since this is a hook, not a component — we have `user` from `useAuth` already)
- Fire-and-forget: `awardXP(user.id, 'scan_coffee_bag', 10)` then `updateStreakOnAction(user.id)` — wrapped in try/catch, non-blocking
- The visual toast feedback will be handled at the component level using the `useAwardXP` hook or by adding a toast call here

**Approach**: Since `useCoffeeScanner` already has `user` from `useAuth`, we'll call the service functions directly and show a toast:

```typescript
// After setScanResult(result.data) on line 112:
if (user) {
  awardXP(user.id, 'scan_coffee_bag', 10)
    .then(() => updateStreakOnAction(user.id))
    .catch(err => console.error("[Gamification]", err));
  toast.success("☕ +10 XP — Coffee Scanned!");
}
```

## 3. Wire Recipe Creation (`src/features/recipes/CreateRecipePage.tsx`)

In `handleSubmit`, after `createMutation.mutateAsync` succeeds:
- Use the `useAwardXP` hook at the component level
- Call `rewardAction('log_brew_recipe', 20, 'Recipe Created')` before navigating

```typescript
const { rewardAction } = useAwardXP();

const handleSubmit = async (data: RecipeFormData) => {
  try {
    await createMutation.mutateAsync(data);
    rewardAction('log_brew_recipe', 20, 'Recipe Created'); // fire-and-forget
    toast.success("Recipe created successfully!");
    navigate(ROUTES.recipes);
  } catch { ... }
};
```

## Files Modified

| File | Change |
|------|--------|
| `src/hooks/gamification/useAwardXP.ts` | **New** — unified reward hook |
| `src/hooks/gamification/index.ts` | Add `useAwardXP` export |
| `src/features/scanner/hooks/useCoffeeScanner.ts` | Award 10 XP on successful scan |
| `src/features/recipes/CreateRecipePage.tsx` | Award 20 XP on recipe creation |

No database changes needed — uses existing `user_xp_logs` table and `profiles.total_xp`/`current_streak` columns.

