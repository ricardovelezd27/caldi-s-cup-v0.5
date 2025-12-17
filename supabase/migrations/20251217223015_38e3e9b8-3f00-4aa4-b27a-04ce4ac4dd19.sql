-- Create coffee tribe enum
CREATE TYPE public.coffee_tribe AS ENUM ('fox', 'owl', 'hummingbird', 'bee');

-- Add tribe and onboarding columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN coffee_tribe public.coffee_tribe,
ADD COLUMN is_onboarded boolean DEFAULT false,
ADD COLUMN onboarded_at timestamp with time zone;

-- Index for quick lookups by tribe
CREATE INDEX idx_profiles_coffee_tribe ON public.profiles(coffee_tribe) WHERE coffee_tribe IS NOT NULL;