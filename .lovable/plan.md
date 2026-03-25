

## Plan: Learning Hub Widget + Persist Onboarding Choices

### Problem
The learning onboarding flow stores the user's chosen track and daily XP goal **only in localStorage** (`caldi_onboarding`). These choices are never written to the database, so they're lost on sign-out or device change. There's also no dashboard widget showing learning progress, making the onboarding feel disconnected.

### Changes

#### 1. Database Migration — Add `learning_hub` to `widget_type` enum
- `ALTER TYPE widget_type ADD VALUE 'learning_hub';`
- This lets us register a new dashboard widget type.

#### 2. Persist onboarding choices to the database
Modify `OnboardingFlow.tsx`: after the goal step completes and the user is authenticated, write the selected daily goal to `learning_user_daily_goals` (via the existing `useDailyGoal().setGoal()` pattern) and store the preferred track on the profile or as widget config. For anonymous users, keep localStorage-only (existing behavior).

Specifically:
- Call `setGoalMutation` with the selected XP goal so it lands in `learning_user_daily_goals`
- Store `selectedTrackId` in the new Learning Hub widget's `config.preferredTrack` when the widget is auto-created

#### 3. Auto-create Learning Hub widget after onboarding
In `OnboardingFlow.tsx`, after persisting choices and before navigating to the first lesson, call `addWidget({ widgetType: 'learning_hub', config: { preferredTrack: selectedTrackId } })` for authenticated users. This ensures the widget appears on their dashboard immediately.

#### 4. New `LearningHubWidget.tsx`
A dashboard widget showing:
- **Daily goal ring** — earned XP / goal XP for today (from `useDailyGoal`)
- **Current streak** — days (from `useStreak`)
- **Preferred track** name + icon (from widget config + track data)
- **CTA button** — "Continue Learning" linking to `/learn` or `/learn/<trackId>`

Follows existing widget conventions: 4px border, hard shadow, category tag ("Learn"), outline CTA button.

#### 5. Register in widget system
- Add `learning_hub` entry in `widgetRegistry.ts` with component + meta
- Widget is user-manageable (not in `HIDDEN_WIDGETS`)

#### 6. i18n keys
| Key | EN | ES |
|---|---|---|
| `widgets.learningHub` | Learning Hub | Centro de Aprendizaje |
| `widgets.continueLearning` | Continue Learning | Continuar Aprendiendo |
| `widgets.dailyProgress` | Today's Progress | Progreso de Hoy |

### Files to create
- `src/features/dashboard/widgets/LearningHubWidget.tsx`

### Files to modify
- `src/features/onboarding/OnboardingFlow.tsx` — persist goal to DB + auto-create widget for authenticated users
- `src/features/dashboard/widgets/widgetRegistry.ts` — register new widget
- `src/i18n/en.ts`, `src/i18n/es.ts` — add keys
- Database migration for enum value

### Technical Notes
- The `widget_type` enum needs a new value via migration before the widget can be inserted
- For anonymous users completing onboarding, the widget will be created when they eventually sign up (the `create_default_widgets` trigger can be updated to include `learning_hub`, or it stays opt-in via the Edit Widgets dialog)
- The `useDailyGoal` hook already supports setting goals — we just need to call it during onboarding completion

