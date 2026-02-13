
-- Add 'manual' to coffee_source enum
ALTER TYPE coffee_source ADD VALUE 'manual';

-- Allow authenticated users to insert roasters (for auto-creation during manual add)
CREATE POLICY "Authenticated users can create roasters for manual add"
ON public.roasters
FOR INSERT
WITH CHECK (user_id = auth.uid());
