# Caldi's Cup - Product Backlog

This file tracks all discussed but unimplemented features, organized by priority and phase.

---

## Table of Contents

1. [Architectural Decision Records](#architectural-decision-records)
2. [System Class Diagram](#system-class-diagram)
3. [Phased Validation Roadmap](#phased-validation-roadmap)
4. [Feature Backlog](#feature-backlog)
5. [Page Structure](#page-structure)
6. [Division of Work](#division-of-work)
7. [Development Notes](#development-notes)

---

## Architectural Decision Records

### ADR-001: Multi-Vendor Marketplace with Headless Shopify

**Date**: 2025-01-14
**Status**: Accepted (Future Phase)

**Decision**: Use **Headless Shopify Basic + Webkul Multi-Vendor** for marketplace functionality.

**Context**: Caldi's Cup requires a multi-vendor marketplace where roasters/cafes can self-list products, while maintaining full AI personalization control over the shopping experience.

**Justification**:
- Multi-vendor support via Webkul ($15-60/month)
- Full AI personalization control via Shopify Storefront API
- Shopify handles: PCI compliance, payment processing, inventory sync

---

### ADR-002: Unified Coffee Catalog

**Date**: 2026-02-02
**Status**: Implemented

**Decision**: Use a single `coffees` table as the source of truth for all coffee data.

**Implementation**:
- Single `coffees` table with `source` enum (scan/admin/roaster/import)
- `is_verified` flag for admin-approved products
- Separate `coffee_scans` table for scan history (links to coffees)

---

### ADR-003: Auto Roaster Creation on Scan

**Date**: 2026-02-02
**Status**: Implemented

**Decision**: Automatically create roaster profiles when new brands are detected during scanning.

**Implementation**:
- Edge function searches for existing roaster by brand/slug
- Creates new unverified roaster if not found
- Links coffee to roaster via `roaster_id`

---

### ADR-004: Client-Side Multi-Image Stitching

**Date**: 2026-02-20
**Status**: Implemented

**Decision**: Stitch up to 4 user photos into a single composite image client-side before sending to AI.

**Implementation**:
- Canvas-based utility composites 1-4 base64 images into a 2×1 or 2×2 grid
- Each cell scaled to 960×960px max, output compressed to JPEG ≤1.5MB
- AI prompt updated to analyze all panels in the grid as a single product
- Individual photos preserved in route state for gallery display on coffee profile
- Credit cost remains exactly 1 AI call per scan regardless of photo count

---

## System Class Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        DOMAIN MODEL                                     │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                              Coffee                                     │
├─────────────────────────────────────────────────────────────────────────┤
│ + id: string                                                            │
│ + name: string                                                          │
│ + brand: string | null                                                  │
│ + imageUrl: string | null                                               │
│ + originCountry / originRegion / originFarm: string | null              │
│ + roastLevel: RoastLevelEnum | null                                     │
│ + processingMethod / variety: string | null                             │
│ + altitudeMeters: number | null                                         │
│ + acidityScore / bodyScore / sweetnessScore: number | null (1-5)        │
│ + flavorNotes: string[]                                                 │
│ + description / brandStory: string | null                               │
│ + cuppingScore / aiConfidence: number | null                            │
│ + awards: string[]                                                      │
│ + jargonExplanations: Record<string, string>                            │
│ + roasterId: string | null                                              │
│ + isVerified: boolean                                                   │
│ + source: CoffeeSource                                                  │
│ + createdBy / createdAt / updatedAt: string                             │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
│  CoffeeScanMeta     │ │ CoffeeInventoryMeta │ │     Product         │
└─────────────────────┘ └─────────────────────┘ └─────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                              Roaster                                    │
├─────────────────────────────────────────────────────────────────────────┤
│ + id / userId / businessName / slug / description                       │
│ + logoUrl / bannerUrl / locationCity / locationCountry                   │
│ + website / contactEmail / certifications[] / isVerified                 │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                           CoffeeTribe                                   │
│   FOX (Tastemaker) | OWL (Optimizer) | HUMMINGBIRD (Explorer) | BEE   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Phased Validation Roadmap

### Phase 1: Foundation & Landing Page ✅

- Landing page with brand identity and Caldi character narrative
- Design system (60/30/10 color hierarchy)

### Phase 2: Marketplace UI Skeleton (Mock Data) ✅

- Product page, roaster storefront, browse/search interface, shopping cart UI

### Phase 3: Error Handling & Production Resilience ✅

- Error boundaries, logging, network resilience, storage fallbacks, rate limiting

### Phase 4: Authentication & Roles ✅

- Auth integration, profiles table with RLS, role management (user/roaster/admin)
- Login/signup forms, Google OAuth sign-in

### Phase 5: AI Scanner & Coffee Quiz ✅

- Coffee preference quiz (5 scenarios), tribe assignment
- AI coffee scanner (Gemini 2.5 Flash), unified coffee catalog
- Auto roaster creation, marketplace database integration
- Multi-image scanner (up to 4 photos, client-side stitching)

### Phase 6: Recipes, Ratings, Feedback & i18n ✅

- Recipes CRUD, user coffee ratings, feedback system
- Manual coffee add, scan error reports
- Full i18n (EN + ES, ~460+ keys), dashboard customizable widgets
- Coffee profile gallery, color-coded flavor notes

### Phase 7: Learning Module ✅

- Database schema (13 tables, RLS, triggers, seeds)
- UI components (pages, tracks, lessons, exercises, mascots)
- 12 exercise templates (knowledge + applied)
- Gamification (streaks, XP, hearts, leagues, achievements)
- MVP content: Brewing Science S1 (4 units, 12 lessons, 72 exercises)
- Track navigation (TrackPathView with status indicators)

### Phase 8: Admin Dashboard (Cockpit) ✅

- Admin layout with sidebar navigation (RequireRole guard)
- Learning Hub: drill-down management (tracks → sections → units → lessons → exercises)
- Exercise editor (JSONB `question_data`, bilingual text, mascot assignments)
- JSON Headstart Importer (paste, validate with Zod, stage/preview, publish)

### Phase 9: Shopify Integration (Planned)

- Enable Shopify Basic + Webkul Multi-Vendor
- Onboard 3-5 pilot roasters, connect Storefront API
- Checkout flow integration
- **Validation Gate**: First real orders processed

### Phase 10: AI Personalization (Planned)

- AI search ranking based on user profile
- "You might like" recommendations, personalized homepage curation
- **Validation Gate**: Improved conversion vs. non-personalized

---

## Feature Backlog

### Upcoming Features

| Priority | Feature | Phase | Description |
|----------|---------|-------|-------------|
| 🔴 High | Learning Content (S2-S4) | 7+ | Remaining Brewing Science sections |
| 🔴 High | Learning Content (Other Tracks) | 7+ | History & Culture, Bean Knowledge, Sustainability |
| 🔴 High | Shopify Enable | 9 | Connect Shopify Basic with Webkul |
| 🔴 High | Checkout Flow | 9 | Shopify checkout integration |
| 🔴 High | Vendor Onboarding | 9 | Guide for roasters to join |
| 🟡 Medium | Spaced Repetition | 7+ | Review weak exercises based on history |
| 🟡 Medium | League Weekly Reset | 7+ | Scheduled function for league rotation |
| 🟡 Medium | AI Recommendations | 10 | "You might like" suggestions |
| 🟡 Medium | Search Ranking | 10 | Personalized results |
| 🟡 Medium | Wishlist | — | Save products for later |
| 🟡 Medium | Additional Languages | — | PT-BR, FR, IT support |
| 🟢 Low | Streak Freeze Logic | 7+ | Use streak freezes on missed days |
| 🟢 Low | Gems/Premium System | 7+ | Premium features with payment |
| 🟢 Low | Animations | — | Bouncy micro-interactions |
| 🟢 Low | Dark Mode Toggle | — | UI toggle with persistence |
| 🟢 Low | PWA Support | — | Offline capability |

---

## Page Structure

| Route | Component | Phase | Status |
|-------|-----------|-------|--------|
| `/` | Index | 1 | ✅ |
| `/marketplace` | MarketplaceBrowse | 2 | ✅ |
| `/product/:id` | ProductPage | 2 | ✅ |
| `/roaster/:slug` | RoasterStorefront | 2 | ✅ |
| `/cart` | CartPage | 2 | ✅ |
| `/auth` | Auth | 4 | ✅ |
| `/quiz` | QuizPage | 5 | ✅ |
| `/results` | ResultsPage | 5 | ✅ |
| `/dashboard` | DashboardPage | 6 | ✅ |
| `/scanner` | ScannerPage | 5 | ✅ |
| `/coffee/:id` | CoffeeProfilePage | 5 | ✅ |
| `/recipes` | RecipesPage | 6 | ✅ |
| `/recipes/new` | CreateRecipePage | 6 | ✅ |
| `/recipes/:id` | RecipeViewPage | 6 | ✅ |
| `/recipes/:id/edit` | EditRecipePage | 6 | ✅ |
| `/profile` | ProfilePage | 4 | ✅ |
| `/feedback` | FeedbackPage | 6 | ✅ |
| `/blog` | BlogPage | 6 | ✅ |
| `/learn` | LearnPage | 7 | ✅ |
| `/learn/:trackId` | TrackPage | 7 | ✅ |
| `/learn/:trackId/:lessonId` | LessonPage | 7 | ✅ |
| `/learn/achievements` | AchievementsPage | 7 | ✅ |
| `/learn/leaderboard` | LeaderboardPage | 7 | ✅ |
| `/admin` | AdminOverviewPage | 8 | ✅ |
| `/admin/learning` | LearningHubPage | 8 | ✅ |
| `/admin/learning/:trackId` | TrackDetailPage | 8 | ✅ |
| `/admin/learning/:trackId/:unitId` | UnitDetailPage | 8 | ✅ |
| `/admin/learning/:trackId/:unitId/:lessonId` | LessonDetailPage | 8 | ✅ |
| `/checkout` | CheckoutRedirect | 9 | 🔲 |

---

## Division of Work

### Shopify + Webkul Handles (Future)

- Product catalog, inventory, payments, order management, vendor payouts, seller portal

### Caldi's Cup (Lovable) Handles

- Custom shopping frontend, auth & profiles, quiz & scanner, AI personalization, search ranking, brand experience, error handling, learning module, admin dashboard

### Roasters Handle

- Product uploads, inventory updates, images/descriptions, shipping, fulfillment

---

## Development Notes

### Mandates from Knowledge File

- **UI/UX First**: Complete visual design before backend integration
- **TDD Workflow**: Write tests before implementation for complex logic
- **Animations Deferred**: Keep UI static for MVP, add motion later
- **Security**: Zero-trust approach when handling user input
- **Error Handling**: Production resilience with boundaries and logging
- **Clean Code**: SRP, DRY, meaningful names

### B2B2C Platform Model

- **B2B**: Roasters manage profiles and products
- **B2C**: Consumers discover, scan, and purchase coffee
- **Platform**: Caldi's Cup provides AI-powered personalization

### Learning Module Architecture

- **Content hierarchy**: Tracks → Sections → Units → Lessons → Exercises
- **Gamification**: Streaks, XP, Hearts, 7-tier Leagues, Achievements
- **Anonymous-first**: Guests can try lessons; prompted to sign up after 3
- **RPC for atomicity**: `update_streak_and_xp` handles concurrent updates

---

*Last Updated: 2026-02-27*
