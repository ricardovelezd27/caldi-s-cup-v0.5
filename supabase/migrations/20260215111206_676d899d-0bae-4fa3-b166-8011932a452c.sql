ALTER TABLE public.user_coffee_ratings
ADD COLUMN user_flavor_notes TEXT[] DEFAULT '{}'::TEXT[];