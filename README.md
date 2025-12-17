# Caldi's Cup

> Coffee got complicated, Caldi brings it back to clarity.

## Project Status

### Current System State

**Architecture:** Modular Monolith (React + Vite + Tailwind CSS + TypeScript + Lovable Cloud)

**Phase:** Phase 5 Complete (Authentication Foundation)

**Status:** Full authentication system with Lovable Cloud backend, profiles, and role management

### Completed Features

- ✅ Landing Page with Hero, Problem, and Solution sections
- ✅ Product Page with attributes, flavor chart, roaster info
- ✅ Marketplace Browse with filters, sorting, pagination
- ✅ Roaster Storefront with tabs and product catalog
- ✅ Shopping Cart with optimistic updates and validation
- ✅ Responsive navigation (desktop links + mobile hamburger menu)
- ✅ Error handling & production resilience (Phase 4)
- ✅ Authentication system with login/signup (Phase 5)
- ✅ User profiles and role management
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
4. Then connect Supabase/Shopify for persistence

### Component Organization Rationale

```
src/components/
├── ui/        → shadcn primitives (untouched)
├── layout/    → Page structure (Header, Footer, PageLayout)
├── shared/    → Brand components (CaldiCard, SectionHeading, Container)
└── error/     → Error handling (ErrorBoundary, ErrorFallback, OfflineIndicator)
```

This separation ensures:
- UI primitives remain upgrade-safe
- Layout components handle page structure
- Shared components enforce brand consistency
- Error components provide production resilience

---

## Error Handling Architecture

Phase 4 implemented comprehensive error handling for production resilience:

| Layer | Component | Purpose |
|-------|-----------|---------|
| **Boundaries** | `ErrorBoundary` | Catches React crashes, shows recovery UI |
| **Logging** | `errorLogger` | Structured logging with external service readiness |
| **Network** | `retryWithBackoff` | Exponential backoff for failed requests |
| **Network** | `useNetworkStatus` | Monitor connectivity, show offline banner |
| **Storage** | `storageFactory` | Fallbacks: localStorage → sessionStorage → memory |
| **Rate Limit** | `createRateLimiter` | Token bucket to prevent operation spam |

See `docs/ERROR_HANDLING.md` for full documentation.

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
| ~~**Mobile Nav**~~ | ✅ Done | Hamburger menu with Sheet slide-out |
| ~~**Error Handling**~~ | ✅ Done | Phase 4 complete |
| **Testing** | None | Add unit tests per TDD mandate |
| **Accessibility** | Basic semantic HTML | Add ARIA labels, keyboard navigation |
| **SEO** | Minimal | Add meta tags, structured data |

---

## Security Boundary Summary

| Boundary | Status |
|----------|--------|
| Backend Integration | ✅ Lovable Cloud connected |
| User Data Collection | ✅ Profiles table with RLS |
| Row Level Security (RLS) | ✅ All tables protected |
| Role Management | ✅ Separate user_roles table |
| API Keys / Secrets | ✅ Managed via Lovable Cloud |
| Input Validation | ✅ Cart + Auth validation with Zod |
| Error Boundaries | ✅ Global crash protection |
| Rate Limiting | ✅ Cart operations protected |

---

## Next Phase Roadmap

### Phase 2B: Shopify + Vendor Integration

1. **Enable Shopify Basic + Webkul Multi-Vendor**
2. **Onboard 3-5 pilot roasters**
3. **Connect Shopify Storefront API to frontend**
4. **Validation Gate**: First real orders processed

### Phase 2C: User Onboarding & Quiz

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
│   ├── auth/         # Authentication (AuthCard, LoginForm, SignupForm, UserMenu)
│   ├── layout/       # PageLayout, Header, Footer
│   ├── shared/       # CaldiCard, SectionHeading, Container
│   ├── error/        # ErrorBoundary, ErrorFallback, OfflineIndicator
│   └── ui/           # shadcn components
├── constants/        # APP_CONFIG, ROUTES
├── contexts/
│   ├── auth/         # AuthContext, useAuth hook
│   └── cart/         # CartContext, useCart hook
├── features/         # Feature modules (marketplace, cart)
├── hooks/            # Custom React hooks
├── integrations/
│   └── supabase/     # Supabase client and types
├── pages/            # Route pages (Index, Auth, NotFound)
├── schemas/          # Zod validation schemas (cart, auth)
├── services/         # Service layer (cart, errorLogging)
├── types/            # TypeScript type definitions
└── utils/            # Utilities (formatters, validation, network, storage, rateLimit)
```

### Active Assets

- `src/assets/characters/caldi-modern-chest.png` - Modern Caldi mascot
- `src/assets/backgrounds/path-to-clarity.svg` - Hero background
- `public/favicon.png` - Site favicon

---

## Documentation

| Document | Description |
|----------|-------------|
| `README.md` | Project overview and status |
| `CHANGELOG.md` | Version history |
| `BACKLOG.md` | Feature backlog and roadmap |
| `docs/BACKEND_OPTIONS.md` | Shopify vs Supabase comparison |
| `docs/ERROR_HANDLING.md` | Error handling architecture |

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
- **Zod** - Schema validation

## Deployment

Open [Lovable](https://lovable.dev) and click Share → Publish.

## Custom Domain

Navigate to Project > Settings > Domains and click Connect Domain.

[Read more](https://docs.lovable.dev/features/custom-domain)
