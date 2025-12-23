-- Add missing UPDATE policy for scanned_coffees table
CREATE POLICY "Users can update own scans" ON public.scanned_coffees
  FOR UPDATE TO authenticated 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);