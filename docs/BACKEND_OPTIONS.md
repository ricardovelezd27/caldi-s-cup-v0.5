# Caldi's Cup Backend Options

This document outlines the backend architecture choices for the Caldi's Cup marketplace, including the primary Shopify integration path and the Supabase+Stripe escape hatch alternative.

## Current Architecture (Phase 2A)

The cart currently uses a **local-first architecture** with localStorage persistence. All cart operations go through the `CartOperations` interface, enabling seamless backend swapping.

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  React UI       │────▶│  CartContext     │────▶│  localCartService│
│  Components     │     │  (Operations)    │     │  (localStorage)  │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

## Option A: Shopify + Webkul (Recommended for MVP)

**Best for:** Fast time-to-market, proven e-commerce infrastructure, minimal development.

### Costs
- Shopify Basic: $39/month
- Webkul Multi-Vendor: $15-60/month
- **Total:** ~$54-99/month

### Pros
- ✅ Proven, reliable e-commerce platform
- ✅ Built-in payment processing (Shopify Payments)
- ✅ Multi-vendor support via Webkul
- ✅ Order management, inventory, shipping built-in
- ✅ PCI compliance handled by Shopify
- ✅ Fast to integrate (2-3 weeks)

### Cons
- ❌ Monthly recurring costs
- ❌ Less control over data model
- ❌ API rate limits
- ❌ Vendor lock-in considerations

### Implementation Path
1. Set up Shopify Basic store
2. Install Webkul Multi-Vendor app
3. Configure Storefront API access
4. Implement `shopifyCartService` using Storefront API
5. Connect product catalog (or sync from existing data)
6. Test checkout flow

### Required Service Implementation
```typescript
// src/services/cart/shopifyCartService.ts
export function createShopifyCartService(config: CartServiceConfig) {
  return {
    // Cart mutations via Storefront API
    createCart: () => { /* cartCreate mutation */ },
    addItem: () => { /* cartLinesAdd mutation */ },
    updateQuantity: () => { /* cartLinesUpdate mutation */ },
    removeItem: () => { /* cartLinesRemove mutation */ },
    
    // Checkout
    getCheckoutUrl: () => { /* cart.checkoutUrl */ },
  };
}
```

---

## Option B: Supabase + Stripe (Custom Build)

**Best for:** Full control, custom features, long-term cost optimization, data ownership.

### Costs
- Supabase Pro: $25/month
- Stripe: 2.9% + $0.30 per transaction
- **Total:** ~$25/month + transaction fees

### Pros
- ✅ Full data control and ownership
- ✅ Lower long-term costs at scale
- ✅ Custom features without limitations
- ✅ No vendor lock-in
- ✅ Direct database access for AI features
- ✅ Flexible pricing and commission models

### Cons
- ❌ More development time (6-10 weeks)
- ❌ Need to build vendor portal
- ❌ PCI compliance considerations
- ❌ Self-managed infrastructure
- ❌ Need to handle order fulfillment workflow

### Implementation Path
1. Enable Lovable Cloud (Supabase)
2. Create database schema (see below)
3. Implement Row Level Security
4. Connect Stripe for payments
5. Build `supabaseCartService`
6. Implement checkout flow with Stripe Checkout
7. Build vendor portal for roasters

### Database Schema

```sql
-- Products & Variants
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roaster_id UUID REFERENCES roasters(id),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2),
  images TEXT[],
  -- ... other product fields
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  size TEXT,
  grind TEXT,
  price DECIMAL(10,2) NOT NULL,
  inventory_quantity INTEGER DEFAULT 0,
  stripe_price_id TEXT, -- Linked to Stripe Price
  available BOOLEAN DEFAULT true
);

-- Shopping Cart
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT, -- For guest carts
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0 AND quantity <= 99),
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cart_id, variant_id)
);

-- Orders (created after successful Stripe checkout)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  stripe_checkout_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  status TEXT DEFAULT 'pending',
  subtotal DECIMAL(10,2),
  shipping DECIMAL(10,2),
  tax DECIMAL(10,2),
  total DECIMAL(10,2),
  shipping_address JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID,
  variant_id UUID,
  product_snapshot JSONB, -- Frozen product data at time of order
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL
);
```

### Row Level Security

```sql
-- Carts: Users can only access their own carts
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own carts"
ON carts FOR ALL
USING (
  user_id = auth.uid() OR 
  session_id = current_setting('app.session_id', true)
);

-- Cart items follow cart access
CREATE POLICY "Cart items follow cart access"
ON cart_items FOR ALL
USING (
  cart_id IN (SELECT id FROM carts WHERE user_id = auth.uid())
);
```

### Stripe Integration

```typescript
// Supabase Edge Function: create-checkout-session
import Stripe from "stripe";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!);

Deno.serve(async (req) => {
  const { cartId } = await req.json();
  
  // Fetch cart items from Supabase
  const { data: items } = await supabase
    .from("cart_items")
    .select("*, product:products(*), variant:product_variants(*)")
    .eq("cart_id", cartId);
  
  // Create Stripe Checkout session
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: items.map(item => ({
      price: item.variant.stripe_price_id,
      quantity: item.quantity,
    })),
    success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cart`,
  });

  return new Response(JSON.stringify({ url: session.url }));
});
```

---

## Migration Path

The current architecture is designed for easy backend swapping:

### Step 1: Service Factory
The `createCartService()` factory already supports multiple backends:

```typescript
const service = createCartService({ 
  dataSource: 'shopify', // or 'supabase'
  apiKey: '...',
  endpoint: '...'
});
```

### Step 2: Implement New Service
Create a new service file implementing the same interface:
- `shopifyCartService.ts` for Shopify
- `supabaseCartService.ts` for Supabase

### Step 3: Update Configuration
Change the data source in environment configuration:
```env
VITE_CART_DATA_SOURCE=shopify  # or supabase
```

### Step 4: No UI Changes Required
The React components use the `CartOperations` interface and don't need modification.

---

## Decision Criteria

Choose **Shopify** if:
- You need to launch quickly (< 4 weeks)
- Multi-vendor functionality is critical at launch
- You prefer managed infrastructure
- Budget allows for monthly SaaS costs

Choose **Supabase + Stripe** if:
- You need full data control for AI features
- Long-term cost optimization is priority
- You need custom marketplace features
- You have engineering capacity for 6-10 weeks build

---

## Timeline Comparison

| Phase | Shopify Path | Supabase Path |
|-------|--------------|---------------|
| Setup | 3-5 days | 1-2 weeks |
| Cart Integration | 1 week | 2 weeks |
| Checkout Flow | 3-5 days | 2 weeks |
| Testing | 1 week | 2 weeks |
| **Total** | **2-3 weeks** | **6-10 weeks** |

---

## Recommendation

**For Phase 8 (2026):** Start with Shopify + Webkul to validate the marketplace concept quickly. The monthly costs are manageable for early validation, and the faster time-to-market allows gathering real user feedback sooner.

**Long-term:** If the marketplace proves successful and scale justifies it, evaluate migrating to Supabase + Stripe for cost optimization and deeper AI integration capabilities.

The current backend-agnostic architecture ensures this migration is straightforward when needed.

> **Note (2026-02-20):** The platform now includes full i18n support (EN/ES), recipes, user ratings, feedback, and scan error reporting — all running on Lovable Cloud. The cart remains local-first pending marketplace backend selection.
