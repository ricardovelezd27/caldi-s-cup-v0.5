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

**Context**: Previously, scanned coffees were stored separately from catalog coffees, causing data duplication and complexity.

**Implementation**:
- Single `coffees` table with `source` enum (scan/admin/roaster/import)
- `is_verified` flag for admin-approved products
- Separate `coffee_scans` table for scan history (links to coffees)

---

### ADR-003: Auto Roaster Creation on Scan

**Date**: 2026-02-02  
**Status**: Implemented

---

### ADR-004: Client-Side Multi-Image Stitching

**Date**: 2026-02-20  
**Status**: Implemented

**Decision**: Stitch up to 4 user photos into a single composite image client-side before sending to AI.

**Context**: Users need to capture multiple surfaces of a coffee bag (front, back, sides) for better AI analysis, but each AI call costs credits.

**Implementation**:
- Canvas-based utility composites 1-4 base64 images into a 2×1 or 2×2 grid
- Each cell scaled to 960×960px max, output compressed to JPEG ≤1.5MB
- AI prompt updated to analyze all panels in the grid as a single product
- Individual photos preserved in route state for gallery display on coffee profile
- Credit cost remains exactly 1 AI call per scan regardless of photo count

**Decision**: Automatically create roaster profiles when new brands are detected during scanning.

**Context**: To populate the marketplace with roaster data as coffees are scanned.

**Implementation**:
- Edge function searches for existing roaster by brand/slug
- Creates new unverified roaster if not found
- Links coffee to roaster via `roaster_id`

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
│ + originCountry: string | null                                          │
│ + originRegion: string | null                                           │
│ + originFarm: string | null                                             │
│ + roastLevel: RoastLevelEnum | null                                     │
│ + processingMethod: string | null                                       │
│ + variety: string | null                                                │
│ + altitudeMeters: number | null                                         │
│ + acidityScore: number | null  (1-5)                                    │
│ + bodyScore: number | null  (1-5)                                       │
│ + sweetnessScore: number | null  (1-5)                                  │
│ + flavorNotes: string[]                                                 │
│ + description: string | null                                            │
│ + cuppingScore: number | null                                           │
│ + awards: string[]                                                      │
│ + brandStory: string | null                                             │
│ + jargonExplanations: Record<string, string>                            │
│ + aiConfidence: number | null                                           │
│ + roasterId: string | null                                              │
│ + isVerified: boolean                                                   │
│ + source: CoffeeSource                                                  │
│ + createdBy: string | null                                              │
│ + createdAt: string                                                     │
│ + updatedAt: string                                                     │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
│  CoffeeScanMeta     │ │ CoffeeInventoryMeta │ │     Product         │
├─────────────────────┤ ├─────────────────────┤ ├─────────────────────┤
│ + scanId: string    │ │ + inventoryId       │ │ (extends Coffee)    │
│ + coffeeId: string  │ │ + quantityGrams     │ │ + roasterId: string │
│ + aiConfidence      │ │ + purchaseDate      │ │ + roasterName       │
│ + tribeMatchScore   │ │ + openedDate        │ │ + slug: string      │
│ + matchReasons[]    │ │ + notes             │ │ + variants[]        │
│ + jargonExplan.     │ └─────────────────────┘ │ + basePrice         │
│ + scannedAt         │                         │ + images[]          │
│ + rawImageUrl       │                         │ + rating            │
└─────────────────────┘                         │ + reviewCount       │
                                                └─────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                              Roaster                                    │
├─────────────────────────────────────────────────────────────────────────┤
│ + id: string                                                            │
│ + userId: string                                                        │
│ + businessName: string                                                  │
│ + slug: string                                                          │
│ + description: string | null                                            │
│ + logoUrl: string | null                                                │
│ + bannerUrl: string | null                                              │
│ + locationCity: string | null                                           │
│ + locationCountry: string | null                                        │
│ + website: string | null                                                │
│ + contactEmail: string | null                                           │
│ + certifications: string[]                                              │
│ + isVerified: boolean                                                   │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                           CoffeeTribe                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐              │
│   │     FOX     │     │     OWL     │     │ HUMMINGBIRD │              │
│   │ Tastemaker  │     │  Optimizer  │     │  Explorer   │              │
│   ├─────────────┤     ├─────────────┤     ├─────────────┤              │
│   │ Geisha      │     │ Washed      │     │ Natural     │              │
│   │ Rare        │     │ Light Roast │     │ Fruit       │              │
│   │ Competition │     │ Elevation   │     │ Fermented   │              │
│   │ Anaerobic   │     │ Precision   │     │ Experimental│              │
│   │ Limited     │     │ Single Orig │     │ Wild        │              │
│   └─────────────┘     └─────────────┘     └─────────────┘              │
│                                                                         │
│                         ┌─────────────┐                                 │
│                         │     BEE     │                                 │
│                         │  Loyalist   │                                 │
│                         ├─────────────┤                                 │
│                         │ House Blend │                                 │
│                         │ Dark Roast  │                                 │
│                         │ Chocolate   │                                 │
│                         │ Nutty       │                                 │
│                         │ Classic     │                                 │
│                         └─────────────┘                                 │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Phased Validation Roadmap

### Phase 1: Foundation & Landing Page MVP ✅

- Landing page with brand identity
- Design system implementation
- Hero section with Caldi character narrative

### Phase 2A: Marketplace UI Skeleton (Mock Data) ✅

- ✅ Product page design
- ✅ Roaster storefront design
- ✅ Browse/search interface
- ✅ Shopping cart UI

### Phase 4: Error Handling & Production Resilience ✅

- ✅ Error boundaries
- ✅ Error logging service
- ✅ Network resilience
- ✅ Storage fallbacks
- ✅ Rate limiting

### Phase 5: Authentication Foundation ✅

- ✅ Supabase Auth integration
- ✅ Profiles table with RLS
- ✅ Role management (user/roaster/admin)
- ✅ Login/Signup forms

### Phase 6: AI Scanner & Quiz ✅

- ✅ Coffee preference quiz (5 scenarios)
- ✅ Coffee tribe assignment
- ✅ AI coffee scanner
- ✅ Unified coffee catalog
- ✅ Auto roaster creation
- ✅ Marketplace database integration

### Phase 7: Recipes, Ratings, Feedback & i18n ✅

- ✅ Recipes CRUD (create, edit, view, list)
- ✅ User coffee ratings (acidity, body, sweetness, flavor notes)
- ✅ Feedback system (rating + message)
- ✅ Manual coffee add (form-based entry)
- ✅ Scan error reports
- ✅ Full i18n (English + Spanish, ~400 keys)
- ✅ Browser locale auto-detection
- ✅ Dashboard customizable widgets

### Phase L1-L5: Learning Module ✅

- ✅ Database schema (13 tables, RLS, triggers, seeds)
- ✅ UI components (pages, tracks, lessons, exercises, mascots)
- ✅ 12 exercise templates (knowledge + applied)
- ✅ Gamification integration (streaks, XP, hearts, leagues, achievements)
- ✅ MVP content: Brewing Science S1 (4 units, 12 lessons, 72 exercises)
- ✅ Track navigation (TrackPathView with lesson status indicators)
- ✅ Gamification i18n keys (EN/ES)

### Phase 8: Shopify Integration (Future)

- Enable Shopify Basic + Webkul Multi-Vendor
- Onboard 3-5 pilot roasters
- Connect Shopify Storefront API to frontend
- **Validation Gate**: First real orders processed

### Phase 9: AI Personalization (Future)

- AI search ranking based on user profile
- "You might like" recommendations
- Personalized homepage curation
- **Validation Gate**: Improved conversion vs. non-personalized

---

## Feature Backlog

### Completed Features ✅

| Feature | Phase | Description |
|---------|-------|-------------|
| Landing Page | 1 | Hero, Problem, Solution sections |
| Design System | 1 | 60/30/10 color hierarchy |
| Product Page | 2A | Coffee attributes, roaster info |
| Marketplace Browse | 2A | Filters, search, sorting, pagination |
| Roaster Storefront | 2A | Profile with product catalog |
| Shopping Cart | 2A | Optimistic updates, validation |
| Error Handling | 4 | Boundaries, logging, resilience |
| Authentication | 5 | Login, signup, profiles |
| Role Management | 5 | User/Roaster/Admin RBAC |
| Coffee Quiz | 6 | 5 scenarios, tribe assignment |
| AI Scanner | 6 | Gemini 2.5 Flash integration |
| Unified Catalog | 6 | Single coffees table |
| Auto Roaster | 6 | Create on new brand scan |
| DB Integration | 6 | Marketplace pulls from database |
| Recipes CRUD | 7 | Create, edit, view, list brew recipes |
| User Coffee Ratings | 7 | Personal acidity/body/sweetness scores |
| Feedback System | 7 | In-app feedback with rating |
| Manual Coffee Add | 7 | Form-based coffee entry |
| Scan Error Reports | 7 | Report AI scan inaccuracies |
| i18n (EN/ES) | 7 | Full bilingual support (~460+ keys) |
| Dashboard Widgets | 7 | Customizable widget grid |
| Multi-Image Scanner | 7+ | Up to 4 photos per scan, client-side stitching |
| Coffee Profile Gallery | 7+ | Amazon-style image gallery with thumbnails |
| Color-Coded Flavor Notes | 7+ | Yellow (AI) vs teal (user) badge colors |
| Learning DB Schema | L1 | 13 tables, RLS, triggers |
| Learning UI Components | L2 | Pages, tracks, lessons, mascots |
| Exercise Templates | L3 | 12 interactive exercise types |
| Gamification Integration | L4 | Streaks, XP, hearts, leagues, achievements |
| MVP Content (Brewing S1) | L5 | 4 units, 12 lessons, 72 exercises |
| Track Navigation | L5 | TrackPathView with status indicators |

### Upcoming Features

| Priority | Feature | Phase | Description |
|----------|---------|-------|-------------|
| 🔴 High | Learning Content (S2-S4) | L5+ | Remaining Brewing Science sections |
| 🔴 High | Learning Content (Other Tracks) | L5+ | History & Culture, Bean Knowledge, Sustainability |
| 🔴 High | Shopify Enable | 8 | Connect Shopify Basic with Webkul |
| 🔴 High | Checkout Flow | 8 | Shopify checkout integration |
| 🔴 High | Vendor Onboarding | 8 | Guide for roasters to join |
| 🟡 Medium | Spaced Repetition | L6 | Review weak exercises based on history |
| 🟡 Medium | League Weekly Reset | L+ | Scheduled function for league rotation |
| 🟡 Medium | Content Admin Panel | L+ | Browse/preview/import content UI |
| 🟡 Medium | AI Recommendations | 9 | "You might like" suggestions |
| 🟡 Medium | Search Ranking | 9 | Personalized results |
| 🟡 Medium | Wishlist | - | Save products for later |
| 🟡 Medium | Additional Languages | - | PT-BR, FR, IT support |
| 🟢 Low | Streak Freeze Logic | L+ | Use streak freezes on missed days |
| 🟢 Low | Gems/Premium System | L+ | Premium features with payment |
| 🟢 Low | Animations | - | Bouncy micro-interactions |
| 🟢 Low | Dark Mode Toggle | - | UI toggle with persistence |
| 🟢 Low | PWA Support | - | Offline capability |

---

## Page Structure

| Route | Component | Phase | Status |
|-------|-----------|-------|--------|
| `/` | Index | 1 | ✅ Complete |
| `/marketplace` | MarketplaceBrowse | 2A | ✅ Complete |
| `/product/:id` | ProductPage | 2A | ✅ Complete |
| `/roaster/:slug` | RoasterStorefront | 2A | ✅ Complete |
| `/cart` | CartPage | 2A | ✅ Complete |
| `/auth` | Auth | 5 | ✅ Complete |
| `/quiz` | QuizPage | 6 | ✅ Complete |
| `/results` | ResultsPage | 6 | ✅ Complete |
| `/dashboard` | DashboardPage | 6 | ✅ Complete |
| `/scanner` | ScannerPage | 6 | ✅ Complete |
| `/coffee/:id` | CoffeeProfilePage | 6 | ✅ Complete |
| `/recipes` | RecipesPage | 7 | ✅ Complete |
| `/recipes/new` | CreateRecipePage | 7 | ✅ Complete |
| `/recipes/:id` | RecipeViewPage | 7 | ✅ Complete |
| `/recipes/:id/edit` | EditRecipePage | 7 | ✅ Complete |
| `/profile` | ProfilePage | 5 | ✅ Complete |
| `/feedback` | FeedbackPage | 7 | ✅ Complete |
| `/blog` | BlogPage | 7 | ✅ Complete |
| `/learn` | LearnPage | L2 | ✅ Complete |
| `/learn/:trackId` | TrackPage | L2 | ✅ Complete |
| `/learn/:trackId/:lessonId` | LessonPage | L2 | ✅ Complete |
| `/learn/achievements` | AchievementsPage | L4 | ✅ Complete |
| `/learn/leaderboard` | LeaderboardPage | L4 | ✅ Complete |
| `/checkout` | CheckoutRedirect | 8 | 🔲 Planned |

---

## Division of Work

### Shopify + Webkul Handles (Future)

- Product catalog management
- Inventory tracking
- Payment processing (PCI compliant)
- Order management and routing
- Vendor payouts
- Roaster seller portal

### Caldi's Cup (Lovable) Handles

- Custom shopping frontend
- User authentication and profiles
- Coffee preference quiz and results
- AI coffee scanner
- AI personalization layer
- Search ranking and recommendations
- Brand experience and design
- Error handling and resilience

### Roasters Handle

- Product uploads via portal
- Inventory updates
- Product images and descriptions
- Shipping settings
- Order fulfillment

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

The project follows a B2B2C architectural model:

- **B2B**: Roasters can manage their profiles and products
- **B2C**: Consumers discover, scan, and purchase coffee
- **Platform**: Caldi's Cup provides AI-powered personalization

---

### Learning Module Architecture

- **Content hierarchy**: Tracks → Sections → Units → Lessons → Exercises
- **Gamification**: Streaks, XP (with bonuses), Hearts (lives), 7-tier Leagues, Achievements
- **Content seeding**: Direct SQL migrations (Option A); JSON importer deferred
- **Batch queries**: `getUnitsBySectionIds`, `getLessonsByUnitIds` prevent N+1 issues
- **Anonymous-first**: Guests can try lessons; prompted to sign up after 3
- **RPC for atomicity**: `update_streak_and_xp` handles concurrent streak/XP updates

---

*Last Updated: 2026-02-26*
