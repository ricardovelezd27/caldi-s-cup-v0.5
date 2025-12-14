# Caldi's Cup

> Coffee got complicated, Caldi brings it back to clarity.

## Project Status

### Current System State

**Architecture:** Modular Monolith (React + Vite + Tailwind CSS + TypeScript)

**Phase:** 1 - Foundation & Landing Page MVP

**Status:** UI/UX development in progress (backend integration deferred)

### MVP Scope (Phase 1)

- ✅ Landing Page with Hero, Problem, and Solution sections
- 🔲 Coffee Preference Quiz (4-6 questions)
- 🔲 Results Page with taste profile
- 🔲 Waitlist signup integration

---

## Architectural Decisions

### Modular Monolith Justification

The initial architecture is a **Modular Monolith** as mandated by V03 architectural guidelines. This choice prioritizes:

- **Centralized data management** - Single source of truth
- **Integrated functionality** - Components work together seamlessly
- **Robustness against changes** - Easier refactoring than microservices
- **Simplicity for MVP** - Reduced operational overhead

### UI/UX First Development Approach

Development prioritizes UI/UX completion before backend integration:

1. Complete visual design and interactions
2. Test user flows with mock data
3. Validate design system consistency
4. Then connect Supabase for persistence

### Component Organization Rationale

```
src/components/
├── ui/        → shadcn primitives (untouched)
├── layout/    → Page structure (Header, Footer, PageLayout)
└── shared/    → Brand components (CaldiCard, SectionHeading, Container)
```

This separation ensures:
- UI primitives remain upgrade-safe
- Layout components handle page structure
- Shared components enforce brand consistency

---

## Design System

**Color Hierarchy (60/30/10 Rule):**
- 60% Foam White (`#FDFCF7`) - backgrounds
- 30% Clarity Teal (`#4db6ac`) - main accent
- 10% Energy Yellow (`#F1C30F`) - primary CTAs

**Supporting Colors:**
- Bean Black (`#2C4450`) - text, borders, shadows
- Warm Orange (`#E67E22`) - secondary highlights
- Chaos Red (`#E74C3C`) - warnings/errors only

**Typography:**
- Headings: `Bangers` (cursive), letter-spacing 0.05em
- Body: `Inter` (sans-serif), weights 400/500/700

**Visual Style:**
- 4px solid borders with 4px floating sticker shadow
- Border radius: 0.5rem (8px)

---

## Known Issues / Technical Debt

| Issue | Status | Notes |
|-------|--------|-------|
| ~~Unused import in Header.tsx~~ | ✅ Fixed | Removed dead `logo.svg` import |
| Header logo scroll behavior | 🔲 Planned | Needs fade transition animation |
| Animations deferred | 🔲 Planned | MVP uses static UI per constraint |

---

## Areas of Improvement for Future Sessions

| Area | Current State | Improvement Needed |
|------|--------------|-------------------|
| **Quiz Feature** | Not started | Build 4-6 question card-based quiz |
| **Waitlist** | Not started | Add email capture with validation |
| **Results Page** | Not started | Display personalized taste profile |
| **Animations** | Deferred | Add bouncy micro-interactions (Phase 2) |
| **Header Scroll** | Basic | Add fade transition for logo reveal |
| **Dark Mode** | CSS Ready | Add toggle UI and localStorage persistence |
| **Mobile Nav** | Empty placeholder | Add hamburger menu when pages expand |
| **Testing** | None | Add unit tests per TDD mandate |
| **Accessibility** | Basic semantic HTML | Add ARIA labels, keyboard navigation |
| **SEO** | Minimal | Add meta tags, structured data |

---

## Security Boundary Summary

| Boundary | Status |
|----------|--------|
| Backend Integration | Not connected (deferred) |
| User Data Collection | None yet |
| Row Level Security (RLS) | N/A until Supabase connected |
| API Keys / Secrets | None in codebase |
| Input Validation | Will implement with quiz/waitlist |

---

## Next Phase Roadmap

### Phase 2: Quiz & Waitlist MVP

1. **Coffee Preference Quiz**
   - 4-6 visual card-based questions
   - Intensity, flavor profile, brewing method, ethics preferences
   - Local state management (mock data first)

2. **Results Page**
   - Personalized taste profile visualization
   - Mock coffee recommendations
   - Share functionality

3. **Waitlist Signup**
   - Email capture form with validation
   - Connect to Supabase for storage
   - Confirmation toast/email

4. **Backend Connection**
   - Enable Lovable Cloud / Supabase
   - Store quiz responses and emails
   - Set up RLS policies

---

## Folder Structure

```
src/
├── assets/           # Images and brand assets
├── components/
│   ├── layout/       # PageLayout, Header, Footer
│   ├── shared/       # CaldiCard, SectionHeading, Container
│   └── ui/           # shadcn components
├── constants/        # APP_CONFIG, ROUTES
├── features/         # Feature modules (quiz, etc.)
├── hooks/            # Custom React hooks
├── pages/            # Route pages
└── types/            # TypeScript type definitions
```

### Active Assets

- `src/assets/characters/caldi-modern-chest.png` - Modern Caldi mascot
- `src/assets/backgrounds/path-to-clarity.svg` - Hero background
- `public/favicon.png` - Site favicon

---

## Development

### Prerequisites

- Node.js & npm ([install with nvm](https://github.com/nvm-sh/nvm))

### Quick Start

```sh
npm install
npm run dev
```

### Technologies

- **Vite** - Build tool
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library

## Deployment

Open [Lovable](https://lovable.dev) and click Share → Publish.

## Custom Domain

Navigate to Project > Settings > Domains and click Connect Domain.

[Read more](https://docs.lovable.dev/features/custom-domain)
