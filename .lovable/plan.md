
# Omnipresent Feedback Module with Usage Summary

## Overview
Build a reusable feedback module that can be invoked from anywhere in the app -- as a standalone page at `/contact_feedback`, from the footer, from a floating button, or programmatically from any component. The feedback form uses `mailto:` (no database needed) and optionally includes a brief summary of the user's app usage if they are logged in and consent to sharing it.

## Architecture: Reusable Dialog Module

Instead of building a page-only solution, the core feedback UI lives inside a **dialog component** (`FeedbackDialog`) that can be triggered from:
- The dedicated `/contact_feedback` route (opens the dialog automatically on mount)
- A "Give Feedback" link in the Footer
- A "Feedback" link in mobile navigation
- Any future trigger point (post-scan, post-quiz, etc.)

This keeps the module omnipresent without duplicating code.

## New Files

### 1. `src/features/feedback/components/FeedbackDialog.tsx`
A Dialog (shadcn) containing:
- Title: "We'd Love Your Feedback" (Bangers font)
- Subtitle: "Caldi is a work in progress. Tell us what you think!"
- **Star rating row**: 5 clickable star icons (optional), filled = selected
- **Name** (text input, optional, pre-filled from `profile.display_name` if logged in)
- **Email** (text input, optional, pre-filled from `user.email` if logged in)
- **Message** (textarea, required, placeholder: "What did you like? What could be better?")
- **Usage summary consent checkbox** (only shown if logged in): "Include a summary of my app activity"
  - When checked, a small read-only summary block appears showing counts (coffees scanned, favorites, coffees added, tribe)
- **Submit button**: composes a `mailto:r.velez@caldi.coffee` link with subject "Caldi Feedback [rating]" and body containing all fields + optional usage summary
- After clicking submit, the dialog shows a thank-you message with confetti-style text before closing

### 2. `src/features/feedback/components/StarRating.tsx`
A small reusable component: 5 star icons in a row, click to set rating (1-5), click again to deselect. Uses lucide `Star` icon with filled/outlined states.

### 3. `src/features/feedback/components/UsageSummary.tsx`
A read-only card that fetches and displays usage stats for the logged-in user:
- Coffee tribe (from profile)
- Number of coffees scanned (count from `coffee_scans` where `user_id`)
- Number of favorites (count from `user_coffee_favorites` where `user_id`)
- Number of coffees added manually (count from `coffees` where `created_by` and `source = 'manual'`)
This data is fetched via a small React Query hook.

### 4. `src/features/feedback/hooks/useUsageSummary.ts`
React Query hook that runs 3 count queries in parallel and returns `{ tribe, scansCount, favoritesCount, manualCoffeesCount, isLoading }`.

### 5. `src/features/feedback/components/FeedbackTrigger.tsx`
A simple wrapper that renders a button/link and controls the dialog open state. Accepts `children` as the trigger element (flexibility for footer link, nav link, floating button, etc.).

### 6. `src/features/feedback/index.ts`
Barrel exports for `FeedbackDialog`, `FeedbackTrigger`, `StarRating`.

### 7. `src/features/feedback/FeedbackPage.tsx`
A thin page component at `/contact_feedback` that wraps `PageLayout` and auto-opens the `FeedbackDialog` on mount. Also contains the "Who we are" content (a brief about section) so the existing "Who we are" nav link still makes sense. The dialog can also be triggered again via a button on the page.

## Modified Files

### `src/App.tsx`
- Import `FeedbackPage` from `@/features/feedback`
- Add route: `<Route path="/contact_feedback" element={<FeedbackPage />} />`
- No auth required for this route

### `src/constants/app.ts`
- Route already exists as `contactFeedback: "/contact_feedback"` -- no change needed

### `src/components/layout/Footer.tsx`
- Change the existing "Contact" link to use `FeedbackTrigger` wrapping a styled link that opens the dialog directly
- Add a second "Give Feedback" text link that also opens the dialog
- This way feedback is accessible from every page's footer without navigating away

### `src/components/layout/Header.tsx`
- Add `MessageSquare` icon import from lucide-react
- Add a "Feedback" link in mobile navigation menu that opens the `FeedbackDialog` via `FeedbackTrigger`
- Desktop nav keeps the existing "Who we are" link to `/contact_feedback` (page has both about content and feedback trigger)

## User Flow

```text
User on any page
  |
  +-- Clicks "Give Feedback" in Footer --> FeedbackDialog opens (overlay)
  |
  +-- Clicks "Feedback" in mobile menu --> FeedbackDialog opens (overlay)
  |
  +-- Navigates to /contact_feedback --> FeedbackPage with about info + dialog auto-opens
        |
        Fill optional name, email, stars
        Write message (required)
        [x] Include usage summary (if logged in)
        |
        Submit --> mailto: opens email client
        |
        Thank-you message shown
```

## Technical Details

- **Mailto composition**: URL-encode subject and body. Subject format: `Caldi Feedback` or `Caldi Feedback (4/5 stars)`. Body includes name, email, message, and optionally the usage summary text block.
- **Usage summary queries** (only run when user is logged in AND consents):
  - `SELECT count(*) FROM coffee_scans WHERE user_id = ?`
  - `SELECT count(*) FROM user_coffee_favorites WHERE user_id = ?`
  - `SELECT count(*) FROM coffees WHERE created_by = ? AND source = 'manual'`
  - Tribe comes from `profile.coffee_tribe` (already in auth context)
- **No database writes** -- pure mailto approach keeps it lightweight
- **Dialog state**: managed via React state in `FeedbackTrigger`, or via URL param on the `/contact_feedback` page
- **Design**: 4px borders, Bangers headings, Inter body text, sticker shadows on cards/buttons
