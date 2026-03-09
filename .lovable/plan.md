

# Plan: Edit Profile Modal via Pencil Icon

## What Changes

Replace the inline name/city editing in `ProfileHero` and the separate `ProfileInfoForm` + `ChangePasswordForm` sections with a single **Edit Profile Dialog** triggered by the pencil icon. This removes the redundant form section from the page body.

## New Component: `EditProfileDialog.tsx`

Create `src/features/profile/components/EditProfileDialog.tsx`:
- A `Dialog` modal with tabs or sections for:
  1. **Display Name** (text input)
  2. **Email** (read-only, disabled)
  3. **City** (text input)
  4. **Change Password** (new password + confirm, collapsible or always visible)
- Uses Zod validation (extend existing schemas)
- Single "Save" button that updates profile fields and optionally password
- On success: calls `refreshProfile()`, closes dialog, shows toast

## File Changes

### 1. `EditProfileDialog.tsx` (new)
- Accepts `open`, `onOpenChange` props
- Reads current profile data from `useAuth()`
- Combines profile update + password update logic
- Styled with project design tokens (4px borders, Bangers headings, shadows)

### 2. `ProfileHero.tsx`
- Remove all inline editing state (`isEditing`, `tempName`, `tempCity`, `saving`, `saveEdit`, `startEdit`, `cancelEdit`)
- Remove the `Input` fields and check/X buttons
- Pencil button now opens the `EditProfileDialog` via `useState<boolean>`
- Keep cover upload logic as-is (separate concern)

### 3. `ProfilePage.tsx`
- Remove `ProfileInfoForm` and `ChangePasswordForm` from the page body
- Remove the tribe+form grid and the password/retake-quiz grid
- Keep: `ProfileHero`, `TribeSection`, `RetakeQuizSection`, collections tables, `FeedbackCTA`
- Simplified layout: Hero → Tribe section → Retake Quiz → Collections → Feedback

### 4. `ProfileInfoForm.tsx`
- Delete or keep for potential reuse — likely delete since logic moves to dialog

### 5. Component index update
- Export `EditProfileDialog` from `components/index.ts`

