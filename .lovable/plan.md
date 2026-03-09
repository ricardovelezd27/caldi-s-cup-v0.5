

# Plan: Decayed Status UI for Track Path Lessons

## Overview
Add visual styling and coffee-themed microcopy for lessons with `"decayed"` status to encourage review.

## Changes to `src/features/learning/components/track/TrackPathView.tsx`

### 1. Import Coffee Icon
Add `Coffee` to the lucide-react imports (line 2).

### 2. Add Decay Jokes Array
Create bilingual joke arrays at the top of the file:

```typescript
const DECAY_JOKES_EN = [
  "Brrr... your coffee is getting cold! 🥶",
  "These beans are going stale. Time to review! 🫘",
  "Your crema is fading! Reheat your skills. ☕",
  "Extraction dropping... pull this shot again! 📉",
];

const DECAY_JOKES_ES = [
  "Brrr... ¡tu café se está enfriando! 🥶",
  "Estos granos se están poniendo rancios. ¡Hora de repasar! 🫘",
  "¡Tu crema se desvanece! Recalienta tus habilidades. ☕",
  "Extracción bajando... ¡tira este shot de nuevo! 📉",
];
```

Use `lesson.id` to deterministically pick a joke (avoid random re-renders).

### 3. Update LessonNode Component

**Status circle styling** (add to className logic):
```typescript
lesson.status === "decayed" && "bg-amber-100 border-amber-500 text-amber-600"
```

**Icon rendering** (add condition):
```typescript
{lesson.status === "decayed" && <Coffee className="w-5 h-5" />}
```

**Text styling** (add condition for amber color):
```typescript
lesson.status === "decayed" && "text-amber-600"
```

**Subtitle logic**: For decayed lessons, show a random joke instead of "X min · Y XP" in italic amber text.

### 4. Make Decayed Nodes Clickable
Update the link condition to include `"decayed"`:
```typescript
if (lesson.status === "available" || lesson.status === "decayed") {
  return <Link to={...}>{nodeContent}</Link>;
}
```

## Files Modified

| File | Change |
|------|--------|
| `src/features/learning/components/track/TrackPathView.tsx` | Add decayed styling, coffee icon, bilingual jokes |

No database changes.

