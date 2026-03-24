

## Plan: Fix Missing Spanish Translations on Profile Page

### Problem
The profile page dashboard widgets (`WelcomeHeroWidget`, `WeeklyGoalWidget`, `QuickScanWidget`, `FavoritesWidget`, `InventoryWidget`, `RecentScansWidget`, `RecentBrewsWidget`, `RecommendationsWidget`, `CoffeeTribeWidget`, `TribeInfoModal`) all use hardcoded English strings instead of the `t()` translation function. Switching to Spanish has no effect on these components.

### Solution
Add a new `widgets` section to both `en.ts` and `es.ts` i18n files, then replace all hardcoded strings in the 10 widget/modal components with `t("widgets.xxx")` calls.

### New translation keys needed

| Key | EN | ES |
|-----|----|----|
| `widgets.weeklyGoal` | Weekly Goal | Meta Semanal |
| `widgets.lessons` | Lessons | Lecciones |
| `widgets.goalReached` | 🎉 Goal reached! | 🎉 ¡Meta alcanzada! |
| `widgets.moreToGo` | more to go this week | más esta semana |
| `widgets.dayStreak` | day streak | días de racha |
| `widgets.startLearning` | Start learning → | Empezar a aprender → |
| `widgets.scanCoffee` | Scan a Coffee | Escanea un Café |
| `widgets.discoverWithAI` | Discover coffee profiles with AI | Descubre perfiles de café con IA |
| `widgets.startScanning` | Start scanning → | Empezar a escanear → |
| `widgets.favorites` | Favorites | Favoritos |
| `widgets.noFavoritesYet` | No favorites yet | Sin favoritos aún |
| `widgets.scanToDiscover` | Scan to discover → | Escanear para descubrir → |
| `widgets.viewAll` | View all → | Ver todo → |
| `widgets.by` | by | de |
| `widgets.myInventory` | My Inventory | Mi Inventario |
| `widgets.noInventory` | No coffees in inventory | Sin cafés en inventario |
| `widgets.scanToAdd` | Scan to add → | Escanear para añadir → |
| `widgets.recentScans` | Recent Scans | Escaneos Recientes |
| `widgets.noScansYet` | No scans yet | Sin escaneos aún |
| `widgets.scanMore` | Scan more → | Escanear más → |
| `widgets.recentBrews` | Recent Brews | Preparaciones Recientes |
| `widgets.noBrewsYet` | No brews logged yet | Sin preparaciones aún |
| `widgets.startBrewing` | Start brewing to track your progress! | ¡Empieza a preparar para seguir tu progreso! |
| `widgets.coffeeCol` | Coffee | Café |
| `widgets.methodCol` | Method | Método |
| `widgets.whenCol` | When | Cuándo |
| `widgets.forYou` | For You | Para Ti |
| `widgets.aiComingSoon` | AI recommendations coming soon! | ¡Recomendaciones IA próximamente! |
| `widgets.scanMoreForRecs` | Scan more coffees to get personalized suggestions | Escanea más cafés para sugerencias personalizadas |
| `widgets.brewingLevel` | Brewing Level | Nivel de Preparación |
| `widgets.yourTribe` | Your Coffee Tribe | Tu Tribu Cafetera |
| `widgets.discoverPersonality` | Discover your coffee personality! | ¡Descubre tu personalidad cafetera! |
| `widgets.youreA` | You're a | Eres un/a |
| `widgets.readyToDiscover` | Ready to discover your coffee personality? | ¿Listo para descubrir tu personalidad cafetera? |
| `widgets.takeQuiz` | Take the Quiz | Hacer el Quiz |
| `widgets.myTribe` | My Tribe | Mi Tribu |
| `widgets.xpTo` | XP to | XP para |
| `widgets.maxRank` | Max Rank Achieved! ☕🏆 | ¡Rango Máximo Alcanzado! ☕🏆 |
| `widgets.retakeQuiz` | Retake Coffee Quiz | Repetir Quiz del Café |
| `widgets.discoverYourTribe` | Discover Your Tribe | Descubre Tu Tribu |
| `widgets.noTribeYet` | You haven't discovered your coffee tribe yet. | Aún no has descubierto tu tribu cafetera. |
| `widgets.categoryLearn` | Learn | Aprender |
| `widgets.categoryExperience` | Experience | Experiencia |
| `widgets.categoryAI` | AI | IA |

### Files to modify

1. **`src/i18n/en.ts`** — Add `widgets: { ... }` section
2. **`src/i18n/es.ts`** — Add `widgets: { ... }` section
3. **`src/features/dashboard/widgets/WelcomeHeroWidget.tsx`** — Replace hardcoded strings with `t()` calls
4. **`src/features/dashboard/widgets/WeeklyGoalWidget.tsx`** — Replace hardcoded strings
5. **`src/features/dashboard/widgets/QuickScanWidget.tsx`** — Replace hardcoded strings
6. **`src/features/dashboard/widgets/FavoritesWidget.tsx`** — Replace hardcoded strings
7. **`src/features/dashboard/widgets/InventoryWidget.tsx`** — Replace hardcoded strings
8. **`src/features/dashboard/widgets/RecentScansWidget.tsx`** — Replace hardcoded strings
9. **`src/features/dashboard/widgets/RecentBrewsWidget.tsx`** — Replace hardcoded strings
10. **`src/features/dashboard/widgets/RecommendationsWidget.tsx`** — Replace hardcoded strings
11. **`src/features/dashboard/widgets/CoffeeTribeWidget.tsx`** — Replace hardcoded strings
12. **`src/features/dashboard/widgets/TribeInfoModal.tsx`** — Replace hardcoded strings
13. **`src/features/dashboard/widgets/BrewingLevelWidget.tsx`** — Replace hardcoded strings (including `LEVEL_CONFIG` labels)

Each widget component will import `useLanguage` and call `t("widgets.xxx")` for every user-facing string, following the same pattern already used in `EditProfileDialog`, `FeedbackCTA`, and other translated components.

