
# Complete i18n Coverage: All Remaining Pages

## Problem
Many pages still have hardcoded English strings that don't switch when Spanish is selected. The screenshot confirms the Profile page shows "THE OWL", "The Optimizer", tribe descriptions, "Change Password", "Retake Coffee Quiz" all in English even when the app is set to Spanish.

## Scope of Untranslated Content

The following pages/components have hardcoded English strings that need translation:

### 1. Profile Page Components
- **TribeSection.tsx** -- tribe card (name, title, description), "Discover your Coffee Tribe!", "Take the Quiz"
- **ChangePasswordForm.tsx** -- "Change Password", "New Password", "Confirm Password", "Update Password"
- **RetakeQuizSection.tsx** -- "Retake Coffee Quiz", "Start Quiz Again", description text
- **ProfileInfoForm.tsx** -- "Display Name", "Email", "City", "Save Profile", "Email cannot be changed"
- **ProfileHero.tsx** -- "Edit cover", "Your name", "City (optional)", "Coffee Lover", "Name is required"
- **FavoritesTable.tsx** -- "Favorites", table headers (Coffee, Brand, Added), empty state, "Show less", "View more"
- **InventoryTable.tsx** -- "Inventory", table headers (Coffee, Brand, Qty, Purchased), empty state

### 2. Tribe Data (tribes.ts)
- Tribe names ("The Fox", "The Owl", etc.), titles ("The Tastemaker", "The Optimizer", etc.), descriptions, values, and coffee recommendations all need Spanish variants
- This requires a structural change: instead of static data, tribe display strings will be resolved through `t()` keys

### 3. Quiz Components
- **OnboardingModal.tsx** -- 5 slide headlines + bodies, "Skip", "Next", "Let's Go!"
- **ScenarioScreen.tsx** -- category badges, questions, option labels + descriptions (all from scenarios.ts)
- **QuizNavigation.tsx** -- "Skip", "See My Results", "Next Scenario"
- **QuizProgress.tsx** -- "Scenario X/Y"
- **ResultsPreview.tsx** -- "Your Results So Far"
- **TribeReveal.tsx** -- tribe name/title/description/values (uses tribes.ts data)
- **ResultsPage.tsx** -- "Coffees Curated For Your Psychology", "Your Coffee Keywords", CTAs, status messages

### 4. Auth Pages
- **Auth.tsx** -- "Welcome Back", "Join Caldi's Cup", "Sign in to your account", "Create your account"
- **LoginForm.tsx** -- "Email", "Password", "Sign In", "Signing in...", error messages, "Don't have an account?"
- **SignupForm.tsx** -- "Display Name (optional)", "Create Account", "Creating account...", "Already have an account?"

### 5. Coffee Profile Components
- **CoffeeInfo.tsx** -- "New Coffee Detected!", "Verified", "by", "Origin not specified", "Roast", "Cupping Score"
- **CoffeeAttributes.tsx** -- "Coffee Attributes", "Body", "Acidity", "Sweetness", slider labels, "Sign in to rate"
- **CoffeeFlavorNotes.tsx** -- "Flavor Notes", "Add a flavor note...", helper text
- **CoffeeDescription.tsx** -- "About This Coffee", "Jargon Buster"
- **CoffeeScanMatch.tsx** -- "Your Match Score", tribe-aware phrases, "Why this matches/doesn't match", "AI Confidence", "Sign in to rate"
- **CoffeeActions.tsx** -- "Add to Favorites", "Favorited", "Add to Inventory", "In Inventory", "Scan Another", toast messages
- **ReportScanErrorDialog.tsx** -- "Report Error", "Report Scan Error", form labels
- **CoffeeProfilePage.tsx** -- "Coffee Not Found", "Go Back", "Back to Scanner"

### 6. Scanner Components
- **ScanUploader.tsx** -- "Scan Your Coffee Bag", "Take Photo", "Upload", "Change Image", "Processing Image"
- **ManualAddForm.tsx** -- "Add Coffee Manually", all form labels and placeholders
- **ScanProgress.tsx** -- step labels ("Uploading", "Analyzing", "Enriching", "Complete"), "Time elapsed"
- **ScanningTips.tsx** -- all tip titles and descriptions (generic + tribe-specific)

### 7. Shared Components
- **FeedbackCTA.tsx** -- "Got thoughts?", "Help us brew...", "Share Your Feedback"

## Technical Approach

### Dictionary Expansion
Add all new keys to both `src/i18n/en.ts` and `src/i18n/es.ts` under new sections:
- `profile.*` -- expand with all profile sub-components
- `auth.*` -- new section for login/signup
- `quiz.onboarding.*`, `quiz.scenarios.*`, `quiz.navigation.*`, `quiz.results.*`
- `coffee.*` -- new section for coffee profile page
- `scanner.uploader.*`, `scanner.manual.*`, `scanner.progress.*`, `scanner.tips.*`
- `tribes.*` -- tribe names, titles, descriptions, values translated per language
- `shared.*` -- FeedbackCTA and other shared strings

### Tribe Data Architecture Change
The current `tribes.ts` has hardcoded English strings. To translate tribe content:
- Add tribe display data to the i18n dictionaries under `tribes.fox.name`, `tribes.fox.title`, `tribes.fox.description`, etc.
- Components that display tribe info (TribeSection, TribeReveal, ResultsPage, ProfileHero) will use `t()` to resolve tribe strings instead of reading directly from the static TRIBES object
- The TRIBES object keeps structural data (id, emoji, colorClass, bgClass, keywords, coffeeRecommendations) but display strings come from i18n

### Scenario Data Architecture Change
Similarly, quiz scenarios (questions, option labels, descriptions, categories) will be moved to i18n dictionaries keyed by scenario ID.

### Component Updates
Each component listed above will:
1. Import `useLanguage` from `@/contexts/language`
2. Destructure `const { t } = useLanguage()`
3. Replace every hardcoded English string with the corresponding `t('section.key')` call

### Layout Safety
- Spanish text is 20-40% longer than English
- All containers already use responsive layouts (flex-wrap, truncate, max-w constraints)
- Button labels like "Agregar a Favoritos" or "Agregar al Inventario" are longer but buttons use `flex-1 min-w-[140px]` which accommodates this
- Table headers are short words in both languages
- Quiz scenario text uses responsive `text-2xl md:text-3xl` with no fixed widths

## Files to Modify

| File | Changes |
|------|---------|
| `src/i18n/en.ts` | Add ~200 new translation keys |
| `src/i18n/es.ts` | Add ~200 matching Spanish keys |
| `src/features/profile/components/TribeSection.tsx` | Use `t()` for all strings |
| `src/features/profile/components/ChangePasswordForm.tsx` | Use `t()` for all strings |
| `src/features/profile/components/RetakeQuizSection.tsx` | Use `t()` for all strings |
| `src/features/profile/components/ProfileInfoForm.tsx` | Use `t()` for all strings |
| `src/features/profile/components/ProfileHero.tsx` | Use `t()` for all strings |
| `src/features/profile/components/FavoritesTable.tsx` | Use `t()` for all strings |
| `src/features/profile/components/InventoryTable.tsx` | Use `t()` for all strings |
| `src/features/quiz/components/OnboardingModal.tsx` | Use `t()` for slides |
| `src/features/quiz/components/ScenarioScreen.tsx` | Use `t()` for scenario text |
| `src/features/quiz/components/QuizNavigation.tsx` | Use `t()` for buttons |
| `src/features/quiz/components/QuizProgress.tsx` | Use `t()` for labels |
| `src/features/quiz/components/ResultsPreview.tsx` | Use `t()` for heading |
| `src/features/quiz/components/TribeReveal.tsx` | Use `t()` for tribe data |
| `src/features/quiz/ResultsPage.tsx` | Use `t()` for all CTA text |
| `src/features/quiz/data/scenarios.ts` | Add `i18nKey` fields or move text to i18n |
| `src/pages/Auth.tsx` | Use `t()` for titles/subtitles |
| `src/components/auth/LoginForm.tsx` | Use `t()` for all labels |
| `src/components/auth/SignupForm.tsx` | Use `t()` for all labels |
| `src/features/coffee/CoffeeProfilePage.tsx` | Use `t()` for error/nav text |
| `src/features/coffee/components/CoffeeInfo.tsx` | Use `t()` for labels |
| `src/features/coffee/components/CoffeeAttributes.tsx` | Use `t()` for labels |
| `src/features/coffee/components/CoffeeFlavorNotes.tsx` | Use `t()` for labels |
| `src/features/coffee/components/CoffeeDescription.tsx` | Use `t()` for headings |
| `src/features/coffee/components/CoffeeScanMatch.tsx` | Use `t()` for labels + tribe phrases |
| `src/features/coffee/components/CoffeeActions.tsx` | Use `t()` for button labels |
| `src/features/coffee/components/CoffeeJargonBuster.tsx` | Use `t()` for heading |
| `src/features/coffee/components/ReportScanErrorDialog.tsx` | Use `t()` for all text |
| `src/features/scanner/components/ScanUploader.tsx` | Use `t()` for all text |
| `src/features/scanner/components/ManualAddForm.tsx` | Use `t()` for all labels |
| `src/features/scanner/components/ScanProgress.tsx` | Use `t()` for step labels |
| `src/features/scanner/components/ScanningTips.tsx` | Use `t()` for tips |
| `src/components/shared/FeedbackCTA.tsx` | Use `t()` for all text |

## Estimated Impact
- ~35 files modified
- ~400 new i18n keys total (200 per language)
- Zero new dependencies
- No structural/routing changes
