

## Plan: Add "What's Next" Card for Anonymous Users on Coffee Profile

### Summary
Add a new component `WhatsNextCard` rendered at the bottom of the coffee profile page, visible only when no user is logged in. It features the Caldi mascot (celebrating mood) and three CTAs.

### Changes

**1. New component: `src/features/coffee/components/WhatsNextCard.tsx`**
- Uses `useAuth` to confirm `!user` (caller already gates rendering, but defensive)
- Renders Caldi mascot via `MascotCharacter` with `mood="celebrating"` and `size="lg"`
- Card styled with `border-4 border-border shadow-[4px_4px_0px_0px_hsl(var(--border))] rounded-lg`
- Three CTAs using `Link` + `Button`:
  - Primary: `t("coffee.whatsNext.discoverTribe")` → `/quiz`
  - Secondary (outline): `t("coffee.whatsNext.signUp")` → `/auth`
  - Tertiary (ghost): `t("coffee.whatsNext.scanAnother")` → `/scanner`
- Heading: `t("coffee.whatsNext.title")` with `font-bangers`

**2. `src/features/coffee/CoffeeProfilePage.tsx`**
- Import `useAuth` and `WhatsNextCard`
- Between `<CoffeeProfile>` and `<FeedbackCTA>`, conditionally render `<WhatsNextCard />` when `!user`
- No changes to existing coffee profile logic

**3. `src/i18n/en.ts`** — Add under `coffee`:
```
whatsNextTitle: "What's Next?",
whatsNextDiscover: "Discover Your Coffee Tribe",
whatsNextSignUp: "Sign Up to Save This Coffee",
whatsNextScanAnother: "Scan Another Coffee",
```

**4. `src/i18n/es.ts`** — Add matching Spanish keys:
```
whatsNextTitle: "¿Qué sigue?",
whatsNextDiscover: "Descubre Tu Tribu de Café",
whatsNextSignUp: "Regístrate para Guardar Este Café",
whatsNextScanAnother: "Escanear Otro Café",
```

