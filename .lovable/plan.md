

## Plan: Consolidate Photo Uploads into Edit Profile Dialog

### What changes

1. **EditProfileDialog** — Add avatar and cover photo upload sections at the top of the modal (before the name field). Each shows a preview thumbnail with a camera overlay button. Upload logic is extracted from `ProfileAvatar` and `ProfileHero` into this dialog.

2. **ProfileHero** — Remove the "Edit Cover" button and its hidden file input. Remove the cover upload handler. When the user clicks the avatar, open the Edit Profile dialog instead of triggering a file picker directly.

3. **ProfileAvatar** — Remove the built-in file upload logic (click-to-upload, overlay, hidden input). Make it a pure display component. Accept an `onClick` prop so the hero can wire it to open the edit dialog.

4. **Desktop spacing fix** — Restore spacing between the cover and the name/avatar row on desktop by adding `md:pt-4` (or similar) to the content card section in `ProfileHero`.

### Technical details

**EditProfileDialog changes:**
- Add `useRef` for avatar and cover file inputs
- Add `uploadingAvatar` and `uploadingCover` state
- Add two upload handler functions (reuse existing logic from `ProfileAvatar` and `ProfileHero`)
- At the top of the form, render two side-by-side upload areas:
  - Cover: wide rectangle preview with camera icon overlay
  - Avatar: circular preview with camera icon overlay
- Both use hidden `<input type="file">` elements

**ProfileHero changes:**
- Remove `coverInputRef`, `uploadingCover`, `handleCoverUpload` state/logic
- Remove the "Edit Cover" button and hidden file input
- Pass `onClick={() => setEditOpen(true)}` to `ProfileAvatar`
- Add `md:pt-4` to the content card div for desktop spacing

**ProfileAvatar changes:**
- Remove `fileInputRef`, `uploading`, `handleUpload`, hidden input, camera overlay
- Accept optional `onClick` prop, apply it to the wrapper div
- Keep cursor-pointer when onClick is provided

### Files to modify
- `src/features/profile/components/EditProfileDialog.tsx`
- `src/features/profile/components/ProfileHero.tsx`
- `src/features/profile/components/ProfileAvatar.tsx`

