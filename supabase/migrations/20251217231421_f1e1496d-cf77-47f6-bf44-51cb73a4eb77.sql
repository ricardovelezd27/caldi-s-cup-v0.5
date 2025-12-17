-- Create scanned_coffees table for storing AI-analyzed coffee data
CREATE TABLE public.scanned_coffees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  image_url TEXT NOT NULL,
  
  -- Extracted Data
  coffee_name TEXT,
  brand TEXT,
  origin TEXT,
  roast_level TEXT,
  processing_method TEXT,
  variety TEXT,
  altitude TEXT,
  
  -- Flavor Profile (1-5 scale)
  acidity_score INTEGER CHECK (acidity_score >= 1 AND acidity_score <= 5),
  body_score INTEGER CHECK (body_score >= 1 AND body_score <= 5),
  sweetness_score INTEGER CHECK (sweetness_score >= 1 AND sweetness_score <= 5),
  flavor_notes TEXT[],
  
  -- AI Enrichment
  brand_story TEXT,
  awards TEXT[],
  cupping_score NUMERIC(4,1),
  ai_confidence NUMERIC(3,2) CHECK (ai_confidence >= 0 AND ai_confidence <= 1),
  
  -- Personalization
  tribe_match_score INTEGER CHECK (tribe_match_score >= 0 AND tribe_match_score <= 100),
  match_reasons TEXT[],
  
  -- Jargon Explanations (stored as JSONB)
  jargon_explanations JSONB,
  
  -- Raw AI Response (for debugging)
  raw_ai_response JSONB,
  
  scanned_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.scanned_coffees ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own scans" ON public.scanned_coffees
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert own scans" ON public.scanned_coffees
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can delete own scans" ON public.scanned_coffees
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_scanned_coffees_user ON public.scanned_coffees(user_id);
CREATE INDEX idx_scanned_coffees_date ON public.scanned_coffees(scanned_at DESC);

-- Create storage bucket for coffee scan images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('coffee-scans', 'coffee-scans', true);

-- Storage policies for coffee-scans bucket
CREATE POLICY "Authenticated users can upload coffee scans"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'coffee-scans' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view coffee scan images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'coffee-scans');

CREATE POLICY "Users can delete own coffee scans"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'coffee-scans' AND auth.uid()::text = (storage.foldername(name))[1]);