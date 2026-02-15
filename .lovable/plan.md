
# Profile Page Enhancements

## Overview
Save the uploaded Caldi character as the default avatar placeholder, add avatar photo upload functionality via a storage bucket, make the password form collapsible, and restructure the mobile layout with "show 5 / view more / collapse" behavior on both tables.

## Changes

### 1. Save the Caldi asset
Copy `user-uploads://ilustration_CaldiModern_Chest_front-2.png` to `src/assets/characters/caldi-profile-placeholder.png`. This image will be imported and used as the default fallback in ProfileAvatar when the user has no uploaded photo.

### 2. Create storage bucket for avatars
A new database migration will:
- Create a public `avatars` storage bucket
- Add RLS policies so authenticated users can upload/update/delete their own avatar files (path pattern: `{user_id}/*`)
- Allow public read access to all avatars

### 3. Update ProfileAvatar component
- Import the Caldi placeholder image as the default fallback (replacing the initials-only fallback)
- Add a camera/upload button overlay on the avatar
- On click, open a file picker (accept images only)
- Upload the selected file to the `avatars` bucket under `{userId}/avatar.{ext}`
- Update the `profiles.avatar_url` with the public URL
- Call `refreshProfile()` to reflect the change immediately
- Show a loading spinner during upload

### 4. Make ChangePasswordForm collapsible
Wrap the password form content in a `Collapsible` component (already available in the UI library). The trigger will show "Change Password" with a chevron icon. Collapsed by default.

### 5. Restructure mobile layout in ProfilePage
- On mobile (single column): Avatar with upload, Profile info form, Tribe section, Collapsible password form, Inventory table, Favorites table
- On desktop (two columns): Keep current layout but with password form collapsible

### 6. Add "View more / Collapse" to FavoritesTable and InventoryTable
Both tables will:
- Initially show only the 5 most recent items
- Display a "View more" button if there are more than 5
- When expanded, show all items plus a "Show less" button to collapse back to 5
- Fetch all items (remove the limit of 20, or increase it)

## Technical Details

### Storage bucket migration SQL
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
```

### File Summary

| File | Action |
|------|--------|
| `src/assets/characters/caldi-profile-placeholder.png` | New -- copied from upload |
| `supabase/migrations/..._create_avatars_bucket.sql` | New -- storage bucket + RLS |
| `src/features/profile/components/ProfileAvatar.tsx` | Edit -- add placeholder image, upload button, upload logic |
| `src/features/profile/components/ChangePasswordForm.tsx` | Edit -- wrap in Collapsible |
| `src/features/profile/ProfilePage.tsx` | Edit -- reorder mobile layout |
| `src/features/profile/components/FavoritesTable.tsx` | Edit -- add show 5 / view more / collapse |
| `src/features/profile/components/InventoryTable.tsx` | Edit -- add show 5 / view more / collapse |
