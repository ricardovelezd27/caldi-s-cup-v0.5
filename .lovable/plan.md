

# Modern Mobile Profile Hero with Tribe Covers and Inline Editing

## Overview

Transform the mobile profile into an immersive, modern experience. The cover extends to ~65vh with tribe-specific CSS gradients and SVG patterns, a white content card overlaps it with rounded corners, and user identity is displayed seamlessly (no labels). A pencil icon toggles inline editing for name and city.

---

## Visual Layout

```text
+----------------------------------+
|                                  |
|   TRIBE GRADIENT + SVG PATTERN   |
|                                  |
|      Caldi Logo (watermark)      |
|                                  |
|                                  |
|  +--------+                      |
|  | AVATAR |  (circle, overlap)   |
+--|   (o)  |--+-------------------+
   +--------+
 Display Name            [pencil]
 user@email.com
 Fox -- The Tastemaker
+----- white card continues -------+
| Tribe detail card                |
| Change Password (collapsible)    |
| Retake Quiz (collapsible)        |
| Inventory / Favorites            |
+----------------------------------+
```

---

## Changes

### 1. New File: `src/features/profile/utils/tribeCoverStyles.ts`

A utility that maps each tribe to a gradient string and an inline SVG data URI pattern:

| Tribe | Gradient | Pattern |
|-------|----------|---------|
| Fox | Deep warm red-orange to golden amber | Diamond/gem shapes |
| Owl | Teal to dark slate | Fine grid lines |
| Hummingbird | Warm yellow to coral | Organic wavy lines |
| Bee | Rich amber to deep brown | Honeycomb hexagons |
| (none) | Neutral muted gray | None |

All colors are derived from the brand palette (destructive red for Fox, secondary teal for Owl, primary yellow for Hummingbird, accent orange for Bee). Returns `{ gradient: string, patternSvg: string | null }`.

### 2. Rewrite: `src/features/profile/components/ProfileHero.tsx`

Major changes from the current 150px banner:

- **Cover**: `h-[65vh]` with tribe gradient background and subtle SVG pattern overlay at low opacity. Caldi logo watermark centered with ~40% opacity.
- **White card overlap**: A `div` with `bg-background rounded-t-3xl -mt-10 relative z-10` that creates the smooth transition into content (like the reference image).
- **Avatar**: Circular, positioned at the boundary using `-mt-16` inside the white card, left-aligned with padding.
- **Identity block** (inside white card, below avatar):
  - Display name as a Bangers heading (no label)
  - Email in muted Inter text (no label)
  - Tribe emoji + name + title as a tagline
  - Pencil icon button (top-right of identity area)
- **Edit mode** (toggled by pencil):
  - Name becomes an `Input` field (no label, placeholder "Your name")
  - City `Input` appears below email
  - Avatar shows camera overlay persistently (`showOverlayAlways` prop)
  - Save (checkmark) and Cancel (X) icon buttons replace the pencil
  - On save: same Supabase update as `ProfileInfoForm` (`profiles.update`)
  - On cancel: revert local state, exit edit mode

### 3. Edit: `src/features/profile/components/ProfileAvatar.tsx`

Add optional `showOverlayAlways?: boolean` prop. When true, the camera icon overlay is always visible (full opacity) instead of only on hover. Used during edit mode in ProfileHero.

### 4. Edit: `src/features/profile/ProfilePage.tsx`

On mobile only:
- Remove `ProfileInfoForm` from the mobile flow (editing is now handled inline in ProfileHero)
- The mobile content sequence becomes: ProfileHero (with inline edit), TribeSection, Separator, ChangePasswordForm, Separator, RetakeQuizSection, Separator, tables, FeedbackCTA

Desktop layout remains completely untouched.

---

## File Summary

| File | Action | Description |
|------|--------|-------------|
| `src/features/profile/utils/tribeCoverStyles.ts` | New | Tribe-to-gradient and SVG pattern mapping |
| `src/features/profile/components/ProfileHero.tsx` | Rewrite | 65vh cover, white card overlap, inline identity with edit mode |
| `src/features/profile/components/ProfileAvatar.tsx` | Edit | Add `showOverlayAlways` prop |
| `src/features/profile/ProfilePage.tsx` | Edit | Remove ProfileInfoForm from mobile flow |

---

## Technical Details

- Gradients use inline `style={{ background: 'linear-gradient(...)' }}` with brand HSL values
- SVG patterns are tiny inline data URIs in `backgroundImage` with `repeat` and 5-8% opacity
- The white card overlap uses `rounded-t-3xl` (24px radius) and `-mt-10` with `relative z-10`
- Edit mode uses local `useState` for `isEditing`, `tempName`, and `tempCity`
- Save calls `supabase.from("profiles").update(...)` then `refreshProfile()` from AuthContext
- Brand compliance: 4px borders on avatar (border-background for contrast), Bangers font on name, Inter on email, Energy Yellow save button, Bean Black borders
- No new dependencies required

