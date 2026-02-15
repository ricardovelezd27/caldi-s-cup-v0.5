
# UI Polish: Navigation, Footer, Feedback, and Instructional Text

## Overview

Four targeted improvements: hide the Dashboard nav link, add a compact footer variant for the scanner, fix the mobile feedback trigger, add feedback sections to coffee/scanner/profile pages, and add instructional text above interactive coffee sections.

---

## 1. Hide Dashboard from Desktop Navigation

**File: `src/components/layout/Header.tsx`**

Remove the Dashboard `NavLink` from both desktop and mobile navigation. The Dashboard route remains accessible via direct URL but is not shown in the nav bar.

---

## 2. Compact Footer for Scanner Page

**File: `src/components/layout/Footer.tsx`**

Add a `compact` prop (default `false`). When `true`, render a minimal single-row footer with just the copyright and email link -- no 4-column grid. This keeps the scanner page focused.

**File: `src/components/layout/PageLayout.tsx`**

Add a `compactFooter` prop that passes through to `<Footer compact />`.

**File: `src/features/scanner/ScannerPage.tsx`**

Pass `compactFooter` to PageLayout:
```tsx
<PageLayout compactFooter>
```

---

## 3. Fix Mobile Feedback Trigger in Burger Menu

**File: `src/components/layout/Header.tsx`**

The current `FeedbackTrigger` in the mobile menu calls `setIsOpen(false)` then `setTimeout(() => open(), 300)`. The issue is likely that the `Sheet` unmount destroys the `FeedbackDialog` before it opens. The fix:

- Move the `FeedbackDialog` state management outside the `Sheet` component so the dialog persists after the sheet closes.
- Add a `useState` for `feedbackOpen` at the `Header` level.
- In the mobile menu button: close the sheet, then after 300ms set `feedbackOpen = true`.
- Render `<FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />` outside the `Sheet`.

---

## 4. Feedback Section on Coffee, Scanner, and Profile Pages

Add a feedback CTA section (matching the Our Story page pattern) as the last item on these pages. This is a simple reusable component.

**New file: `src/components/shared/FeedbackCTA.tsx`**

A small card with a "Give Us Feedback" button that opens the `FeedbackDialog`. Styled consistently with the Our Story page's feedback section.

**Files to edit:**
- `src/features/coffee/CoffeeProfilePage.tsx` -- add `<FeedbackCTA />` after `CoffeeProfile`.
- `src/features/scanner/ScannerPage.tsx` -- add `<FeedbackCTA />` at the bottom of the Container.
- `src/features/profile/ProfilePage.tsx` -- add `<FeedbackCTA />` at the bottom of the Container.

---

## 5. Instructional Text Above Interactive Sections

**File: `src/features/coffee/components/CoffeeAttributes.tsx`**

Add a subtle helper line below the heading when the user is authenticated:
> "Drag the sliders to reflect your own experience with this coffee."

**File: `src/features/coffee/components/CoffeeScanMatch.tsx`**

Add below the heading when authenticated:
> "Adjust the score to match how well this coffee suits your taste."

**File: `src/features/coffee/components/CoffeeFlavorNotes.tsx`**

Add below the heading when authenticated:
> "Add or remove tags to describe the flavors you taste."

For guests, these lines are not shown (the existing "Sign in to rate" tooltip suffices).

---

## File Summary

| File | Action | Description |
|------|--------|-------------|
| `src/components/layout/Header.tsx` | Edit | Remove Dashboard link; fix mobile feedback dialog |
| `src/components/layout/Footer.tsx` | Edit | Add `compact` prop for minimal variant |
| `src/components/layout/PageLayout.tsx` | Edit | Pass `compactFooter` prop to Footer |
| `src/features/scanner/ScannerPage.tsx` | Edit | Use compact footer; add FeedbackCTA |
| `src/components/shared/FeedbackCTA.tsx` | New | Reusable feedback call-to-action section |
| `src/features/coffee/CoffeeProfilePage.tsx` | Edit | Add FeedbackCTA at bottom |
| `src/features/profile/ProfilePage.tsx` | Edit | Add FeedbackCTA at bottom |
| `src/features/coffee/components/CoffeeAttributes.tsx` | Edit | Add instructional text for authenticated users |
| `src/features/coffee/components/CoffeeScanMatch.tsx` | Edit | Add instructional text for authenticated users |
| `src/features/coffee/components/CoffeeFlavorNotes.tsx` | Edit | Add instructional text for authenticated users |
