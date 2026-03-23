

# Plan: Mobile-Friendly Stats Redesign

## Problem

On mobile, the 5 stat cards render in a 2-column grid with tall, padded cards — taking up excessive vertical space and feeling clunky. The desktop 5-column layout is fine and stays as-is.

## Solution: Compact Pill Stats on Mobile

On mobile, switch to a horizontal scrollable row of compact "pill" stats — icon + metric + label inline, no big padding or shadows. On desktop (md+), keep the current 5-column card grid unchanged.

```text
Mobile (horizontal scroll, compact pills):
┌──────────────────────────────────────────────┐
│ [🔥 7 Streak] [🎯 5/10 Goal] [⭐ 240 XP] → │
└──────────────────────────────────────────────┘

Desktop (unchanged):
[Streak] [Goal] [XP] [Favs] [Inventory]
```

## Changes

### 1. `ProfileStatCard.tsx` — Add compact variant

- Add a `compact` prop (boolean, default false)
- When `compact`: render as a horizontal pill — `flex-row` layout, smaller icon (h-7 w-7), inline metric+label, reduced padding (px-3 py-2), `rounded-full`, thinner border (2px), smaller shadow (2px 2px)
- When not compact: existing card layout (no changes)

### 2. `ProfilePage.tsx` — Responsive stats layout

- Use `useIsMobile()` hook
- Mobile: render stats in a `flex overflow-x-auto gap-3` horizontal scroll container, passing `compact` to each stat card
- Desktop: keep existing `grid grid-cols-5 gap-4` with full cards
- Hide the "📊 Your Stats" heading on mobile (stats are self-explanatory as pills) or keep it smaller

### Files Modified

| File | Change |
|------|--------|
| `ProfileStatCard.tsx` | Add `compact` prop for pill variant |
| `ProfilePage.tsx` | Responsive: scroll pills on mobile, grid on desktop |

