-- Add column to store individual scan image URLs for multi-image gallery
ALTER TABLE public.coffees
ADD COLUMN additional_image_urls text[] DEFAULT NULL;