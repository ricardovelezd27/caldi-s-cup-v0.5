-- Add cover_url column to profiles for custom cover images
ALTER TABLE public.profiles ADD COLUMN cover_url text DEFAULT NULL;