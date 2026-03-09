

# Fix: Scanner and Coffee Profile UI Issues on Small Screens

## Issues Identified

### 1. Scanner Upload Zone Overflow (Pictures 1 & 2)
**Root cause**: The upload zone uses `p-8` padding and buttons in a `flex gap-3` without wrapping. On small iPhones, the content overflows the dashed border area.

**Fix in `ScanUploader.tsx`**:
- Reduce inner padding from `p-8` to `p-4 sm:p-8` on the empty-state upload zone (line 195)
- Add `flex-wrap` to the button container (line 208) so buttons stack on narrow screens
- For the "has images" state (line 158), add `flex-wrap` to the CTA buttons container

### 2. Duplicate Progress Message (Picture 3)
**Root cause**: `ScanProgress.tsx` displays `progress.message` twice:
1. Line 34: Under the progress bar as `<p>{progress.message}</p>`
2. Line 52: In the yellow animated section as `<span>{progress.message}</span>`

**Fix in `ScanProgress.tsx`**: Remove the `<p>` on line 34 (the one under the progress bar). Keep only the animated yellow one.

### 3. Progress Messages Not Translated (Picture 3)
**Root cause**: `SCAN_PROGRESS_STATES` in `scanner.ts` (lines 70-77) has hardcoded English strings like `"AI is analyzing your coffee bag..."`. These are NOT using i18n keys.

**Fix in `ScanProgress.tsx`**: Instead of displaying `progress.message` directly, map each `progress.status` to a translated string using the `t()` function. Add new i18n keys for the progress messages:
- `scanner.progressUploading`: "Uploading image..." / "Subiendo imagen..."
- `scanner.progressAnalyzing`: "AI is analyzing your coffee bag (this may take 20-30 seconds)..." / "La IA está analizando tu bolsa de café (esto puede tomar 20-30 segundos)..."
- `scanner.progressEnriching`: "Almost done! Saving results..." / "¡Casi listo! Guardando resultados..."
- `scanner.progressComplete`: "Scan complete!" / "¡Escaneo completo!"

### 4. "Sign in to save this image" Not Translated (Picture 4)
**Root cause**: `CoffeeImage.tsx` lines 32-33 have hardcoded English: `"Sign in"` and `"to save this image to your collection"`.

**Fix**: Replace with `t()` calls. Add new i18n keys:
- `coffee.signInLink`: "Sign in" / "Inicia sesión"
- `coffee.saveImageToCollection`: "to save this image to your collection" / "para guardar esta imagen en tu colección"

### 5. CTA Layout Not Consistent — Force 2x2 Grid (Pictures 5 & 6)
**Root cause**: `CoffeeActions.tsx` uses `flex flex-wrap gap-3` with `min-w-[140px]` which renders inconsistently across screen sizes.

**Fix in `CoffeeActions.tsx`**: Replace the two `<div className="flex flex-wrap gap-3">` containers with a single `grid grid-cols-2 gap-3` layout. Place all 4 buttons (Favorites, Inventory, Scan Another, Report Error) in the 2x2 grid. Move the Share button outside the grid or into one of the cells.

### 6. Jargon Buster Translation Issue (Picture 7)
**Root cause**: Looking at Picture 7, the section title `t('coffee.jargonBuster')` translates correctly ("Traductor de Jerga"). The issue is likely that the **jargon explanation content** comes from the AI in English and is not translated. Since jargon content is AI-generated (dynamic), we cannot translate the body text via i18n. However, I need to check if there's a label or heading that's wrong. 

Looking more carefully — the `CoffeeJargonBuster` uses `t('coffee.jargonBuster')` which maps to "Traductor de Jerga" in Spanish. The jargon **terms** (keys from `jargonExplanations`) are displayed with `capitalize` styling. If the user is seeing English labels, it could be that the term keys themselves are in English from the AI. Since these are dynamic AI-generated content, they are excluded from translation per project constraints. 

However, the user explicitly says "there is another translation mistake." Let me check if there's a missing or wrong key. The `jargonBuster` key exists in both files. Perhaps the issue is that the component heading itself doesn't render the translated version due to a bug — I'll need to verify. Given the user says it's a translation mistake, I'll ensure the key mapping is correct and add any missing pieces.

## Summary of File Changes

| File | Changes |
|------|---------|
| `ScanUploader.tsx` | Reduce padding, add `flex-wrap` to button containers |
| `ScanProgress.tsx` | Remove duplicate message under progress bar; use translated status messages |
| `CoffeeImage.tsx` | Replace hardcoded English text with i18n keys |
| `CoffeeActions.tsx` | Switch from `flex flex-wrap` to `grid grid-cols-2` for consistent 2x2 layout |
| `scanner.ts` | No changes needed (messages will be overridden in component) |
| `en.ts` | Add new keys: `progressUploading`, `progressAnalyzing`, `progressEnriching`, `progressComplete`, `coffee.signInLink`, `coffee.saveImageToCollection` |
| `es.ts` | Add same keys with Spanish translations |

7 files, all frontend. No backend changes.

