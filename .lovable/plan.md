

# Plan: Replace Email with City in ProfileHero

## Change

In `src/features/profile/components/ProfileHero.tsx`, replace the email line (line 139-141) with a conditional city display using a 📍 pin prefix. If `profile.city` is falsy, render nothing.

### `src/features/profile/components/ProfileHero.tsx` (lines 139-141)

**Before:**
```tsx
<p className="text-sm text-muted-foreground truncate">
  {user.email}
</p>
```

**After:**
```tsx
{profile.city && (
  <p className="text-sm text-muted-foreground truncate">
    📍 {profile.city}
  </p>
)}
```

No other files affected. Same styling preserved.

