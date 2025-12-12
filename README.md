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

### Design System

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

### Folder Structure

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
