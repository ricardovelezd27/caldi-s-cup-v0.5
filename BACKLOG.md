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

### Phase 8: Shopify Integration (Future)

- Enable Shopify Basic + Webkul Multi-Vendor
- Onboard 3-5 pilot roasters
- Connect Shopify Storefront API to frontend
- **Validation Gate**: First real orders processed

### Phase 8: AI Personalization (Future)

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
| i18n (EN/ES) | 7 | Full bilingual support (~400 keys) |
| Dashboard Widgets | 7 | Customizable widget grid |

### Upcoming Features

| Priority | Feature | Phase | Description |
|----------|---------|-------|-------------|
| 🔴 High | Shopify Enable | 8 | Connect Shopify Basic with Webkul |
| 🔴 High | Checkout Flow | 8 | Shopify checkout integration |
| 🔴 High | Vendor Onboarding | 8 | Guide for roasters to join |
| 🟡 Medium | AI Recommendations | 9 | "You might like" suggestions |
| 🟡 Medium | Search Ranking | 9 | Personalized results |
| 🟡 Medium | Wishlist | - | Save products for later |
| 🟡 Medium | Order Confirmation | 8 | Post-purchase page |
| 🟡 Medium | Additional Languages | - | PT-BR, FR, IT support |
| 🟢 Low | Animations | - | Bouncy micro-interactions |
| 🟢 Low | Dark Mode Toggle | - | UI toggle with persistence |
| 🟢 Low | Testing Suite | - | Unit tests per TDD mandate |
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

*Last Updated: 2026-02-20*
