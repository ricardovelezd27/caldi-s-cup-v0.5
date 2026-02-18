
# Bilingual Support: Spanish & English with Language Selector

## Approach

Build a lightweight, custom i18n system using React Context — no external library needed. This avoids adding a heavy dependency and keeps full control over layout safety. The language preference is persisted to `localStorage` so it survives page reloads.

The language selector (ES / EN toggle) will sit in the top-left of the header, between the logo and the nav links on desktop, and at the top of the mobile sheet menu.

---

## Architecture

```text
src/
  contexts/
    language/
      LanguageContext.tsx   <-- NEW: context + hook + provider
      index.ts              <-- NEW: exports
  i18n/
    en.ts                   <-- NEW: all English strings
    es.ts                   <-- NEW: all Spanish strings
    index.ts                <-- NEW: type + union export
  components/
    layout/
      Header.tsx            <-- EDIT: add LanguageSelector + useLanguage
      Footer.tsx            <-- EDIT: translate static strings
  pages/
    Index.tsx               <-- EDIT: translate hero, features, CTA
  features/
    feedback/FeedbackPage.tsx    <-- EDIT: translate Our Story page
    blog/BlogPage.tsx            <-- EDIT: translate
    scanner/ScannerPage.tsx      <-- EDIT: translate
    quiz/QuizPage.tsx            <-- EDIT: translate
    quiz/components/QuizHook.tsx <-- EDIT: translate
    profile/ProfilePage.tsx      <-- EDIT: translate section headings
  App.tsx                        <-- EDIT: wrap with LanguageProvider
```

---

## Step 1: New Files

### `src/i18n/en.ts` — Master English dictionary

All strings currently hardcoded across the active pages, grouped by section. This becomes the source of truth.

Key sections:
- `nav` — Label Scanner, My Profile, Our Story, The Brew Log, Sign In, Sign Out, Feedback
- `hero` — badge, headline, body, CTA buttons
- `features` — section title + 3 feature cards (title + description each)
- `footer` — Explore, Company, Get in Touch, social, copyright
- `scanner` — page title, tab labels, alert messages, tips
- `quiz` — hook screen, progress, navigation, scenario categories
- `ourStory` — all sections of the Feedback/Story page
- `blog` — coming soon text
- `profile` — section headings, form labels
- `common` — shared strings (Loading, Error, Try Again, etc.)

### `src/i18n/es.ts` — Spanish translations

All the same keys, translated to natural Spanish (not machine-translated tone). Example highlights:
- `"Label Scanner"` → `"Escáner de Etiquetas"`
- `"Coffee Got Complicated"` → `"El Café Se Complicó"`
- `"Caldi Makes It Simple."` → `"Caldi Lo Simplifica."`
- `"Give Caldi AI a Try!"` → `"¡Prueba Caldi AI!"`
- `"Find Your Coffee Tribe"` → `"Encuentra Tu Tribu Cafetera"`
- `"Scan & Understand Any Coffee"` → `"Escanea y Entiende Cualquier Café"`
- `"Our Story"` → `"Nuestra Historia"`
- `"The Brew Log"` → `"El Diario del Café"`
- `"Sign In"` → `"Iniciar Sesión"`
- `"Sign Out"` → `"Cerrar Sesión"`

### `src/contexts/language/LanguageContext.tsx`

```typescript
type Language = 'en' | 'es';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string; // nested key accessor e.g. t('nav.scanner')
}
```

- Initializes from `localStorage.getItem('caldi_lang')` or browser's `navigator.language` (defaults to `'en'` if not `'es'`)
- Persists changes back to `localStorage`
- Exposes `t()` helper that resolves dot-notation keys from the active dictionary

---

## Step 2: Language Selector Component (inside Header)

A compact, pill-shaped toggle rendered in the header nav between logo and nav items on desktop, and at the top of the mobile sheet:

```
[ ES | EN ]
```

- Active language shown in `text-primary font-bold`
- Inactive in `text-muted-foreground`
- Separated by a `|` divider
- Uses `border-2 border-border` and the existing `shadow-[4px_4px_0px...]` style to match the design system
- On mobile: shown at the top of the Sheet nav, full-width pill

---

## Step 3: Apply Translations to Active Pages

Each page will import `useLanguage()` and replace hardcoded strings with `t('key')` calls.

### Layout safety notes for Spanish:
Spanish strings are generally 20-40% longer than English. To prevent overflow:
- All nav items already use `text-sm` — safe
- Hero headline uses `font-bangers` with `leading-tight` — will remain responsive
- Feature card descriptions use `max-w` constraints — will naturally wrap
- Footer nav items are short labels — safe
- No `whitespace-nowrap` used on translatable text (the speech bubble in the hero already has `whitespace-nowrap` — that specific string `"Let's find your match!"` will also be translated and the bubble will auto-expand since it has no fixed width)
- Mobile sheet items use `text-lg` with `py-2` flex rows — adequate space for longer Spanish labels

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/i18n/en.ts` | English string dictionary |
| `src/i18n/es.ts` | Spanish string dictionary |
| `src/i18n/index.ts` | Type exports |
| `src/contexts/language/LanguageContext.tsx` | Context + provider + hook |
| `src/contexts/language/index.ts` | Barrel export |

## Files to Edit

| File | Change |
|------|--------|
| `src/App.tsx` | Wrap app in `<LanguageProvider>` |
| `src/components/layout/Header.tsx` | Add `LanguageSelector`, replace all strings with `t()` |
| `src/components/layout/Footer.tsx` | Replace all static strings with `t()` |
| `src/pages/Index.tsx` | Replace hero/features/CTA strings with `t()` |
| `src/features/feedback/FeedbackPage.tsx` | Replace all page content with `t()` |
| `src/features/blog/BlogPage.tsx` | Replace strings with `t()` |
| `src/features/scanner/ScannerPage.tsx` | Replace UI strings with `t()` |
| `src/features/quiz/QuizPage.tsx` | Replace nav/progress strings with `t()` |
| `src/features/quiz/components/QuizHook.tsx` | Replace hook screen strings with `t()` |
| `src/features/profile/ProfilePage.tsx` | Replace section headings with `t()` |
| `src/constants/app.ts` | `APP_CONFIG.description` becomes a key, description moves to i18n |

---

## What is NOT translated (by design)

- Coffee names, flavor notes, origin names — these are proper nouns and stay in English
- Quiz tribe names (Fox, Owl, etc.) — brand identifiers
- Dynamic content returned from the AI scanner backend — that is AI-generated text, outside scope
- Email addresses and social links

