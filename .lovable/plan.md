

## Redesign Hero Section: Split-Screen Two-Column Layout

This plan replaces the current centered hero with a modern split-screen layout matching the provided reference design.

### Changes Overview

2 files modified, 1 asset added.

---

### 1. Copy Illustration Asset

Copy the uploaded illustration `ilustration_Duo_and_Goat_NoBG_1.png` into `src/assets/characters/` for use as an ES6 module import.

---

### 2. `src/pages/Index.tsx` -- Rewrite HeroSection

Replace the entire `HeroSection` component with a two-column split layout:

**Left Column (Typography and Action):**
- Pill-shaped badge at top: "AI-POWERED COFFEE DISCOVERY" with a coffee icon (lucide `Coffee`), styled with rounded-full, dark background, white text
- Headline using Bangers font:
  - Line 1: "Coffee Got" then "Complicated" with an orange strikethrough (`line-through decoration-accent`) in `text-foreground`
  - Line 2: "Caldi Makes It Simple." in `text-secondary` (teal)
- Body text: The existing `APP_CONFIG.description` paragraph in muted-foreground
- CTA row: The yellow primary `Button` ("Give Caldi AI a try!") linking to `/quiz`, next to a simple "How it works" text link that scrolls down to the features section (using `#features` anchor with `scroll-behavior: smooth`)

**Right Column (Visual):**
- The Duo and Goat illustration imported from `src/assets/characters/`, sized responsively
- A floating speech bubble above the characters: white background, rounded-2xl, border-4, caldi-shadow, with teal text "Let's find your match!" -- uses `animate-float` for a gentle bobbing effect

**Background:**
- `path-to-clarity.svg` as a full-bleed background (already imported), layered over the cream `--background` color
- Subtle gradient overlay for readability

**Mobile layout:**
- Stacks vertically: badge, headline, body text, CTA, then illustration below with speech bubble
- Illustration scales down appropriately

**Desktop layout:**
- Two-column grid (`grid md:grid-cols-2`), left column vertically centered, right column with illustration

---

### 3. `src/pages/Index.tsx` -- Add anchor to FeaturesSection

Add `id="features"` to the FeaturesSection `<section>` element so the "How it works" link can scroll to it.

---

### 4. Remove unused imports

- Remove `ChevronDown` import (scroll indicator removed)
- Add `Coffee` icon import from lucide-react
- Add the illustration asset import

---

### Technical Details

- The strikethrough effect uses Tailwind's `line-through decoration-[color] decoration-[thickness]` utilities for the orange line crossing out "Complicated"
- The speech bubble uses absolute positioning relative to the illustration container
- Smooth scrolling to `#features` handled via `<a href="#features">` with CSS `scroll-behavior: smooth` on the html element
- The `PageLayout` wrapper with `heroHasLogo` remains unchanged
- `FeaturesSection` and `CTASection` remain as-is below the hero

