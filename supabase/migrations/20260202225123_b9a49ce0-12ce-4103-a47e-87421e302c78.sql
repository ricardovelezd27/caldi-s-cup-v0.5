-- =====================================================
-- SCHEMA CONSOLIDATION: Unified Coffee Catalog
-- =====================================================

-- Step 1: Add scan-related columns to coffees table
-- These columns capture AI analysis and user context from scans
ALTER TABLE public.coffees 
ADD COLUMN IF NOT EXISTS ai_confidence numeric CHECK (ai_confidence >= 0 AND ai_confidence <= 1),
ADD COLUMN IF NOT EXISTS brand_story text,
ADD COLUMN IF NOT EXISTS jargon_explanations jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS scanned_image_url text;

-- Step 2: Create lightweight coffee_scans log table
-- This tracks WHO scanned WHAT and WHEN, with personalized match scores
CREATE TABLE IF NOT EXISTS public.coffee_scans (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  coffee_id uuid NOT NULL REFERENCES public.coffees(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  tribe_match_score integer CHECK (tribe_match_score >= 0 AND tribe_match_score <= 100),
  match_reasons text[] DEFAULT '{}'::text[],
  ai_confidence numeric CHECK (ai_confidence >= 0 AND ai_confidence <= 1),
  raw_ai_response jsonb,
  scanned_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Create index for faster user scan history queries
CREATE INDEX IF NOT EXISTS idx_coffee_scans_user_id ON public.coffee_scans(user_id);
CREATE INDEX IF NOT EXISTS idx_coffee_scans_coffee_id ON public.coffee_scans(coffee_id);
CREATE INDEX IF NOT EXISTS idx_coffee_scans_scanned_at ON public.coffee_scans(scanned_at DESC);

-- Enable RLS on coffee_scans
ALTER TABLE public.coffee_scans ENABLE ROW LEVEL SECURITY;

-- RLS policies for coffee_scans
CREATE POLICY "Users can view own scans"
  ON public.coffee_scans FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own scans"
  ON public.coffee_scans FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own scans"
  ON public.coffee_scans FOR DELETE
  USING (user_id = auth.uid());

-- Step 3: Migrate existing data from scanned_coffees to coffee_scans
-- Only migrate records that have a coffee_id (linked to master catalog)
INSERT INTO public.coffee_scans (user_id, coffee_id, image_url, tribe_match_score, match_reasons, ai_confidence, raw_ai_response, scanned_at, created_at)
SELECT 
  user_id,
  coffee_id,
  image_url,
  tribe_match_score,
  match_reasons,
  ai_confidence,
  raw_ai_response,
  scanned_at,
  created_at
FROM public.scanned_coffees
WHERE coffee_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- Step 4: Add foreign key constraint to user_coffee_favorites
-- This ensures favorites reference the coffees table
ALTER TABLE public.user_coffee_favorites
DROP CONSTRAINT IF EXISTS user_coffee_favorites_coffee_id_fkey;

ALTER TABLE public.user_coffee_favorites
ADD CONSTRAINT user_coffee_favorites_coffee_id_fkey 
FOREIGN KEY (coffee_id) REFERENCES public.coffees(id) ON DELETE CASCADE;

-- Step 5: Add foreign key constraint to user_coffee_inventory
ALTER TABLE public.user_coffee_inventory
DROP CONSTRAINT IF EXISTS user_coffee_inventory_coffee_id_fkey;

ALTER TABLE public.user_coffee_inventory
ADD CONSTRAINT user_coffee_inventory_coffee_id_fkey 
FOREIGN KEY (coffee_id) REFERENCES public.coffees(id) ON DELETE CASCADE;

-- Step 6: Drop redundant tables
-- Note: Do this carefully - we're removing duplicate tables
DROP TABLE IF EXISTS public.user_favorites CASCADE;
DROP TABLE IF EXISTS public.scanned_coffees CASCADE;

-- Step 7: Update coffees RLS to allow all verified coffees to be visible in marketplace
-- Already exists: "Anyone can view verified coffees"
-- Add policy for users to view their own scanned coffees (unverified)
-- This already exists too: "Users can view own unverified coffees"

-- Step 8: Add marketplace-specific indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_coffees_is_verified ON public.coffees(is_verified);
CREATE INDEX IF NOT EXISTS idx_coffees_source ON public.coffees(source);
CREATE INDEX IF NOT EXISTS idx_coffees_brand ON public.coffees(brand);
CREATE INDEX IF NOT EXISTS idx_coffees_origin_country ON public.coffees(origin_country);