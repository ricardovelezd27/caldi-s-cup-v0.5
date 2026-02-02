-- ============================================
-- Phase A1-A3: Database Foundation Migration
-- Master coffees table, roasters table, and refactored favorites/inventory
-- ============================================

-- A1: Create source_type enum for coffee sources
CREATE TYPE public.coffee_source AS ENUM ('scan', 'admin', 'roaster', 'import');

-- A2: Create roasters table (business accounts)
CREATE TABLE public.roasters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  business_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  banner_url TEXT,
  location_city TEXT,
  location_country TEXT,
  website TEXT,
  contact_email TEXT,
  certifications TEXT[] DEFAULT '{}',
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- A1: Create master coffees table (single source of truth)
CREATE TABLE public.coffees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roaster_id UUID REFERENCES public.roasters(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  brand TEXT,
  origin_country TEXT,
  origin_region TEXT,
  origin_farm TEXT,
  roast_level public.roast_level_enum,
  processing_method TEXT,
  variety TEXT,
  altitude_meters INTEGER,
  acidity_score INTEGER CHECK (acidity_score IS NULL OR (acidity_score >= 1 AND acidity_score <= 5)),
  body_score INTEGER CHECK (body_score IS NULL OR (body_score >= 1 AND body_score <= 5)),
  sweetness_score INTEGER CHECK (sweetness_score IS NULL OR (sweetness_score >= 1 AND sweetness_score <= 5)),
  flavor_notes TEXT[] DEFAULT '{}',
  description TEXT,
  image_url TEXT,
  cupping_score NUMERIC,
  awards TEXT[] DEFAULT '{}',
  is_verified BOOLEAN DEFAULT false,
  source public.coffee_source NOT NULL DEFAULT 'scan',
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- A3: Create new user_coffee_favorites table with proper FK
CREATE TABLE public.user_coffee_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  coffee_id UUID NOT NULL REFERENCES public.coffees(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, coffee_id)
);

-- A3: Create user_coffee_inventory table
CREATE TABLE public.user_coffee_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  coffee_id UUID NOT NULL REFERENCES public.coffees(id) ON DELETE CASCADE,
  quantity_grams INTEGER,
  purchase_date DATE,
  opened_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- A6: Add coffee_id FK to scanned_coffees for linking scans to catalog
ALTER TABLE public.scanned_coffees 
ADD COLUMN coffee_id UUID REFERENCES public.coffees(id) ON DELETE SET NULL;

-- Create indexes for performance
CREATE INDEX idx_coffees_roaster ON public.coffees(roaster_id);
CREATE INDEX idx_coffees_source ON public.coffees(source);
CREATE INDEX idx_coffees_verified ON public.coffees(is_verified);
CREATE INDEX idx_coffees_origin ON public.coffees(origin_country);
CREATE INDEX idx_roasters_user ON public.roasters(user_id);
CREATE INDEX idx_roasters_slug ON public.roasters(slug);
CREATE INDEX idx_user_coffee_favorites_user ON public.user_coffee_favorites(user_id);
CREATE INDEX idx_user_coffee_favorites_coffee ON public.user_coffee_favorites(coffee_id);
CREATE INDEX idx_user_coffee_inventory_user ON public.user_coffee_inventory(user_id);
CREATE INDEX idx_scanned_coffees_coffee ON public.scanned_coffees(coffee_id);

-- Trigger for updated_at on coffees
CREATE TRIGGER update_coffees_updated_at
  BEFORE UPDATE ON public.coffees
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on roasters
CREATE TRIGGER update_roasters_updated_at
  BEFORE UPDATE ON public.roasters
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on user_coffee_inventory
CREATE TRIGGER update_user_coffee_inventory_updated_at
  BEFORE UPDATE ON public.user_coffee_inventory
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- Row Level Security Policies
-- ============================================

-- Enable RLS on all new tables
ALTER TABLE public.coffees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roasters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_coffee_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_coffee_inventory ENABLE ROW LEVEL SECURITY;

-- COFFEES RLS POLICIES
-- Anyone can read verified coffees (public catalog)
CREATE POLICY "Anyone can view verified coffees"
  ON public.coffees
  FOR SELECT
  USING (is_verified = true);

-- Users can view their own unverified coffees
CREATE POLICY "Users can view own unverified coffees"
  ON public.coffees
  FOR SELECT
  TO authenticated
  USING (created_by = auth.uid() AND is_verified = false);

-- Users can insert coffees (for scan-to-catalog flow)
CREATE POLICY "Authenticated users can insert coffees"
  ON public.coffees
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

-- Users can update their own unverified coffees
CREATE POLICY "Users can update own unverified coffees"
  ON public.coffees
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid() AND is_verified = false);

-- Admins can do everything with coffees
CREATE POLICY "Admins have full access to coffees"
  ON public.coffees
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Roasters can manage their own coffees
CREATE POLICY "Roasters can manage own coffees"
  ON public.coffees
  FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'roaster') 
    AND roaster_id IN (SELECT id FROM public.roasters WHERE user_id = auth.uid())
  );

-- ROASTERS RLS POLICIES
-- Anyone can view verified roasters
CREATE POLICY "Anyone can view verified roasters"
  ON public.roasters
  FOR SELECT
  USING (is_verified = true);

-- Users can view their own roaster profile
CREATE POLICY "Users can view own roaster profile"
  ON public.roasters
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users with roaster role can insert their profile
CREATE POLICY "Roasters can create their profile"
  ON public.roasters
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() 
    AND public.has_role(auth.uid(), 'roaster')
  );

-- Roasters can update their own profile
CREATE POLICY "Roasters can update own profile"
  ON public.roasters
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Admins have full access to roasters
CREATE POLICY "Admins have full access to roasters"
  ON public.roasters
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- USER_COFFEE_FAVORITES RLS POLICIES
CREATE POLICY "Users can view own favorites"
  ON public.user_coffee_favorites
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own favorites"
  ON public.user_coffee_favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own favorites"
  ON public.user_coffee_favorites
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- USER_COFFEE_INVENTORY RLS POLICIES
CREATE POLICY "Users can view own inventory"
  ON public.user_coffee_inventory
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own inventory"
  ON public.user_coffee_inventory
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own inventory"
  ON public.user_coffee_inventory
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own inventory"
  ON public.user_coffee_inventory
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());