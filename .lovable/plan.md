
# User Profile Page

## Overview
Create a dedicated `/profile` route that displays and allows editing of user information, styled consistently with the coffee profile page layout (image left, info right on desktop). The page is protected (requires authentication) and accessible from the burger menu on mobile and the UserMenu dropdown on desktop.

## Changes

### 1. Database Migration -- add `city` column to `profiles`
Add an optional `city` text column to the existing `profiles` table so users can store their location.

```sql
ALTER TABLE public.profiles ADD COLUMN city text DEFAULT NULL;
```

### 2. New Feature: `src/features/profile/ProfilePage.tsx`
The main profile page, protected by `RequireAuth`. Uses the same two-column layout as `CoffeeProfile`:
- **Left column**: User avatar (large, square, matching `CoffeeImage` style with 4px borders and sticker shadow). Shows initials fallback if no avatar. Below it, the tribe card (if they have one) with emoji, name, title, and fun description from `tribes.ts`.
- **Right column**: 
  - **Display Name** (editable text input)
  - **Email** (read-only, shown as text)
  - **City** (optional text input)
  - **Coffee Tribe section**: If tribe exists, show tribe emoji + name + description. If no tribe, show a prompt card: "Discover your coffee personality!" with a CTA linking to `/quiz`.
  - **Change Password section**: Current password not required (uses Supabase `updateUser`). Two fields: new password + confirm password. Submit button.
  - **Save Profile button**: Saves display_name and city to `profiles` table via Supabase update + calls `refreshProfile()`.

### 3. New Component: `src/features/profile/components/ProfileAvatar.tsx`
Reusable large avatar display matching the `CoffeeImage` container style (aspect-square, 4px border, sticker shadow). Shows `AvatarImage` or initials fallback.

### 4. New Component: `src/features/profile/components/ProfileInfoForm.tsx`
Form with fields for display name, city, email (read-only). Uses react-hook-form + zod validation. Save button updates `profiles` table and calls `refreshProfile()`.

### 5. New Component: `src/features/profile/components/ChangePasswordForm.tsx`
Simple form: new password + confirm password. Uses `supabase.auth.updateUser({ password })`. Shows success/error toast. Zod validation for min length and match.

### 6. New Component: `src/features/profile/components/TribeSection.tsx`
If user has `coffee_tribe` in profile, renders the tribe card with emoji, name, title, and the fun description from `TRIBES` data. If no tribe, renders a prompt card with text "You haven't discovered your coffee tribe yet!" and a "Take the Quiz" button linking to `/quiz`.

### 7. Route Registration -- `src/App.tsx`
Add `/profile` route pointing to `ProfilePage`, wrapped in `RequireAuth`.

### 8. Route Constant -- `src/constants/app.ts`
Add `profile: "/profile"` to `ROUTES`.

### 9. Navigation Updates

**Header.tsx (mobile burger menu)**: Add a "My Profile" link (with `User` icon) visible only when `user` is authenticated, placed before "Sign Out".

**UserMenu.tsx (desktop dropdown)**: Update the existing "Profile" link from `/dashboard/profile` to `/profile`.

### 10. Update `src/integrations/supabase/types.ts`
This file auto-updates. The `city` column will appear after migration.

## File Summary

| File | Action |
|------|--------|
| `supabase/migrations/...` | New -- add `city` column |
| `src/features/profile/ProfilePage.tsx` | New -- main page |
| `src/features/profile/components/ProfileAvatar.tsx` | New -- avatar display |
| `src/features/profile/components/ProfileInfoForm.tsx` | New -- name/city/email form |
| `src/features/profile/components/ChangePasswordForm.tsx` | New -- password change form |
| `src/features/profile/components/TribeSection.tsx` | New -- tribe display or quiz CTA |
| `src/features/profile/components/index.ts` | New -- barrel export |
| `src/features/profile/index.ts` | New -- barrel export |
| `src/constants/app.ts` | Edit -- add `profile` route |
| `src/App.tsx` | Edit -- add `/profile` route |
| `src/components/layout/Header.tsx` | Edit -- add Profile link in mobile menu |
| `src/components/auth/UserMenu.tsx` | Edit -- fix Profile link path |

## Technical Notes
- Password change uses `supabase.auth.updateUser({ password })` which does not require the current password when the user has an active session.
- Profile save updates the `profiles` table directly (RLS policy `Users can update own profile` already covers this).
- The `city` column is nullable with no default, keeping it fully optional.
- All forms use Zod schemas for validation and `sonner` toasts for feedback.
- The page follows the existing `PageLayout` + `Container` pattern for consistent header/footer rendering.
