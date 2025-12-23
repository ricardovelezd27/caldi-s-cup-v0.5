-- Create roast level enum (1-5 scale: 1=lightest, 5=darkest)
CREATE TYPE roast_level_enum AS ENUM ('1', '2', '3', '4', '5');

-- Add new structured columns to scanned_coffees
ALTER TABLE public.scanned_coffees 
ADD COLUMN roast_level_numeric roast_level_enum,
ADD COLUMN altitude_meters INTEGER,
ADD COLUMN origin_country TEXT,
ADD COLUMN origin_region TEXT,
ADD COLUMN origin_farm TEXT;

-- Add comments to deprecated columns for documentation
COMMENT ON COLUMN public.scanned_coffees.roast_level IS 'DEPRECATED: Use roast_level_numeric instead. Kept for backward compatibility.';
COMMENT ON COLUMN public.scanned_coffees.altitude IS 'DEPRECATED: Use altitude_meters instead. Kept for backward compatibility.';
COMMENT ON COLUMN public.scanned_coffees.origin IS 'DEPRECATED: Use origin_country, origin_region, origin_farm instead. Kept for backward compatibility.';

-- Add comments to new columns
COMMENT ON COLUMN public.scanned_coffees.roast_level_numeric IS 'Roast level on 1-5 scale: 1=light, 2=light-medium, 3=medium, 4=medium-dark, 5=dark';
COMMENT ON COLUMN public.scanned_coffees.altitude_meters IS 'Altitude in meters above sea level (integer)';
COMMENT ON COLUMN public.scanned_coffees.origin_country IS 'Country of origin';
COMMENT ON COLUMN public.scanned_coffees.origin_region IS 'Region/province within the country';
COMMENT ON COLUMN public.scanned_coffees.origin_farm IS 'Farm/estate/cooperative name if known';