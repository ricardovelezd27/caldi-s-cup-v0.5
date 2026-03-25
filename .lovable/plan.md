## Plan: Learning Hub Widget + Persist Onboarding Choices — IMPLEMENTED

### What was done

1. **Database Migration** — Added `learning_hub` to `widget_type` enum
2. **LearningHubWidget** — New dashboard widget showing daily XP goal ring, streak, and "Continue Learning" CTA linking to the user's preferred track
3. **Widget Registration** — Registered in `widgetRegistry.ts` as a user-manageable widget (icon 📚, 2×1 default)
4. **Persist Onboarding Choices** — `OnboardingFlow.tsx` now writes the daily goal to `learning_user_daily_goals` and auto-creates the Learning Hub widget with `preferredTrack` config for authenticated users
5. **i18n** — Added `learningHub`, `continueLearning`, `dailyProgress` keys in EN and ES

### Files created
- `src/features/dashboard/widgets/LearningHubWidget.tsx`

### Files modified
- `src/features/onboarding/OnboardingFlow.tsx`
- `src/features/dashboard/widgets/widgetRegistry.ts`
- `src/features/dashboard/widgets/index.ts`
- `src/i18n/en.ts`
- `src/i18n/es.ts`

### New Files

#### 1. `src/features/onboarding/hooks/useOnboarding.ts`
- Manages state in localStorage (`caldi_onboarding` key added to `storageKeys.ts`): `{ step: 'interest' | 'goal' | 'done', selectedTrackId, selectedGoalXp, hasCompleted }`
- Provides `setTrack()`, `setGoal()`, `markCompleted()`, `reset()`
- On mount, loads from localStorage; on every change, persists

#### 2. `src/features/onboarding/steps/InterestPicker.tsx`
- Fetches tracks via `getTracks()` from learningService
- Renders a 2x2 grid of track cards (icon + name + description, using existing `LearningTrack` data and `useLanguage` for ES/EN)
- On select, calls `onSelect(trackId)` to advance

#### 3. `src/features/onboarding/steps/GoalPicker.tsx`
- Renders the 4 tiers from `dailyGoals.ts` in a vertical list (reuses the same layout as `DailyGoalSelector`)
- On confirm, calls `onSelect(goalXp)` to advance

#### 4. `src/features/onboarding/OnboardingFlow.tsx`
- Step machine: `interest` → `goal` → navigate to `/learn/<trackId>/<firstLessonId>`
- After goal is selected, fetches the first lesson of the chosen track (sections → units → lessons, pick sort_order 0) and navigates
- Uses `useOnboarding()` for state
- For authenticated users, writes the selected daily goal to `learning_user_daily_goals` and auto-creates the Learning Hub widget with `preferredTrack` config

#### 5. `src/features/onboarding/index.ts`
- Barrel export

### Modified Files

#### 6. `src/constants/storageKeys.ts`
- Add `ONBOARDING: 'caldi_onboarding'`

#### 7. `src/constants/app.ts`
- Add `onboarding: "/onboarding"` to ROUTES

#### 8. `src/App.tsx`
- Add lazy import for `OnboardingFlow` and `/onboarding` route

#### 9. `src/pages/Index.tsx`
- Add a "Start Learning Free →" button in the CTA row below the existing scanner CTA, linking to `/onboarding`

#### 10. `src/features/learning/components/lesson/LessonComplete.tsx`
- For anonymous users (`!user`), show a "Create Account to Save Progress" CTA button (Link to `/auth`) below the XP breakdown, using the existing `SignupPrompt` benefit style

#### 11. `src/i18n/en.ts` & `src/i18n/es.ts`
Add keys:
| Key | EN | ES |
|---|---|---|
| `onboarding.pickInterest` | What do you want to learn? | ¿Qué quieres aprender? |
| `onboarding.pickGoal` | Set your daily goal | Establece tu meta diaria |
| `onboarding.startLearning` | Start Learning Free | Empieza a Aprender Gratis |
| `onboarding.saveProgress` | Create Account to Save Progress | Crea una Cuenta para Guardar tu Progreso |
| `onboarding.letsGo` | Let's go! | ¡Vamos! |
| `learningHub` | Learning Hub | Hub de Aprendizaje |
| `continueLearning` | Continue Learning | Continúa Aprendiendo |
| `dailyProgress` | Daily Progress | Progreso Diario |

### Technical Details
- First lesson lookup: After goal selection, query sections (sort_order 0) → units (sort_order 0) → lessons (sort_order 0) for the selected track to find the first lesson ID
- The onboarding state persists so refreshing mid-flow resumes at the correct step
- If a user has `hasCompleted: true` in localStorage and visits `/onboarding` again, redirect straight to `/learn`
