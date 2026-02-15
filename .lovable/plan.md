
# LinkedIn-Style Mobile Profile Header

## Overview

Redesign the mobile profile page to feature a LinkedIn-inspired cover + avatar layout. A cover banner displays the Caldi logo, with a circular profile photo overlapping the bottom edge. Below that, the user's name, tribe emoji, and a brief tribe description appear inline. Desktop layout remains unchanged.

---

## 1. New Component: ProfileHero (mobile only)

**New file: `src/features/profile/components/ProfileHero.tsx`**

A self-contained component rendered only on mobile (hidden on `md:` and up) that contains:

- **Cover banner**: A colored background (using the user's tribe color or a default muted tone) with the Caldi logo centered, full-width with horizontal padding. Height roughly 140-160px.
- **Circular avatar**: 120x120px circle with a 4px white border, positioned to overlap the cover by ~50%. Uses `object-cover` for photos, `object-contain` with padding for the Caldi placeholder. Clickable to trigger avatar upload (reuses the same upload logic from `ProfileAvatar`).
- **Camera overlay on hover/tap**: Same pattern as current ProfileAvatar.
- **Name + Tribe summary**: Below the avatar, display the user's display name (Bangers heading), tribe emoji + tribe name inline, and a one-line tribe tagline (the `title` field from tribe data, e.g., "The Tastemaker").

```text
+----------------------------------+
|         [COVER BANNER]           |
|        Caldi Logo centered       |
|                                  |
|   +------+                       |
|   | AVATAR|  (overlapping)       |
+---|      |--+--------------------+
    +------+
  Display Name
  Fox - The Tastemaker
```

## 2. Update ProfilePage Layout

**File: `src/features/profile/ProfilePage.tsx`**

- Import `ProfileHero` and `useIsMobile`.
- On mobile: render `<ProfileHero />` at the top (before the Container), then hide the old avatar and tribe section.
- On desktop (`md:` and up): keep the existing 2-column grid layout exactly as-is (no changes to desktop).

The mobile flow becomes:
1. ProfileHero (cover + avatar + name + tribe tagline)
2. TribeSection card (full detail)
3. ProfileInfoForm
4. ChangePasswordForm
5. RetakeQuizSection
6. InventoryTable
7. FavoritesTable
8. FeedbackCTA

## 3. Update ProfileAvatar for Circle Variant

**File: `src/features/profile/components/ProfileAvatar.tsx`**

Add an optional `variant` prop: `"square"` (default, current behavior) or `"circle"`.

When `variant="circle"`:
- Container uses `rounded-full` instead of `rounded-md`
- Sizing controlled by className passed from ProfileHero (e.g., `w-28 h-28`)
- White border (`border-background`) instead of `border-border` for contrast against cover
- No box-shadow (clean circle look)
- Avatar image uses `object-cover rounded-full` for photos, keeps `object-contain` for the placeholder

## 4. File Summary

| File | Action | Description |
|------|--------|-------------|
| `src/features/profile/components/ProfileHero.tsx` | New | LinkedIn-style cover + avatar + name + tribe tagline for mobile |
| `src/features/profile/components/ProfileAvatar.tsx` | Edit | Add `variant="circle"` support |
| `src/features/profile/ProfilePage.tsx` | Edit | Use ProfileHero on mobile, hide old avatar/tribe on mobile |
| `src/features/profile/components/index.ts` | Edit | Export ProfileHero |

## Technical Notes

- The cover banner uses the Caldi logo from `/lovable-uploads/8e78a6bd-5f00-45be-b082-c35b57fa9a7c.png`.
- The avatar overlap is achieved with a negative top margin (`-mt-14`) on the avatar container relative to the cover.
- The tribe brief description uses the `title` field from the tribe definition (e.g., "The Tastemaker", "The Explorer") -- short enough for a single line under the name.
- Upload functionality is fully reused from the existing ProfileAvatar component.
