

## Plan: Fix Homepage "Start Learning" CTA

### What
Change the outline button on the homepage hero from linking to `/onboarding` with label `onboarding.startLearning` to linking to `/quiz` with a new i18n key like `hero.discoverTribe`.

### Changes

**1. `src/pages/Index.tsx` (line ~63)**
- Change `Link to={ROUTES.onboarding}` → `Link to={ROUTES.quiz}`
- Change `t("onboarding.startLearning")` → `t("hero.discoverTribe")`

**2. `src/i18n/en.ts`**
- Add `hero.discoverTribe: "Discover Your Coffee Tribe"`

**3. `src/i18n/es.ts`**
- Add `hero.discoverTribe: "Descubre Tu Tribu de Café"`

No other files touched. Existing `onboarding.startLearning` key preserved.

