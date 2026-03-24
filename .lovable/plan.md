

# Plan: Restructure WelcomeHeroWidget + Create TribeInfoModal

## Changes

### 1. New file: `src/features/dashboard/widgets/TribeInfoModal.tsx`

A dialog component that receives `open` and `onOpenChange` props:

- **Has tribe**: Shows emoji avatar circle (w-16 h-16, rounded-full, border-4, tribe bgClass), tribe name (font-bangers text-3xl, tribe colorClass), subtitle in muted text, full description, value tags, and a "Retake Coffee Quiz" button (clears `STORAGE_KEYS.QUIZ_RESULT` + `QUIZ_STATE`, navigates to `/quiz`)
- **No tribe**: Shows "You haven't discovered your tribe yet" message with a "Take the Quiz" button navigating to `/quiz`

Uses Dialog/DialogContent from `@/components/ui/dialog`, imports tribe data via `getTribeDefinition`, reads `profile.coffee_tribe` from `useAuth`.

### 2. Edit: `src/features/dashboard/widgets/WelcomeHeroWidget.tsx`

- Remove the `Welcome, {greeting}!` heading (lines 23-25) and the `greeting` variable
- Keep tribe description text and rank badge + progress bar unchanged
- Add `useState` for modal open state
- After the tribe description paragraph, add a ghost/outline small button: `Learn about your tribe {tribeDef.emoji}` (only when tribeDef exists)
- Import and render `<TribeInfoModal>` wired to the open state

## Files Modified

| File | Change |
|------|--------|
| `TribeInfoModal.tsx` (new) | Tribe info dialog with retake quiz CTA |
| `WelcomeHeroWidget.tsx` | Remove welcome heading, add "Learn about your tribe" button + modal |

