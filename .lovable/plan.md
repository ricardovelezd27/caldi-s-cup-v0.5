

# Architecture Refactoring Plan: Caldi's Cup Platform

## Executive Summary

This plan addresses the core architectural issues and prepares the platform for the B2B2C business model with proper role-based access, a unified coffee data model, widget-based dashboard, and streamlined user flows.

---

## Part 1: Current State Analysis

### What Exists Today

**Database Tables:**
- `profiles` - User profiles with coffee_tribe, brewing_level, onboarding status
- `user_roles` - Role table with enum: user | roaster | admin (already exists but underutilized)
- `scanned_coffees` - AI-scanned coffee data tied to individual users
- `user_favorites` - Simplified favorites with just coffee_name, roaster_name (no foreign key to coffee)
- `brew_logs` - User brewing history

**User Flows:**
- Sign up/in via email/password
- Quiz to determine "coffee tribe"
- Scanner page for AI coffee analysis
- Dashboard with hardcoded cards (not widget-based)
- Marketplace with mock data only

**Key Problems Identified:**

| Problem | Impact |
|---------|--------|
| No master coffee table | Coffee data is duplicated across scanned_coffees, user_favorites, and mock products |
| User roles exist but not enforced | has_role() function exists, but no admin/roaster flows implemented |
| Dashboard is hardcoded | No widget architecture; users cannot customize their dashboard |
| Scanner saves to user-scoped table | Scanned coffees are not shared; no path to master catalog |
| Marketplace uses mock data only | Product type differs significantly from ScannedCoffee type |
| Two different coffee profile views | ProductPage and ScanResults have similar layouts but different data sources |
| Favorites table is disconnected | Stores coffee_name strings, not references to actual coffee records |
| No inventory concept | Users cannot track coffees they own |
| No recipes feature | No data model or UI for user recipes |

---

## Part 2: Target Architecture

### Database Schema Redesign

```text
+---------------------------+          +---------------------------+
|        coffees            |          |         roasters          |
| (Master Coffee Catalog)   |          | (Business Accounts)       |
+---------------------------+          +---------------------------+
| id (uuid, PK)             |<-------->| id (uuid, PK)             |
| roaster_id (FK, nullable) |          | user_id (FK to profiles)  |
| name                      |          | business_name             |
| brand                     |          | slug                      |
| origin_country            |          | description               |
| origin_region             |          | logo_url                  |
| origin_farm               |          | location_city             |
| roast_level (1-5)         |          | location_country          |
| processing_method         |          | website                   |
| variety                   |          | certifications[]          |
| altitude_meters           |          | is_verified               |
| acidity_score (1-5)       |          | created_at                |
| body_score (1-5)          |          +---------------------------+
| sweetness_score (1-5)     |
| flavor_notes[]            |
| description               |
| image_url                 |
| cupping_score             |
| awards[]                  |
| is_verified (boolean)     |
| source (scan|admin|roaster)|
| created_by (FK to profiles)|
| created_at                |
| updated_at                |
+---------------------------+
           |
           | (Foreign Keys)
           v
+---------------------------+     +---------------------------+
|    user_coffee_inventory  |     |    user_coffee_favorites  |
+---------------------------+     +---------------------------+
| id (uuid, PK)             |     | id (uuid, PK)             |
| user_id (FK)              |     | user_id (FK)              |
| coffee_id (FK to coffees) |     | coffee_id (FK to coffees) |
| quantity_grams            |     | added_at                  |
| purchase_date             |     +---------------------------+
| opened_date               |
| notes                     |
| created_at                |
+---------------------------+

+---------------------------+     +---------------------------+
|    coffee_scans           |     |    recipes                |
| (Scan History/Attribution)|     +---------------------------+
+---------------------------+     | id (uuid, PK)             |
| id (uuid, PK)             |     | user_id (FK, nullable)    |
| user_id (FK)              |     | name                      |
| coffee_id (FK to coffees) |     | description               |
| image_url                 |     | brew_method               |
| raw_ai_response (jsonb)   |     | coffee_id (FK, nullable)  |
| ai_confidence             |     | water_temp                |
| tribe_match_score         |     | grind_size                |
| match_reasons[]           |     | ratio                     |
| jargon_explanations       |     | brew_time                 |
| scanned_at                |     | steps[]                   |
+---------------------------+     | is_public (boolean)       |
                                  | created_at                |
                                  +---------------------------+

+---------------------------+
|    dashboard_widgets      |
+---------------------------+
| id (uuid, PK)             |
| user_id (FK)              |
| widget_type (enum)        |
| position (jsonb)          |
| config (jsonb)            |
| is_visible (boolean)      |
| created_at                |
+---------------------------+
```

### Role-Based Access Control

**Roles:**
1. **user** (default) - Regular consumers
2. **roaster** - Cafe/Roaster business accounts
3. **admin** - Platform administrators (you)

**Capabilities by Role:**

| Feature | User | Roaster | Admin |
|---------|------|---------|-------|
| Take quiz | Yes | Yes | Yes |
| Scan coffees | Yes | Yes | Yes |
| Add to inventory | Yes | Yes | Yes |
| Add to favorites | Yes | Yes | Yes |
| Create recipes | Yes | Yes | Yes |
| Customize dashboard | Yes | Yes | Yes |
| Create/edit own coffees | Yes | Yes | Yes |
| Upload to marketplace | No | Yes | Yes |
| Promote scans to catalog | No | Yes | Yes |
| Manage users | No | No | Yes |
| View all scans | No | No | Yes |

---

## Part 3: Implementation Phases

### Phase A: Database Foundation (Week 1) ✅ COMPLETED

**A1. Create Master Coffees Table** ✅
- New `coffees` table as single source of truth
- All coffee attributes in one normalized structure
- `source` enum: 'scan' | 'admin' | 'roaster' | 'import'
- `is_verified` boolean for quality control

**A2. Create Roasters Table** ✅
- Business profile linked to user accounts
- Only users with 'roaster' role can have roaster profiles
- Stores business metadata separate from personal profile

**A3. Migrate Favorites and Add Inventory** ✅
- `user_coffee_favorites` with proper FK to coffees
- `user_coffee_inventory` for tracking owned coffees
- Migration to move existing favorites data

**A4. Create Dashboard Widgets Table** ✅
- `dashboard_widgets` with widget_type enum
- Position/config stored as JSONB for flexibility
- Default widget set created on user signup via trigger

**A5. Create Recipes Table** ✅
- `recipes` with optional coffee_id foreign key
- Public/private visibility flag
- Structured brew parameters

**A6. Refactor Scans Table** ✅
- Added `coffee_id` FK to link scan to promoted coffee
- Keep as audit trail, not primary coffee storage

---

### Phase B: Authentication & Authorization (Week 2) ✅ COMPLETED

**B1. Role Checking Utilities** ✅
Created frontend hooks and utilities:
- `src/hooks/useRole.ts` - Hook returning { role, isAdmin, isRoaster, isUser, isLoading }
- `src/components/auth/RequireRole.tsx` - Route guard for role-based access
- `src/components/auth/RequireAuth.tsx` - Route guard for authentication
- `src/components/auth/ShowForRole` - Conditional rendering based on role

**B2. Role-Based Route Guards** ✅
- RequireRole component with roles prop for route protection
- RequireAuth component for authentication-only routes
- Support for redirect paths and loading states

**B3. Admin Assignment Flow**
- TODO: Create admin panel for role management
- Secure way to assign roles via database

---

### Phase B: Authentication & Authorization (Week 2)

**B1. Role Checking Utilities**
Create frontend hooks and utilities:
```typescript
// hooks/useRole.ts
export function useRole() {
  const { user } = useAuth();
  // Query user_roles table
  // Return { isAdmin, isRoaster, isUser, role, isLoading }
}

// Utility for protecting routes
export function RequireRole({ roles, children }) {
  // Render children only if user has required role
}
```

**B2. Role-Based Route Guards**
- `/admin/*` routes - admin only
- `/roaster/*` routes - roaster role
- `/dashboard` - any authenticated user

**B3. Admin Assignment Flow**
- Secure way to assign yourself admin role
- Admin panel for managing user roles

---

### Phase C: Scanner Flow Refactor (Week 2-3)

**C1. Unified Coffee Profile Component**
Create a single `<CoffeeProfile>` component used for:
- Scan results display
- Product page display
- Coffee detail in favorites/inventory

```typescript
interface CoffeeProfileProps {
  coffee: Coffee;  // From master coffees table
  scanData?: CoffeeScan;  // Optional scan metadata
  actions?: React.ReactNode;  // Contextual actions
}
```

**C2. Scanner "Promote to Catalog" Flow**
After scanning:
1. AI extracts data
2. Match against existing coffees (fuzzy search)
3. If match found: Link scan to existing coffee
4. If no match:
   - User role: Save scan, coffee stays in scans table
   - Admin role: Option to "Promote to Catalog" (creates coffee record)
   - Roaster role: Can create coffee if from their roastery

**C3. Add to Inventory/Favorites From Scan**
- "Add to Inventory" button creates inventory record
- "Add to Favorites" button creates favorite record
- Both reference the coffee_id (created or matched)

---

### Phase D: Widget-Based Dashboard (Week 3-4)

**D1. Widget Framework**
```typescript
// Widget type definitions
type WidgetType = 
  | 'welcome_hero'
  | 'coffee_tribe'
  | 'recent_scans'
  | 'favorites'
  | 'inventory'
  | 'weekly_goal'
  | 'brewing_level'
  | 'quick_scan'
  | 'recent_brews'
  | 'recommendations';

interface WidgetConfig {
  type: WidgetType;
  title?: string;
  size: 'small' | 'medium' | 'large';
}
```

**D2. Widget Registry**
Map widget types to components:
```typescript
const WIDGET_REGISTRY: Record<WidgetType, React.ComponentType> = {
  welcome_hero: WelcomeHeroWidget,
  coffee_tribe: TribeWidget,
  recent_scans: RecentScansWidget,
  // ...
};
```

**D3. Dashboard Layout Engine**
- Responsive grid layout
- Drag-and-drop reordering (using existing @dnd-kit or similar)
- Add/remove widgets
- Persist layout to `dashboard_widgets` table

**D4. Default Widget Set**
On user creation, populate default widgets:
- Welcome Hero
- Coffee Tribe (if completed quiz)
- Quick Scan button
- Weekly Goal
- Recent Brews

---

### Phase E: Onboarding Flow Redesign (Week 4)

**E1. New User Flow**
```text
Sign Up
   |
   v
Welcome Screen (Explain Caldi)
   |
   v
Coffee Personality Quiz (required)
   |
   v
Dashboard (with default widgets)
```

**E2. Post-Quiz Dashboard Initialization**
- After quiz completion, create default widgets
- Tribe-specific widget recommendations
- First-time user guidance

**E3. Returning User Flow**
- Sign in goes directly to dashboard
- No quiz prompt if already completed

---

### Phase F: Marketplace Integration Prep (Week 5)

**F1. Unified Coffee Types**
Single TypeScript type for all coffee sources:
```typescript
// types/coffee.ts
export interface Coffee {
  id: string;
  name: string;
  brand: string | null;
  roasterId: string | null;
  originCountry: string | null;
  originRegion: string | null;
  originFarm: string | null;
  roastLevel: 1 | 2 | 3 | 4 | 5 | null;
  processingMethod: string | null;
  variety: string | null;
  altitudeMeters: number | null;
  acidityScore: number | null;
  bodyScore: number | null;
  sweetnessScore: number | null;
  flavorNotes: string[];
  description: string | null;
  imageUrl: string | null;
  cuppingScore: number | null;
  awards: string[];
  isVerified: boolean;
  source: 'scan' | 'admin' | 'roaster' | 'import';
  createdAt: string;
  updatedAt: string;
}
```

**F2. Replace Mock Data with Database**
- Marketplace queries `coffees` table where `is_verified = true`
- Filter by roaster, origin, roast level
- Product page uses same `<CoffeeProfile>` component

**F3. Roaster Portal Foundation**
- `/roaster/dashboard` - Roaster's own dashboard
- `/roaster/coffees` - Manage their coffees
- `/roaster/add-coffee` - Add new coffee (with scanner option)

---

### Phase G: Recipes Feature (Week 5-6)

**G1. Recipe Data Model**
Already covered in database schema above.

**G2. Recipe CRUD**
- Create recipe (with optional linked coffee)
- Edit/delete own recipes
- Browse public recipes

**G3. Recipe Integration**
- "Create Recipe" button on coffee profile
- Recipe suggestions based on coffee type

---

## Part 4: Technical Specifications

### New Database Tables

**coffees**
```sql
CREATE TABLE public.coffees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roaster_id UUID REFERENCES public.roasters(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  brand TEXT,
  origin_country TEXT,
  origin_region TEXT,
  origin_farm TEXT,
  roast_level roast_level_enum,
  processing_method TEXT,
  variety TEXT,
  altitude_meters INTEGER,
  acidity_score INTEGER CHECK (acidity_score BETWEEN 1 AND 5),
  body_score INTEGER CHECK (body_score BETWEEN 1 AND 5),
  sweetness_score INTEGER CHECK (sweetness_score BETWEEN 1 AND 5),
  flavor_notes TEXT[],
  description TEXT,
  image_url TEXT,
  cupping_score NUMERIC,
  awards TEXT[],
  is_verified BOOLEAN DEFAULT false,
  source TEXT NOT NULL CHECK (source IN ('scan', 'admin', 'roaster', 'import')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: Anyone can read verified coffees
-- Roasters can CRUD their own coffees
-- Admins can CRUD all coffees
```

**roasters**
```sql
CREATE TABLE public.roasters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  business_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  banner_url TEXT,
  location_city TEXT,
  location_country TEXT,
  website TEXT,
  contact_email TEXT,
  certifications TEXT[],
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**dashboard_widgets**
```sql
CREATE TABLE public.dashboard_widgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  widget_type TEXT NOT NULL,
  position JSONB DEFAULT '{"row": 0, "col": 0, "width": 1, "height": 1}',
  config JSONB DEFAULT '{}',
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### New Feature Folders

```text
src/features/
  admin/            # Admin panel
    AdminDashboard.tsx
    CoffeeCatalog.tsx
    UserManagement.tsx
    
  roaster/          # Roaster portal
    RoasterDashboard.tsx
    MyCoffees.tsx
    AddCoffee.tsx
    
  coffee/           # Unified coffee feature
    CoffeeProfile.tsx      # Single source of truth for coffee display
    CoffeeAttributes.tsx
    CoffeeFlavorNotes.tsx
    CoffeeActions.tsx
    
  inventory/        # User inventory
    InventoryPage.tsx
    InventoryCard.tsx
    
  recipes/          # Recipes feature
    RecipesPage.tsx
    RecipeCard.tsx
    RecipeEditor.tsx
```

### New Hooks

```typescript
// hooks/useRole.ts
export function useRole(): {
  role: 'user' | 'roaster' | 'admin' | null;
  isAdmin: boolean;
  isRoaster: boolean;
  isUser: boolean;
  isLoading: boolean;
}

// hooks/useCoffee.ts
export function useCoffee(coffeeId: string): {
  coffee: Coffee | null;
  isLoading: boolean;
  error: Error | null;
}

// hooks/useInventory.ts
export function useInventory(): {
  inventory: InventoryItem[];
  addToInventory: (coffeeId: string, data: InventoryData) => Promise<void>;
  // ...
}

// hooks/useFavorites.ts
export function useFavorites(): {
  favorites: Coffee[];
  addToFavorites: (coffeeId: string) => Promise<void>;
  removeFromFavorites: (coffeeId: string) => Promise<void>;
  isFavorite: (coffeeId: string) => boolean;
}
```

---

## Part 5: Migration Strategy

### Data Migration Steps

1. **Create new tables** (coffees, roasters, dashboard_widgets, etc.)
2. **Migrate scanned_coffees to coffees**
   - Copy unique coffees from scanned_coffees to coffees
   - Mark as `source = 'scan'`, `is_verified = false`
   - Update scanned_coffees to reference new coffee_id
3. **Migrate user_favorites**
   - Match coffee_name to coffees table
   - Create coffee record if no match
   - Update favorites to use coffee_id FK
4. **Create default dashboard widgets** for existing users
5. **Assign admin role** to specified user(s)

### Backward Compatibility

- Keep legacy columns in scanned_coffees during transition
- Old scanner results still work with new coffee_id reference
- Gradual deprecation of old endpoints

---

## Part 6: Priority Order

| Priority | Phase | Deliverable | Why First |
|----------|-------|-------------|-----------|
| 1 | A1-A3 | Master coffees table + favorites migration | Foundation for everything else |
| 2 | B1-B3 | Role checking + admin assignment | Needed for admin features |
| 3 | C1-C2 | Unified CoffeeProfile + scanner refactor | Single source of truth for UI |
| 4 | A4, D1-D4 | Widget-based dashboard | User-requested feature |
| 5 | E1-E3 | Onboarding flow redesign | Better user experience |
| 6 | A5, G1-G3 | Recipes feature | New feature request |
| 7 | F1-F3 | Marketplace database integration | Replace mock data |

---

## Part 7: Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Data loss during migration | Create backups before migration; use transactions |
| Breaking existing scanner | Keep old scanner working during transition; feature flag new flow |
| Role escalation attack | Use security definer functions; never trust client for role checks |
| Performance with large coffee catalog | Add indexes on frequently queried columns; implement pagination |

---

## Summary

This refactoring effort establishes:

1. **Single source of truth** for all coffee data in a `coffees` table
2. **Proper B2B2C roles** with user, roaster, and admin capabilities
3. **Widget-based dashboard** for user customization
4. **Unified coffee profile component** used across scanner, marketplace, and inventory
5. **Inventory and recipes** features as requested
6. **Clean onboarding flow** with required quiz

The phased approach allows incremental delivery while maintaining a working application throughout the transition.

