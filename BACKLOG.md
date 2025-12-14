# Caldi's Cup - Product Backlog

This file tracks all discussed but unimplemented features, organized by priority and phase.

---

## Architectural Decision Record

### ADR-001: Multi-Vendor Marketplace with Headless Shopify

**Date**: 2025-01-14  
**Status**: Accepted

**Decision**: Use **Headless Shopify Basic + Webkul Multi-Vendor** for marketplace functionality.

**Context**: Caldi's Cup requires a multi-vendor marketplace where roasters/cafes can self-list products, while maintaining full AI personalization control over the shopping experience.

**Options Considered**:
1. **Traditional Shopify**: Limited AI integration, locked into Shopify themes
2. **Headless Shopify Basic**: Full API access, custom frontend, $39/month
3. **Custom Clone**: Full control, 3-4 months build time, payment/PCI complexity

**Justification**:
- Multi-vendor support via Webkul ($15-60/month) without building clone
- Roasters get their own seller portal for product uploads
- Full AI personalization control via Shopify Storefront API
- Low initial cost ($54/month combined) for validation phase
- Shopify handles: PCI compliance, payment processing, inventory sync, order routing
- Caldi's Cup handles: Custom frontend, AI personalization, user experience

**Architecture Flow**:
```
User → Lovable Frontend → AI Layer (Supabase) → Shopify Storefront API
                              ↓
                    User Preferences DB
                              ↓
                    Re-ranked Product Results
```

---

## Phased Validation Roadmap

### Phase 1: Foundation & Landing Page MVP ✅
- Landing page with brand identity
- Design system implementation
- Hero section with Caldi character narrative

### Phase 2A: Marketplace UI Skeleton (Mock Data)
**Goal**: Validate marketplace UX before Shopify integration
- Product page design
- Roaster storefront design
- Browse/search interface
- Shopping cart UI
- **Validation Gate**: User testing confirms marketplace UX

### Phase 2B: Shopify + Vendor Integration
**Goal**: Enable real products and roaster onboarding
- Enable Shopify Basic + Webkul Multi-Vendor
- Onboard 3-5 pilot roasters
- Connect Shopify Storefront API to frontend
- **Validation Gate**: First real orders processed

### Phase 2C: User Onboarding & Quiz
**Goal**: Capture user preferences for personalization
- Onboarding flow explaining Caldi AI
- Coffee preference quiz
- Results page with taste profile
- User authentication (guest vs. signed-in)
- **Validation Gate**: 100+ quiz completions

### Phase 3: AI Personalization Layer
**Goal**: Differentiate with intelligent recommendations
- AI search ranking based on user profile
- "You might like" recommendations
- Personalized homepage curation
- **Validation Gate**: Improved conversion vs. non-personalized

### Phase 4: Scale & Automation
**Goal**: Grow vendor base and automate operations
- Self-service roaster onboarding
- Automated product sync
- Review/rating system
- Advanced analytics dashboard

---

## Feature Backlog

### Phase 2A: Marketplace UI (Mock Data)

| Priority | Feature | Status | Description |
|----------|---------|--------|-------------|
| 🔴 High | Product Page | Not Started | Coffee product detail with attributes, roaster info |
| 🔴 High | Roaster Storefront | Not Started | Cafe/roaster profile with their product catalog |
| 🔴 High | Marketplace Browse | Not Started | Product listing with filters, search, sorting |
| 🔴 High | Shopping Cart | Not Started | Add to cart, quantity management, cart preview |
| 🟡 Medium | Wishlist | Not Started | Save products for later |

### Phase 2B: Shopify Integration

| Priority | Feature | Status | Description |
|----------|---------|--------|-------------|
| 🔴 High | Shopify Enable | Not Started | Connect Shopify Basic with Webkul |
| 🔴 High | Checkout Flow | Not Started | Shopify checkout integration |
| 🔴 High | Vendor Onboarding | Not Started | Guide for roasters to join marketplace |
| 🟡 Medium | Order Confirmation | Not Started | Post-purchase confirmation page |
| 🟡 Medium | Inventory Sync | Not Started | Real-time stock updates from Shopify |

### Phase 2C: User Onboarding & Quiz

| Priority | Feature | Status | Description |
|----------|---------|--------|-------------|
| 🔴 High | Onboarding Flow | Not Started | Multi-step wizard explaining Caldi AI |
| 🔴 High | Authentication | Not Started | Guest vs. Sign-in with Supabase |
| 🔴 High | Coffee Quiz | Not Started | 4-6 visual card-based preference questions |
| 🔴 High | Results Page | Not Started | Personalized taste profile visualization |
| 🟡 Medium | Waitlist Signup | Not Started | Email capture with preference data |

### Phase 3: AI Personalization

| Priority | Feature | Status | Description |
|----------|---------|--------|-------------|
| 🔴 High | AI Search Ranking | Not Started | Re-rank products based on user profile |
| 🔴 High | AI Recommendations | Not Started | "You might like" suggestions |
| 🟡 Medium | Personalized Home | Not Started | Curated homepage based on preferences |
| 🟡 Medium | Taste Profile Evolution | Not Started | Update profile based on purchases |

### Phase 3+: Polish & Enhancement

| Priority | Feature | Status | Description |
|----------|---------|--------|-------------|
| 🟢 Low | Animations & Motion | Deferred | Bouncy micro-interactions |
| 🟢 Low | Dark Mode Toggle | Not Started | UI toggle with localStorage |
| 🟢 Low | Testing Suite | Not Started | Unit tests per TDD mandate |
| 🟢 Low | Accessibility Audit | Not Started | ARIA, keyboard nav, screen readers |
| 🟢 Low | SEO Optimization | Not Started | Meta tags, structured data |
| 🟢 Low | PWA Support | Not Started | Offline capability, installable |

---

## High-Priority Feature Specifications

### 1. Product Page (Phase 2A)

**User Story**: As a coffee enthusiast, I want to see detailed information about a coffee product so I can decide if it matches my preferences.

**Route**: `/product/:id`

**Acceptance Criteria**:
- [ ] Hero image gallery (3-5 images)
- [ ] Product name, roaster name (linked to storefront)
- [ ] Price and variant selection (size/grind)
- [ ] Flavor profile visualization (radar chart or badges)
- [ ] Origin, roast level, processing method
- [ ] Ethical badges (organic, fair trade, single origin)
- [ ] Roaster description and link
- [ ] Add to cart button with quantity selector
- [ ] "You might also like" section (mock data initially)

**Technical Notes**:
- Component: `src/features/marketplace/ProductPage.tsx`
- Uses mock data initially, then Shopify Storefront API
- Types: `Product`, `ProductVariant` from `src/types/coffee.ts`

---

### 2. Roaster Storefront (Phase 2A)

**User Story**: As a visitor, I want to explore a roaster's profile and their full catalog so I can discover their brand and products.

**Route**: `/roaster/:id`

**Acceptance Criteria**:
- [ ] Roaster hero banner with logo
- [ ] About section with story/mission
- [ ] Location and contact info
- [ ] Product grid with all their offerings
- [ ] Filter by roast level, flavor, price
- [ ] "Featured" or "Best Sellers" highlight

**Technical Notes**:
- Component: `src/features/marketplace/RoasterStorefront.tsx`
- Uses mock data initially, then Shopify vendor data via Webkul
- Types: `Roaster` from `src/types/coffee.ts`

---

### 3. Marketplace Browse (Phase 2A)

**User Story**: As a user, I want to browse and search all available coffees with filters so I can find products matching my preferences.

**Route**: `/marketplace`

**Acceptance Criteria**:
- [ ] Product grid with cards (image, name, roaster, price, flavor badges)
- [ ] Search bar with instant results
- [ ] Filters: roast level, origin, flavor notes, price range, ethical options
- [ ] Sort: relevance, price, newest, rating
- [ ] Pagination or infinite scroll
- [ ] Empty state for no results

**Technical Notes**:
- Component: `src/features/marketplace/MarketplaceBrowse.tsx`
- Uses mock data initially, then Shopify Storefront API queries
- AI layer intercepts and re-ranks results in Phase 3

---

### 4. Shopping Cart (Phase 2A)

**User Story**: As a shopper, I want to manage items in my cart so I can review before checkout.

**Route**: `/cart` (also slide-out panel)

**Acceptance Criteria**:
- [ ] List of cart items with image, name, variant, quantity, price
- [ ] Quantity adjustment (+/-)
- [ ] Remove item
- [ ] Subtotal calculation
- [ ] "Continue Shopping" and "Proceed to Checkout" CTAs
- [ ] Empty cart state

**Technical Notes**:
- Component: `src/features/cart/ShoppingCart.tsx`
- Local state initially (localStorage), then Shopify cart API
- Types: `CartItem` from `src/types/coffee.ts`

---

### 5. Coffee Preference Quiz (Phase 2C)

**User Story**: As a user, I want to answer questions about my coffee preferences so Caldi can make personalized recommendations.

**Route**: `/quiz`

**Acceptance Criteria**:
- [ ] 4-6 questions covering:
  - Intensity preference (light to bold)
  - Flavor profile (fruity, nutty, chocolatey, earthy)
  - Brewing method (espresso, pour-over, French press, etc.)
  - Ethical preferences (organic, fair trade, single origin)
  - Optional: frequency, budget
- [ ] Visual card-based selections (not dropdowns)
- [ ] Progress indicator
- [ ] Back/forward navigation
- [ ] Results lead to Results Page

**Technical Notes**:
- Component: `src/features/quiz/`
- State: Local first (mock), then persist to Supabase
- Types: `UserTasteProfile` from `src/types/coffee.ts`

**Dependencies**: None for UI; Authentication for persistence

---

## Page Structure

| Route | Component | Phase | Description |
|-------|-----------|-------|-------------|
| `/` | Index | 1 ✅ | Landing page |
| `/marketplace` | MarketplaceBrowse | 2A | Browse all products |
| `/product/:id` | ProductPage | 2A | Product detail |
| `/roaster/:id` | RoasterStorefront | 2A | Roaster profile + catalog |
| `/cart` | ShoppingCart | 2A | Shopping cart |
| `/checkout` | CheckoutRedirect | 2B | Redirect to Shopify checkout |
| `/onboarding` | OnboardingFlow | 2C | Intro to Caldi AI |
| `/quiz` | QuizFlow | 2C | Preference questions |
| `/results` | ResultsPage | 2C | Taste profile display |
| `/auth` | AuthPage | 2C | Login/signup/guest |
| `/dashboard` | Dashboard | 2C | Personal AI barista hub |

---

## Division of Work

### Shopify + Webkul Handles:
- Product catalog management
- Inventory tracking
- Payment processing (PCI compliant)
- Order management and routing
- Vendor payouts
- Roaster seller portal (via Webkul)

### Caldi's Cup (Lovable) Handles:
- Custom shopping frontend
- User authentication and profiles
- Coffee preference quiz and results
- AI personalization layer
- Search ranking and recommendations
- Brand experience and design

### Roasters Handle:
- Product uploads via Webkul portal
- Inventory updates
- Product images and descriptions
- Shipping settings
- Order fulfillment

---

## Development Notes

### Mandates from Knowledge File
- **UI/UX First**: Complete visual design before backend integration
- **TDD Workflow**: Write tests before implementation for complex logic
- **Animations Deferred**: Keep UI static for MVP, add motion in Phase 3+
- **Security**: Zero-trust approach when handling user input

---

*Last Updated: 2025-01-14*
