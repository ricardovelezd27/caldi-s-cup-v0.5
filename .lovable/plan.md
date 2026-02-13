
# Redesign "Who We Are" Page (FeedbackPage)

## Overview
Transform the current minimal "Who We Are" section into a rich, multi-section storytelling page with two-column layouts on desktop that stack on mobile. The page uses the existing Caldi design system (Bangers headings, Inter body, 4px borders, brand colors). Ricardo's profile photo and the Duo-and-Goat illustration are embedded as assets. The feedback dialog trigger and footer CTA remain intact.

## New Asset
- Copy `user-uploads://Profile_picture_Ricardo.png` to `src/assets/characters/ricardo-profile.png`

## File Changes

### `src/features/feedback/FeedbackPage.tsx` (full rewrite)
The page becomes a long-scroll storytelling page with these sections:

1. **Hero / Intro**: "The Story Behind Your Next Great Cup"
   - Two-column on desktop: text left, Duo-and-Goat illustration right
   - Stacks on mobile (image on top, text below)
   - Summarized text: the "coffee aisle frustration" origin story and AI companion pitch

2. **Why "Caldi"?**
   - Two-column: illustration (Duo and Goat) left, text right (swap from hero)
   - The Kaldi legend + Colombian "C" homage
   - Uses `CaldiCard` for the story block

3. **Why This Matters**
   - Two-column: Ricardo's photo (circular, bordered) left, text right
   - Ricardo's three passions as a compact list with emoji markers
   - Uses secondary color accent

4. **A Personal Mission** (quote block)
   - Full-width `CaldiCard` with secondary/5 background
   - Ricardo's personal statement about Colombia, coffee farmers, and coca farming
   - Styled as a blockquote with left border accent

5. **Our North Star** (Mission / Vision)
   - Two-column grid: Mission card left, Vision card right
   - Each in a `CaldiCard` with heading and body text
   - Stacks on mobile

6. **The Journey Ahead** (roadmap)
   - Three-step horizontal layout on desktop (Today / Tomorrow / Future)
   - Stacks vertically on mobile
   - Simple text badges with secondary color highlights

7. **CTA Section**
   - "Ready to discover something extraordinary?"
   - Reuses the same CTA button pattern from Index: `Give Caldi AI a Try!` linking to `/quiz`
   - Signature line: "With purpose and passion, Ricardo, Founder"

8. **Connect / Feedback**
   - Social icons: LinkedIn and Instagram (using lucide `Linkedin` and `Instagram` icons) linking to the provided URLs
   - "Give Us Feedback" button opening the `FeedbackDialog`

### Design Patterns
- All headings use `font-bangers tracking-wide`
- Body text uses `text-muted-foreground` with Inter
- Two-column sections use `grid md:grid-cols-2 gap-8 items-center`
- Mobile stacking is automatic via the grid (single column default)
- Colors stay within the brand palette: secondary (#4db6ac) for accents, primary (#F1C30F) for CTAs, foreground (#2C4450) for text
- Images use rounded corners and the 4px border/shadow treatment where appropriate
- Ricardo's photo is displayed as a circular avatar with border

### No other files change
- Header, Footer, App.tsx routes all remain the same
- FeedbackDialog and FeedbackTrigger are unchanged
